'use client';
import { AnimatePresence } from 'framer-motion';
import {
  useForm,
  FormProvider,
  type SubmitHandler,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import OrderSummery from '@/app/shared/ecommerce/checkout/order-summery';
import { Text } from 'rizzui';
import cn from '@utils/class-names';
import { useEffect, useMemo, useState } from 'react';
import MapWithZones from '@/app/components/ui/inputs/map/MapWithZones';
import { RadioGroup } from '@headlessui/react';

import { BriefcaseBusiness, Building, Home } from 'lucide-react';
import { useUserContext } from '@/app/components/context/UserContext';
import { MadeOrderInput, madeOrderSchema } from '@/validators/checkoutcreditecard.schema';
import { useCart } from '@/store/quick-cart/cart.context';
import usePrice from '@hooks/use-price';
// import { shopId } from '@/config/shopId';
import axiosClient from '@/app/components/fetch/api';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/app/i18n/client';
// import Modal from '../ui/Modal';
import Modal from '@/app/components/ui/Modal';
import Login from '@/app/components/authPopups/Login';
import AddressModalWithLogin from '@/app/components/profile/AddressModalWithLogin';
import AddressModal from '@/app/components/profile/AddressModal';

type Address = {
  id: string;
  apartmentNumber: string;
  additionalDirections?: string;
  floor?: number;
  street: string;
  latitude: number;
  longtude: number;
  buildingType: number;
  phoneNumber: string;
};

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
type Branchprops = {
  name: string;
  addressText: string;
  openAt: string;
  closedAt: string;
  deliveryCharge: number;
  minimumDeliveryCharge: number;
  deliveryPerKilo: number;
  isFixedDelivery: boolean;
  deliveryTime: string;
}

type Gateway = {
  id: string;
  gatewayName: string;
  gatewayDescription: string;
  isEnabled: boolean;
  priority: number;
  gatewayUrl: any;
  paymentMethod: number;
};

// main order form component for create and update order
export default function CheckoutPageWrapper({
  className,
  lang,
}: {
  className?: string;
  lang?: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { orderNote, setOrderNote, copone, setCopone, shopId, setDiscountValue, setDiscountType } = useUserContext();
  const { items, total, addItemToCart, removeItemFromCart, clearItemFromCart } =
    useCart();
  const [response, setResponse] = useState<Branchprops[]>([]);

  const { price: totalPrice } = usePrice({
    amount: total,
  });
  // console.log("total: ",total);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pay, setPay] = useState<Gateway[]>([]);

  const [loginModal, setLoginModal] = useState(false);
  const [currentModal, setCurrentModal] = useState<'login' | 'register' | 'resetPassword'>('login');
  const accessToken = localStorage.getItem('accessToken');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [deliveryBerKelo, setDeliveryBerKelo] = useState<any>('');
  const [branchId, setBranchId] = useState<any>('');
  const methods = useForm<MadeOrderInput>({
    mode: 'onChange',
    resolver: zodResolver(madeOrderSchema),
  });

  const { t } = useTranslation(lang!, 'profile');
  // Sample addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressApiLoading, setIsAddressApiLoading] = useState(false);
  const { updateAddresses, setUpdateAddresses, branchZones } = useUserContext();

  //summary بجيبها من ال ordersummary
  const [summary, setSummary] = useState<{
    finalTotal: number;
    tax: number;
    delivery: number;
    discount: number;
  } | null>(null);

  // const totalPricing: any = summary
  //   ? summary.finalTotal - (summary.tax + summary.delivery)
  //   : 0;
  const fetchAddresses = async () => {
    setIsAddressApiLoading(true);

    try {
      const response = await axiosClient.get('/api/Address/GetEndUserAddresses', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      const mappedAddresses = data.map((a: any) => ({
        id: a.id,
        additionalDirections: a.additionalDirections,
        apartmentNumber: a.apartmentNumber,
        floor: a.floor,
        street: a.street,
        latitude: a.latitude,
        longtude: a.longtude,
        buildingType: a.buildingType,
      }));

      setAddresses(mappedAddresses);
      setUserLocation({
        lat: mappedAddresses[mappedAddresses.length - 1]?.latitude,
        lng: mappedAddresses[mappedAddresses.length - 1]?.longtude,
      });
      setSelectedAddressId(mappedAddresses[mappedAddresses.length - 1]?.id);
      setIsAddressApiLoading(false);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setIsAddressApiLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    if (updateAddresses === true) {
      fetchAddresses();
      setUpdateAddresses(false);
    }
  }, [updateAddresses]);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // setLoading(true);
        const response = await axiosClient.get(`/api/Branch/GetByShopId/${shopId}`, {
          headers: {
            'Accept-Language': lang,
          },
        });
        setResponse(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchOrders();
  }, [lang]);
  async function fetchDeliveryCharge(shopId: string, addressId: string) {
    try {
      const response = await fetch(
        `https://testapi.ordrat.com/api/Order/GetDeliveryCharge/${shopId}/${addressId}`,
        {
          method: 'GET',
          headers: {
            Accept: '*/*',
          },
        }
      );

      if (!response.ok) {
        throw new Error('فشل في الحصول على قيمة التوصيل');
      }

      const data = await response.json();
      setDeliveryBerKelo(data.message.shippingFees);
      setBranchId(data.message.branch.id);

    } catch (error) {
      console.error('خطأ في استدعاء قيمة التوصيل:', error);
      return null;
    }
  }

  //  const addresses = [
  //   {
  //     id: 'd6a3d710-96ae-4197-ab6c-9494a735e400',
  //     additionalDirections: 'street',
  //     apartmentNumber: 122,
  //     floor: 'street',
  //     street: 'street',
  //     latitude: 31.201240111381715,
  //     longtude: 29.90064892297799,
  //     buildingType: 1,
  //   },
  //   {
  //     id: '46f1e3e0-6ac2-4d66-8758-f62474d5d635',
  //     additionalDirections: 'string',
  //     apartmentNumber: 0,
  //     floor: 'string',
  //     street: 'string',
  //     latitude: 30.013056,
  //     longtude: 31.208853,
  //     buildingType: 0,
  //   },
  // ];

  // Initial user location
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: addresses[addresses?.length - 1]?.latitude,
    lng: addresses[addresses?.length - 1]?.longtude,
  });

  // Active selected address ID
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addresses[addresses?.length - 1]?.id || null);
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [locationOutOfZone, setLocationOutOfZone] = useState(false);

  // ببعت القيم للفانكشن عشان احسب التوصيل
  useEffect(() => {
    const getCharge = async () => {
      if (!shopId || !selectedAddressId) return;
      const charge = await fetchDeliveryCharge(shopId, selectedAddressId);
      console.log('قيمة التوصيل:', charge);
    };

    getCharge();
  }, [shopId, selectedAddressId as any]);
  // Handle location change from the map
  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setUserLocation(newLocation); // Update user location when the marker is moved
    setSelectedAddressId(null); // Deselect the radio option if the user picks a location manually
    console.log('New user location:', newLocation);
  };

  // Handle address selection from the radio group
  const handleAddressSelection = (address: typeof addresses[0]) => {
    setUserLocation({ lat: address.latitude, lng: address.longtude });
    setSelectedAddressId(address.id);
  };

  // Define some zones (circles) with center points and radii
  // const zones = [
  //   { center: { lat: 30.013056, lng: 31.208853 }, radius: 2000, color: '#FF0000' }, // Central Giza
  //   { center: { lat: 30.001219, lng: 31.168858 }, radius: 1800, color: '#00FF00' },  // Near Pyramids
  //   { center: { lat: 29.976480, lng: 31.131302 }, radius: 1300, color: '#0000FF' },  // Giza Pyramids
  //   { center: { lat: 30.020817, lng: 31.275039 }, radius: 1000, color: '#FFFF00' },  // Eastern Giza
  // ];
  const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080"];

  const zones = useMemo(() =>
    branchZones.map((zone, index) => ({
      center: { lat: zone.lat, lng: zone.lng },
      radius: zone.zoonRadius,
      color: colors[index % colors.length]
    })),
    [branchZones]
  );

  useEffect(() => {
    const isInsideAnyZone = zones.some((zone) => {
      const distance = getDistanceFromLatLonInMeters(
        userLocation.lat,
        userLocation.lng,
        zone.center.lat,
        zone.center.lng
      );
      return distance <= zone.radius;
    });

    setLocationOutOfZone(!isInsideAnyZone);
  }, [userLocation, zones]);

  function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Earth radius in meters
    const toRad = (x: number) => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const fetchGateways = async () => {
      try {
        const response = await axiosClient.get(`/api/ShopPaymentGateway/GetByShopId/${shopId}`, {
          headers: {
            'Accept-Language': lang,
          },
        });
        setPay(response.data);
      } catch (error) {
        console.error('Error fetching payment gateways:', error);
      }
    };

    fetchGateways();
  }, [lang, shopId]);
  console.log("errors: ", methods.formState.errors);

  const onSubmit: SubmitHandler<MadeOrderInput> = async (data) => {
    setLoading(true);
    try {
      const selectedGateway = pay.find((g) => g.id === selectedId);
      const paymentMethod = selectedGateway?.paymentMethod;

      const formData = new FormData();
      formData.append('paymentmethod', paymentMethod?.toString() || '0');
      formData.append('OrderType', '2');
      formData.append('TotalPrice', "0");
      formData.append('ShippingFees', String(summary?.delivery || 0));
      formData.append('TotalVat', "0");
      // formData.append('ShippingFees',fees);
      // formData.append('TotalPrice', String(total || 0));
      // formData.append('TotalVat', String(summary?.tax || 0));

      formData.append('ShopId', shopId);
      formData.append('BranchId', branchId);
      formData.append('EndUserId', '');
      formData.append('Discount', '0');
      formData.append('GrossProfit', '0');
      formData.append('Service', '0');
      formData.append('IsPaid', 'false');
      formData.append('SourceChannel', '0');
      // formData.append('OrderNumber', 'ORD123456');
      // formData.append('TableNumber', '5');
      formData.append('Status', '1');

      if (copone) {
        formData.append('CouponCode', copone);
      }


      if (orderNote) {
        formData.append('Notes', orderNote);
      }
      if (selectedAddressId) {
        formData.append('AddressId', selectedAddressId);
      }
      // formData.append('ShopId', shopId);
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

      formData.append('CreatedAt', formattedDate);

      items.forEach((item, index) => {
        const realProductData = parseProductData(item.id as string)
        formData.append(`Items[${index}].quantity`, item.quantity.toString());
        if (item.notes) {
          formData.append(`Items[${index}].notes`, item.notes);
        }
        formData.append(`Items[${index}].productId`, realProductData.id.toString());
        item.orderItemVariations?.forEach((order, orderIndex) => {
          const hasValidChoice = order.choices?.some(
            (choice) => choice.choiceId || choice.inputValue || choice.image
          );
          if (order.variationId && hasValidChoice) {
            formData.append(`Items[${index}].orderItemVariations[${orderIndex}].variationId`, order.variationId);
          }
          order.choices?.forEach((choice, choiceIndex) => {
            if (choice.inputValue) {
              formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].inputValue`, choice.inputValue);
            }
            if (choice.choiceId) {
              formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].choiceId`, choice.choiceId);
            }
            if (choice.image) {
              formData.append(`Items[${index}].orderItemVariations[${orderIndex}].choices[${choiceIndex}].image`, choice.image);
            }
          })
        });
      });

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const response = await axiosClient.post(`/api/Order/Create/${shopId}`, formData);

      if (response.status === 200) {
        // Clear the cart items
        items.forEach(item => clearItemFromCart(item.id));
        // Display success toast
        toast.success(<Text as="b">{lang === 'ar' ? 'تم الطلب بنجاح' : 'Order placed successfully!'}</Text>);
        setOrderNote("");
        setCopone("");
        setDiscountValue(0);
        setDiscountType(0);
        const orderId = response.data.id;
        const orderNumber = response.data.orderNumber;
        const payUrl = response.data.payUrl;
        router.push(payUrl)
        if (orderNumber) {
          localStorage.setItem('orderNumber', orderNumber.toString());
        }
        if (orderId) {
          localStorage.setItem('orderId', orderId.toString());
        }
      } else {
        console.error('Error creating order:', response.data);
        toast.error(<Text as="b">Failed to place order. Please try again.</Text>);
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;

      if (serverMessage === "Insufficient stock for product no data. Available: 0, Requested: 1") {
        toast.error(
          <Text as="b">
            {lang === 'ar' ? 'الكمية المطلوبة غير متوفرة في المخزون' : 'Insufficient stock for the requested product.'}
          </Text>
        );
      } else {
        toast.error(
          <Text as="b">
            {serverMessage || (lang === 'ar' ? 'حدث خطأ أثناء تنفيذ الطلب' : 'An error occurred. Please try again later.')}
          </Text>
        );
      }

      console.error('Error during order submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = !selectedAddressId || !localStorage.getItem('accessToken') || total === 0 || locationOutOfZone;

  const toggleLoginModal = () => {
    setLoginModal(true);
  };
  const handleAddNewAddress = () => {
    const phoneNumber = localStorage.getItem('phoneNumber');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedAddress({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          phoneNumber: phoneNumber,
        });
        setIsOpen(true);
      },
      (error) => {
        console.error('Error fetching user location:', error);
        setSelectedAddress({
          lat: 30.023173855111207,
          lng: 31.185028997638923,
          phoneNumber: phoneNumber,
        });
        setIsOpen(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

  };
  const handleAddAddress = () => {
    const phoneNumber = localStorage.getItem('phoneNumber');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedAddress({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          phoneNumber: phoneNumber,
        });
        setIsAddressOpen(true);
      },
      (error) => {
        console.error('Error fetching user location:', error);
        setSelectedAddress({
          lat: 30.023173855111207,
          lng: 31.185028997638923,
          phoneNumber: phoneNumber,
        });
        setIsAddressOpen(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

  };


  return (
    <div className='w-[90%] mx-auto lg:mt-8 mt-24'>
      <FormProvider {...methods}>
        <form
          // @ts-ignore
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn(
            'isomorphic-form isomorphic-form mx-auto flex w-full max-w-[1536px] flex-grow flex-col @container [&_label.block>span]:font-medium',
            className
          )}
        >
          <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
            <div className="gap-4 border-muted @container @5xl:col-span-8 @5xl:border-e @5xl:pb-12 @5xl:pe-7 @6xl:col-span-7 @7xl:pe-12">
              <div className="flex flex-col gap-4 @xs:gap-4 @5xl:gap-7">
                <div>
                  <MapWithZones
                    initialLocation={userLocation}
                    onLocationChange={handleLocationChange}
                    zones={zones}
                  />
                  {/* <p>
                    Current Location: Latitude: {userLocation.lat}, Longitude: {userLocation.lng}
                  </p> */}
                  {addresses.length === 0 && (
                    <p className="text-red-700 font-bold mt-2">
                      {lang === 'ar' ? "يجب ان تضيف عنوان الطلب" : "You should add an address"}
                    </p>
                  )}
                </div>

                {/* Address selection via radio buttons */}
                <RadioGroup
                  value={selectedAddressId}
                  onChange={(val) => {
                    const selectedAddress = addresses.find((a) => a.id === val);
                    if (selectedAddress) {
                      handleAddressSelection(selectedAddress);
                    }
                  }}
                  className="grid grid-cols-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-2 col-span-full"
                >
                  {addresses.map((address) => (
                    <RadioGroup.Option key={address.id} value={address.id}>
                      {({ checked }) => (
                        <div
                          className={`px-1 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 w-full capitalize cursor-pointer rounded-lg transition duration-150 min-h-[90px] ${checked ? 'bg-mainColor text-white' : 'bg-gray-200'
                            }`}
                        >
                          {/* <p>{`Apartment No: ${address.apartmentNumber}, Street: ${address.street}`}</p>
                          <p>{`Floor: ${address.floor}, Directions: ${address.additionalDirections}`}</p> */}
                          <div className={cn('flex flex-col gap-2 max-w-full', className)}>
                            <span className={`px-3 py-2 rounded-lg transition duration-150 flex items-center gap-2 max-w-full`}>
                              {address.buildingType === 0 ? (
                                <Building className={`pt-1 ${checked ? 'text-white' : 'text-mainColor'}`} />
                              ) : address.buildingType === 1 ? (
                                <Home className={`pt-1 ${checked ? 'text-white' : 'text-mainColor'}`} />
                              ) : (
                                <BriefcaseBusiness className={`pt-1 ${checked ? 'text-white' : 'text-mainColor'}`} />
                              )}
                              <span className='whitespace-nowrap overflow-hidden  truncate max-w-[200px] sm:max-w-[80%]'>
                                {address.apartmentNumber}, {address.floor ? address.floor + ', ' : ''}
                                {address.street}
                              </span>
                            </span>
                            <p className={`px-6 ${checked ? 'text-white/80' : 'text-black/50'} text-sm font-bold sm:whitespace-nowrap sm:overflow-hidden sm:truncate max-w-full`}>
                              {/* {address.phoneNumber}
                              <br /> */}
                              {address.additionalDirections}
                            </p>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
                {locationOutOfZone && addresses.length != 0 && (
                  <p className="text-red-700 font-bold mt-2">
                    {lang === 'ar' ? "الموقع خارج نطاق التوصيل" : "Location is outside the delivery zones"}
                  </p>
                )}

                {!accessToken ? (
                  <button
                    type='button'
                    onClick={toggleLoginModal}
                    className="w-fit col-span-full large:self-start flex gap-1 items-center px-3 py-2 rounded-lg text-white border border-transparent hover:border-mainColor bg-mainColor hover:bg-transparent hover:text-mainColor  transition duation-150"
                  >
                    <Plus />
                    {t('Add-Address')}
                  </button>
                ) : (
                  // <Link href={`/${lang}/profile`}>
                  <button
                    type='button'
                    onClick={handleAddAddress}
                    className="w-fit col-span-full large:self-start flex gap-1 items-center px-3 py-2 rounded-lg text-white border border-transparent hover:border-mainColor bg-mainColor hover:bg-transparent hover:text-mainColor  transition duation-150"
                  >
                    <Plus />
                    {t('New-Address')}
                  </button>
                  // </Link>
                )}

                {/* <Link href={`/${lang}/profile`}>
                  <button
                    className="self-center col-span-full w-40 large:self-start flex gap-1 items-center px-3 py-2 rounded-lg text-white border border-transparent hover:border-mainColor bg-mainColor hover:bg-transparent hover:text-mainColor  transition duation-150"
                  >
                    <Plus />
                    {t('New-Address')}
                  </button>
                </Link> */}
                {/* <AddressInfo type="billingAddress" title="Billing Information" />

                <DifferentBillingAddress />

                {!sameShippingAddress && <AddressInfo type="shippingAddress" />}

                <OrderNote />

                <ShippingMethod />

                <PaymentMethod /> */}
              </div>
            </div>

            <OrderSummery lang={lang} isLoading={isLoading} isButtonDisabled={isButtonDisabled} onSummaryCalculated={(summary: any) => setSummary(summary)} fees={deliveryBerKelo}

              setSelectedId={setSelectedId}
              selectedId={selectedId}
            />
          </div>
        </form>
      </FormProvider>
      {loginModal && (
        <Modal isOpen={loginModal} setIsOpen={setLoginModal}>
          {currentModal === 'login' && (
            <Login
              setCurrentModal={setCurrentModal}
              onLogin={() => {
                setLoginModal(false);
                setUpdateAddresses(true);
              }}
            />
          )}
        </Modal>
      )}
      {/* <AnimatePresence mode="wait">
        {isOpen && <AddressModalWithLogin lang={lang} isOpen={isOpen} setIsOpen={setIsOpen} address={selectedAddress} />}
      </AnimatePresence> */}
      <AnimatePresence mode="wait">
        {isAddressOpen && <AddressModal lang={lang} isOpen={isAddressOpen} setIsOpen={setIsAddressOpen} address={selectedAddress} />}
      </AnimatePresence>
    </div>
  );
}