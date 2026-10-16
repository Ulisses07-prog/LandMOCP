export function getWhatsAppUrl(
  productName?: string,
  sku?: string,
  campaignName?: string,
  customNumber?: string,
  storeName?: string,
  customMessage?: string
): string {
  // Prioridade: customNumber > número do contexto > env > fallback
  const rawNumber = customNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581999999999';
  const cleanNumber = rawNumber.replace(/\D/g, '');

  let message = customMessage || 'Olá! Estava navegando no catálogo da Arruda Móveis e gostaria de mais informações.';

  // Adicionar nome da loja se fornecido
  const storePrefix = storeName ? ` (estou em ${storeName})` : '';

  if (customMessage) {
    message = customMessage + (storeName && !customMessage.includes(storeName) ? storePrefix : '');
  } else if (campaignName && productName) {
    message = `Olá! Vi a oferta ${productName} na campanha ${campaignName} da Arruda Móveis${storePrefix} e gostaria de saber mais.`;
  } else if (productName) {
    const skuPart = sku ? `, código ${sku}` : '';
    message = `Olá! Tenho interesse no produto ${productName}${skuPart}, anunciado no catálogo da Arruda Móveis${storePrefix}.`;
  } else if (storeName) {
    message = `Olá! Estou em ${storeName} e gostaria de saber mais sobre os produtos da Arruda Móveis.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
