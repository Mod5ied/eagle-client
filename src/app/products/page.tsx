"use client";
import { useAuth } from '@hooks/useAuth';
import { useProductsSubscription } from '@hooks/useProductsSubscription';
import { productsSelectors } from '@store/slices/products.slice';
import { useSelector } from 'react-redux';
import { Button } from '@components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@components/ui/dialog';
import { ProductForm } from '@components/product/product-form';
// Firestore subscription retained for real-time updates, but CRUD now via backend productsApi
import { useListQuery, useCreateMutation, useUpdateMutation, useRemoveMutation, useToggleStatusMutation } from '@store/services/products.api';
import { useDispatch } from 'react-redux';
import { productsUpserted, productsRemoved } from '@store/slices/products.slice';
import { useToast } from '@components/ui/toast';
import { ProductsTable } from '@components/product/products-table';
import { useState, useEffect, useRef } from 'react';
import { LogoutButton } from '@components/auth/logout-button';
import Link from 'next/link';

export default function ProductsPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { toast } = useToast();
  useProductsSubscription(!!user);
  const products = useSelector(productsSelectors.selectAll);
  const initializing = useSelector((s: any) => s.products.initializing);

  // Primary data source: RTK Query for initial fetch and CRUD operations
  const { data: backendProducts, isLoading: isLoadingProducts } = useListQuery(undefined, {
    skip: !user
  });

  // Populate Redux store with backend data when it arrives
  useEffect(() => {
    if (backendProducts && backendProducts.length > 0) {
      dispatch(productsUpserted(backendProducts));
    }
  }, [backendProducts, dispatch]);
  const [openAdd, setOpenAdd] = useState(false);
  const [createProduct, createState] = useCreateMutation();
  const [updateProductMutation, updateState] = useUpdateMutation();
  const [removeProduct, removeState] = useRemoveMutation();
  const [toggleStatus, toggleState] = useToggleStatusMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const editing = products.find((p: any) => p.id === editingId) || null;
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Products</h1>
        <div className="flex items-center gap-2">
          <Link href="/analytics">
            <Button variant="ghost" className="w-20 h-[2.5rem]">Analytics</Button>
          </Link>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-28 h-[2.5rem]">Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>Enter product details.</DialogDescription>
              <ProductForm onSubmit={async (v) => {
                try {
                  // Optimistic placeholder (id will be replaced when Firestore snapshot arrives)
                  const tempId = 'temp-' + Date.now();
                  dispatch(productsUpserted([{
                    id: tempId,
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    quantity: v.quantity,
                    status: 'active',
                    category: v.category,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }]));
                  await createProduct(v).unwrap();
                  toast({ message: 'Product added', variant: 'success' });
                  setOpenAdd(false);
                } catch (e: any) {
                  toast({ message: 'Add failed', variant: 'error' });
                }
              }} />
            </DialogContent>
          </Dialog>

          <LogoutButton />
        </div>
      </div>
      <ProductsTable
        products={products}
        initializing={isLoadingProducts}
        onEdit={(id: string) => setEditingId(id)}
        onDelete={(id: string) => setDeletingId(id)}
        onToggleStatus={async (id: string) => {
          const prod = products.find((p: any) => p.id === id);
          if (!prod) return;
          try {
            const newStatus = prod.status === 'active' ? 'inactive' : 'active';
            await toggleStatus({ id, status: newStatus }).unwrap();
            toast({ message: `Status: ${newStatus}`, variant: 'info' });
          } catch (e: any) {
            toast({ message: 'Status toggle failed', variant: 'error' });
          }
        }}
      />
      {/* Dialogs outside table to avoid re-render flicker */}
      {products.map((p: any) => (
        <Dialog key={p.id} open={editingId === p.id} onOpenChange={(o: boolean) => !o && setEditingId(null)}>
          <DialogContent>
            <DialogTitle>Edit Product</DialogTitle>
            <ProductForm submitting={updateState.isLoading && editingId === p.id} defaultValues={editingId === p.id ? p : undefined} onSubmit={async (v: any) => {
              try {
                await updateProductMutation({ id: p.id, data: v }).unwrap();
                toast({ message: 'Product updated', variant: 'success' });
                setEditingId(null);
              } catch (e: any) {
                toast({ message: 'Update failed', variant: 'error' });
              }
            }} />
            <Button variant="outline" size="sm" disabled={toggleState.isLoading} onClick={async () => { try { await toggleStatus({ id: p.id, status: p.status === 'active' ? 'inactive' : 'active' }).unwrap(); setEditingId(null); } catch { toast({ message: 'Toggle failed', variant: 'error' }); } }}>Toggle Status</Button>
          </DialogContent>
        </Dialog>
      ))}
      {products.map((p: any) => (
        <Dialog key={`del-${p.id}`} open={deletingId === p.id} onOpenChange={(o: boolean) => !o && setDeletingId(null)}>
          <DialogContent>
            <DialogTitle>Delete Product</DialogTitle>
            <p className="text-sm">Are you sure you want to delete {p.name}?</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
              <Button size="sm" variant="destructive" disabled={removeState.isLoading} onClick={async () => {
                // Optimistic removal - use deletingId to ensure we get current product
                const productToDelete = products.find((x: any) => x.id === deletingId);
                if (!productToDelete) {
                  return;
                }
                dispatch(productsRemoved([productToDelete.id]));
                try {
                  await removeProduct(productToDelete.id).unwrap();
                  toast({ message: 'Product deleted', variant: 'success' });
                  setDeletingId(null);
                } catch (e: any) {
                  // Rollback on error
                  dispatch(productsUpserted([productToDelete]));
                  toast({ message: 'Delete failed', variant: 'error' });
                }
              }}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
