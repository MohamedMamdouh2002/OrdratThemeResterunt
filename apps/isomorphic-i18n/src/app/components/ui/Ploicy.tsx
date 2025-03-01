'use client'
import React from 'react'
import { useTranslation } from '@/app/i18n/client';
import Title from '../ui/title/Title';

type props = {
  title: string,
  description: string

}

function Policy({ lang, sections }: { lang?: string, sections?: props }) {
  const { t } = useTranslation(lang!, 'policy');

  if (!sections?.description) return null;

  const contentParts = sections.description.split(/(<ul>.*?<\/ul>)/s); 
  return (
    <div className="">
      {/* <Title className="text-center mt-20 text-[#404040]" title={t('privacypolicy')} /> */}

      {sections && (
        <div className="mt-10">
          <h2 className="text-2xl font-medium mb-2">{sections.title}</h2>
          <div className="mt-2 overflow-hidden text-base font-medium text-[#2b2b2b]">
            {contentParts.map((part, index) => {
              if (part.startsWith('<ul>')) {
                const listItems = part.match(/<li>(.*?)<\/li>/g) || [];
                return (
                  <ul key={index} className="space-y-2 mt-4">
                    {listItems.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-mainColor text-2xl">•</span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/<\/?li>/g, '') }} />
                      </li>
                    ))}
                  </ul>
                );
              } else {
                return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Policy;
