import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '@components/providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-foreground bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
