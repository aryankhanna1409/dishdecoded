import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DishDecoded",
  description: "Snap a dish or a menu and find out what it is, what's in it, its story, and how to make it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <Nav />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 pb-10 text-xs text-stone-400">
          DishDecoded is an AI guide. Ingredients and allergens are estimates; always confirm with the restaurant.
        </footer>
      </body>
    </html>
  );
}
