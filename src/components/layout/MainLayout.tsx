import type { ReactNode } from "react";
import Header from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-neutral-900">
      <Header />
      <main className="mx-auto max-w-6xl px-2 py-8 sm:px-6">{children}</main>
    </div>
  );
}
