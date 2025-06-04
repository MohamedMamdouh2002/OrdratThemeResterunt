import { getServerShopId } from "@/app/components/ui/getServerShopId";
import { API_BASE_URL } from "@/config/base-url";

export async function GetBannerData(lang: string) {
    try {

      // const shopId = cookieStore.get('shopId')?.value;
      const shopId = await getServerShopId(lang);
  
      const response = await fetch(`${API_BASE_URL}/api/Banner/GetAll/${shopId}`, {
        headers: {
  
          'Accept-Language': lang,
        },
        cache: 'no-store'
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch category data');
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  }
  export async function GetHomeData(lang: string, page: number = 1, pageSize: number = 10) {
    try {
      // const shopId = cookieStore.get('shopId')?.value;
      const shopId = await getServerShopId(lang);
      const response = await fetch(`${API_BASE_URL}/api/Category/GetPaginatedWithProducts/${shopId}?PageNumber=${page}&PageSize=${pageSize}`, {
        headers: {
          'Accept-Language': lang,
        },
        cache: 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch category data');
      }
      const data = await response.json();
      console.log('datadatadatadatadata', data);
      return data;
    } catch (err) {
      console.error('Error fetching paginated data:', err);
      return { entities: [], nextPage: 0, totalPages: 0 };
    }
  }
  export async function getCoupons() {
    try {
      // const shopId = cookieStore.get('shopId')?.value;
      const shopId = await getServerShopId('en');
      const res = await fetch(`${API_BASE_URL}/api/Coupon/GetAll/${shopId}?PageNumber=1&PageSize=500`, {
        cache: 'no-store',
      });
      const data = await res.json();
      return data.entities ?? [];
    } catch (error) {
      console.error("Error fetching coupons:", error);
      return [];
    }
  }
  
  export async function getBranches(lang: string) {
    try {
      // const shopId = cookieStore.get('shopId')?.value ?? '952E762C-010D-4E2B-8035-26668D99E23E';
      const shopId = await getServerShopId(lang) ?? '';
      const res = await fetch(`${API_BASE_URL}/api/Branch/GetByShopId/${shopId}`, {
        headers: {
          'Accept-Language': lang,
        },
        cache: 'no-store',
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      return null;
    }
  }