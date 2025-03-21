import Order from '@/app/components/order/MyOrder';
import PrivacyPolicy from '@/app/components/privacypolicy/PrivacyPolicy';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'سياسة الخصوصية | حماية بياناتك هي أولويتنا' : 'Privacy Policy | Your Data Protection is Our Priority',
      lang,
      undefined,
      lang === 'ar' ? 'تعرف على كيفية جمع، استخدام، وحماية بياناتك الشخصية عند استخدام موقعنا لضمان تجربة آمنة ومريحة.' : 'Learn how we collect, use, and protect your personal data while using our website for a safe and secure experience.',
    ),
  };
}
export default function Privacy({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <PrivacyPolicy lang={lang!}/>
}
