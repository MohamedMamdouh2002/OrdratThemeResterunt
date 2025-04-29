import { Inter, Lexend_Deca, Noto_Sans_Arabic, Tajawal } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend',
});
export const NotoSansArabic =Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-',
});


export const elTajawal = Tajawal({
  weight: ['400', '500', '700', '800'], 
  subsets: ['arabic'], 
  variable: '--font-el-tajawal', 
  preload: true,
  fallback: ['Arial', 'sans-serif'], 
});
