import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar } from "@/components/sidebar";
import { getModulesWithArticles } from "@/lib/strapi";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DTAPS Knowledge Base",
  description: "Find help and documentation for DTAPS.",
};

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const strapiResponse = await getModulesWithArticles();
  const modules = strapiResponse?.data || [];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background">
            {/* ===== Sidebar ===== */}
            <Sidebar modules={modules} />

            {/* ===== Main Content Area ===== */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Top Bar */}
              <header className="h-16 flex items-center justify-between px-6 border-b border-border/60 flex-shrink-0">
                {/* Search Bar */}
                <div className="relative w-full max-w-md text-muted-foreground flex items-center">
                  <SearchIcon className="w-5 h-5 absolute left-3" />
                  <input
                    type="search"
                    placeholder="Search documentation..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-input rounded-lg focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </div>
                {/* Theme Toggle Button */}
                <div>
                  <ThemeToggle />
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}