import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Arruda Móveis Eletro — Catálogo Digital e Ofertas',
  description: 'Confira nosso catálogo completo de móveis e eletrodomésticos com as melhores ofertas e atendimento direto pelo WhatsApp.',
  openGraph: {
    title: 'Arruda Móveis Eletro — Catálogo Digital',
    description: 'Móveis e eletrodomésticos de qualidade com condições exclusivas e entrega rápida.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
