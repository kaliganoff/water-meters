import { observer } from 'mobx-react-lite';
import { useStore } from '../store/storeProvider';
import './MeterTable.css';
import { WaterIcon } from './WaterIcon';
import { DeleteIcon } from './DeleteIcon';

export const MeterTable = observer(() => {
  const store = useStore();

  const totalPages = store.totalPages;

  const numberOfButtons = 5;
  const half = Math.floor(numberOfButtons / 2);
  const start = Math.min(
    Math.max(1, store.currentPage - half),
    Math.max(1, totalPages - numberOfButtons + 1)
  );
  const end = Math.min(totalPages, start + numberOfButtons - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="table-layout">
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
              const rowNumber =
                (store.currentPage - 1) * store.pageSize + index + 1;

              return (
                <tr key={meter.id}>
                  <td className="cell-gray">{rowNumber}</td>
                  <td className="type-cell">
                    <WaterIcon type={meter.typeLabel} />
                    <span>{meter.typeLabel}</span>
                  </td>
                  <td>{meter.formattedDate}</td>
                  <td>{meter.is_automatic ? 'да' : 'нет'}</td>
                  <td>
                    {meter.initial_values?.[0]
                      ? meter.initial_values?.[0].toFixed(1)
                      : '-'}
                  </td>
                  <td>{address ? address.fullAddress : 'Загрузка...'}</td>
                  <td className="cell-gray">
                    <div className="description-cell">
                      <span>{meter.description || '-'}</span>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => {
                          store.removeMeter(meter.id);
                        }}
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

      <div className="table-footer">
        <div className="pagination">
          <button
            type="button"
            className="page-btn"
            disabled={store.currentPage <= 1}
            onClick={() => store.setPage(store.currentPage - 1)}
          >
            ‹
          </button>

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`page-btn ${p === store.currentPage ? 'is-active' : ''}`}
              onClick={() => store.setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            className="page-btn"
            disabled={store.currentPage >= totalPages}
            onClick={() => store.setPage(store.currentPage + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
});
