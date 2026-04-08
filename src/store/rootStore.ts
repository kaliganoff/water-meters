import { types, flow } from 'mobx-state-tree';
import { deleteMeter, fetchMeters } from '../api/metersApi';
import { meterModel } from '../models/meterModel';
import { areaModel } from '../models/areaModel';
import { fetchAreas } from '../api/areasApi';

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
  }))
  .actions((self) => {
    const loadMeters = flow(function* (page = 1) {
      self.isLoading = true;
      try {
        const firstPage = Math.max(1, Math.floor(page));
        const offset = (firstPage - 1) * self.pageSize;
        const data: any = yield fetchMeters(offset);
        self.meters = data.results;
        self.currentPage = firstPage;
        self.totalCount = data.count;
        const ids: string[] = Array.from(
          new Set(data.results.map((m: any) => m.area.id))
        );
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
        const data = yield fetchAreas(unknownIds);

        data.results.forEach((area: any) => {
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
