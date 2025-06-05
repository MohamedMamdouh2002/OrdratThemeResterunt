'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import sliderPhoto from '@public/assets/Web-00h-1.jpg'
import sliderPhoto1 from '@public/assets/9175da.jpg'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { shopId } from '@/config/shopId';
import { API_BASE_URL } from '@/config/base-url';
import { useUserContext } from '../context/UserContext';
import Link from 'next/link';
import CustomImage from '../ui/CustomImage';
type images={
    img:any
}
const Photos=[
    {img:sliderPhoto},
    {img:sliderPhoto1},
  
]
type Banner = {
  id?: string;
  bannerUrl: string;
  actionType?: number;
  actionString?: string;
};

type MainSliderProps = {
  banner: Banner[];
};

function MainSlider({ banner }: MainSliderProps) {
  // const [banner, setbanner] = useState<Banner[]>([]);
  const { shopId } = useUserContext();

    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const fetchOrder = async () => {
    //       try {
    //         const response = await fetch(
    //           `${API_BASE_URL}/api/Banner/GetAll/${shopId}`,
    //           {
    //             method: 'GET',
    //           }
    //         );
    //         if (!response.ok) {
    //           throw new Error('Failed to fetch order');
    //         }
    //         const data:Banner[] = await response.json();
    
    //         setbanner(data);
    //       } catch (error) {
    //         console.error('Error fetching order:', error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };
    
    //     fetchOrder();
    //   }, []);
    const settings = {
        className: "",
        dots: true,
        arrows:false,
        speed: 500,
        autoplay: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
      };
  return <>
<div className="slider-container w-5/6 lg:w-[750px] cursor-grab border-none mt-10 mx-auto relative">
    <Slider {...settings}>
        {banner && banner.map((photo:Banner) => (
            <Link href={photo?.actionString as string} target='_blank' key={photo.id}>
                <CustomImage 
                    width={800}
                    height={500}
                    src={photo.bannerUrl} 
                    alt='slider' 
                    className='h-[150px] w-full sm:h-[300px] overflow-hidden image rounded-xl px-1 pointer-events-none' 
                />
            </Link>
        ))}
    </Slider>
</div>

  </>
}

export default MainSlider