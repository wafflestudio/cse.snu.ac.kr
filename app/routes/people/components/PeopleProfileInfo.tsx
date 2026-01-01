import type { LucideIcon } from 'lucide-react';
import { Globe, Mail, MapPin, PhoneCall, Printer } from 'lucide-react';
import ProfileImage from '~/routes/people/components/PeopleProfileImage';

interface PeopleProfileInfoItem {
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
    <div className="relative mb-8 sm:float-right">
      <ProfileImage imageURL={imageURL} />

      <div className="mt-5 flex flex-col gap-[9px] bg-white text-sm font-medium text-neutral-600">
        {items.map((item, idx) => (
          <ProfileInfoRow key={`${item.icon}-${idx}`} {...item} />
        ))}
      </div>
    </div>
  );
}

function ProfileInfoRow({ icon, label, href }: PeopleProfileInfoItem) {
  const hasLabel = typeof label === 'string' && label.length > 0;
  const Icon = ICONS[icon];

  return (
    <div className="flex items-center gap-[6px] break-all">
      {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
      {href ? (
        <a
          target={href.startsWith('http') ? '_blank' : undefined}
          href={href}
          className="text-link hover:underline"
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {label}
        </a>
      ) : (
        <p>{hasLabel ? label : '-'}</p>
      )}
    </div>
  );
}
