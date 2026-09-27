import type { MainNews } from '@/types/api';
import NewsCard from './NewsCard';

export default function NewsCarouselMobile({ news }: { news: MainNews[] }) {
  return (
    // 초점 링(카드 밖 4px)이 스크롤 영역에 잘리지 않게 4px 여유를 두고 음수 여백으로 제자리.
    <div className="no-scrollbar -mx-1 -my-1 mr-4 flex gap-5 overflow-auto p-1">
      {news.map((news) => (
        <NewsCard key={news.id} news={news} />
      ))}
    </div>
  );
}
