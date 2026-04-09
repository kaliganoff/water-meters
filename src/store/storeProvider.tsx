import type { PropsWithChildren } from 'react';
import { StoreContext, store } from './storeContext';

type StoreProviderProps = PropsWithChildren;

export const StoreProvider = ({ children }: StoreProviderProps) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
