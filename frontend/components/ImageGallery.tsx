'use client';

import React, { useState } from 'react';
import { ProductImage } from '@/types/catalog';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [{ id: 0, storage_key: '', url: '', is_primary: true, sort_order: 0 }];
  const activeImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Imagem Principal */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {activeImage.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt_text || productName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>
            Imagem ilustrativa em breve
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: '72px',
                height: '72px',
                flexShrink: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                padding: '2px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                opacity: selectedIndex === idx ? 1 : 0.7,
                transition: 'opacity var(--transition-fast), border-color var(--transition-fast)',
              }}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${productName} miniatura ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
