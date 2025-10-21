import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/index';
import { productsSelectors } from '@store/slices/products.slice';

// Base selector for all products
export const selectProducts = (state: RootState) => productsSelectors.selectAll(state as any);

export const selectTotals = createSelector(selectProducts, (products) => {
  const total = products.length;
  const active = products.filter(p => p.status === 'active').length;
  const inactive = total - active;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  return { total, active, inactive, inventoryValue };
});

export const selectCategoryDistribution = createSelector(selectProducts, (products) => {
  const map: Record<string, number> = {};
  products.forEach(p => { const c = p.category || 'Uncategorized'; map[c] = (map[c] || 0) + 1; });
  return Object.entries(map).map(([category, value]) => ({ category, value }));
});

export const selectStatusPieData = createSelector(selectTotals, ({ active, inactive }) => [
  { status: 'active', value: active, fill: 'var(--chart-1)' },
  { status: 'inactive', value: inactive, fill: 'var(--chart-2)' }
]);

export const selectInventorySeries = createSelector(selectProducts, (products) => {
  const byDay: Record<string, number> = {};
  products.forEach(p => {
    const d = p.createdAt instanceof Date ? p.createdAt : undefined;
    const key = d ? d.toISOString().slice(0,10) : 'Unknown';
    byDay[key] = (byDay[key] || 0) + p.price * p.quantity;
  });
  return Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).map(([day, value]) => ({ day, value, fill: 'var(--chart-3)' }));
});
