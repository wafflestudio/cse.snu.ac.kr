import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import LoginVisible from '@/components/feature/auth/LoginVisible';
import SelectionTitle from '@/components/feature/selection/SelectionTitle';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import HTMLViewer from '@/components/ui/HTMLViewer';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import type { Club } from '@/types/api';
import { api } from '@/utils/api';
import type { ProcessedHtml } from '@/utils/csp';

interface ClubDetailsProps {
  club: {
    id: number;
    imageURL: string | null;
    ko: ProcessedClub;
    en: ProcessedClub;
  };
  locale: 'ko' | 'en';
}

type ProcessedClub = Omit<Club, 'description'> & { description: ProcessedHtml };

export default function ClubDetails({ club, locale }: ClubDetailsProps) {
  const router = useRouter();
  const { localizedPath } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const oppositeLocale = locale === 'ko' ? 'en' : 'ko';
  // 사진은 동아리에 하나뿐이라 언어와 무관하게 최상위에서 온다.
  const image = club.imageURL
    ? ({
        src: club.imageURL,
        width: 320,
        height: 200,
        mobileFullWidth: true,
      } as const)
    : undefined;

  const handleDelete = async () => {
    try {
      await api.delete(`v2/about/student-clubs/${club.id}`);

      setShowDeleteDialog(false);
      toast.success('동아리를 삭제했습니다.');
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div>
        <div className="justify-between sm:flex items-start">
          <SelectionTitle
            title={club[locale].name}
            subtitle={club[oppositeLocale].name}
            animateKey={club[locale].name}
          />
          <LoginVisible allow="ROLE_STAFF">
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowDeleteDialog(true)}
              >
                삭제
              </Button>
              <Button
                as="link"
                to={localizedPath(
                  `/about/student-clubs/edit?selected=${club.id}`,
                )}
                variant="secondary"
                size="md"
              >
                편집
              </Button>
            </div>
          </LoginVisible>
        </div>
        <HTMLViewer html={club[locale].description} image={image} />
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="동아리를 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </>
  );
}
