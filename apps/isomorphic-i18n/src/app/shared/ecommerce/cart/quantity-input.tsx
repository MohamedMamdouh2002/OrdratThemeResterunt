'use client';

import { PiMinusBold, PiPlusBold } from 'react-icons/pi';
import { ActionIcon } from 'rizzui';
import { useCart } from '@/store/quick-cart/cart.context';
import { CartItem } from '@/types';
import { useEffect, useState } from 'react';

function parseProductData(productString: string) {
  const dataPairs = productString.split('&&');

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

export default function QuantityInput({ product }: { product: CartItem }) {
  const { addItemToCart, removeItemFromCart, items } = useCart();
  const [totalSoldQuantity, setTotalSoldQuantity] = useState<number>(0);

  useEffect(() => {
    let totalQuantity = 0;
    if (product.hasStock) {
      items.forEach((item) => {
        const itemData = parseProductData(item.id as string);
        const realProductData = parseProductData(product.id as string);
        if (itemData.id === realProductData.id) {
          totalQuantity += item.quantity;
        }
      });
      setTotalSoldQuantity(totalQuantity);
      // console.log(`✅ Total quantity - totalSoldQuantity ${product.id}:`, totalSoldQuantity );
    }
    console.log(`✅ Total quantity sold for product: ${product.stockNumber} --->`, totalQuantity);
  }, [items, product]);
  return (
    <div className="inline-flex items-center rounded-lg border border-muted px-1.5 hover:border-gray-1000">
      <ActionIcon
        title="Decrement"
        size="sm"
        variant="flat"
        className="h-auto px-1 py-[5px]"
        onClick={() => removeItemFromCart(product.id)}
      >
        <PiMinusBold className="h-4 w-4" />
      </ActionIcon>
      <input
        type="number"
        className="h-full w-12 border-none text-center outline-none focus:ring-0 sm:w-20 dark:bg-gray-50"
        value={product.quantity}
        readOnly
      />
      <ActionIcon
        title="Increment"
        size="sm"
        variant="flat"
        className={`h-auto px-1 py-1.5 ${(product.hasStock && totalSoldQuantity >= product.stockNumber) ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => addItemToCart(product, 1)}
        disabled={product.hasStock && totalSoldQuantity >= product.stockNumber}
      >
        <PiPlusBold className="h-3.5 w-3.5" />
      </ActionIcon>
    </div>
  );
}
