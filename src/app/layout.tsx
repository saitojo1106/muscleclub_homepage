import Footer from "@/app/_components/footer";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeScript } from "./_components/theme-switcher";
import { Providers } from "./providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `マッスルクラブ | 筋トレサークル公式サイト`,
  description: `筋トレと健康的な生活を通じて、心身ともに成長していく仲間たちのコミュニティ`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} bg-white dark:bg-slate-900 text-black dark:text-white min-h-screen`}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
