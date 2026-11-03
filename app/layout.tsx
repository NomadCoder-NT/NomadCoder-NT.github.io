import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'nomadcoder-nt — 3D Portfolio & Digital Strategy',
  description:
    'Performance Marketing & Digital Strategy Professional transitioning into AI Systems and 3D WebGL Engineering. An atmospheric 3D scroll storytelling journey across the seasons of growth.',
  openGraph: {
    title: 'nomadcoder-nt — 3D Portfolio & Digital Strategy',
    description:
      'Performance Marketing & Digital Strategy Professional transitioning into AI Systems and 3D WebGL Engineering. An atmospheric 3D scroll storytelling journey across the seasons of growth.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nomadcoder-nt — 3D Portfolio & Digital Strategy',
    description:
      'Performance Marketing & Digital Strategy Professional transitioning into AI Systems and 3D WebGL Engineering. An atmospheric 3D scroll storytelling journey across the seasons of growth.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
