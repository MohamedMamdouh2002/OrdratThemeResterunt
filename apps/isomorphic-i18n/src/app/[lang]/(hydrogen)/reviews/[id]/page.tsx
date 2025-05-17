import CreateRating from '@/app/components/createRating/CreateRating';
import { metaObject } from '@/config/site.config';


export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;

  return {
    ...metaObject(
      lang === 'ar'
        ? 'قيّم تجربتك معنا | نرحب بآرائك'
        : 'Rate Your Experience | We Value Your Feedback',
      lang,
      undefined,
      lang === 'ar'
        ? 'شاركنا رأيك في خدماتنا وساعدنا في تحسين تجربتك القادمة. تقييمك يهمنا.'
        : 'Tell us what you think about our services and help us improve. Your feedback matters.',
    ),
  };
}
export default function Page({
  params,
}: {
  params: {
    lang: string;
    id: string;
  };
}) {
  const { lang, id } = params;

  return <CreateRating lang={lang} id={id} />;
}