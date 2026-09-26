import { useRouter } from '@tanstack/react-router';
import { SquareCheck } from 'lucide-react';
import { useState } from 'react';
import AlertDialog from '@/components/ui/AlertDialog';
import Button from '@/components/ui/Button';
import { toast, toastError } from '@/components/ui/sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { api } from '@/utils/api';

interface AdminFeaturesProps {
  selectedIds: Set<number>;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export default function AdminFeatures({
  selectedIds,
  isEditMode,
  toggleEditMode,
}: AdminFeaturesProps) {
  const { localizedPath } = useLanguage();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUnpinDialog, setShowUnpinDialog] = useState(false);

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      await api.delete('v2/notice', {
        json: { idList: Array.from(selectedIds) },
      });

      toast.success('선택한 공지를 삭제했습니다.');
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
    setShowDeleteDialog(false);
  };

  const handleBatchUnpin = async () => {
    if (selectedIds.size === 0) return;

    try {
      await api.patch('v2/notice', {
        json: { idList: Array.from(selectedIds) },
      });

      toast.success('선택한 공지를 고정 해제했습니다.');
      router.invalidate();
    } catch (error) {
      toastError(error);
    }
    setShowUnpinDialog(false);
  };

  return (
    <>
      <div className="mt-12 flex">
        {isEditMode && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 type-meta text-neutral-500">
              <SquareCheck />
              <span className="tracking-wide">
                {selectedIds.size}개 게시물 선택
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={selectedIds.size === 0}
              onClick={() => setShowDeleteDialog(true)}
            >
              일괄 삭제
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={selectedIds.size === 0}
              onClick={() => setShowUnpinDialog(true)}
            >
              일괄 고정 해제
            </Button>
          </div>
        )}
        <div className="ml-auto flex items-center gap-3">
          <Button
            variant={isEditMode ? 'primary' : 'secondary'}
            onClick={toggleEditMode}
          >
            {isEditMode ? '완료' : '편집'}
          </Button>
          {isEditMode ? (
            <Button variant="primary" disabled>
              새 게시물
            </Button>
          ) : (
            <Button
              variant="primary"
              as="link"
              to={localizedPath('/community/notice/create')}
            >
              새 게시물
            </Button>
          )}
        </div>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description={`선택한 공지 ${selectedIds.size}개를 삭제하시겠습니까?\n되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleBatchDelete}
      />

      <AlertDialog
        open={showUnpinDialog}
        onOpenChange={setShowUnpinDialog}
        description={`선택한 공지 ${selectedIds.size}개를 고정 해제하시겠습니까?`}
        confirmText="고정 해제"
        onConfirm={handleBatchUnpin}
      />
    </>
  );
}
