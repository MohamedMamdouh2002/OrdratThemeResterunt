"use client";

import Image from 'next/image';

const customLoader = ({ src, width, quality }: any) => {
  if (src.startsWith('http')) {
    return src;
  }
  if (src.endsWith('.svg')) {
    return `https://cdn.ordrat.com${src}`;
  }
  return `https://cdn.ordrat.com${src}?w=${width}&q=${quality || 75}`;
};

const CustomImage = (props: any) => {
  return <Image loader={customLoader} {...props} />;
};

export default CustomImage;
