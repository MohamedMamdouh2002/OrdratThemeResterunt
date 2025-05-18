import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm, Controller } from 'react-hook-form';
import { buildProductDetailsSchema, ProductDetailsInput } from '@/validators/product-details.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, Star, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactDOM from 'react-dom';
import QuantityHandler from '../item/QuantityHandler';
import ItemPrice from '../ItemPrice';
import { AllCategories, Food } from '@/types'
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Badge from '../Badge';
import Image from 'next/image';
import cn from '../../../../../../../packages/isomorphic-core/src/utils/class-names';
import { FullProduct, FoodId, CartItem } from '@/types';
import { useUserContext } from '../../context/UserContext';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Button, Title, Text, Input } from 'rizzui';
import { useCart } from '@/store/quick-cart/cart.context';
import toast from 'react-hot-toast';
import GetSize from '@/app/shared/ecommerce/product/get-size';
import GetRadio from '@/app/shared/ecommerce/product/get-radio';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png';
import hamburger from '@public/assets/hamburger.png';
import potato from '@public/assets/شاورما-عراقي-لحمة-مع-بطاطا.png';
import { PhoneNumber } from '@ui/phone-input';
import RoleSelect from '../inputs/selectInput/SelectInput';
import SpecialNotes from '@/app/components/ui/SpecialNotes';
import { useTranslation } from '@/app/i18n/client';
import CustomImage from '../CustomImage';
import { useTracking } from '../../context/TrackingContext';


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

// Type definitions remain the same as in your original code
interface Variation {
  id: string;
  name: string;
  buttonType: number;
  isActive: boolean;
  isRequired: boolean;
  choices: Choice[];
}

interface Choice {
  id: string;
  name?: string;
  imageUrl?: string;
  price?: number;
  isActive: boolean;
  isDefault: boolean;
}

type Option = {
  label: string | JSX.Element;
  value: number | string;
};

type ModalProps = {
  data?: FullProduct;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  hasMoreDetails?: boolean;
  lang: string;
  ProductData: any;
  currentModalProductId?: string | null;
  handleUpdateCart?: () => void;
  itemId?: string;
  type?: string;
  currencyAbbreviation?: string;
  FakeData?: any
  setIsModalOpen: (isOpen: boolean) => void;
  modalId: string;
  setCurrentModalProductId: Dispatch<SetStateAction<string | null>>;
};

