"use client";
import { useState, useMemo, ChangeEvent } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  FilterFn,
  Row,
  HeaderGroup,
  Cell,
  Table as TableType,
  useReactTable
} from '@tanstack/react-table';
import { ProductEntity } from '@store/slices/products.slice';
import { Table, THead, TBody, TR, TH, TD } from '@components/ui/table';
import { Skeleton } from '@components/ui/skeleton';
import { Button } from '@components/ui/button';

interface ProductsTableProps {
  products: ProductEntity[];
  initializing?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const columnHelper = createColumnHelper<ProductEntity>();

export function ProductsTable({ products, initializing, onEdit, onDelete, onToggleStatus }: ProductsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('sku', {
      header: () => 'SKU',
      cell: (info) => info.getValue()
    }),
    // Use separate cell formatting so underlying value remains numeric for proper sorting
    columnHelper.accessor('price', {
      header: () => 'Price',
      cell: (info) => `$${info.getValue().toFixed(2)}`
    }),
    columnHelper.accessor('quantity', {
      header: () => 'Qty',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => (
        <span className={`text-xs px-2 py-1 rounded-full border ${
          info.getValue() === 'active' 
            ? 'bg-green-50 border-green-300 text-green-700' 
            : 'bg-red-50 border-red-300 text-red-700'
        }`}>
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('category', {
      header: () => 'Category',
      cell: (info) => info.getValue() || '—'
    }),
    columnHelper.display({
      id: 'actions',
      header: () => '',
      cell: ({ row }: { row: Row<ProductEntity> }) => (
        <div className="flex gap-1">
          <Button aria-label={`Edit product ${row.original.name}`} size="sm" variant="ghost" onClick={() => onEdit(row.original.id)}>Edit</Button>
          <Button aria-label={`${row.original.status === 'active' ? 'Deactivate' : 'Activate'} product ${row.original.name}`} size="sm" variant="outline" onClick={() => onToggleStatus(row.original.id)}>{row.original.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
          <Button aria-label={`Delete product ${row.original.name}`} size="sm" variant="destructive" onClick={() => onDelete(row.original.id)}>Delete</Button>
        </div>
      )
    })
  ], [onEdit, onDelete, onToggleStatus]);

  const globalFilterFn: FilterFn<ProductEntity> = (row, _columnId, filterValue) => {
    if (!filterValue) return true;
    const v = String(filterValue).toLowerCase();
    return Object.values(row.original).some(val => typeof val === 'string' && val.toLowerCase().includes(v));
  };

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter, columnFilters, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // status filter convenience helpers
  const statusColumn = table.getColumn('status');
  const currentStatusFilter = statusColumn?.getFilterValue() as string | undefined;

  const totalRows = table.getRowModel().rows.length;
  const pageRows = table.getRowModel().rows;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            value={globalFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            aria-label="Search products"
            className="h-9 w-56 rounded-md border border-gray-200 bg-white px-3 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="statusFilter" className="text-xs font-medium">Status:</label>
          <select
            id="statusFilter"
            className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm"
            value={currentStatusFilter ?? ''}
            onChange={(e) => statusColumn?.setFilterValue(e.target.value === '' ? undefined : e.target.value)}
            aria-label="Filter products by status"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        {sorting.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setSorting([])}>Clear Sort</Button>
        )}
      </div>
      {/* Desktop/Table view - unified table for proper alignment */}
      <div className="hidden md:block rounded-lg border border-gray-200 bg-white shadow-sm min-h-[70vh] max-h-[70vh] overflow-auto">
        <Table className="w-full border-collapse">
          <THead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_#e5e7eb]">
            {table.getHeaderGroups().map((hg: HeaderGroup<ProductEntity>) => (
              <TR key={hg.id}>
                {hg.headers.map(header => (
                  <TH
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={"py-2 px-3 text-left text-xs font-medium text-gray-600 " + (header.column.getCanSort() ? 'cursor-pointer select-none' : '')}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <span>▲</span>}
                      {header.column.getIsSorted() === 'desc' && <span>▼</span>}
                    </div>
                  </TH>
                ))}
              </TR>
            ))}
          </THead>
          <TBody>
            {initializing && Array.from({ length: 6 }).map((_, i) => (
              <TR key={`skeleton-row-${i}`} className="animate-pulse">
                {columns.map((col, ci) => (
                  <TD key={`sk-${ci}`} className="py-2 px-3 border-b border-gray-100">
                    <Skeleton className="h-4 w-full" />
                  </TD>
                ))}
              </TR>
            ))}
            {!initializing && pageRows.length === 0 && (
              <TR>
                <TD colSpan={columns.length} className="p-6 text-center text-sm">No products found.</TD>
              </TR>
            )}
            {!initializing && pageRows.map((row: Row<ProductEntity>) => (
              <TR key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell: Cell<ProductEntity, unknown>) => (
                  <TD key={cell.id} className="py-2 px-3 text-sm border-b border-gray-100 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TD>
                ))}
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-2">
        {initializing && Array.from({ length: 6 }).map((_, i) => (
          <div key={`sk-m-${i}`} className="rounded border border-gray-200 p-3 bg-white">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
        {!initializing && pageRows.length === 0 && (
          <div className="p-6 text-center text-sm border rounded">No products found.</div>
        )}
        {!initializing && pageRows.map((row: Row<ProductEntity>) => {
          const p = row.original;
          return (
            <div key={row.id} className="rounded border border-gray-200 p-3 bg-white shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border ${p.status==='active' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}>{p.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex flex-col"><span className="text-muted-foreground">Price</span><span>${p.price.toFixed(2)}</span></div>
                <div className="flex flex-col"><span className="text-muted-foreground">Qty</span><span>{p.quantity}</span></div>
                <div className="flex flex-col"><span className="text-muted-foreground">Category</span><span>{p.category || '—'}</span></div>
                <div className="flex flex-col"><span className="text-muted-foreground">Updated</span><span>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : '—'}</span></div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button aria-label={`Edit product ${p.name}`} size="sm" variant="ghost" onClick={() => onEdit(p.id)}>Edit</Button>
                <Button aria-label={`${p.status === 'active' ? 'Deactivate' : 'Activate'} product ${p.name}`} size="sm" variant="outline" onClick={() => onToggleStatus(p.id)}>{p.status === 'active' ? 'Deactivate' : 'Activate'}</Button>
                <Button aria-label={`Delete product ${p.name}`} size="sm" variant="destructive" onClick={() => onDelete(p.id)}>Delete</Button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Pagination controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Rows: {totalRows}</span>
          <span className="text-muted-foreground">Page {pagination.pageIndex + 1} of {table.getPageCount()}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-8 rounded-md border border-gray-200 bg-white px-2"
            value={pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[5,10,20,50].map(sz => <option key={sz} value={sz}>{sz} / page</option>)}
          </select>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>⏮</Button>
            <Button size="sm" variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
            <Button size="sm" variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            <Button size="sm" variant="outline" onClick={() => table.setPageIndex(table.getPageCount()-1)} disabled={!table.getCanNextPage()}>⏭</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
