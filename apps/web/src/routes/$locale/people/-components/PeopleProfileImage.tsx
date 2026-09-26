import Image from '@/components/ui/Image';

export default function ProfileImage({
  imageURL,
  alt = '대표 이미지',
}: {
  imageURL: string | null;
  alt?: string;
}) {
  return (
    <Image
      alt={alt}
      src={imageURL}
      width={200}
      sizes="200px"
      height={250}
      // 사진 틀은 200·4:5 고정 — 사진은 채워 자르고, 없으면 같은 틀에 로고(/design-system#unique).
      className="aspect-4/5 w-50 shrink-0 object-cover"
      loading="lazy"
    />
  );
}
