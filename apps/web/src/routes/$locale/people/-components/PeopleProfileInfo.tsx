import type { LucideIcon } from 'lucide-react';
import { Globe, Mail, MapPin, PhoneCall, Printer } from 'lucide-react';
import ProfileImage from '@/routes/$locale/people/-components/PeopleProfileImage';

export interface PeopleProfileInfoItem {
  icon: string;
  label?: string | null;
  href?: string | null;
}

interface PeopleProfileInfoProps {
  imageURL: string | null;
  items: PeopleProfileInfoItem[];
}

const ICONS: Record<string, LucideIcon> = {
  distance: MapPin,
  phone_in_talk: PhoneCall,
  print: Printer,
  mail: Mail,
  captive_portal: Globe,
};

export default function PeopleProfileInfo({
  imageURL,
  items,
}: PeopleProfileInfoProps) {
  return (
    // 인물 상세의 왼쪽: 사진과 그 아래 아이콘 연락처(/design-system#unique). 비어 있는 항목은 그리지 않는다.
    <div className="flex shrink-0 flex-col">
      <ProfileImage imageURL={imageURL} />

      <div className="mt-4 flex flex-col gap-4 type-meta text-neutral-600">
        {items
          .filter((item) => item.label)
          .map((item, idx) => (
            <ProfileInfoRow key={`${item.icon}-${idx}`} {...item} />
          ))}
      </div>
    </div>
  );
}

function ProfileInfoRow({ icon, label, href }: PeopleProfileInfoItem) {
  const Icon = ICONS[icon];

  return (
    // 주소 등은 여러 줄이 된다 — 아이콘 높이(1.2em)가 줄높이와 같아 items-start 면 첫 줄 가운데에 선다.
    <div className="flex items-start gap-1 wrap-anywhere">
      {Icon && <Icon className="shrink-0" />}
      {href ? (
        <a
          target={href.startsWith('http') ? '_blank' : undefined}
          href={href}
          className="text-link underline underline-offset-2"
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      ) : (
        <p>{label}</p>
      )}
    </div>
  );
}