type FakeData = {
  maximumFakeViewers: number;
  minimumFakeViewers: number;
  isFakeViewersAvailable: boolean;
  isFakeSoldNumberAvailable: boolean;
  maximumFakeSoldNumber: number;
  minimumFakeSoldNumber: number;
  lastSoldNumberInHours: number;

};
function Modal({
  setIsModalOpen,
  currencyAbbreviation,
  modalId,
  data,
  quantity,
  setQuantity,
  lang,
  hasMoreDetails,
  handleUpdateCart,
  ProductData,
  FakeData,
  currentModalProductId,
  setCurrentModalProductId,
  itemId,
  type,
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [prodId, setProdId] = useState<FoodId | any>(null);
  const [modalId1, setModalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen1] = useState(false);
  const [productData, setProductData] = useState<FoodId | any>(null);
  const [prodCartItem, setProdCartItem] = useState<CartItem | any>(null);
  const [isLoading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const { t } = useTranslation(lang!, 'home');
  const errorMassages = useTranslation(lang!, 'form');
  // const abbreviation = useCurrencyAbbreviation({ lang });
  const { GetProduct } = useUserContext();
  const { addItemToCart, items } = useCart();
  const [isImageVisible, setImageVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isFakeSoldNumberAvailable, setisFakeSoldNumberAvailable] = useState<FakeData | null>(null);
  const [isFakeViewersAvailable, setisFakeViewersAvailable] = useState<FakeData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRefs = useRef<{ [key: string]: SwiperType | null }>({});
  const [randomViewers, setRandomViewers] = useState<number | null>(null);
  const { trackAddToCart } = useTracking();
  const [totalSoldQuantity, setTotalSoldQuantity] = useState<number>(0);
  console.log("totalSoldQuantity: ", totalSoldQuantity);
  // // Fetch fake data
  // useEffect(() => {
  //   const fetchFakeData = async () => {
  //     const cacheKey = 'fakeSoldNumberCache';
  //     const cacheTTL = 4 * 60 * 60 * 1000;

  //     // ابدأ بالتحقق من الكاش
  //     const cached = localStorage.getItem(cacheKey);
  //     const now = Date.now();
  //     let fakeSoldNumberFromCache: number | null = null;

  //     if (cached) {
  //       const { value, timestamp } = JSON.parse(cached);

  //       if (now - timestamp < cacheTTL) {
  //         fakeSoldNumberFromCache = value;
  //       }
  //     }

  //     try {

  //       const result: FakeData = FakeData

  //       // خزن fakeSoldNumber في الكاش لو مش موجود أو انتهت صلاحيته
  //       if (fakeSoldNumberFromCache === null) {
  //         localStorage.setItem(
  //           cacheKey,
  //           JSON.stringify({
  //             value: result.fakeSoldNumber,
  //             timestamp: Date.now(),
  //           })
  //         );
  //         fakeSoldNumberFromCache = result.fakeSoldNumber;
  //       }

  //       // استخدم fakeSoldNumber من الكاش والباقي من الـ API
  //       setFakeData({
  //         fakeSoldNumber: fakeSoldNumberFromCache,
  //         fakeViewers: result.fakeViewers,
  //         fakeSoldNumberInHours: result.fakeSoldNumberInHours,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching fake data:', error);
  //     }
  //   };

  //   fetchFakeData();
  // }, []);
  // Updated click handler for related products
  // useEffect(() => {
  //   const fetchData = async () => {
  //     // استخدم المعرف الفعلي للمنتج الذي تريد عرضه
  //     const productIdToFetch = currentModalProductId || modalId;
  //     console.log("تحميل المنتج بمعرف:", productIdToFetch); // للتصحيح

  //     // const data = await GetProduct({ lang, id: productIdToFetch });

  //   };

  //   fetchData();
  // }, [GetProduct, modalId, lang, currentModalProductId]);


  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      setImageVisible(scrollTop < 150);
    }
  };

  const handleScrollPc = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollPc);
    return () => window.removeEventListener("scroll", handleScrollPc);
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      // استخدم currentModalProductId إذا كان موجودًا، وإلا استخدم modalId الأصلي
      const productIdToFetch = currentModalProductId || modalId;
      console.log("جاري تحميل بيانات المنتج...");
      console.log("معرف المودال:", modalId);
      console.log("معرف المنتج الحالي:", currentModalProductId);
      const Cdata = ProductData
      // const data = ProductData
      // .flatMap((c: any) => c.products)
      // .find((p: any) => p.id === productIdToFetch);

      let data: any = null;

      if (Array.isArray(ProductData)) {
        // الحالة الأولى: ProductData = [منتجات مباشرة]
        if (ProductData.length > 0 && !ProductData[0].products) {
          data = ProductData.find((p: any) => p.id === productIdToFetch);
        }
        // الحالة الثانية: ProductData = [تصنيفات وفيها products]
        else if (ProductData.length > 0 && Array.isArray(ProductData[0].products)) {
          data = ProductData
            .filter((c: any) => c && Array.isArray(c.products))
            .flatMap((c: any) => c.products)
            .find((p: any) => p.id === productIdToFetch);
        }
      }



      if (!data) {
        console.error("المنتج غير موجود بالمعرف:", productIdToFetch);
        return;
      }

      console.log("id الحالي:", data);
      console.log("items الحالي:", items);
      setTotalSoldQuantity(0);
      let totalQuantity = 0;
      if (data.hasStock) {
        items.forEach((item) => {
          const realProductData = parseProductData(item.id as string);
          if (realProductData.id === data.id) {
            totalQuantity += item.quantity;
          }
        });
        setTotalSoldQuantity(totalQuantity);

        console.log(`✅ Total quantity sold for product ${data.id}:`, totalSoldQuantity);
        console.log(`✅ Total quantity - totalSoldQuantity ${data.id}:`, totalSoldQuantity - quantity);
      }
      // const data = await GetProduct({ lang, id: productIdToFetch });
      const formattedData: any = {
        id: data.id,
        name: lang === 'ar' ? data.nameAr : data.nameEn,
        description: lang === 'ar' ? data.descriptionAr : data.descriptionEn,
        vat: data.vat,
        vatType: data.vatType,
        isDiscountActive: data.isDiscountActive,
        discount: data.discount,
        discountType: data.discountType,
        isActive: data.isActive,
        createdAt: data.createdAt,
        lastUpdatedAt: data.lastUpdatedAt,
        isTopSelling: data.isTopSelling,
        isTopRated: data.isTopRated,
        seoDescription: lang === 'ar' ? data.metaDescriptionAr : data.metaDescriptionEn,
        imageUrl: data.images.length > 0 ? data.images[0].imageUrl : "",
        categoryId: data.categoryId,
        numberOfSales: data.numberOfSales,
        category: null,
        variations: data.variations.filter((variation: any) => variation.isActive).map((variation: any) => ({
          id: variation.id,
          name: lang === 'ar' ? variation.nameAr : variation.nameEn,
          buttonType: variation.buttonType,
          isActive: variation.isActive,
          isRequired: variation.isRequired,
          choices: variation.choices.filter((choice: any) => choice.isActive).map((choice: any) => ({
            id: choice.id,
            name: lang === 'ar' ? choice.nameAr : choice.nameEn,
            price: choice.price,
            isDefault: choice.isDefault,
            isActive: choice.isActive,
            imageUrl: choice.imageUrl,
          })),
        })),
        frequentlyOrderedWith: data.frequentlyOrderedWith,
        reviews: data.reviews,
        price: data.finalPrice,
        oldPrice: data.price,
        stockNumber: data.stockNumber,
        hasStock: data.hasStock,
      };

      const formattedData2 = {
        id: data.id,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        vat: data.vat,
        vatType: data.vatType,
        isDiscountActive: data.isDiscountActive,
        discount: data.discount,
        discountType: data.discountType,
        isActive: data.isActive,
        createdAt: data.createdAt,
        lastUpdatedAt: data.lastUpdatedAt,
        isTopSelling: data.isTopSelling,
        isTopRated: data.isTopRated,
        metaDescriptionEn: data.metaDescriptionEn,
        metaDescriptionAr: data.metaDescriptionAr,
        imageUrl: data.images.length > 0 ? data.images[0].imageUrl : "",
        categoryId: data.categoryId,
        numberOfSales: data.numberOfSales,
        variations: data.variations.filter((variation: any) => variation.isActive).map((variation: any) => ({
          id: variation.id,
          nameEn: variation.nameEn,
          nameAr: variation.nameAr,
          buttonType: variation.buttonType,
          isActive: variation.isActive,
          isRequired: variation.isRequired,
          choices: variation.choices.filter((choice: any) => choice.isActive).map((choice: any) => ({
            id: choice.id,
            nameEn: choice.nameEn,
            nameAr: choice.nameAr,
            price: choice.price,
            isDefault: choice.isDefault,
            isActive: choice.isActive,
            imageUrl: choice.imageUrl,
          })),
        })),
        frequentlyOrderedWith: data.frequentlyOrderedWith,
        reviews: data.reviews,
        price: data.finalPrice,
        oldPrice: data.price,
        stockNumber: data.stockNumber,
        hasStock: data.hasStock,
      };

      setProdId(formattedData);
      setProductData(formattedData2);
      setProdCartItem({
        id: formattedData.id,
        name: formattedData.name,
        slug: formattedData.name,
        description: formattedData.description,
        imageUrl: formattedData.imageUrl,
        isDiscountActive: formattedData.isDiscountActive,
        stockNumber: formattedData.stockNumber,
        hasStock: formattedData.hasStock,
        price: formattedData.price,
        quantity: 1,
        sizeFood: "small",
        color: {
          name: "Purple Heart",
          code: "#5D30DD",
        },
      });
    };

    fetchData();
  }, [GetProduct, modalId, lang, currentModalProductId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);


  const handleClose = () => {
    setIsOpen(false);
    // Use a timeout to allow the animation to complete before actually closing the modal
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Form setup
  const methods = useForm<ProductDetailsInput>({
    mode: 'onChange',
    resolver: zodResolver(buildProductDetailsSchema(prodId?.variations || [])),
    defaultValues: {}, // initially empty
  });

  useEffect(() => {
    if (prodId) {
      const defaults: Record<string, any> = {};
      prodId.variations.forEach((variation: any) => {
        if (variation.buttonType === 0 || variation.buttonType === 1) {
          const defaultChoice = variation.choices.find((choice: any) => choice.isDefault);
          if (defaultChoice) {
            defaults[variation.id] = defaultChoice.id;
          }
        }
      });

      methods.reset(defaults);
    }
  }, [prodId, methods]);

  const { watch, setValue, register, handleSubmit, control } = methods;

  useEffect(() => {
    const subscription = watch((values) => {
      Object.keys(values).forEach((key) => {
        const value = values[key];
        const matchingFields = Object.keys(values).filter(
          (field) => field === key
        );
        matchingFields.forEach((field) => {
          if (values[field] !== value) {
            setValue(field, value);
          }
        });
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Calculate total price
  const selectedChoicePrices = prodId?.variations?.reduce((total: number, variation: Variation) => {
    const selectedChoiceId = watch(variation.id);
    const selectedChoice = variation.choices.find((choice: Choice) => choice.id === selectedChoiceId);
    return total + (selectedChoice?.price || 0);
  }, 0) || 0;

  const finalPrice = prodId ? (prodId.price * quantity) + (selectedChoicePrices * quantity) : 0;
  const finalOldPrice = (data?.oldPrice && prodId) ? (prodId.oldPrice * quantity) + (selectedChoicePrices * quantity) : undefined;

  const onSubmit: SubmitHandler<ProductDetailsInput> = (data) => {
    if (!productData || !prodId) return;

    const variationsString = productData.variations.map((variation: any) => {
      const variationData = data[variation.id];
      if (variation.buttonType === 0 || variation.buttonType === 1) {
        const selectedChoice = variation.choices.find((choice: any) => choice.id === variationData);
        return `variations[${variation.id}].id:${variation.id}&&variations[${variation.id}].nameEn:${variation.nameEn}&&variations[${variation.id}].nameAr:${variation.nameAr}&&variations[${variation.id}].choiceId:${variationData}&&variations[${variation.id}].choiceValueEn:${selectedChoice?.nameEn || ""}&&variations[${variation.id}].choiceValueAr:${selectedChoice?.nameAr || ""}`;
      } else {
        return `variations[${variation.id}].id:${variation.id}&&variations[${variation.id}].nameEn:${variation.nameEn}&&variations[${variation.id}].nameAr:${variation.nameAr}&&variations[${variation.id}].inputValue:${variationData || ""}`;
      }
    }).join('&&');
    const isDiscount = prodId.isDiscountActive;

    const cartItem: CartItem = {
      id: `id:${prodId.id}&&nameAr:${productData.nameAr}&&nameEn:${productData.nameEn}&&descriptionEn:${productData.descriptionEn}&&descriptionAr:${productData.descriptionAr}&&metaDescriptionEn:${productData.metaDescriptionEn}&&metaDescriptionAr:${productData.metaDescriptionAr}&&${variationsString}`,
      name: prodId.name || "Default Item",
      description: prodId.description,
      image: prodId.imageUrl || "",
      isDiscountActive: isDiscount,
      price: (prodId.price + selectedChoicePrices) || 0,
      oldPrice: (prodId.oldPrice + selectedChoicePrices) || 0,
      stockNumber: prodId?.stockNumber,
      hasStock: prodId.hasStock,
      quantity,
      notes: notes || "",
      orderItemVariations: prodId.variations.map((variation: Variation) => {
        const variationData = data[variation.id];
        // Skip choice-based variation if it's not required and has no selected value
        if ((variation.buttonType === 0 || variation.buttonType === 1) && !variationData && !variation.isRequired) {
          return [];
        }
        if (variation.buttonType === 0 || variation.buttonType === 1) {
          const selectedChoice = variation.choices.find(choice => choice.id === variationData);
          return {
            variationId: variation.id,
            variationLable: variation.name,
            choices: [
              {
                choiceId: variationData || "",
                choiceValue: selectedChoice?.name || "",
              },
            ],
          };
        } else {
          return {
            variationId: variation.id,
            variationLable: variation.name,
            choices: [
              {
                inputValue: variationData || "",
              },
            ],
          };
        }
      }),
    };

    let isItemAdded = false;

    prodId.variations.forEach((variation: Variation) => {
      const variationData = data[variation.id];
      if (variation.buttonType === 0 || variation.buttonType === 1) {
        if (variationData || !variation.isRequired) {
          isItemAdded = true;
        }
      } else {
        isItemAdded = true;
      }
    });

    if (prodId.variations.length === 0) {
      isItemAdded = true;
    }
    const remainingStock = prodId.stockNumber - totalSoldQuantity;

    if (isItemAdded) {
      const remainingStock = prodId.stockNumber - totalSoldQuantity;

      if (!prodId.hasStock || (remainingStock > 0 && remainingStock - quantity >= 0)) {
        addItemToCart(cartItem, quantity);
        console.log("✅ Stock:", prodId.stockNumber, "Sold:", totalSoldQuantity, "Qty:", quantity, "Remaining after:", remainingStock - quantity);

        setTotalSoldQuantity(0);
        setQuantity(1);
        handleClose();
        toast.success(t("addtoCart"));
      } else {
        console.warn("❌ Not enough stock to proceed.");
      }
    }
  };


  const TWO_MINUTES = 2 * 60 * 1000;

  const getStableFakeNumber = (keyPrefix: string, productId: string, min: number, max: number): number => {
    const key = `${keyPrefix}_${productId}`;
    const cached = localStorage.getItem(key);
    const now = Date.now();

    if (cached) {
      const { value, timestamp } = JSON.parse(cached);
      if (now - timestamp < TWO_MINUTES) {
        return value;
      }
    }

    // Generate random number between min and max
    const generated = Math.floor(Math.random() * (max - min + 1)) + min;
    localStorage.setItem(key, JSON.stringify({ value: generated, timestamp: now }));
    return generated;
  };

  useEffect(() => {
    console.log('isModalOpen', isModalOpen);
    console.log('FakeData', FakeData);

    if (isModalOpen === false && FakeData?.isFakeViewersAvailable) {
      const random = Math.floor(
        Math.random() * (FakeData.maximumFakeViewers - FakeData.minimumFakeViewers + 1)
      ) + FakeData.minimumFakeViewers;
      console.log('isModalOpen', isModalOpen);

      console.log('Generated random:', random);
      setRandomViewers(random);
    }
  }, [isModalOpen, FakeData]);



  if (!prodId) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {/* Desktop Modal */}
      <div className="hidden md:block">
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 blur-md z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />

        <FormProvider {...methods}>
          <form className="pb-8 pt-5" onSubmit={methods.handleSubmit(onSubmit)}>
            <motion.div
              onClick={handleOutsideClick}
              className="fixed inset-0 flex z-[999] items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg b-4 w-[600px] 4xl:w-[800px] min-h-auto max-h-[650px]"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: isOpen ? 1 : 0.9, y: isOpen ? 0 : 20, opacity: isOpen ? 1 : 0 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div
                  className={cn('grid grid-cols-3 rounded-lg gap-2 relative', {
                    'grid-cols-1': !hasMoreDetails,
                  })}
                >
                  <div className="relative rounded-t-lg z-50 bg-white">
                    {/* PC Product Image */}
                    <div className={`sticky mb-5 rounded-t-lg ${isScrolled ? `secShadow` : `shadow-none`} top-0 bg-white z-50 `}>
                      <div className={`flex mb-4 `}>
                        <div className="relative">
                          <img
                            src={prodId.imageUrl || photo}
                            width={500}
                            height={300}
                            alt="s"
                            className="w-52 h-52 p-1 rounded-lg object-cover"
                          />
                          <X
                            onClick={handleClose}
                            className="bg-white rounded-full p-2 absolute top-3 start-2 hover:cursor-pointer"
                            size={36}
                          />
                          {prodId?.isDiscountActive &&
                          <p
                          className="bg-white rounded-xl py-2 px-3 absolute top-3 font-semibold end-2 hover:cursor-pointer"
                          
                          >
                              {lang==='ar'?'خصم':'save'}{" "}

                            {prodId.discountType ===0 ?
                           ` ${prodId.discount} %`
                           :
                            `${prodId.discount} ${currencyAbbreviation}`
                          }
                          </p>
                          }
                        </div>
                        <div className="px-4 pt-2 flex flex-col">
                          <div className="flex items-center gap-2">
                            {prodId?.isTopSelling && <Badge Icon={Flame} title={lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="-ms-1" />}
                            {prodId?.isTopRated && <Badge Icon={Star} title={lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="-ms-1" />}
                          </div>
                          <h3 className="text-xl font-bold leading-10">{prodId?.name}</h3>
                          <p className="text-sm font-medium text-black/75">{prodId?.description}</p>
                          <SpecialNotes lang={lang!} notes={notes} setNotes={setNotes} className="gap-2" />

                          {/* {prodId.hasStock && (prodId.stockNumber - totalSoldQuantity - quantity > 0) && (
                            <>{prodId.stockNumber - totalSoldQuantity - quantity}</>
                          )} */}

                          <div className="mt-3 space-y-1 text-sm text-gray-700">
                            {/* عرض عدد المبيعات الوهمية */}
                            {FakeData?.isFakeSoldNumberAvailable && (
                              <div className="flex items-center gap-1 ">
                                <picture>
                                  <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp" type="image/webp" />
                                  <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif" alt="🔥" width="18" height="18" />
                                </picture>
                                <span className='font-medium'>
                                  {getStableFakeNumber('sold', modalId, FakeData.minimumFakeSoldNumber, FakeData.maximumFakeSoldNumber)}
                                  {lang === 'ar' ? ' بيعت في آخر ' : ' sold in the last '}
                                  {FakeData.lastSoldNumberInHours} {lang === 'ar' ? ' ساعات' : ' hours'}
                                </span>
                              </div>
                            )}

                            {/* عرض عدد المشاهدين الوهميين */}
                            {FakeData?.isFakeViewersAvailable && randomViewers !== null && (
                              <div className="flex items-center gap-1 ">
                                <picture>
                                  <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.webp" type="image/webp" />
                                  <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif" alt="😍" width="18" height="18" />
                                </picture>
                                <span className='font-medium'>
                                  {randomViewers} {lang === 'ar' ? ' اشخاص يشاهدون هذا الآن' : ' people are viewing this right now'}
                                </span>
                              </div>
                            )}

                          </div>


                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PC Product Variations */}
                  <div className="overflow-y-auto  max-h-[350px]">
                    <div className="">
                      {prodId?.variations && (
                        <>
                          <div className="flex flex-col gap-3 pb-4">
                            {prodId.variations.filter((variation: any) => variation.isActive).map((variation: Variation) => {
                              {/* PC Product Variation buttonType 0 */ }
                              if (variation.buttonType === 0 && (variation.isActive)) {
                                const options: Option[] = variation.choices.map((choice: Choice) => ({
                                  label: (
                                    <>
                                      {/* PC Product Variation Choices */}
                                      <div className="flex flex-col justify-center items-center">
                                        {choice.imageUrl ? (
                                          <>
                                            <CustomImage
                                              src={choice.imageUrl}
                                              alt={choice.name || "Radio"}
                                              width={600}
                                              height={350}
                                              className="w-20 h-20 object-cover"
                                            />
                                            <div className="">
                                              <p>{choice.name}</p>
                                              {/* {choice.price && <small>{abbreviation && toCurrency(\\ */}
                                              {choice.price}{" "}{currencyAbbreviation}
                                              {/* , lang, abbreviation)}</small>} */}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="h-10">
                                            <p>{choice.name}</p>
                                            {choice.price}{" "}{currencyAbbreviation}

                                            {/* {choice.price && <small>{abbreviation && toCurrency(choice.price, lang, abbreviation)}</small>} */}
                                          </div>

                                        )
                                        }
                                      </div>
                                    </>
                                  ),
                                  value: choice.id,
                                }));
                                return (
                                  <div key={variation.id} className="flex px-4">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-end justify-between">
                                        {/* PC Product Variation Name */}
                                        <strong>{t('choiceof')} {variation.name}</strong>
                                        {/* PC Product Variation isRequired */}
                                        {variation.isRequired && (
                                          <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      <span className="text-black/75">{t('Choose1')}</span>
                                      {/* PC Product Variation choice */}
                                      <div className='mt-2'>
                                        <GetRadio lang={lang} name={variation.id} options={options} />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              {/* PC Product Variation buttonType 1 */ }
                              if (variation.buttonType === 1 && (variation.isActive)) {
                                return <>
                                  <div key={variation.id} className="flex z-10 px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-end justify-between">
                                        {/* PC Product Variation Name */}
                                        <strong>{t('choiceof')} {variation.name}</strong>
                                        {variation.isRequired && (
                                          <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      <Controller
                                        key={variation.id}
                                        name={variation.id}
                                        control={methods.control}
                                        render={({ field, fieldState }) => (
                                          <RoleSelect
                                            label={variation.name}
                                            options={variation.choices as { id: string; name: string }[]}

                                            field={{
                                              ...field,
                                              value: typeof field.value === "string" ? field.value : "",
                                            }}
                                            error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                            placeholder={variation.name}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </>
                              }
                              {/* PC Product Variation buttonType 3 */ }
                              if (variation.buttonType === 3 && (variation.isActive)) {
                                return (
                                  <div key={variation.id} className="flex px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-end justify-between">
                                        {/* <strong>Your choice of: {variation.name}</strong> */}
                                        {variation.isRequired && (
                                          <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                            {t('req')}

                                          </div>
                                        )}
                                      </div>
                                      {/* <Input
                                              key={variation.id}
                                              label={variation.name}
                                              placeholder={variation.name}
                                              inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                              className="w-full"
                                              {...methods.register(variation.id)}
                                              error={String(methods.formState.errors[variation.id]?.message || '')}
                                          /> */}
                                      <Controller
                                        control={control}
                                        name={variation.id}
                                        render={({ field }) => (
                                          <Input
                                            label={variation.name}
                                            {...register(variation.id)}
                                            {...field}
                                            placeholder={variation.name}
                                            inputClassName="text-[16px] [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                            className="input-placeholder text-[16px] w-full"
                                            error={String(methods.formState.errors[variation.id]?.message || '')}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              if (variation.buttonType === 4 && (variation.isActive)) {
                                return (
                                  <div key={variation.id} className="flex px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-end justify-between">
                                        {/* <strong>Your choice of: {variation.name}</strong> */}
                                        {variation.isRequired && (
                                          <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                            {t('req')}

                                          </div>
                                        )}
                                      </div>
                                      <Controller
                                        key={variation.id}
                                        name={variation.id}
                                        control={methods.control}
                                        render={({ field: { value, onChange } }) => (
                                          <PhoneNumber
                                            label={t('phoneNumber')}
                                            country="us"
                                            value={value}
                                            labelClassName='font-medium'
                                            inputClassName="text-[16px] hover:!border-mainColor focus:!border-mainColor focus:!ring-mainColor text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                            className="input-placeholder text-[16px] w-full"
                                            {...methods.register(variation.id)}
                                            onChange={onChange}
                                            // @ts-ignore
                                            error={methods.formState.errors[variation.id]?.message}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              if (variation.buttonType === 5 && (variation.isActive)) {
                                return (
                                  <div key={variation.id} className="flex px-4 pt-0">
                                    <div className="w-full flex flex-col gap-1">
                                      <div className="flex items-end justify-between">
                                        {/* <strong>Your choice of: {variation.name}</strong> */}
                                        {variation.isRequired && (
                                          <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                            {t('req')}
                                          </div>
                                        )}
                                      </div>
                                      {/* <Input
                                              key={variation.id}
                                              label={variation.name}
                                              placeholder={variation.name}
                                              inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                              className="w-full"
                                              {...methods.register(variation.id)}
                                              error={String(methods.formState.errors[variation.id]?.message || '')}
                                          /> */}
                                      <Controller
                                        control={control}
                                        name={variation.id}
                                        render={({ field }) => (
                                          <Input
                                            label={variation.name}
                                            {...register(variation.id)}
                                            {...field}
                                            placeholder={variation.name}
                                            inputClassName="text-[16px] [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                            className="input-placeholder text-[16px] w-full"
                                            error={String(methods.formState.errors[variation.id]?.message || '')}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </>
                      )}
                      {prodId?.frequentlyOrderedWith && prodId.frequentlyOrderedWith.length > 0 && (
                        <div className="my-3 px-5">
                          <h3 className="font-bold mb-2">{lang === 'ar' ? 'منتجات ذات صلة:' : 'Related Products:'}</h3>

                          <Swiper
                            spaceBetween={12}
                            slidesPerView={4}
                            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
                            breakpoints={{
                              0: { slidesPerView: 3 },
                              450: { slidesPerView: 3.5 },
                              600: { slidesPerView: 4.5 },
                            }}
                          >
                            {prodId.frequentlyOrderedWith.map((item: any, index: any) => (
                              <SwiperSlide key={index}>
                                <div
                                  className="border border-dashed border-mainColor mt-3 rounded-lg p-2 w-28 cursor-pointer"
                                  onClick={() => {
                                    setIsModalOpen(false);
                                    setTimeout(() => {
                                      setCurrentModalProductId(null); // reset
                                      setTimeout(() => {
                                        setCurrentModalProductId(item.relatedProductId);
                                        setIsModalOpen(true);
                                      }, 10);
                                    }, 300);
                                  }}

                                >
                                  <Image
                                    src={item.relatedProduct.imageUrl ?? potato}
                                    width={200}
                                    height={300}
                                    alt={item.relatedProduct.name}
                                    className="w-40 h-20 object-cover"
                                  />
                                  <p className="text-sm mb-1 font-medium truncate">
                                    {item.relatedProduct.name}
                                  </p>
                                  <div className="flex flex-col">
                                    <p className="text-[10px] text-mainColor">
                                      {item.relatedProduct.finalPrice}{" "}{currencyAbbreviation}
                                      {/* {abbreviation && toCurrency(item.relatedProduct.price, lang, abbreviation)} */}
                                    </p>
                                    {item.relatedProduct.oldPrice && (
                                      <del className="text-[10px]">
                                        {item.relatedProduct.oldPrice}{" "}{currencyAbbreviation}
                                        {/* {abbreviation && toCurrency(item.relatedProduct.oldPrice, lang, abbreviation)} */}
                                      </del>
                                    )}
                                  </div>
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 justify-between items-center gap-5 p-3 bg-white w-full">
                      <div className={cn('bg-white rounded-bl-lg col-span-1 secShadow rtl:rounded-br-lg h-full', { 'rtl:rounded-bl-none': hasMoreDetails })}>
                        <QuantityHandler quantity={quantity} plusClassName={`${!prodId.hasStock || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? 'text-mainColor' : 'cursor-no-drop text-Color30 pointer-events-none'}`} setQuantity={setQuantity} className='w-full h-full rounded-lg' />
                      </div>
                      <div className={'col-span-2'}>
                        <ItemPrice
                          type={type}
                          action={() =>
                            trackAddToCart()
                          }
                          buttonType="submit"
                          price={`${finalPrice} ${currencyAbbreviation}`}
                          // oldPrice={` ${finalOldPrice}` ? `${finalOldPrice} ${currencyAbbreviation}`:''}
                          // oldPrice={finalOldPrice ? abbreviation && toCurrency(finalOldPrice, lang, abbreviation) : ''}
                          className={`${!prodId.hasStock || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? '' : 'cursor-no-drop bg-slate-400'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </form>
        </FormProvider>
      </div>

      {/* Mobile Modal */}
      <div className="md:hidden">
        <motion.div
          className="fixed inset-0 bg-gray-600 bg-opacity-50  z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.015 }}
          onClick={handleOutsideClick}

        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isOpen ? 0 : '100%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="fixed bottom-0 right-0 left-0 flex items-end z-[10000] overflow-hidden"
        >
          {/* > */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="bg-white rounded-lg b-4 w-full max-h-svh flex flex-col overflow-y-auto custom-scroll"
          >
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="relative">

                  {isImageVisible ? (
                    <div className="w-full h-60">
                      {prodId.imageUrl ?
                      <>
                        <img
                          src={prodId.imageUrl}
                          alt="Product Image"
                        />
                        {prodId.isDiscountActive===true &&
                         <p
                         className="bg-white rounded-xl py-2 px-3 absolute top-3 font-semibold end-2 hover:cursor-pointer"
                            
                            >
                              {lang==='ar'?'خصم':'save'}{" "}
                            {prodId.discountType ===0 ?
                           ` ${prodId.discount} %`
                           :
                           `${prodId.discount} ${currencyAbbreviation}`
                          }
                          </p>
                        }
                          </>
                        :
                        <div className="bg-white shadow-md rounded-lg p-2">
                          <Skeleton height={200} className="w-full rounded-lg " />
                        </div>

                      }
                    </div>
                  ) : (
                    <div className="w-full h-16 fixed top-0 start-0 right-0 flex items-center bg-white secShadow z-50">
                      <h3 className="text-xl font-bold leading-10 text-start ps-14">{prodId?.name}</h3>
                    </div>
                  )}
                  <X
                    onClick={handleClose}
                    className={`bg-white rounded-full p-2 ${isImageVisible ? 'fixed top-2 start-2' : 'fixed top-3.5 start-2 z-[100]'}`}
                    size={36}
                  />
                </div>

                <div className={`flex-1 px-4 pb-20 ${isImageVisible ? 'pt-4' : 'pt-60'}`}>
                  <div className="flex items-center gap-2">
                    {prodId?.isTopSelling && <Badge Icon={Flame} title={lang === 'ar' ? "الأعلى مبيعًا" : "Top Sale"} className="-ms-1" />}
                    {prodId?.isTopRated && <Badge Icon={Star} title={lang === 'ar' ? "الأعلى تقييمًا" : "Top Rated"} className="-ms-1" />}
                  </div>
                  <h3 className="text-xl font-bold leading-10">{prodId?.name}</h3>
                  <p className="text-sm font-medium text-black/75">{prodId?.description}</p>

                  {/* Fake data section */}
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    {FakeData?.isFakeSoldNumberAvailable && (
                      <div className="flex items-center gap-1 ">
                        <picture>
                          <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp" type="image/webp" />
                          <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif" alt="🔥" width="18" height="18" />
                        </picture>
                        <span className='font-medium'>
                          {getStableFakeNumber('sold', modalId, FakeData.minimumFakeSoldNumber, FakeData.maximumFakeSoldNumber)}
                          {lang === 'ar' ? ' بيعت في آخر ' : ' sold in the last '}
                          {FakeData.lastSoldNumberInHours} {lang === 'ar' ? ' ساعات' : ' hours'}
                        </span>
                      </div>
                    )}

                    {/* عرض عدد المشاهدين الوهميين */}
                    {FakeData?.isFakeViewersAvailable && randomViewers !== null && (
                      <div className="flex items-center gap-1 ">
                        <picture>
                          <source srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.webp" type="image/webp" />
                          <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/512.gif" alt="😍" width="18" height="18" />
                        </picture>
                        <span className='font-medium'>
                          {randomViewers} {lang === 'ar' ? ' اشخاص يشاهدون هذا الآن' : ' people are viewing this right now'}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Variations rendering for mobile */}
                  <div className="pt-6">
                    {prodId?.variations && (
                      <>
                        <div className="flex flex-col gap-3">
                          {prodId.variations.map((variation: Variation) => {
                            {/* PC Product Variation buttonType 0 */ }
                            if (variation.buttonType === 0 && (variation.isActive)) {
                              const options: Option[] = variation.choices.map((choice: Choice) => ({
                                label: (
                                  <div className="flex flex-col justify-center items-center">
                                    {choice.imageUrl ? (
                                      <>
                                        <CustomImage
                                          src={choice.imageUrl}
                                          alt={choice.name || "Radio"}
                                          width={600}
                                          height={350}
                                          className="w-20 h-20 object-cover"
                                        />
                                        <div className="">
                                          <p>{choice.name}</p>
                                          {choice.price}{" "}{currencyAbbreviation}

                                          {/* {choice.price && <small>{abbreviation && toCurrency(choice.price, lang, abbreviation)}</small>} */}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="h-10">
                                        <p>{choice.name}</p>
                                        {choice.price}{" "}{currencyAbbreviation}

                                        {/* {choice.price && <small>{abbreviation && toCurrency(choice.price, lang, abbreviation)}</small>} */}
                                      </div>
                                    )
                                    }
                                  </div>
                                ),
                                value: choice.id,
                              }));
                              return (
                                <div key={variation.id} className="flex">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-end justify-between">
                                      <strong>{t('choiceof')} {variation.name}</strong>
                                      {variation.isRequired && (
                                        <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    <span className="text-black/75">{t('Choose1')}</span>
                                    <div>
                                      <GetRadio lang={lang} name={variation.id} options={options} />
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            if (variation.buttonType === 1 && (variation.isActive)) {
                              return <>
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-end justify-between">
                                      {/* <strong>Your choice of: {variation.name}</strong> */}
                                      {variation.isRequired && (
                                        <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    <Controller
                                      key={variation.id}
                                      name={variation.id}
                                      control={methods.control}
                                      render={({ field, fieldState }) => (
                                        <RoleSelect
                                          label={variation.name}

                                          options={variation.choices as { id: string; name: string }[]}
                                          field={{
                                            ...field,
                                            value: typeof field.value === "string" ? field.value : "", // Ensure field.value is a string
                                          }}
                                          error={errorMassages.t(String(methods.formState.errors[variation.id]?.message || ''))}
                                          placeholder={variation.name}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </>
                            }
                            if (variation.buttonType === 3 && (variation.isActive)) {
                              return (
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-end justify-between">
                                      {/* <strong>Your choice of: {variation.name}</strong> */}
                                      {variation.isRequired && (
                                        <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    {/* <Input
                                      key={variation.id}
                                      label={variation.name}
                                      placeholder={variation.name}
                                      inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                      className="w-full"
                                      {...methods.register(variation.id)}
                                      error={String(methods.formState.errors[variation.id]?.message || '')}
                                    /> */}
                                    <Controller
                                      control={control}
                                      name={variation.id}
                                      render={({ field }) => (
                                        <Input
                                          label={variation.name}
                                          {...register(variation.id)}
                                          {...field}
                                          placeholder={variation.name}
                                          inputClassName="text-[16px] [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                          className="input-placeholder text-[16px] w-full"
                                          error={String(methods.formState.errors[variation.id]?.message || '')}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            if (variation.buttonType === 4 && (variation.isActive)) {
                              return (
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-end justify-between">
                                      {/* <strong>Your choice of: {variation.name}</strong> */}
                                      {variation.isRequired && (
                                        <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    <Controller
                                      key={variation.id}
                                      name={variation.id}
                                      control={methods.control}
                                      render={({ field: { value, onChange } }) => (
                                        <PhoneNumber
                                          label={t('phoneNumber')}
                                          country="us"
                                          value={value}
                                          inputClassName="text-sm hover:!border-mainColor focus:!border-mainColor focus:!ring-mainColor text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                          className="w-full"
                                          {...methods.register(variation.id)}
                                          onChange={onChange}
                                          // @ts-ignore
                                          error={methods.formState.errors[variation.id]?.message}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            if (variation.buttonType === 5 && (variation.isActive)) {
                              return (
                                <div key={variation.id} className="flex pt-0">
                                  <div className="w-full flex flex-col gap-1">
                                    <div className="flex items-end justify-between">
                                      {/* <strong>Your choice of: {variation.name}</strong> */}
                                      {variation.isRequired && (
                                        <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                          {t('req')}
                                        </div>
                                      )}
                                    </div>
                                    {/* <Input
                                      key={variation.id}
                                      label={variation.name}
                                      placeholder={variation.name}
                                      inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                      className="w-full"
                                      {...methods.register(variation.id)}
                                      error={String(methods.formState.errors[variation.id]?.message || '')}
                                    /> */}
                                    <Controller
                                      control={control}
                                      name={variation.id}
                                      render={({ field }) => (
                                        <Input
                                          label={variation.name}
                                          {...register(variation.id)}
                                          {...field}
                                          placeholder={variation.name}
                                          inputClassName="text-[16px] [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                          className="input-placeholder w-full text-[16px]"
                                          error={String(methods.formState.errors[variation.id]?.message || '')}
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </>
                    )}
                    {prodId?.frequentlyOrderedWith && prodId.frequentlyOrderedWith.length > 0 && (
                      <div className="my-3 ">
                        <h3 className="font-bold mb-2">{lang === 'ar' ? 'منتجات ذات صلة:' : 'Related Products:'}</h3>

                        <Swiper
                          spaceBetween={12}
                          slidesPerView={4}
                          onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
                          breakpoints={{
                            0: { slidesPerView: 3 },
                            450: { slidesPerView: 3.5 },
                            600: { slidesPerView: 4.5 },
                          }}
                        >
                          {prodId.frequentlyOrderedWith.map((item: any, index: any) => (
                            <SwiperSlide key={index}>
                              <div
                                className="border border-dashed border-mainColor mt-3 rounded-lg p-2 w-28 cursor-pointer"
                                onClick={() => {
                                  // Close the current modal
                                  setIsModalOpen(false);
                                  // Important: Update the modalId state in the parent component
                                  setCurrentModalProductId(item.relatedProduct.id);
                                  // A small delay before reopening the modal with the new ID
                                  setTimeout(() => {
                                    setIsModalOpen(true);
                                  }, 300);
                                }}
                              >
                                <Image
                                  src={item.relatedProduct.imageUrl ?? potato}
                                  width={200}
                                  height={300}
                                  alt={item.relatedProduct.name}
                                  className="w-40 h-20 object-cover"
                                />
                                <p className="text-sm mb-1 font-medium truncate">
                                  {item.relatedProduct.name}
                                </p>
                                <div className="flex flex-col">
                                  <p className="text-[10px] text-mainColor">
                                    {item.relatedProduct.finalPrice}{" "}{currencyAbbreviation}

                                    {/* {abbreviation && toCurrency(item.relatedProduct.price, lang, abbreviation)} */}
                                  </p>
                                  {item.relatedProduct.oldPrice && (
                                    <del className="text-[10px]">
                                      {item.relatedProduct.oldPrice}{" "}{currencyAbbreviation}

                                      {/* {abbreviation && toCurrency(item.relatedProduct.oldPrice, lang, abbreviation)} */}
                                    </del>
                                  )}
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}



                  </div>

                  <SpecialNotes
                    lang={lang!}
                    className="pt-4 pb-2 col-span-full gap-2"
                    notes={notes}
                    setNotes={setNotes}
                  />
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-5 secShadow bg-white rounded-b-lg z-[10001]">
                  <div className="grid grid-cols-3 justify-between items-center gap-5 w-full">
                    <div className={cn('bg-white rounded-bl-lg col-span-1 secShadow rtl:rounded-br-lg h-full', { 'rtl:rounded-bl-none': hasMoreDetails })}>
                      <QuantityHandler plusClassName={`${!prodId.hasStock || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? 'text-mainColor' : 'cursor-no-drop text-Color30 pointer-events-none'}`} quantity={quantity} setQuantity={setQuantity} className='w-full h-full rounded-lg' />
                    </div>
                    <div className={'col-span-2'}>
                      <ItemPrice
                        type={type}
                        buttonType="submit"
                        price={`${finalPrice} ${currencyAbbreviation}`}
                        // oldPrice={` ${finalOldPrice}` ? `${finalOldPrice} ${currencyAbbreviation}`:''}
                        // price={abbreviation && toCurrency(finalPrice, lang, abbreviation)}
                        // oldPrice={finalOldPrice ? abbreviation && toCurrency(finalOldPrice, lang, abbreviation) : ''}
                        className={`${!prodId.hasStock || (prodId.stockNumber - totalSoldQuantity > 0 && prodId.stockNumber - totalSoldQuantity - quantity >= 0) ? '' : 'cursor-no-drop  bg-slate-400'}`}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

export default Modal;