
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StartLane AI | Performance Marketing & AI Automation',
  description: 'AI-powered marketing systems for local businesses and service brands.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#080810] text-[#8888AA]">
        {children}
      </body>
    </html>
  );
}
