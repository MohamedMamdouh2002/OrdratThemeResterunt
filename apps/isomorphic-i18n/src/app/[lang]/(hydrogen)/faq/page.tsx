// app/[lang]/(hydrogen)/faq/page.tsx
import FAQBody from '@/app/components/faqBody/FAQBody';
import { metaObject } from '@/config/site.config';
import { API_BASE_URL } from '@/config/base-url';
import { cookies } from 'next/headers';
import { getServerShopId } from '@/app/components/ui/getServerShopId';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'الأسئلة الشائعة | كل ما تحتاج معرفته عن خدماتنا'
        : 'FAQ | Everything You Need to Know About Our Services',
      lang,
      undefined,
      lang === 'ar'
        ? 'عندك استفسار؟ تصفح الأسئلة الشائعة لمعرفة المزيد عن الطلبات، التوصيل، الدفع، والاسترداد.'
        : 'Have a question? Browse our FAQ section to learn about orders, delivery, payment, and refunds.'
    ),
  };
}

export default async function FAQPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  // const cookieStore = cookies();
  const shopId = await getServerShopId(lang)
  console.log('cookieStore.ge', shopId);
  const res = await fetch(`${API_BASE_URL}/api/FAQCategory/GetShopFAQs/${shopId}`, {
    headers: {
      'Accept-Language': lang,
    },
    cache: 'no-store',
  });

  const faqs: FaqType[] = await res.json();

  return <FAQBody lang={lang} faqs={faqs || []} />;
}
