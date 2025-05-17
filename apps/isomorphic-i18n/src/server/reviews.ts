import { API_BASE_URL } from "@/config/base-url";
import { Review as type} from '@/types';


export async function getReviewsFromServer(lang: string, shopId: string): Promise<type[] | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Review/GetShopReviews/${shopId}?pageNumber=1&pageSize=500`, {
      headers: {
        'Accept-Language': lang,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch reviews');

    const data = await res.json();

    // ✅ رجع فقط entities
    return data.entities || [];
  } catch (error) {
    console.error('Failed to fetch reviews from server:', error);
    return null;
  }
}
