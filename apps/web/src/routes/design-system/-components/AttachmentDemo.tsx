import Attachments from '@/components/ui/Attachments';
import brochureImage from '@/routes/$locale/about/overview/assets/brochure1.avif';

export function AttachmentDemo() {
  return (
    <div className="leading-[1.2] max-w-[560px] pt-3 [&>div]:m-0 [&>div]:max-w-full [&_a]:min-w-0 [&_a>span:last-child]:shrink-0 max-sm:[&>div]:pr-8">
      <Attachments
        files={[
          {
            id: 0,
            url: brochureImage,
            name: '학부 소개 브로슈어.avif',
            bytes: 83109,
          },
        ]}
      />
    </div>
  );
}
