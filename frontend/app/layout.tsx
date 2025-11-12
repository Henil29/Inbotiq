"use client";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/ui/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container py-8">{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
