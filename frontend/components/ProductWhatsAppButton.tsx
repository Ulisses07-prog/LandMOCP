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
  const { selectedStore, storeWhatsAppNumber } = useStore();
  const whatsappUrl = getWhatsAppUrl(productName, productSku, undefined, storeWhatsAppNumber, selectedStore?.name);
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
