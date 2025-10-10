import type { Metadata } from 'next';
import { Coustard, Karla } from 'next/font/google';
import './globals.css';

const coustard = Coustard({
  variable: '--font-coustard',
  subsets: ['latin'],
  weight: ['400'],
});

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Nina Groop - Writer, Editor, Grant Writer, Life Coach',
  description:
    'Nina Groop helps people and organizations tell their stories with clarity and heart.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${coustard.variable} ${karla.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
