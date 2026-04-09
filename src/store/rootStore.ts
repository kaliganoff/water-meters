import { applySnapshot, flow, types } from 'mobx-state-tree';
import type { Instance, SnapshotIn } from 'mobx-state-tree';
import { deleteMeter, fetchMeters } from '../api/metersApi';
import { meterModel } from '../models/meterModel';
import { areaModel } from '../models/areaModel';
import { fetchAreas } from '../api/areasApi';

type ApiList<T> = {
  count: number;
  results: T[];
};

type MeterSnapshotIn = SnapshotIn<typeof meterModel>;
type AreaSnapshotIn = SnapshotIn<typeof areaModel>;

function extractAreaIds(meters: Array<{ area: { id: string } }>): string[] {
  return Array.from(new Set(meters.map((m) => m.area.id)));
}

export const RootStore = types
  .model({
    meters: types.array(meterModel),
    areas: types.map(areaModel),
    isLoading: false,
    pageSize: 20,
    currentPage: 1,
    totalCount: 0,
  })
  .views((self) => ({
    get totalPages() {
      return Math.max(1, Math.ceil(self.totalCount / self.pageSize));
    },
    get offset() {
      return (self.currentPage - 1) * self.pageSize;
    },
  }))
  .actions((self) => {
    function setMeters(results: MeterSnapshotIn[]) {
      applySnapshot(self.meters, results);
    }

    const fetchAndStoreMeters = flow(function* () {
      const data: ApiList<MeterSnapshotIn> = yield fetchMeters(self.offset);

      setMeters(data.results);
      self.totalCount = data.count;

      return data.results;
    });

    const loadMeters = flow(function* (page = 1) {
      self.isLoading = true;

      try {
        const firstPage = Math.max(1, Math.floor(page));
        self.currentPage = firstPage;

        const meters = yield fetchAndStoreMeters();

        const ids = extractAreaIds(meters);

        yield loadAreas(ids);
      } catch (e) {
        console.error(e);
      } finally {
        self.isLoading = false;
      }
    });

    const setPage = flow(function* (page: number) {
      const safePage = Math.min(Math.max(1, Math.floor(page)), self.totalPages);
      yield loadMeters(safePage);
    });

    const removeMeter = flow(function* (id: string) {
      try {
        yield deleteMeter(id);

        self.totalCount = Math.max(0, self.totalCount - 1);
        const pageAfterDelete = Math.min(self.currentPage, self.totalPages);
        yield loadMeters(pageAfterDelete);
      } catch (e) {
        console.error('Unable to delete', e);
      }
    });

    const loadAreas = flow(function* (ids: string[]) {
      const unknownIds = ids.filter((id) => !self.areas.has(id));

      if (!unknownIds.length) return;

      try {
        const data: ApiList<AreaSnapshotIn> = yield fetchAreas(unknownIds);

        data.results.forEach((area) => {
          self.areas.set(area.id, area);
        });
      } catch (e) {
        console.error(e);
      }
    });

    return {
      loadMeters,
      setPage,
      removeMeter,
      loadAreas,
    };
  });

export type RootStoreInstance = Instance<typeof RootStore>;
