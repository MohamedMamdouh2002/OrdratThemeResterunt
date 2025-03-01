'use client';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, SubmitHandler, useForm, useFormContext, Controller } from 'react-hook-form';
import {
    buildProductDetailsSchema,
    ProductDetailsInput,
} from '@/validators/product-details.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flame, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactDOM from 'react-dom';
// import SpecialNotes from '@/app/components/ui/SpecialNotes';
import QuantityHandler from '../item/QuantityHandler';
import ItemPrice from '../ItemPrice';
import Badge from '../Badge';
import Image from 'next/image';
import cn from '../../../../../../../packages/isomorphic-core/src/utils/class-names';
import sliderPhoto from '@public/assets/landing-poster.png';
import { FullProduct, FoodId, CartItem } from '@/types';
import { useUserContext } from '../../context/UserContext';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Button, Title, Text, Input } from 'rizzui';
import { useCart } from '@/store/quick-cart/cart.context';
import toast from 'react-hot-toast';
import GetSize from '@/app/shared/ecommerce/product/get-size';
import GetRadio from '@/app/shared/ecommerce/product/get-radio';
import { toCurrency } from '@utils/to-currency';
import photo from '@public/assets/شاورما-عربي-لحمة-768x768.png'
import hamburger from '@public/assets/hamburger.png'
import potato from '@public/assets/شاورما-عراقي-لحمة-مع-بطاطا.png'
import { PhoneNumber } from '@ui/phone-input';
import RoleSelect from '../inputs/selectInput/SelectInput';
import { Data } from '@react-google-maps/api';

import SpecialNotes from '@/app/components/ui/SpecialNotes';
import { useTranslation } from '@/app/i18n/client';

// type Props = {

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
    handleUpdateCart?: () => void;
    itemId?: string;
    // setShowItem: (val: boolean) => void;
    type?: string;
    setIsModalOpen: (isOpen: boolean) => void;
    modalId: string;
};

