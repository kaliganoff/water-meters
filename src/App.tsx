import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './store/storeProvider';

const App = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.loadMeters();
  }, []);

  if (store.isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Счётчики</h1>

      {store.meters.map((meter: any, index: number) => (
        <div key={meter.id}>
          {index + 1}. {meter._type} - {meter.installation_date} - {meter.is_automatic} - {meter.initial_values} - {JSON.stringify(meter.area)} - {meter.description}
        </div>
      ))}
    </div>
  );
});

export default App;
