import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bannersDir = path.join(process.cwd(), 'public', 'images', 'banners');

    if (!fs.existsSync(bannersDir)) {
      fs.mkdirSync(bannersDir, { recursive: true });
      return NextResponse.json({ banners: [] });
    }

    const validExtensions = ['.webp', '.jpg', '.jpeg', '.png'];
    const files = fs.readdirSync(bannersDir);

    const banners = files
      .filter((file) => validExtensions.includes(path.extname(file).toLowerCase()))
      .map((file, idx) => {
        const cleanName = path.parse(file).name.replace(/[-_]/g, ' ');
        return {
          id: `custom-banner-${idx}-${file}`,
          title: `Arruda Móveis - ${cleanName}`,
          href: '/catalogo',
          desktopSrc: `/images/banners/${file}`,
          mobileSrc: `/images/banners/${file}`,
          bgColor: '#0f0345',
          isOffer: false,
        };
      });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Erro ao ler pasta de banners:', error);
    return NextResponse.json({ banners: [] }, { status: 500 });
  }
}
