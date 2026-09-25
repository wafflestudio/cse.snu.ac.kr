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
      height={264}
      className="object-contain"
      loading="lazy"
    />
  );
}
