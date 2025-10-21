"use client";
import * as React from 'react';
import {
  Tooltip as ReTooltip,
  TooltipProps,
  Legend as ReLegend,
} from 'recharts';

// Config types
export type ChartConfig = Record<string, {
  label?: string;
  color?: string; // direct color or css var
  icon?: React.ComponentType<{ className?: string }>;
  theme?: { light: string; dark: string };
}>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig;
}

// Provides CSS vars for the chart instance based on config keys.
export const ChartContainer: React.FC<ChartContainerProps> = ({ config, className, style, ...rest }) => {
  const cssVars: React.CSSProperties = {};
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      const baseColor = value.color || value.theme?.light;
      if (baseColor) {
        // Cast to index signature since CSSProperties doesn't include custom vars
        (cssVars as Record<string, string>)[`--color-${key}`] = baseColor;
      }
    });
  }
  return <div className={className} style={{ ...cssVars, ...style }} {...rest} />;
};

// Tooltip
interface ChartTooltipContentProps {
  labelKey?: string;
  nameKey?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: 'dot' | 'line' | 'dashed';
  contentProps?: Partial<TooltipProps<any, any>>;
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps & { payload?: any; label?: any; active?: boolean }> = ({ active, payload, label, hideLabel, hideIndicator, indicator = 'dot', labelKey, nameKey }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border bg-white/90 backdrop-blur px-2 py-1 text-xs shadow dark:bg-neutral-900/80">
      {!hideLabel && <div className="font-medium mb-1">{label}</div>}
      <div className="space-y-1">
        {payload.map((p: any, i: number) => {
          const color = p.color || p.payload?.fill || `var(--color-${p.dataKey})`;
          const name = nameKey ? p.payload?.[nameKey] : p.name;
          return (
            <div key={i} className="flex items-center gap-2">
              {!hideIndicator && (
                <span
                  className={indicator === 'dot' ? 'h-2 w-2 rounded-full' : 'h-2 w-4'}
                  style={{ background: indicator === 'dot' ? color : undefined, borderBottom: indicator !== 'dot' ? `2px ${indicator === 'dashed' ? 'dashed' : 'solid'} ${color}` : undefined }}
                />
              )}
              <span className="flex-1 truncate">{name}</span>
              <span className="tabular-nums">{p.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ChartTooltip: React.FC<TooltipProps<any, any>> = (props) => {
  return <ReTooltip {...props} />;
};

// Legend
interface ChartLegendContentProps {
  nameKey?: string;
}
export const ChartLegendContent: React.FC<ChartLegendContentProps & { payload?: any[] }> = ({ payload, nameKey }) => {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap gap-3 text-[11px]">
      {payload.map((p, i) => {
        const color = p.color || p.payload?.fill || `var(--color-${p.value})`;
        const name = nameKey ? p.payload?.[nameKey] : p.value;
        return (
          <div key={i} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
            <span className="truncate" title={name}>{name}</span>
          </div>
        );
      })}
    </div>
  );
};

// Recharts Legend is a class component; forwarding props directly can confuse TS with ref typing.
// Provide a thin functional wrapper with explicit prop type.
// Export Legend directly (alias) to avoid TS ref mismatch.
export const ChartLegend = ReLegend;
