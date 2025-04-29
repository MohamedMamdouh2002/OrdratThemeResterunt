import SeccessPage from '@/app/components/successPage/SeccessPage';
import SessionGuard from '@/app/components/ui/hoc/layout/SessionGuard';
import { metaObject } from '@/config/site.config';
import React from 'react';
export async function generateMetadata({ params }: { params: { lang: string } }) {
    const lang = params.lang;

    return {
        ...metaObject(
            lang === 'ar'
                ? 'شكراً لك | تم إرسال طلبك بنجاح'
                : 'Thank You | Your Order Has Been Placed Successfully',
            lang,
            undefined,
            lang === 'ar'
                ? 'نشكرك على طلبك. سنقوم بمعالجته وإعلامك بالتحديثات قريبًا.'
                : 'Thank you for your order. We will process it and keep you updated shortly.'
        ),
    };
}

function Page({ params }: { params: { lang: string } }) {
    const { lang } = params;

    return (
        <SessionGuard>
            <SeccessPage lang={lang} />
        </SessionGuard>
    );
}

export default Page;
