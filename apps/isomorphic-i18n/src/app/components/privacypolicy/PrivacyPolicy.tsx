'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n/client';
import axiosClient from '../fetch/api';
import { useUserContext } from '../context/UserContext';

type PolicySection = {
  id: string;
  title: string;
  description: string;
  termType: number;
};

function PrivacyPolicy({ lang }: { lang?: string }) {
  const { t } = useTranslation(lang!, 'policy');
  const [policy, setPolicy] = useState<PolicySection | null>(null);
  const { shopId } = useUserContext();

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!shopId) return;
      try {
        const response = await axiosClient.get(`/api/Term/GetByShopIdAndType/${shopId}?termType=0`, {
          headers: { 'Accept-Language': lang },
        });
        setPolicy(response.data);
      } catch (error) {
        console.error('Error fetching policy:', error);
      }
    };

    setPolicy(null);
    fetchPolicy();
  }, [lang, shopId]);

  if (!policy) {
    return <div className="text-center text-gray-500 mt-10">...</div>;
  }

  return (
    <div className="w-5/6 sm:w-8/12 mx-auto mb-10">
      <div className="mt-10">
        <h2 className="text-3xl font-medium mb-8 text-center">{policy.title}</h2>
        <div className="mt-2 overflow-hidden text-base font-medium text-[#2b2b2b]">
          {policy.description.split(/(<ul>.*?<\/ul>|<ol>.*?<\/ol>)/s).map((part, index) => {
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
                <ul key={index} className="space-y-2 mt-4 list-decimal list-inside">
                  {listItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-mainColor text-xl">{i + 1}.</span>
                      <span
                        className="font-medium [&>strong]:font-bold [&>u]:underline [&>span]:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: item.replace(/<\/?li.*?>/g, '') }}
                      />
                    </li>
                  ))}
                </ul>
              );
            } else {
              return (
                <div key={index} className="" dangerouslySetInnerHTML={{ __html: part }} />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
