"use client";
import React, { useMemo } from 'react';
import { ProductEntity } from '@store/slices/products.slice';
import { Card } from '@components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@components/ui/chart';

interface ChartsProps { products: ProductEntity[]; }

export function StatusDonut({ products }: ChartsProps) {
  const data = useMemo(() => {
    const active = products.filter(p => p.status === 'active').length;
    const inactive = products.length - active;
    return [
      { status: 'Active', value: active, fill: '#22c55e' },
      { status: 'Inactive', value: inactive, fill: '#ef4444' }
    ];
  }, [products]);

  const config = {
    Active: { label: 'Active', color: '#22c55e' },
    Inactive: { label: 'Inactive', color: '#ef4444' }
  };

  return (
    <div role="group" aria-labelledby="chart-status-heading">
      <Card className="p-4">
        <h3 id="chart-status-heading" className="text-sm font-medium mb-2">Status Distribution</h3>
        <ChartContainer config={config} className="min-h-[200px] w-full" aria-label="Pie chart showing active versus inactive product counts">
          <PieChart width={300} height={200}>
          <Pie data={data} dataKey="value" nameKey="status" innerRadius={40} outerRadius={70} paddingAngle={2}>
            {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
          <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </Card>
    </div>
  );
}

export function CategoryBars({ products }: ChartsProps) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach(p => { const c = p.category || 'Uncategorized'; counts[c] = (counts[c] || 0) + 1; });
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return Object.entries(counts).map(([category, value], i) => ({ 
      category, 
      value, 
      fill: colors[i % colors.length] 
    }));
  }, [products]);
  
  const config = { 
    value: { label: 'Count', color: '#3b82f6' }
  };

  return (
    <div role="group" aria-labelledby="chart-category-heading">
      <Card className="p-4">
        <h3 id="chart-category-heading" className="text-sm font-medium mb-2">Category Counts</h3>
        <ChartContainer config={config} className="min-h-[250px] w-full" aria-label="Bar chart showing number of products per category">
        <BarChart width={300} height={250} data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} width={30} />
          <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
          <Bar dataKey="value" radius={4} fill="#3b82f6" />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
}

export function InventoryLine({ products }: ChartsProps) {
  const chartData = useMemo(() => {
    const byDay: Record<string, number> = {};
    products.forEach(p => {
      const d = p.createdAt instanceof Date ? p.createdAt : undefined;
      const key = d ? d.toISOString().slice(0,10) : 'Unknown';
      const value = p.price * p.quantity;
      byDay[key] = (byDay[key] || 0) + value;
    });
    return Object.entries(byDay).sort(([a],[b]) => a.localeCompare(b)).map(([day, value]) => ({ 
      day: day === 'Unknown' ? day : new Date(day).toLocaleDateString(), 
      value 
    }));
  }, [products]);
  
  const config = { 
    value: { label: 'Inventory Value', color: '#8b5cf6' }
  };

  return (
    <div role="group" aria-labelledby="chart-inventory-heading">
      <Card className="p-4">
        <h3 id="chart-inventory-heading" className="text-sm font-medium mb-2">Inventory Value Over Time</h3>
        <ChartContainer config={config} className="min-h-[250px] w-full" aria-label="Line chart showing inventory value aggregated by day">
        <LineChart width={300} height={250} data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis width={40} />
          <ChartTooltip content={<ChartTooltipContent nameKey="day" />} />
          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </Card>
    </div>
  );
}
