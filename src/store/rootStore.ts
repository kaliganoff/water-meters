import { types, flow } from 'mobx-state-tree';
import { fetchMeters } from '../api/metersApi';

export const RootStore = types
  .model({
    meters: types.array(types.frozen()),
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
