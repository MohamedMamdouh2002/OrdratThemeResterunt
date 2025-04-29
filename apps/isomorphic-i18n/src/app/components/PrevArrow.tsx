import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface PrevArrowProps {
    onClick: () => void;
    lang: string; // إضافة خاصية اللغة
}

const PrevArrow: React.FC<PrevArrowProps> = ({ onClick, lang }) => {    
    return (
        <div className="absolute -end-4 top-[44%] shadow-lg text-mainColor bg-white w-10 h-10 hidden lg:flex justify-center items-center rounded-full z-10 cursor-pointer" onClick={onClick}>
                    <FontAwesomeIcon icon={lang === 'ar' ? faAngleRight : faAngleLeft as any} />

        </div>
    );
};

export default PrevArrow;
