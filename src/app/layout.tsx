import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const metadata: Metadata = {
  title: 'ALAMERA ADVISORY | Private Client CRM & Trophy Asset Management',
  description:
    'Institutional advisory platform for ultra-high-net-worth family offices, off-market real estate mandates, and DLD escrow acquisition tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-alamera-darkest text-alamera-cream antialiased selection:bg-champagne-500 selection:text-alamera-darkest">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
