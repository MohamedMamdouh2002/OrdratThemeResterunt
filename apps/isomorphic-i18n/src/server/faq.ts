export async function getFaqsFromServer(lang: string, shopId: string) {
  const res = await fetch(`https://testapi.ordrat.com/api/FAQCategory/GetShopFAQs/${shopId}`, {
    headers: {
      'Accept-Language': lang,
    },
    cache: 'no-store',
  });

  if (!res.ok) return [];

  const result = await res.json();
  return result || [];
}