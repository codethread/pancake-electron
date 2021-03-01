import { useContext } from 'react';
import { IStoreContext, StoreContext } from '../contexts/contexts';

export const useStore = (): IStoreContext => useContext(StoreContext);
