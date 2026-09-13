'use client';

import React, { useState } from 'react';

interface ShareButtonsProps {
  productName: string;
}

export default function ShareButtons({ productName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Confira este produto no catálogo da Arruda Móveis: ${productName}`,
          url: url,
        });
        return;
      } catch {
        // Usuário cancelou ou navegador não suportou, segue para clipboard
      }
    }

    // Copiar para área de transferência
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Falha silenciosa
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
      <button
        onClick={handleShare}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          padding: '0.625rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'background-color var(--transition-fast)',
        }}
      >
        <span>🔗</span>
        <span>{copied ? 'Link Copiado!' : 'Compartilhar'}</span>
      </button>

      {copied && (
        <span
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-success)',
            fontWeight: 600,
            animation: 'fadeIn 200ms ease',
          }}
        >
          ✓ Copiado com sucesso!
        </span>
      )}
    </div>
  );
}
