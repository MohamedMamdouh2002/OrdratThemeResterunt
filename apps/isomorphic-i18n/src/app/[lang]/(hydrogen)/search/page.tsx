import Content from '@/app/components/search/Content';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('search'),
};

export default function Search({params: { lang },}: {params: {lang: string;};}) {
  return <Content lang={lang}/>;
}
