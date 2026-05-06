import Navbar from '../components/navBar/Navbar';
import Footer from '../components/footer/Footer';
import './global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <Navbar />
        <main className="industrial-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}