'use client';

import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { ProductImage } from '@/types/catalog';
import { ZoomIn, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const displayImages = images.length > 0 ? images : [{ id: 0, storage_key: '', url: '', is_primary: true, sort_order: 0 }];
  const activeImage = displayImages[selectedIndex] || displayImages[0];

  // Controle de posição da lupa no Desktop
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !activeImage.url) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (activeImage.url) {
      setIsZooming(true);
    }
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  // Navegação no modal tela cheia
  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      } else if (e.key === 'ArrowLeft' && isModalOpen) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && isModalOpen) {
        handleNext();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, displayImages.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* Container Principal da Foto com Lupa Interativa */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => activeImage.url && setIsModalOpen(true)}
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: activeImage.url ? 'zoom-in' : 'default',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
        }}
      >
        {activeImage.url ? (
          <>
            <img
              src={activeImage.url}
              alt={activeImage.alt_text || productName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '1rem',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                transition: isZooming ? 'none' : 'transform 0.25s ease-out',
                pointerEvents: 'none',
              }}
            />

            {/* Dica de Zoom e Botão de Expandir Tela Cheia */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 10,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                aria-label="Ver em tela cheia"
                title="Clique para ver em tela cheia"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0f172a',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  transition: 'transform 0.2s, background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                }}
              >
                <Maximize2 size={18} />
              </button>
            </div>

            {/* Badge indicativa de zoom no rodapé do card */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                pointerEvents: 'none',
                opacity: isZooming ? 0 : 0.85,
                transition: 'opacity 0.2s',
              }}
            >
              <ZoomIn size={13} />
              <span>Passe o mouse para ampliar</span>
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>
            Imagem ilustrativa em breve
          </div>
        )}
      </div>

      {/* Miniaturas de Fotos */}
      {displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              style={{
                width: '74px',
                height: '74px',
                flexShrink: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2px solid var(--color-brand-primary)' : '1px solid #e2e8f0',
                padding: '4px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                opacity: selectedIndex === idx ? 1 : 0.7,
                transition: 'all 0.2s ease',
              }}
            >
              <img
                src={img.url}
                alt={img.alt_text || `${productName} miniatura ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal Lightbox Tela Cheia */}
      {isModalOpen && activeImage.url && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 10, 20, 0.92)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            aria-label="Fechar tela cheia"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
              zIndex: 100000,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
          >
            <X size={24} />
          </button>

          {/* Seta Esquerda (se mais de 1 foto) */}
          {displayImages.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              style={{
                position: 'absolute',
                left: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                zIndex: 100000,
              }}
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Imagem em Alta Definição */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={activeImage.url}
              alt={activeImage.alt_text || productName}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                backgroundColor: '#ffffff',
                padding: '1rem',
              }}
            />
            <span
              style={{
                marginTop: '1rem',
                color: '#ffffff',
                fontSize: '0.9375rem',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {productName}
              {displayImages.length > 1 && ` (${selectedIndex + 1}/${displayImages.length})`}
            </span>
          </div>

          {/* Seta Direita (se mais de 1 foto) */}
          {displayImages.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próxima foto"
              style={{
                position: 'absolute',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                zIndex: 100000,
              }}
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
