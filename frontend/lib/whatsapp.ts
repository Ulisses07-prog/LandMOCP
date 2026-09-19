export function getWhatsAppUrl(
  productName?: string,
  sku?: string,
  campaignName?: string
): string {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5581999999999';
  const cleanNumber = rawNumber.replace(/\D/g, '');

  let message = 'Olá! Estava navegando no catálogo da Arruda Móveis e gostaria de mais informações.';

  if (campaignName && productName) {
    message = `Olá! Vi a oferta ${productName} na campanha ${campaignName} da Arruda Móveis e gostaria de saber mais.`;
  } else if (productName) {
    const skuPart = sku ? `, código ${sku}` : '';
    message = `Olá! Tenho interesse no produto ${productName}${skuPart}, anunciado no catálogo da Arruda Móveis.`;
  }

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
