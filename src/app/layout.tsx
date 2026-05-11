import Navbar from "../components/navBar/Navbar";
import InitStorage from "../components/initStorage";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <InitStorage />
        <Navbar />
        <main className="industrial-main">{children}</main>
      </body>
    </html>
  );
}