"use client";

import { Jaro } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const jaro = Jaro({
  variable: "--font-jaro-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jaro.variable} antialiased overflow-hidden bg-darkBlue md:max-w-xl md:ml-auto md:mr-auto`}
      >
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
