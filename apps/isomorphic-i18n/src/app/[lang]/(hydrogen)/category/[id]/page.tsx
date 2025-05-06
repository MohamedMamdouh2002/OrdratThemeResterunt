// 📁 app/[lang]/all-products/page.tsx
import AllProduct from '@/app/components/allProduct/AllProduct';
import ServerHeaderData from '@/app/components/ServerHeader';
import { getServerShopId } from '@/app/components/ui/getServerShopId';
import { API_BASE_URL } from '@/config/base-url';
import { getProductsByCategory } from '@/server/product';
import { cookies } from 'next/headers';


export default async function Category({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const { lang, id: categoryId } = params;
    const cookieStore = cookies();
    const shopId = await getServerShopId(lang)
      const headerData = await ServerHeaderData(lang);
    
    const productData = await getProductsByCategory(
    lang,
    shopId as string,
    categoryId,
    /* page */ 1,
    /* pageSize */ 4
  )
  return (
    <AllProduct
      lang={lang}
      initialProducts={productData.products}
      initialTitle={productData.title}
      initialPage={1} 
      categoryId={categoryId}
      currencyAbbreviation={headerData.currencyAbbreviation}

    />
  );
}
