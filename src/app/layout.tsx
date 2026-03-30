import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import AuthInitializer from "@/components/auth/AuthInitializer";

export const metadata: Metadata = {
  title: "귀국짐",
  description: "일본 거주 한국인을 위한 귀국짐 거래 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthInitializer />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
