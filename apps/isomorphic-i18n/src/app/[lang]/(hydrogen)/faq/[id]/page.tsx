import FAQSectionContent from '@/app/components/faqSectionContent/FAQSectionContent';

export default function Id({
  params: { lang },
}: {
  params: {
    lang?: string;
  };
}) {
  return (
    <>
      <FAQSectionContent lang={lang?lang:'en'}/>
    </>
  );
}
