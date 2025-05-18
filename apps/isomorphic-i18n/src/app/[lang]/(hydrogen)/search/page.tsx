import Content from '@/app/components/search/Content';
import { metaObject } from '@/config/site.config';
import { API_BASE_URL } from '@/config/base-url';
import { cookies } from 'next/headers';
import { getServerShopId } from '@/app/components/ui/getServerShopId';
import ServerHeaderData from '@/app/components/ServerHeader';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar' ? 'البحث | اعثر على أفضل المنتجات والخدمات' : 'Search | Find the Best Products and Services',
      lang,
      undefined,
      lang === 'ar'
        ? 'استخدم البحث للعثور على المطاعم، المتاجر، والمنتجات التي تناسب احتياجاتك بسرعة وسهولة.'
        : 'Use the search feature to find restaurants, stores, and products that suit your needs quickly and easily.'
    ),
  };
}

export default async function Search({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams?: { search?: string };
}) {
  const lang = params.lang;
  const searchTerm = searchParams?.search || '';
  const cookieStore = cookies();
  const shopId = await getServerShopId(lang)
  const headerData = await ServerHeaderData(lang);

  const pageSize = 5;

  const url = searchTerm
    ? `${API_BASE_URL}/api/Products/SearchByName/${shopId}?SearchParamter=${searchTerm}&PageNumber=1&PageSize=${pageSize}`
    : `${API_BASE_URL}/api/Products/GetAllDetailed/${shopId}?PageNumber=1&PageSize=${pageSize}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept-Language': lang,
    },
    cache: 'no-store',
  });

  const result = await response.json();
  const products = result.entities || [];
  console.log('await response.json()',result);
  

  return <Content lang={lang} currencyName={headerData.currencyAbbreviation} shopId={headerData.shopId} initialProducts={products} initialSearch={searchTerm} />;
}
