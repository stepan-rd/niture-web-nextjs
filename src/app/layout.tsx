import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ClientWrapper } from "@/components/ClientWrapper";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Cart } from "@/components/Cart";

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Niture",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ptSerif.className} antialiased`}>
        <ClientWrapper>
          <Navbar />
          {children}
          <Cart />
          <ReactQueryDevtools />
        </ClientWrapper>
      </body>
    </html>
  );
}
