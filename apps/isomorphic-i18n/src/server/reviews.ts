import { API_BASE_URL } from "@/config/base-url";
import { Review as type} from '@/types';


export async function getReviewsFromServer(lang: string, shopId: string): Promise<type[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Review/GetShopReviews/${shopId}?pageNumber=1&pageSize=50`, {
        headers: {
          'Accept-Language': lang,
        },
        cache: 'no-store',
      });
  
      if (!res.ok) throw new Error('Failed to fetch reviews');
      
      return await res.json();
    } catch (error) {
      console.error('Failed to fetch reviews from server:', error);
      return null;
    }
  }
  