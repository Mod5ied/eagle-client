import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';

export interface ProductEntity {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status: 'active' | 'inactive';
  category?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

const adapter = createEntityAdapter<ProductEntity>({ selectId: (p) => p.id });

interface ProductsState {
  initializing: boolean;
}

const initialState = adapter.getInitialState<ProductsState>({ initializing: true });

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    productsUpserted(state, action: PayloadAction<ProductEntity[]>) {
      // Reconcile any optimistic temp-* entries with real documents (match by sku + name)
      const incoming = action.payload;
      const toRemove: string[] = [];
      incoming.forEach(p => {
        if (p.id.startsWith('temp-')) return; // skip temp in incoming just in case
        const existing = Object.values(state.entities).filter((e): e is ProductEntity => !!e && e.id.startsWith('temp-') && e.sku === p.sku && e.name === p.name);
        existing.forEach(e => toRemove.push(e.id));
      });
      toRemove.forEach(id => adapter.removeOne(state, id));
      adapter.upsertMany(state, incoming);
      state.initializing = false;
    },
    productsRemoved(state, action: PayloadAction<string[]>) {
      action.payload.forEach((id) => adapter.removeOne(state, id));
    },
    productsListenerReset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const productsReducer = slice.reducer;
export const { productsUpserted, productsRemoved, productsListenerReset } = slice.actions;
export const productsSelectors = adapter.getSelectors<{
  products: ReturnType<typeof productsReducer>;
}>((state) => state.products);
