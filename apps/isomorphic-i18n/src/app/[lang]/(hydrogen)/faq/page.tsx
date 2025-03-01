import FAQBody from '@/app/components/faqBody/FAQBody';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('faq'),
};

export default function FAQ({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return <FAQBody lang={lang}/>;
}
