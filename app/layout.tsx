import type { Metadata } from "next";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "next-themes";
import Provider from "./provider";

const appfont = DM_Sans({
  subsets: ["latin"],
  // weight: ["400", "500", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Kiwi AI",
  description: "UI/Ux at your fingertips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
    <body className={`${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
