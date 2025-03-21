import Content from '@/app/components/search/Content';
import { metaObject } from '@/config/site.config';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang; 
  return {
    ...metaObject(
      lang === 'ar' ? 'البحث | اعثر على أفضل المنتجات والخدمات' : 'Search | Find the Best Products and Services',
      lang,
      undefined,
      lang === 'ar' ? 'استخدم البحث للعثور على المطاعم، المتاجر، والمنتجات التي تناسب احتياجاتك بسرعة وسهولة.' : 'Use the search feature to find restaurants, stores, and products that suit your needs quickly and easily.'
    ),
  };
}
export default function Search({params: { lang },}: {params: {lang: string;};}) {
  return <Content lang={lang}/>;
}
