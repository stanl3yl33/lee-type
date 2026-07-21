import TopNav from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css"; // for tailwindcss
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* child componnet is to be populated with page.tsx */}
      <body>
        <ThemeProvider>
          {/* top nav */}
          <TopNav />

          <main>{children}</main>

          {/* footer on bottom */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
