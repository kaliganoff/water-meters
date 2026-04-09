import { createContext, useContext } from 'react';
import { RootStore, type RootStoreInstance } from './rootStore';

export const store = RootStore.create({
  meters: [],
  isLoading: false,
});

export const StoreContext = createContext<RootStoreInstance>(store);

export const useStore = () => useContext(StoreContext);
