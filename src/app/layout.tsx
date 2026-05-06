// Importujemy nasze komponenty z folderu components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
      
        <main>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}