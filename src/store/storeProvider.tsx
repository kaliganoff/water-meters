import { createContext, useContext } from 'react';
import { RootStore } from './rootStore';

const store = RootStore.create({
  meters: [],
  isLoading: false,
});

const StoreContext = createContext(store);

export const StoreProvider = ({ children }: any) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
