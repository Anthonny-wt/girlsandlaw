import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Girls & Law | Comunidad Legal',
  description:
    'Comunidad de mujeres multifacéticas en el derecho. Redefiniendo el ejercicio legal desde la autenticidad, la excelencia y la sororidad.',
  keywords: [
    'Girls & Law',
    'comunidad legal',
    'mujeres en el derecho',
    'abogadas',
    'derecho femenino',
  ],
  openGraph: {
    title: 'Girls & Law | Comunidad Legal',
    description:
      'Comunidad de mujeres multifacéticas en el derecho.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-girls-dark antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
