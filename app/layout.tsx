import type { Metadata } from 'next';
import { Montserrat, Raleway } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['200', '400', '600'],
  style: ['normal', 'italic'],
});

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  weight: ['200', '400', '700'],
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
        className={`${montserrat.variable} ${raleway.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
