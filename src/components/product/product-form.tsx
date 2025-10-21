"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema, ProductFormValues } from '@schemas/product.schema';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { useState } from 'react';

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitting?: boolean;
}

export function ProductForm({ defaultValues, onSubmit, submitting }: ProductFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '', sku: '', price: 0, quantity: 0, category: '', status: 'active', ...defaultValues
    }
  });
  const submit = async (values: ProductFormValues) => {
    try { await onSubmit(values); } catch (e: any) { setError(e.message ?? 'Error'); }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <div>
        <Input placeholder="Name" {...register('name')} />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Input placeholder="SKU" {...register('sku')} />
        {errors.sku && <p className="text-xs text-red-600 mt-1">{errors.sku.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input type="number" step="0.01" placeholder="Price" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Input type="number" placeholder="Quantity" {...register('quantity', { valueAsNumber: true })} />
          {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity.message}</p>}
        </div>
      </div>
      <div>
        <Input placeholder="Category" {...register('category')} />
        {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
      </div>
      <div>
        <select className="h-10 w-full rounded-md border border-cerulean/40 px-3 text-sm" {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
    </form>
  );
}
