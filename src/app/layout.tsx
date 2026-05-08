"use client";
import Navbar from "../components/navBar/Navbar";
import Footer from "../components/footer/Footer";
import "./global.css";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!localStorage.getItem("toWatch")) {
      localStorage.setItem("toWatch", JSON.stringify([]));
    }
    if (!localStorage.getItem("watched")) {
      localStorage.setItem("watched", JSON.stringify([]));
    }
  }, []);
  return (
    <html lang="pl">
      <body>
        <Navbar />
        <main className="industrial-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
