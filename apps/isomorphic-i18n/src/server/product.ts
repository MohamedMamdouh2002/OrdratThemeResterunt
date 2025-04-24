// 📁 app/lib/products.ts
import { API_BASE_URL } from '@/config/base-url'

export async function getProductsByCategory(
  lang: string,
  shopId: string,
  categoryId: string,
  page = 1,
  pageSize = 4
) {
  const res = await fetch(
    `${API_BASE_URL}/api/Category/GetProductsByCategoryDetailed/${shopId}` +
    `?categoryId=${categoryId}&PageNumber=${page}&PageSize=${pageSize}`,
    {
      headers: { 'Accept-Language': lang },
      cache: 'no-store',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  return {
    products: data.products || [],
    title: data,       // bannerUrl, name, etc.
    nextPage: data.nextPage ?? null,
  }
}
