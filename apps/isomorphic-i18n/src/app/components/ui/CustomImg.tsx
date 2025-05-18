'use client';

import React from 'react';

interface CustomImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  quality?: number;
}

const buildImageUrl = (src: string, width?: number, quality?: number) => {
  if (src.startsWith('http')) return src;
  if (src.endsWith('.svg')) return `https://cdn.ordrat.com${src}`;
  return `https://cdn.ordrat.com${src}?w=${width || 500}&q=${quality || 75}`;
};

const CustomImg: React.FC<CustomImgProps> = ({
  src,
  quality,
  className = '',
  alt = '',
  ...rest
}) => {
  const finalSrc = buildImageUrl(src, quality);

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={` ${className}`}
      {...rest}
    />
  );
};

export default CustomImg;
