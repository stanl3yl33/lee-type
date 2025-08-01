import TopNav from "@/_components/Header";
import Footer from "@/_components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* child componnet is to be populated with page.tsx */}
      <body>
        {/* top nav */}
        <TopNav />

        <main>{children}</main>

        {/* footer on bottom */}
        <Footer />
      </body>
    </html>
  );
}
