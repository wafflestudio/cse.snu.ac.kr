import { createFileRoute } from '@tanstack/react-router';

import Header from '@/components/layout/Header';
import Image from '@/components/ui/Image';
import ImageModal from '@/components/ui/ImageModal';
import { BASE_URL } from '@/constants/api';
import { useLanguage } from '@/hooks/useLanguage';
import type { MainResponse } from '@/types/api/v2';
import type { ImageModal as ImageModalData } from '@/types/api/v2/admin';
import { SITE_NAME } from '@/utils/metadata';
import backgroundImg from './assets/background.avif';
import GraphicSection from './components/GraphicSection';
import ImportantSection from './components/ImportantSection';
import LinkSection from './components/LinkSection';
import NoticeSection from './components/NoticeSection';
import NewsSection from './components/news/NewsSection';

const META = {
  ko: {
    title: SITE_NAME.ko,
    description:
      '창의와 지식을 융합하여 컴퓨터 기술의 진화를 선도합니다. 서울대학교 컴퓨터공학부는 세계적 수준의 교육과 연구를 통해 미래 IT 인재를 양성합니다.',
  },
  en: {
    title: 'Dept. of Computer Science and Engineering, SNU',
    description:
      'Leading the evolution of computing technology through creativity and knowledge integration. The Department of CSE at Seoul National University cultivates future IT talent through world-class education and research.',
  },
};

function MainPage() {
  const loaderData = Route.useLoaderData();

  const { locale } = useLanguage();
  const meta = META[locale];
  const { imageModal } = loaderData;

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />

      <div className="relative w-full">
        <Header />
        <div className="absolute left-0 right-0 top-0 -z-50 hidden aspect-1336/800 sm:block">
          <Image
            src={backgroundImg}
            alt=""
            // 데스크톱 히어로 배경 = LCP 요소(모바일과 동일 asset → 요청 1회). high로 우선 로드.
            fetchPriority="high"
            className="object-cover w-full h-full"
          />
        </div>
        <GraphicSection />
        <NewsSection mainNews={loaderData.slides} />
        <ImportantSection importantList={loaderData.importants} />
        <NoticeSection allMainNotice={loaderData.notices} />
        <LinkSection />
      </div>
      {imageModal && (
        <ImageModal
          id={imageModal.id}
          imageSrc={imageModal.imageUrl}
          externalLink={imageModal.externalLink}
        />
      )}
    </>
  );
}

export const Route = createFileRoute('/$locale/')({
  loader: async () => {
    const [mainRes, modalRes] = await Promise.all([
      fetch(`${BASE_URL}/v2`),
      fetch(`${BASE_URL}/v2/image-modal`),
    ]);
    if (!mainRes.ok) throw new Error('Failed to fetch main data');

    const main = (await mainRes.json()) as MainResponse;

    let imageModal: ImageModalData | null = null;
    if (modalRes.ok) {
      const [modal] = (await modalRes.json()) as ImageModalData[];
      const isActive =
        modal &&
        (!modal.displayUntil ||
          new Date(modal.displayUntil).getTime() > Date.now());
      imageModal = isActive ? modal : null;
    }

    return { ...main, imageModal };
  },
  component: MainPage,
});
