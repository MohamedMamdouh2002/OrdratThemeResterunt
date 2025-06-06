import Image from 'next/image';
import { PiMinus, PiPlus, PiTrash } from 'react-icons/pi';
import { CartItem } from '@/types';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { generateSlug } from '@utils/generate-slug';
import SimpleBar from '@ui/simplebar';
import { Empty, Title } from 'rizzui';
import cn from '@utils/class-names';
import CustomImage from '@/app/components/ui/CustomImage';
import sarIcon from '@public/assets/Saudi_Riyal_Symbol.svg.png'

export default function OrderProducts({
  items,
  className,
  showControls,
  itemClassName,
  currencyAbbreviation,
  clearItemFromCart,
  addItemToCart,
  removeItemFromCart,
  lang,
}: {
  items: CartItem[];
  className?: string;
  itemClassName?: string;
  currencyAbbreviation: any;
  showControls?: boolean;
  clearItemFromCart: (id: number | string) => void;
  addItemToCart: (item: CartItem, quantity: number) => void;
  removeItemFromCart: (id: number | string) => void;
  lang?: string;
}) {
  // const abbreviation = useCurrencyAbbreviation({ lang } as any);

  if (!items.length) {
    return (
      <div className="pb-3">
        <Empty />
      </div>
    );
  }

  return (
    <SimpleBar className={cn('h-auto pb-3')}>
      <div className={cn('grid gap-3.5', className)}>
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'group relative flex items-center justify-between',
              itemClassName
            )}
          >
            <div className="flex items-center pe-3">
              <figure className="relative aspect-[4/4.5] w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <CustomImage
                  src={item.image}
                  alt={item.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw"
                  className="h-full w-full object-cover"
                />

                {showControls && (
                  <>
                    <span className="absolute inset-0 grid place-content-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                    <RemoveItem
                      clearItemFromCart={clearItemFromCart}
                      product={item}
                      className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform rounded text-white opacity-0 transition duration-300 group-hover:opacity-100"
                    />
                  </>
                )}
              </figure>
              <div className="ps-3">
                <Title
                  as="h3"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  <Link
                    href={routes.eCommerce.productDetails(
                      generateSlug(item.name)
                    )}
                  >
                    {item.name}
                  </Link>
                </Title>
                <div className="text-gray-500 flex gap-1">
                  <div>{item.price}</div> <div>x</div> <div>{item.quantity}</div>
                </div>
                {showControls && (
                  <QuantityControl
                    product={item}
                    addItemToCart={addItemToCart}
                    removeItemFromCart={removeItemFromCart}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 font-medium text-gray-700">
              {item.price * item.quantity}{" "}{currencyAbbreviation === 'ر.س' ? <Image src={sarIcon} alt="SAR" width={5} height={5} style={{ width: '1rem', height: '1rem' }} /> : currencyAbbreviation}
            </div>
          </div>
        ))}
      </div>
    </SimpleBar>
  );
}

function QuantityControl({
  product,
  addItemToCart,
  removeItemFromCart,
}: {
  product: CartItem;
  addItemToCart: (item: CartItem, quantity: number) => void;
  removeItemFromCart: (id: number | string) => void;
}) {
  return (
    <div className="mt-2 inline-flex items-center rounded bg-gray-100 p-0.5 text-xs">
      <button
        title="Decrement"
        className="grid h-5 w-5 place-content-center rounded"
        onClick={() => removeItemFromCart(product.id)}
      >
        <PiMinus className="h-3 w-3" />
      </button>
      <span className="grid w-8 place-content-center">{product.quantity}</span>
      <button
        title="Decrement"
        className="grid h-5 w-5 place-content-center rounded bg-gray-100"
        onClick={() => addItemToCart(product, 1)}
      >
        <PiPlus className="h-3 w-3" />
      </button>
    </div>
  );
}

function RemoveItem({
  product,
  className,
  clearItemFromCart,
}: {
  product: CartItem;
  className?: string;
  clearItemFromCart: (id: number | string) => void;
}) {
  return (
    <button
      className={cn('', className)}
      onClick={() => clearItemFromCart(product.id)}
    >
      <PiTrash className="h-6 w-6" />
    </button>
  );
}
