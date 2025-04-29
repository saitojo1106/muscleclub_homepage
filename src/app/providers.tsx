'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false}
      // 以下を追加
      disableTransitionOnChange
      // style属性とdata-mode属性の同期を避ける
      enableColorScheme={false}
    >
      {children}
    </ThemeProvider>
  );
}
