import { types } from 'mobx-state-tree';

export const meterModel = types
  .model({
    id: types.identifier,
    _type: types.array(types.string),
    area: types.model({
      id: types.string,
    }),
    is_automatic: types.maybeNull(types.boolean),
    description: types.maybeNull(types.string),
    installation_date: types.string,
    initial_values: types.array(types.number),
  })

  .views((self) => ({
    get typeLabel() {
      return self._type.includes('HotWaterAreaMeter') ? 'ГВС' : 'ХВС';
    },
    get formattedDate() {
      return new Date(self.installation_date)
        .toLocaleDateString('ru-RU');
    },
  }));
