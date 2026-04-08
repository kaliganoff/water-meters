import { observer } from 'mobx-react-lite';
import { useStore } from '../store/storeProvider';
import './MeterTable.css';
import { WaterIcon } from './WaterIcon';
import { DeleteIcon } from './DeleteIcon';

export const MeterTable = observer(() => {
  const store = useStore();

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>№</th>
            <th>Тип</th>
            <th>Дата установки</th>
            <th>Автоматический</th>
            <th>Текущие показания</th>
            <th>Адрес</th>
            <th>Примечание</th>
          </tr>
        </thead>

        <tbody>
          {store.meters.map((meter, index) => {
            const address = meter.address;

            return (
              <tr key={meter.id}>
                <td className="cell-gray">{index + 1}</td>
                <td className="type-cell">
                  <WaterIcon type={meter.typeLabel} />
                  <span>{meter.typeLabel}</span>
                </td>
                <td>{meter.formattedDate}</td>
                <td>{meter.is_automatic ? 'да' : 'нет'}</td>
                <td>{meter.initial_values?.[0] ? meter.initial_values?.[0].toFixed(1) : '-'}</td>
                <td>{address ? address.fullAddress : 'Загрузка...'}</td>
                <td className="cell-gray">
                  <div className="description-cell">
                    <span>{meter.description || '-'}</span>
                    <button
                      type="button"
                      className="delete-btn"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
