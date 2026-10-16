'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface ProductWhatsAppButtonProps {
  productName: string;
  productSku?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProductWhatsAppButton({ 
  productName, 
  productSku, 
  children, 
  className, 
  style 
}: ProductWhatsAppButtonProps) {
  const { selectedStore, selectedSalesperson, getNextSalesperson } = useStore();
  const [whatsappNumber, setWhatsappNumber] = useState<string | undefined>();
  
  // Usar WhatsApp do vendedor se disponível, senão da loja
  useEffect(() => {
    if (selectedSalesperson) {
      setWhatsappNumber(selectedSalesperson.whatsapp_number);
    } else if (selectedStore) {
      setWhatsappNumber(selectedStore.whatsapp_number);
    }
  }, [selectedSalesperson, selectedStore]);
  
  const whatsappUrl = getWhatsAppUrl(productName, productSku, undefined, whatsappNumber, selectedStore?.name);
  
  const handleClick = async () => {
    if (selectedStore && !selectedSalesperson) {
      await getNextSalesperson(selectedStore.id);
    }
  };
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
