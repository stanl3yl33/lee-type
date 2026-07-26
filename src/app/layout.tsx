import TopNav from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css"; // for tailwindcss
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  Geist_Mono,
  Fira_Code,
  JetBrains_Mono,
  Roboto_Mono,
  Space_Mono,
  Courier_Prime,
  Nunito,
  Comic_Neue,
} from "next/font/google";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// Space Mono and Courier Prime are not variable fonts
// so explicit weights must be specified
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const comicNeue = Comic_Neue({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-comic-neue",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        ${geistMono.variable}
        ${firaCode.variable}
        ${jetbrainsMono.variable}
        ${robotoMono.variable}
        ${spaceMono.variable}
        ${courierPrime.variable}
        ${nunito.variable}
        ${comicNeue.variable}
      `}
    >
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
