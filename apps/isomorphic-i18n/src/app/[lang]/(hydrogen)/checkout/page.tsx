import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CheckoutPageWrapper from '@/app/shared/ecommerce/checkout';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Checkout'),
};

export default function CheckoutPage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  return (
    <>
      {/* <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} /> */}
      <CheckoutPageWrapper lang={lang} />
    </>
  );
}
