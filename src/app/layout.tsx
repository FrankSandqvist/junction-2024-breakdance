import type { Metadata } from "next";
import { Covered_By_Your_Grace, Jaro } from "next/font/google";
import "./globals.css";

const jaro = Jaro({
  variable: "--font-jaro-sans",
  subsets: ["latin"],
});

const grace = Covered_By_Your_Grace({
  variable: "--font-grace",
  weight: "400",
  subsets: ["latin"], 
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jaro.variable} ${grace.variable} antialiased overflow-hidden bg-darkBlue md:max-w-xl md:ml-auto md:mr-auto`}
      >
        {children}
      </body>
    </html>
  );
}
