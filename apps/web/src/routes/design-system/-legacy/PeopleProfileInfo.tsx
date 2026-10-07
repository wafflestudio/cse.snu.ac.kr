import type { LucideIcon } from 'lucide-react';
import { Globe, Mail, MapPin, PhoneCall, Printer } from 'lucide-react';
import Image from '@/components/ui/Image';
import { stay } from '../-components/sample';

// d1baf83c 의 apps/web/src/routes/$locale/people/-components/PeopleProfileInfo.tsx(와 PeopleProfileImage.tsx)를
// 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다). 교수 상세 왼쪽의 사진과 연락처.
// 링크는 이동하지 않는 <a href="#"> 로 바꿨고, 바깥 float 은 견본 칸에 맞춰 뺐다. 사진 틀 크기(200×264)는 예전 width·height 값.
// 예전 링크 색 --color-link 는 #3c7be4 였다(지금 토큰은 #2867cf). 밑줄은 호버 때만.

interface LegacyProfileInfoItem {
  icon: string;
  label?: string | null;
  href?: string | null;
}

const ICONS: Record<string, LucideIcon> = {
  distance: MapPin,
  phone_in_talk: PhoneCall,
  print: Printer,
  mail: Mail,
  captive_portal: Globe,
};

export function LegacyPeopleProfileInfo({
  imageURL,
  items,
}: {
  imageURL: string | null;
  items: LegacyProfileInfoItem[];
}) {
  return (
    <div className="relative">
      <Image
        alt="대표 이미지"
        src={imageURL}
        width={200}
        sizes="200px"
        height={264}
        className="h-66 w-50 object-contain drop-shadow-[0px_0px_4px_rgba(0,0,0,0.15)]"
      />

      <div className="mt-5 flex flex-col gap-[9px] bg-white text-sm font-medium text-neutral-600">
        {items.map((item, idx) => (
          <ProfileInfoRow key={`${item.icon}-${idx}`} {...item} />
        ))}
      </div>
    </div>
  );
}

function ProfileInfoRow({ icon, label, href }: LegacyProfileInfoItem) {
  const hasLabel = typeof label === 'string' && label.length > 0;
  const Icon = ICONS[icon];

  return (
    <div className="flex items-center gap-[6px] break-all">
      {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
      {href ? (
        <a href="#" onClick={stay} className="text-[#3c7be4] hover:underline">
          {label}
        </a>
      ) : (
        <p>{hasLabel ? label : '-'}</p>
      )}
    </div>
  );
}
