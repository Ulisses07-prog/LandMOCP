'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { MapPin, X, Loader2, ChevronRight } from 'lucide-react';

export default function LocationDetector() {
  const { selectedStore, isLoading, error, detectStoreByLocation } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [hasTried, setHasTried] = useState(false);

  // Mostrar modal se não tiver loja selecionada e ainda não tentou
  useEffect(() => {
    if (!selectedStore && !hasTried) {
      // Pequeno delay para não mostrar imediatamente
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedStore, hasTried]);

  const handleAllowLocation = async () => {
    setHasTried(true);
    await detectStoreByLocation();
    if (!error) {
      setShowModal(false);
    }
  };

  const handleSkip = () => {
    setHasTried(true);
    setShowModal(false);
  };

  // Não mostrar se já tem loja ou se já tentou
  if (selectedStore || !showModal) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        {/* Botão Fechar */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '8px',
            color: '#64748b',
          }}
        >
          <X size={20} />
        </button>

        {/* Ícone e Título */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <MapPin size={32} color="#2563eb" />
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 0.5rem 0',
            }}
          >
            Encontre sua Loja Mais Próxima
          </h2>
          <p
            style={{
              fontSize: '0.9375rem',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Permita o acesso à sua localização para direcionarmos você automaticamente à loja Arruda Móveis mais próxima de você.
          </p>
        </div>

        {/* Lista de Lojas (Manual) */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: '0 0 0.75rem 0',
            }}
          >
            Ou selecione manualmente:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Piripiri', 'São José do Divino', 'Batalha', 'Esperantina', 'Joaquim Pires', 'Murici dos Portelas', 'São João do Arraial', 'Matias Olimpio'].map((city) => (
              <button
                key={city}
                onClick={() => {
                  // TODO: Implementar seleção manual
                  handleSkip();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <span>{city}</span>
                <ChevronRight size={16} color="#64748b" />
              </button>
            ))}
          </div>
        </div>

        {/* Botões de Ação */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            onClick={handleAllowLocation}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '1rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Obtendo localização...</span>
              </>
            ) : (
              <>
                <MapPin size={20} />
                <span>Permitir Localização</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            style={{
              backgroundColor: 'transparent',
              color: '#64748b',
              padding: '0.75rem',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Continuar sem selecionar loja
          </button>
        </div>

        {/* Erro */}
        {error && (
          <p
            style={{
              marginTop: '1rem',
              fontSize: '0.8125rem',
              color: '#dc2626',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
