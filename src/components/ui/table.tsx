import * as React from 'react';
import { cn } from '@lib/utils';
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
	return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />;
}
export function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} />; }
export function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} />; }
export function TR(props: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className={cn('border-b last:border-none', props.className)} {...props} />; }
export function TH(props: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className={cn('text-left p-2 font-medium', props.className)} {...props} />; }
export function TD(props: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn('p-2 align-middle', props.className)} {...props} />; }
