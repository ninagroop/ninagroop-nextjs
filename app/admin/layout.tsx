import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Nina Groop',
  description: 'Content Management System',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* DecapCMS requires these styles to be loaded */}
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          #__next {
            height: 100vh;
          }
        `}</style>
      </head>
      <body>
        <div id="__next">{children}</div>
      </body>
    </html>
  );
}
