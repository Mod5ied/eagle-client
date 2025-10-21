"use client";
import { useSelector } from 'react-redux';
import { Card } from '@components/ui/card';
import { StatusDonut, CategoryBars, InventoryLine } from '@components/analytics/charts';
import { LogoutButton } from '@components/auth/logout-button';
import { selectProducts, selectTotals } from '@store/selectors/analytics.selectors';
import { ReadonlyProductsTable } from '@components/product/readonly-products-table';
import Link from 'next/link';
import { Button } from '@components/ui/button';
import { useAuth } from '@hooks/useAuth';
import { useProductsSubscription } from '@hooks/useProductsSubscription';
import { useListQuery } from '@store/services/products.api';
import { useDispatch } from 'react-redux';
import { productsUpserted } from '@store/slices/products.slice';
import { useEffect } from 'react';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  useProductsSubscription(!!user);

  // Ensure analytics page has the same product data as products page
  const { data: backendProducts } = useListQuery(undefined, {
    skip: !user
  });

  // Populate Redux store with backend data when it arrives
  useEffect(() => {
    if (backendProducts && backendProducts.length > 0) {
      dispatch(productsUpserted(backendProducts));
    }
  }, [backendProducts, dispatch]);

  const products = useSelector(selectProducts);
  const { total, active, inactive, inventoryValue } = useSelector(selectTotals);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="flex items-center gap-2">
          <Link href="/products">
            <Button variant="ghost" className="w-20 h-[2.5rem]">Products</Button>
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <h2 className="font-medium">Total Products</h2>
          <p className="text-2xl font-semibold">{total}</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium">Active</h2>
          <p className="text-2xl font-semibold text-green-600">{active}</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium">Inactive</h2>
          <p className="text-2xl font-semibold text-red-600">{inactive}</p>
        </Card>
        <Card className="p-4">
          <h2 className="font-medium">Inventory Value</h2>
          <p className="text-xl font-semibold">{inventoryValue.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</p>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <StatusDonut products={products} />
        <CategoryBars products={products} />
        <InventoryLine products={products} />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Products Overview</h2>
        <ReadonlyProductsTable products={products} />
      </div>
    </div>
  );
}
