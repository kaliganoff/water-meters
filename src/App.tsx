import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './store/storeProvider';
import { MeterTable } from './components/MeterTable';
import './App.css';

const App = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.loadMeters();
  }, []);

  if (store.isLoading) return <div>Загрузка...</div>;

  return (
    <div className="app">
      <h1 className="title">Список счётчиков</h1>
      <MeterTable />
    </div>
  );
});

export default App;