function Modal({
    setIsModalOpen,
    modalId,
    data,
    quantity,
    setQuantity,
    lang,
    hasMoreDetails,
    handleUpdateCart,

    itemId,
    //   setShowItem,
    type,
}: ModalProps) {

    const [prodId, setProdId] = useState<FoodId | any>(null)
    const [prodCartItem, setProdCartItem] = useState<CartItem | any>(null)
    const [isLoading, setLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const { t } = useTranslation(lang!, 'home');

    const { GetProduct } = useUserContext();
    const { addItemToCart } = useCart();
    const [isImageVisible, setImageVisible] = useState(true);
    const [isScroll, setIsScroll] = useState(true);
    const scrollContainerRef = useRef<HTMLImageElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const scrollTop = scrollContainerRef.current.scrollTop;
            setImageVisible(scrollTop < 150); // إخفاء الصورة عند التمرير بمقدار 100 بيكسل أو أكثر
        }
    };

    const [isScrolled, setIsScrolled] = useState(false);

    const handleScrollPc = () => {
        setIsScrolled(window.scrollY > 0);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScrollPc);
        return () => window.removeEventListener("scroll", handleScrollPc);
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const data = await GetProduct({ lang, id: modalId });
            setProdId(data);


            console.log('Fetched Data prod:', data);

            setProdCartItem({
                id: data.id,
                name: data.name,
                slug: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                price: data.price,
                quantity: 1,
                sizeFood: "small",
                color: {
                    name: "Purple Heart",
                    code: "#5D30DD",
                },
            });
        };
        fetchData();
    }, [GetProduct, modalId]);

    const handleAddToCart = () => {
        if (!prodCartItem) return;

        const cartItem: CartItem = {
            id: prodCartItem.id,
            name: prodCartItem.name || "Default Item",
            slug: prodCartItem.slug || "",
            description: prodCartItem.description || "Default Description",
            image: prodCartItem.imageUrl,
            price: prodCartItem.price || 100,
            quantity,
            sizeFood: "small",
            discount: prodCartItem.discount,
            stock: 10,
        };

        addItemToCart(cartItem, quantity);
        setIsModalOpen(false);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    //   if (typeof window === 'undefined') return null;

    const methods = useForm<ProductDetailsInput>({
        mode: 'onChange',
        resolver: zodResolver(buildProductDetailsSchema(prodId?.variations || [])),
    });
    const { watch, setValue, register, handleSubmit, control } = methods;

    useEffect(() => {
        // Watch for all values in the form
        const subscription = watch((values) => {
            // Iterate over the form data to synchronize fields with the same id
            Object.keys(values).forEach((key) => {
                const value = values[key];
                const matchingFields = Object.keys(values).filter(
                    (field) => field === key
                );

                // Sync value for fields with the same variation.id
                matchingFields.forEach((field) => {
                    if (values[field] !== value) {
                        setValue(field, value);
                    }
                });
            });
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    // Watch the form state for selected variations
    const selectedChoicePrices = prodId?.variations?.reduce((total: number, variation: Variation) => {
        const selectedChoiceId = watch(variation.id); // Watching each variation id for changes
        const selectedChoice = variation.choices.find((choice: Choice) => choice.id === selectedChoiceId);
        return total + (selectedChoice?.price || 0);
    }, 0) * quantity || 0;

    const finalPrice = (prodId?.price * quantity) + selectedChoicePrices;
    const finalOldPrice = data?.oldPrice ? (prodId.oldPrice * quantity) + selectedChoicePrices : undefined;

    const onSubmit: SubmitHandler<ProductDetailsInput> = (data) => {
        const cartItem: CartItem = {
            id: prodId?.id || "",
            name: prodId?.name || "Default Item",
            description: prodId?.description,
            image: prodId?.imageUrl || "",
            price: (prodId?.price + selectedChoicePrices) || 0,
            oldPrice: prodId?.oldPrice || 0,
            quantity,
            notes: notes || "",
            orderItemVariations: prodId?.variations.map((variation: Variation) => {
                const variationData = data[variation.id];

                // Check the type of variation to determine data structure
                if (variation.buttonType === 0 || variation.buttonType === 1) {
                    // Radio or Dropdown case
                    const selectedChoice = variation.choices.find(choice => choice.id === variationData);
                    return {
                        variationId: variation.id,
                        variationLable: variation.name,
                        choices: [
                            {
                                choiceId: variationData || "", // Use the data as choiceId
                                choiceValue: selectedChoice?.name || "", // Store the matched choice name
                            },
                        ],
                    };
                } else {
                    // Other types of input (Input, PhoneNumber, Email, etc.)
                    return {
                        variationId: variation.id,
                        variationLable: variation.name,
                        choices: [
                            {
                                inputValue: variationData || "", // Use the data as inputValue
                            },
                        ],
                    };
                }
            }),
        };
        console.log("supmitted Data: ", cartItem);

        // Add to cart
        addItemToCart(cartItem, quantity);
        setIsModalOpen(false);
        toast.success(t("addtoCart"));
    };

    return ReactDOM.createPortal(
        <>
            {prodId && <>
                <div className="hidden rounded-lg md:flex items-center justify-center">
                    <FormProvider {...methods}>
                        <form className="pb-8 pt-5" onSubmit={methods.handleSubmit(onSubmit)}>
                            <div onClick={handleOutsideClick}
                                className="fixed inset-0 flex z-[999] bg-black/20 items-center justify-center p-4"
                            >
                                <div className="bg-white rounded-lg b-4 w-[600px] 4xl:w-[800px] min-h-auto max-h-[650px]">
                                    <div
                                        className={cn('grid grid-cols-3 rounded-lg  gap-2 relative', {
                                            'grid-cols-1': !hasMoreDetails,
                                        })}
                                    >
                                        <div className="relative rounded-t-lg z-50 bg-white">
                                            <div className={`sticky mb-5 rounded-t-lg ${isScrolled ? `secShadow` : `shadow-none`} top-0 bg-white z-50 `}>
                                                <div className={`flex mb-4 `}>
                                                    <div className="">
                                                        <Image
                                                            src={prodId.imageUrl || photo}
                                                            width={500}
                                                            height={300}
                                                            alt="s"
                                                            className="w-full h-52 p-1 rounded-lg"
                                                        />
                                                        <X
                                                            onClick={() => setIsModalOpen(false)}
                                                            className="bg-white rounded-full p-2 absolute top-3 start-2 hover:cursor-pointer"
                                                            size={36}
                                                        />
                                                    </div>
                                                    <div className="px-4 pt-2 flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            {prodId?.isTopSelling && <Badge Icon={Flame} title="Top Sale" className="-ms-1" />}
                                                            {prodId?.isTopRated && <Badge Icon={Star} title="Top Rated" className="-ms-1" />}
                                                        </div>
                                                        <h3 className="text-xl font-bold leading-10">{prodId?.name}</h3>
                                                        <p className="text-sm font-medium text-black/75">{prodId?.description}</p>
                                                        <SpecialNotes lang={lang!} notes={notes} setNotes={setNotes} className="gap-2" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="overflow-y-auto  max-h-[350px]">
                                                <div className="">
                                                    {prodId?.variations && (
                                                        <>
                                                            <div className="flex flex-col gap-3 pb-4">
                                                                {prodId.variations.map((variation: Variation) => {
                                                                    if (variation.buttonType === 0 && (!variation.isActive)) {
                                                                        const options: Option[] = variation.choices.map((choice: Choice) => ({
                                                                            label: (
                                                                                <div className="flex flex-col justify-center items-center">

                                                                                    {choice.imageUrl ? (
                                                                                        <>
                                                                                            <Image
                                                                                                src={choice.imageUrl}
                                                                                                alt={choice.name || "Radio"}
                                                                                                width={600}
                                                                                                height={350}
                                                                                                className="w-20 h-20"
                                                                                            />
                                                                                            <div className="">
                                                                                                <p>{choice.name}</p>
                                                                                                {choice.price && <small>{toCurrency(choice.price,lang)}</small>}
                                                                                            </div>
                                                                                        </>
                                                                                    ) : (
                                                                                        <div className="h-10">
                                                                                            <p>{choice.name}</p>
                                                                                            {choice.price && <small>{toCurrency(choice.price,lang)}</small>}
                                                                                        </div>

                                                                                    )
                                                                                    }
                                                                                </div>
                                                                            ),
                                                                            value: choice.id,
                                                                        }));
                                                                        return (
                                                                            <div key={variation.id} className="flex px-4">
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
                                                                                    <div className='mt-2'>
                                                                                        <GetRadio name={variation.id} options={options} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    if (variation.buttonType === 1) {
                                                                        return <>
                                                                            <div key={variation.id} className="flex z-10 px-4 pt-0">
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
                                                                                                error={String(methods.formState.errors[variation.id]?.message || '')}
                                                                                                placeholder={variation.name}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    if (variation.buttonType === 3) {
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
                                                                                                inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                                                                                className="w-full"
                                                                                                error={String(methods.formState.errors[variation.id]?.message || '')}
                                                                                            />
                                                                                        )}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    if (variation.buttonType === 4) {
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
                                                                    if (variation.buttonType === 5) {
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
                                                                                                inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                                                                                className="w-full"
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
                                                    {prodId?.frequentlyOrderedWith && (
                                                        <div className=''>
                                                            {prodId.frequentlyOrderedWith.map((item: {
                                                                FoodId: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; relatedProductId: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; relatedProduct: {
                                                                    oldPrice: string; imageUrl: string | StaticImport; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined;
                                                                };
                                                            }, index: React.Key | null | undefined) => (
                                                                <div key={index} className='p-4'>
                                                                    <h3 className="font-medium text-lg mb-2">{t('RelatedProduct')}:</h3>
                                                                    {item.relatedProduct && (
                                                                        <div className=" border border-dashed border-mainColor rounded-lg p-2 w-28">
                                                                            <Image
                                                                                src={item.relatedProduct.imageUrl}
                                                                                width={200}
                                                                                height={300}
                                                                                alt="s"
                                                                                className="w-40"
                                                                            />
                                                                            <p className='text-sm mb-1 font-medium'> {item.relatedProduct.name}</p>
                                                                            <div className="flex gap-3">
                                                                                <p className='text-[10px] text-mainColor'> {item.relatedProduct.price} {t('EGP')}</p>
                                                                                <del className='text-[10px]'>{item.relatedProduct.oldPrice} {t('EGP')} </del>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* {prodId?.reviews && prodId.reviews.length > 0 && (
                                            <div className='p-4'>
                                                <h3 className="font-bold">Reviews:</h3>
                                                {prodId.reviews.map((review: { endUser: { name: string }; rate: number; reviewText: string }, index: React.Key | null | undefined) => (
                                                <div key={index}>
                                                    <p>User: {review.endUser?.name}</p>
                                                    <p className='flex'>Rating:  <Badge Icon={Star} title={`${review.rate} `} className="ms-1" /></p>
                                                    <p>Review: {review.reviewText}</p>
                                                    <hr />
                                                </div>
                                                ))}
                                            </div>
                                            )} */}
                                                </div>
                                            </div>
                                            {/* buttons */}
                                        </div>
                                        <div className="grid grid-cols-3 justify-between items-center gap-5 p-3  bg-white w-full">
                                            <div className={cn('bg-white rounded-bl-lg col-span-1 secShadow rtl:rounded-br-lg h-full', { 'rtl:rounded-bl-none': hasMoreDetails })}>
                                                <QuantityHandler quantity={quantity} setQuantity={setQuantity} className=' w-full h-full rounded-lg' />
                                            </div>
                                            <div className={'col-span-2'}>
                                                <ItemPrice
                                                    type={type}
                                                    buttonType="submit"
                                                    // action={handleAddToCart}
                                                    price={` ${finalPrice} ${t('EGP')}`}
                                                    oldPrice={data?.oldPrice ? ` ${finalOldPrice} ${t('EGP')}` : undefined}
                                                    className={cn('rounded-none rounded-br-lg rtl:rounded-bl-lg rtl:rounded-br-none', { 'rounded-br-none rtl:rounded-bl-none': hasMoreDetails })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 md:z-10 z-[9999]" onClick={handleOutsideClick} />
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 right-0 left-0 md:hidden  flex items-end z-[10000] "
                >
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="bg-white rounded-lg b-4 w-full max-h-svh flex flex-col overflow-y-auto custom-scroll">
                        <FormProvider {...methods}>
                            <form className="" onSubmit={methods.handleSubmit(onSubmit)}>
                                {/* <div className="relative flex-shrink-0">
                                <Image src={prodId.imageUrl} width={900} height={600} alt="s" className="w-full h-60" />
                                <X onClick={handleClose} className="bg-white rounded-full p-2 absolute top-2 start-2" size={36} />
                            </div> */}
                                <div className="relative ">
                                    {isImageVisible ? (
                                        <div className="w-full h-60">
                                            <Image
                                                src={prodId.imageUrl || photo}
                                                // width={900}
                                                // height={600}
                                                layout="fill"
                                                objectFit="cover"
                                                alt="Product Image"
                                                className=""
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-16 fixed top-0 start-0 right-0 flex items-center bg-white secShadow z-50">
                                            <h3 className="text-xl font-bold leading-10 text-start  ps-14">{prodId?.name}</h3>
                                        </div>
                                    )}
                                    <X
                                        onClick={() => setIsModalOpen(false)}
                                        className={`bg-white rounded-full p-2  ${isImageVisible ? 'fixed top-2 start-2' : 'fixed top-3.5 start-2 z-[100]'
                                            }`}
                                        size={36}
                                    />
                                </div>
                                <div className={`flex-1 px-4 pb-20 ${!isImageVisible ? `pt-64` : `pt-4`}`}>
                                    <div className="flex items-center gap-2">
                                        {data?.isTopRated && <Badge Icon={Star} title="Top rated" className="-ms-1" />}
                                        {data?.isTopSelling && <Badge Icon={Flame} title="Top Selling" className="-ms-1" />}
                                    </div>
                                    <h3 className="text-xl font-bold leading-10">{prodId?.name}</h3>
                                    <p className="text-sm font-medium text-black/75">{prodId?.description}</p>

                                    <div className="pt-6">
                                        {prodId?.variations && (
                                            <>
                                                <div className="flex flex-col gap-3">
                                                    {prodId.variations.map((variation: Variation) => {
                                                        if (variation.buttonType === 0 && (!variation.isActive)) {
                                                            const options: Option[] = variation.choices.map((choice: Choice) => ({
                                                                label: (
                                                                    <div className="flex flex-col justify-center items-center">
                                                                        {choice.imageUrl ? (
                                                                            <>
                                                                                <Image
                                                                                    src={choice.imageUrl}
                                                                                    alt={choice.name || "Radio"}
                                                                                    width={600}
                                                                                    height={350}
                                                                                    className="w-20 h-20"
                                                                                />
                                                                                <div className="">
                                                                                    <p>{choice.name}</p>
                                                                                    {choice.price && <small>{toCurrency(choice.price,lang)}</small>}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className="h-10">
                                                                                <p>{choice.name}</p>
                                                                                {choice.price && <small>{toCurrency(choice.price,lang)}</small>}
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
                                                                            <strong>Your choice of: {variation.name}</strong>
                                                                            {variation.isRequired && (
                                                                                <div className="text-white bg-mainColor px-2 py-1 rounded-full text-sm">
                                                                                    {t('req')}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-black/75">Choose 1</span>
                                                                        <div>
                                                                            <GetRadio name={variation.id} options={options} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        if (variation.buttonType === 1) {
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
                                                                                    error={String(methods.formState.errors[variation.id]?.message || '')}
                                                                                    placeholder={variation.name}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                        if (variation.buttonType === 3) {
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
                                                                                    inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                                                                    className="w-full"
                                                                                    error={String(methods.formState.errors[variation.id]?.message || '')}
                                                                                />
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        if (variation.buttonType === 4) {
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
                                                        if (variation.buttonType === 5) {
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
                                                                                    inputClassName="text-sm [&.is-hover]:border-mainColor [&.is-focus]:border-mainColor [&.is-focus]:ring-mainColor"
                                                                                    className="w-full"
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

                                        {prodId?.frequentlyOrderedWith && (
                                            <div>
                                                {prodId.frequentlyOrderedWith.map((item: { relatedProduct: { imageUrl: string | StaticImport; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; price: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; oldPrice: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; }; }, index: React.Key | null | undefined) => (
                                                    <div key={index}>
                                                        <h3 className="font-bold mb-2">Related Product:</h3>
                                                        {item.relatedProduct && (
                                                            <div className=" border border-dashed border-mainColor rounded-lg p-2 w-28">
                                                                <Image
                                                                    src={item.relatedProduct.imageUrl}
                                                                    width={200}
                                                                    height={300}
                                                                    alt="s"
                                                                    className="w-40"
                                                                />
                                                                <p className='text-sm mb-1 font-medium'> {item.relatedProduct.name}</p>
                                                                <div className="flex gap-3">
                                                                    <p className='text-[10px] text-mainColor'> {item.relatedProduct.price} {t('EGP')} </p>
                                                                    <del className='text-[10px]'> {item.relatedProduct.oldPrice} {t('EGP')} </del>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* {prodId?.reviews && prodId.reviews.length > 0 && (
                                    <div>
                                        <h3 className="font-bold">Reviews:</h3>
                                        {prodId.reviews.map((review: { endUser: { name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; }; rate: any; reviewText: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | Iterable<React.ReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                                            <div key={index}>
                                                <p>User: {review.endUser?.name}</p>
                                                <p className='flex'>Rating: <Badge Icon={Star} title={`${review.rate} `} className="ms-1" /></p>
                                                <p>Review: {review.reviewText}</p>
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                                    </div>
                                    <SpecialNotes
                                        lang={lang!}
                                        // des="Anything else we need to know?"
                                        className="pt-4 pb-2 col-span-full gap-2"
                                        notes={notes}
                                        setNotes={setNotes}
                                    />
                                </div>

                                <div className="fixed bottom-0 left-0 right-0 p-5 secShadow  bg-white rounded-b-lg z-[10001]">
                                    <div className="grid grid-cols-3 justify-between items-center gap-5  w-full">
                                        <div className={cn('bg-white rounded-bl-lg col-span-1 secShadow rtl:rounded-br-lg h-full', { 'rtl:rounded-bl-none': hasMoreDetails })}>
                                            <QuantityHandler quantity={quantity} setQuantity={setQuantity} className=' w-full h-full rounded-lg' />
                                        </div>
                                        <div className={'col-span-2'}>
                                            <ItemPrice
                                                type={type}
                                                buttonType="submit"
                                                // action={handleAddToCart}
                                                price={` ${finalPrice} ${t('EGP')}`}
                                                oldPrice={data?.oldPrice ? ` ${finalOldPrice} ${t('EGP')}` : undefined}
                                                className={cn('rounded-none rounded-br-lg rtl:rounded-bl-lg rtl:rounded-br-none', { 'rounded-br-none rtl:rounded-bl-none': hasMoreDetails })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </FormProvider>
                    </div>
                </motion.div>
            </>
            }
        </>,
        document.body
    );
}

export default Modal;