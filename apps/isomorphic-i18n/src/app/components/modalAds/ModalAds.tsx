'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import MOBILEAD from '@public/assets/MOBILE-AD.webp';
import PcAD from '@public/assets/PC -AD.webp';
import { useRouter } from "next/navigation";

export default function AutoModal() {
    const [showModal, setShowModal] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const alreadyCreated = localStorage.getItem('store_created');
        if (alreadyCreated === 'true') {
            setDisabled(true);
            return;
        }
    
        const firstTimeout = setTimeout(() => {
            setShowModal(true);
    
            const interval = setInterval(() => {
                setShowModal(true);
            }, 120000);
    
            return () => clearInterval(interval);
        }, 30000);
    
        return () => clearTimeout(firstTimeout);
    }, []);
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    
        return () => {
            document.body.style.overflow = 'auto'; 
        };
    }, [showModal]);
    
    

    const handleCreateStore = () => {
        localStorage.setItem('store_created', 'true');
        setShowModal(false);
        setDisabled(true);
        window.open("https://ordrat.com/ar/%D8%A7%D9%84%D8%AA%D8%B3%D8%B9%D9%8A%D8%B1", "_blank");
    };

    const handleClose = () => {
        setShowModal(false);
        setDisabled(false);
    };

    if (disabled) return null;

    return (
        <>
            {showModal && (
                <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 md:flex hidden justify-center items-center z-[9999]">
                        <div className="bg-white relative rounded-lg shadow-xl w-[500px] h-[550px] text-center">
                            <div className="w-[500px] h-[500px] rounded-t-lg">
                                <Image src={PcAD} alt="PcAD" className="w-full h-full rounded-t-lg" />
                            </div>
                            <div className="flex justify-between items-center gap-5 mt-2 mx-2">
                                <button
                                    onClick={handleCreateStore}
                                    className="bg-[#E84654] font-medium w-1/2 py-2 text-white rounded-lg"
                                >
                                    أنشئ متجرك الإلكتروني الآن

                                </button>
                                <button
                                    onClick={handleClose}
                                    className="bg-[#003049] w-1/2 py-2 font-medium text-white rounded-lg"
                                >
                                    اغلاق
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* للموبايل */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex md:hidden justify-center items-center z-[9999]">
                    <div className="bg-white relative rounded-lg shadow-xl w-[350px] h-[400px] text-center">
  <div className="w-[350px] h-[350px] rounded-t-lg">
    <Image src={PcAD} alt="MOBILEAD" className="w-full h-full rounded-t-lg" />
  </div>

  <div className="grid grid-cols-12 justify-between items-center gap-4 mt-2 px-4 w-full">
    <button
      onClick={handleCreateStore}
      className="bg-[#E84654] font-medium col-span-8 flex-1 py-2  text-sm text-white rounded-lg"
    >
      أنشئ متجرك الإلكتروني الآن
    </button>
    <button
      onClick={handleClose}
      className="bg-[#003049] flex-1 py-2 col-span-4 font-medium text-sm text-white rounded-lg"
    >
      اغلاق
    </button>
  </div>
</div>

                    </div>
                </>
            )}
        </>
    );
}
