import { types, flow } from 'mobx-state-tree';
import { fetchMeters } from '../api/metersApi';
import { meterModel } from '../models/meterModel';
import { areaModel } from '../models/areaModel';
import { fetchAreas } from '../api/areasApi';

export const RootStore = types
  .model({
    meters: types.array(meterModel),
    areas: types.map(areaModel),
    isLoading: false,
  })
  .actions((self) => {
    const loadMeters = flow(function* () {
      self.isLoading = true;
      try {
        const data = yield fetchMeters(0);
        self.meters = data.results;
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
      loadAreas,
    };
  });
