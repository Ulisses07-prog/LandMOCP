'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { MapPin, X, Loader2, ChevronRight, Check, Building2 } from 'lucide-react';
import { Store } from '@/types/store';

export default function LocationDetector() {
  const {
    selectedStore,
    storesList,
    isLoading,
    error,
    isStoreModalOpen,
    closeStoreModal,
    openStoreModal,
    selectStore,
    detectStoreByLocation,
  } = useStore();

  const [hasTried, setHasTried] = useState(false);

  // Mostrar modal na primeira visita se nenhuma loja foi selecionada
  useEffect(() => {
    if (!selectedStore && !hasTried) {
      const timer = setTimeout(() => {
        openStoreModal();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [selectedStore, hasTried, openStoreModal]);

  const handleAllowLocation = async () => {
    setHasTried(true);
    await detectStoreByLocation();
    closeStoreModal();
  };

  const handleSelectStore = (store: Store) => {
    setHasTried(true);
    selectStore(store);
  };

  const handleClose = () => {
    setHasTried(true);
    closeStoreModal();
  };

  // Se o modal não estiver aberto, não renderiza
  if (!isStoreModalOpen) {
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
        backgroundColor: 'rgba(15, 3, 69, 0.75)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '520px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
        }}
      >
        {/* Botão Fechar */}
        <button
          onClick={handleClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
            }}
          >
            <MapPin size={28} color="var(--color-brand-primary)" />
          </div>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 0.25rem 0',
            }}
          >
            Selecione a Loja Mais Próxima
          </h2>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Escolha sua cidade para direcionar seus pedidos e orçamentos diretamente para a equipe local.
          </p>
        </div>

        {/* Botão Localização GPS Automática */}
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            onClick={handleAllowLocation}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(15, 3, 69, 0.2)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Identificando cidade mais próxima...</span>
              </>
            ) : (
              <>
                <MapPin size={18} color="var(--color-accent-highlight)" />
                <span>Detectar automaticamente por GPS</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <p
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.8125rem',
              color: '#dc2626',
              textAlign: 'center',
              backgroundColor: '#fef2f2',
              padding: '0.5rem',
              borderRadius: '8px',
            }}
          >
            {error}
          </p>
        )}

        {/* Divisor */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Ou escolha na lista abaixo (8 Lojas)
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        {/* Lista Rolável das 8 Lojas */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            paddingRight: '4px',
            maxHeight: '320px',
          }}
        >
          {storesList.map((store) => {
            const isSelected = selectedStore?.id === store.id;
            return (
              <button
                key={store.id}
                onClick={() => handleSelectStore(store)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                  border: isSelected ? '2px solid #22c55e' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#dcfce7' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#15803d' : '#475569',
                    }}
                  >
                    <Building2 size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>
                        {store.city}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: store.type === 'Matriz' ? '#fef08a' : '#e2e8f0',
                          color: store.type === 'Matriz' ? '#854d0e' : '#475569',
                          textTransform: 'uppercase',
                        }}
                      >
                        {store.type}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      {store.address?.split(',')[0] || store.name}
                    </span>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  ) : (
                    <ChevronRight size={18} color="#94a3b8" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
