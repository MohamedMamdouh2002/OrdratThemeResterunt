import dynamic from 'next/dynamic';
import { metaObject } from '@/config/site.config';
import { API_BASE_URL } from '@/config/base-url';
import { cookies } from 'next/headers';
import { getServerShopId } from '@/app/components/ui/getServerShopId';

const RefundPolicy = dynamic(() => import('@/app/components/refundPolicy/RefundPolicy'));

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'سياسة الاسترداد | استرجاع الأموال بكل سهولة'
        : 'Refund Policy | Easy Money-Back Guarantee',
      lang,
      undefined,
      lang === 'ar'
        ? 'اكتشف سياسة الاسترداد لدينا، شروط إرجاع المنتجات، والمدة الزمنية لمعالجة طلبات الاسترداد بسهولة.'
        : 'Learn about our refund policy, product return conditions, and the processing time for refunds with ease.'
    ),
  };
}

export default async function Refund({
  params: { lang },
  searchParams,
}: {
  params: { lang: string };
  searchParams: { shopId?: string };
}) {
      const cookieStore = cookies();
      const shopId = await getServerShopId(lang)
      let policy = null;

  if (shopId) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Term/GetByShopIdAndType/${shopId}?termType=1`, {
        headers: { 'Accept-Language': lang },
        cache: 'no-store',
      });
      const data = await res.json();
      policy = data;
    } catch (error) {
      console.error('Failed to fetch refund policy:', error);
    }
  }
  return <RefundPolicy lang={lang} policy={policy} />;
}
