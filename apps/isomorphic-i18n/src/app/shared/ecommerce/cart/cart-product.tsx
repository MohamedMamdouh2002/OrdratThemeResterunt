import Link from 'next/link';
import Image from 'next/image';
import { CartItem } from '@/types';
import isEmpty from 'lodash/isEmpty';
import useCurrencyAbbreviation, { toCurrency } from '@utils/to-currency';
import { Title, Text } from 'rizzui';
import { AddToWishList } from '@components/wishlist-button';
import RemoveItem from '@/app/shared/ecommerce/cart/remove-item';
import QuantityInput from '@/app/shared/ecommerce/cart/quantity-input';
import { routes } from '@/config/routes';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png';
import CustomImage from '@/app/components/ui/CustomImage';

function parseProductData(productString: string) {
  const dataPairs = productString.split('&&');
  
  // Define an explicit type
  const productData: Record<string, string> = {};

  dataPairs.forEach(pair => {
    const [key, value] = pair.split(':');
    productData[key] = value;
  });

  return {
    id: productData['id'],
    nameAr: productData['nameAr'],
    nameEn: productData['nameEn'],
    descriptionEn: productData['descriptionEn'],
    descriptionAr: productData['descriptionAr'],
    metaDescriptionEn: productData['metaDescriptionEn'],
    metaDescriptionAr: productData['metaDescriptionAr'],
    variations: Object.keys(productData)
      .filter(key => key.startsWith('variations['))
      .reduce<Record<string, any>>((acc, key) => {
        const match = key.match(/variations\[(.+?)\]\.(.+)/);
        if (match) {
          const [, variationId, field] = match;
          acc[variationId] = acc[variationId] || { id: variationId };
          acc[variationId][field] = productData[key];
        }
        return acc;
      }, {})
  };
}

export default function CartProduct({ product, lang , ifModal=false }: { product: CartItem; lang?:string; ifModal:boolean }) {
  console.log("product: ",product);
  console.log("data: ",parseProductData(product.id as string));
  const realProductData = parseProductData(product.id as string);
  const abbreviation = useCurrencyAbbreviation({ lang } as any);

  return (
    <div className="grid grid-cols-12 items-start gap-4 border-b border-muted py-6 first:pt-0 sm:flex sm:gap-6 2xl:py-8">
      <figure className="col-span-4 sm:max-w-[180px]">
        <CustomImage
          src={product.image||photo}
          alt={lang =='ar'? realProductData.nameAr : realProductData.nameEn}
          width={180}
          height={180}
          className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
        />
      </figure>
      <div className="col-span-8 sm:block sm:w-full">
        <div className="flex  gap-1 flex-row items-start justify-between">
          <Title
            as="h3"
            className="truncate text-base font-medium transition-colors hover:text-primary 3xl:text-lg"
          >
            {lang =='ar'? realProductData.nameAr : realProductData.nameEn}
          </Title>
          <div className="">

            <span className="inline-block text-sm font-semibold text-gray-1000 sm:font-medium md:text-base 3xl:text-lg">
              {abbreviation&&toCurrency(product.price,lang as any,abbreviation)}
            </span>
            {product.oldPrice?
              <li className={`flex items-center gap-3 text-gray-500`}>
                {/* <span>Old Price :</span> */}
                <del className="text-gray-1000 ">{abbreviation&&toCurrency(product.oldPrice,lang as any,abbreviation)}</del>
              </li>
              :''
            }
          </div>
        </div>
        <Text className="mt-1 w-full max-w-xs truncate leading-6 2xl:max-w-lg">
          {lang =='ar'? realProductData.descriptionAr : realProductData.descriptionEn}
        </Text>

        <ul className={`mt-2 grid grid-cols-1 sm:grid-cols-1 ${ifModal===true?'':'md:grid-cols-[1fr,1fr]'} gap-x-4 gap-y-3 sm:mt-4 sm:gap-x-8`}>
         
          {/* Map over orderItemVariations */}
          
          {ifModal===false && product.orderItemVariations?.map((variation, index) => (
            (variation.choices?.[0]?.choiceValue || variation.choices?.[0]?.inputValue) && (
              <li key={variation.variationId} className="flex items-center gap-3 text-gray-500">
                {/* <span>{variation.variationLable} :</span> */}
                <span>
                  {lang == 'ar'
                    ? realProductData.variations?.[variation.variationId]?.nameAr
                    : realProductData.variations?.[variation.variationId]?.nameEn} :
                </span>
                {realProductData.variations?.[variation.variationId]?.choiceId && (
                  <span className="text-gray-1000">{lang == 'ar'? realProductData.variations?.[variation.variationId]?.choiceValueAr : realProductData.variations?.[variation.variationId]?.choiceValueEn}</span>
                )}
                {realProductData.variations?.[variation.variationId]?.inputValue && (
                  <span className="text-gray-1000">{realProductData.variations?.[variation.variationId]?.inputValue}</span>
                )}
              </li>
            )
          ))}
          {ifModal === true && (
            <div className="flex flex-wrap gap-2">
              {product.orderItemVariations?.map((variation, index) =>
                (variation.choices?.[0]?.choiceValue || variation.choices?.[0]?.inputValue) && (
                  <div 
                    key={variation.variationId} 
                    className="flex items-center gap-3 text-gray-500"
                  >
                    {realProductData.variations?.[variation.variationId]?.choiceId && (
                      <span 
                        className="bg-gray-100 text-gray-700 px-1 py-[2px] rounded-[3px] max-w-[200px] truncate overflow-hidden inline-block"
                        title={lang == 'ar' ? realProductData.variations?.[variation.variationId]?.choiceValueAr : realProductData.variations?.[variation.variationId]?.choiceValueEn}
                      >
                        {lang == 'ar' 
                          ? realProductData.variations?.[variation.variationId]?.choiceValueAr 
                          : realProductData.variations?.[variation.variationId]?.choiceValueEn}
                      </span>
                    )}
                    {realProductData.variations?.[variation.variationId]?.inputValue && (
                      <span 
                        className="bg-gray-100 text-gray-700 px-1 py-[2px] rounded-[3px] max-w-[200px] truncate overflow-hidden inline-block"
                        title={realProductData.variations?.[variation.variationId]?.inputValue}
                      >
                        {realProductData.variations?.[variation.variationId]?.inputValue}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </ul>
        <div className="mt-3 hidden items-center justify-between xs:flex sm:mt-6">
          <QuantityInput product={product} />
          <div className="flex items-center gap-4">
            {/* <AddToWishList /> */}
            <RemoveItem productID={product.id} placement="bottom-end" />
          </div>
        </div>
      </div>
      <div className="col-span-full flex items-center justify-between xs:hidden">
        <div className="flex items-center gap-4">
          {/* <AddToWishList /> */}
          <RemoveItem productID={product.id} placement="bottom-start" />
        </div>
        <QuantityInput product={product} />
      </div>
    </div>
  );
}
