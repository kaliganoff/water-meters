import { types, flow } from 'mobx-state-tree';
import { fetchMeters } from '../api/metersApi';
import { meterModel } from '../models/meterModel';

export const RootStore = types
  .model({
    meters: types.array(meterModel),
    isLoading: false,
  })
  .actions((self) => ({
    loadMeters: flow(function* () {
      self.isLoading = true;
      try {
        const data = yield fetchMeters(0);
        self.meters = data.results;
      } catch (e) {
        console.error(e);
      } finally {
        self.isLoading = false;
      }
    }),
  }));
