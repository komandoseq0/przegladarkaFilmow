import Navbar from "../components/navBar/Navbar";
import AuthProvider from "../components/AuthProvider";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="industrial-main">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}