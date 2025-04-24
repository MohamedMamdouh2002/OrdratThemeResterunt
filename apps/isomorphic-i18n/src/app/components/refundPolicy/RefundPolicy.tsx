'use client';

import React from 'react';
import { useTranslation } from '@/app/i18n/client';

type PolicySection = {
  id: string;
  title: string;
  description: string;
  termType: number;
};

export default function RefundPolicy({
  lang,
  policy,
}: {
  lang?: string;
  policy: PolicySection | null;
}) {
  const { t } = useTranslation(lang!, 'policy');

  if (!policy) {
    return (
      <div className="text-center text-gray-500 mt-10">
        {lang === 'ar'
          ? 'لا توجد سياسة استرداد حالياً'
          : 'No refund policy available at the moment.'}
      </div>
    );
  }

  return (
    <div className="w-5/6 sm:w-8/12 mx-auto mb-10 lg:mt-0 mt-24">
      <div className="mt-10">
        <h2 className="text-3xl font-medium mb-8 text-center">{policy.title}</h2>
        <div className="mt-2 overflow-hidden text-base font-medium text-[#2b2b2b]">
          {policy.description?.split(/(<ul>.*?<\/ul>|<ol>.*?<\/ol>)/s).map((part, index) => {
            if (part.includes('<ul>')) {
              const listItems = part.match(/<li.*?>(.*?)<\/li>/gs) || [];
              return (
                <ul key={index} className="space-y-2 mt-4 list-disc list-inside">
                  {listItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-mainColor text-2xl">•</span>
                      <span
                        className="font-medium [&>strong]:font-bold [&>u]:underline [&>span]:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: item.replace(/<\/?li.*?>/g, '') }}
                      />
                    </li>
                  ))}
                </ul>
              );
            } else if (part.includes('<ol>')) {
              const listItems = part.match(/<li.*?>(.*?)<\/li>/gs) || [];
              return (
                <ol key={index} className="space-y-2 mt-4 list-decimal list-inside">
                  {listItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-mainColor text-xl">{i + 1}.</span>
                      <span
                        className="font-medium [&>strong]:font-bold [&>u]:underline [&>span]:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: item.replace(/<\/?li.*?>/g, '') }}
                      />
                    </li>
                  ))}
                </ol>
              );
            } else {
              return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            }
          })}
        </div>
      </div>
    </div>
  );
}
