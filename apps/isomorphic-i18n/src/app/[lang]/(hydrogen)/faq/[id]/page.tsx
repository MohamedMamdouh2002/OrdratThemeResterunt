import FAQSectionContent from '@/app/components/faqSectionContent/FAQSectionContent';
import { metaObject } from '@/config/site.config';
import { getFaqsFromServer } from '@/server/faq';
import { cookies } from 'next/headers';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar' ? 'الأسئلة الشائعة | كل ما تحتاج معرفته عن خدماتنا' : 'FAQ | Everything You Need to Know About Our Services',
      lang,
      undefined,
      lang === 'ar'
        ? 'عندك استفسار؟ تصفح الأسئلة الشائعة لمعرفة المزيد عن الطلبات، التوصيل، الدفع، والاسترداد.'
        : 'Have a question? Browse our FAQ section to learn about orders, delivery, payment, and refunds.',
    ),
  };
}


export default async function Id({
  params: { lang },
}: {
  params: { lang: string };
}) {
      const cookieStore = cookies();
  const shopId = cookieStore.get('shopId')?.value;
  const faqData = await getFaqsFromServer(lang, shopId as string);

  return <FAQSectionContent lang={lang} faqData={faqData} />;
}
