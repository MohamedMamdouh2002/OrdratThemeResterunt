import OrderView from '@/app/shared/ecommerce/order/order-view'
import React from 'react'
import SessionGuard from '@/app/components/ui/hoc/layout/SessionGuard';

function OrderId({
  params: { lang },
}: {
  params: {
    lang: string;
  };
})  {
  return <>
  <SessionGuard>
    <div className="w-5/6 mx-auto">
      <OrderView lang={lang}/>
    </div>
  </SessionGuard>
  </>
}

export default OrderId