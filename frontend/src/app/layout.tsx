import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getModules, getAllArticles } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DTAPS Knowledge Base",
  description: "Help and documentation for the DTAPS platform.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: modules } = await getModules();
  const articles = await getAllArticles();

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full bg-secondary`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-full">
            <Sidebar modules={modules} />
            <div className="flex-1 flex flex-col">
              <Topbar articles={articles} modules={modules} />
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}