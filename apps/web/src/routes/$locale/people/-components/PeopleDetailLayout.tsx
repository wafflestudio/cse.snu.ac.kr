import type { ReactNode } from 'react';
import PeopleProfileInfo, {
  type PeopleProfileInfoItem,
} from './PeopleProfileInfo';

// 교수·역대 교수·행정직원 상세가 같은 짜임(/design-system#unique):
// 왼쪽 사진 + 아이콘 연락처, 오른쪽 섹션. 모바일은 사진·연락처가 위.
export default function PeopleDetailLayout({
  imageURL,
  contacts,
  children,
}: {
  imageURL: string | null;
  contacts: PeopleProfileInfoItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
      <PeopleProfileInfo imageURL={imageURL} items={contacts} />
      <div className="flex min-w-0 flex-col">{children}</div>
    </div>
  );
}
