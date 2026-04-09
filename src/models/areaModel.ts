import { types } from 'mobx-state-tree';

export const areaModel = types
  .model({
    id: types.identifier,
    number: types.number,
    str_number: types.string,
    str_number_full: types.string,
    house: types.model({
      id: types.string,
      address: types.string,
    }),
  })

  .views((self) => ({
    get fullAddress() {
      return `${self.house.address}, ${self.str_number_full}`;
    },
  }));
