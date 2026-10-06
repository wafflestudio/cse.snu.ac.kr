import { useFormContext } from 'react-hook-form';
import LegacyButton from './Button';

// d1baf83c 의 apps/web/src/components/form/Action.tsx 를 옮긴 사본. DS 문서 전용(앱 코드에서 가져오지 않는다).
// 예전 폼 버튼 줄: 오류 문장을 모두 버튼 줄 옆에 목록으로 모으고, 취소·저장하기를 오른쪽에 나란히 둔다.
// 취소·삭제 확인창과 저장 처리는 뺐다(누르면 아무 일도 일어나지 않는다).
export default function LegacyAction() {
  return (
    <div className="relative mb-6 flex items-center justify-end gap-3">
      <ErrorMessages />
      <LegacyButton variant="secondary">취소</LegacyButton>
      <LegacyButton variant="neutral">저장하기</LegacyButton>
    </div>
  );
}

const ErrorMessages = () => {
  const {
    formState: { errors },
  } = useFormContext();

  const flattenErrors = (
    errorObj: unknown,
    visited = new WeakSet<object>(),
  ): string[] => {
    const messages: string[] = [];
    if (!errorObj || typeof errorObj !== 'object') return messages;
    if (visited.has(errorObj as object)) return messages;
    visited.add(errorObj as object);
    if ('message' in errorObj && errorObj.message) {
      messages.push(String(errorObj.message));
    }
    for (const [key, value] of Object.entries(errorObj)) {
      if (key === 'ref') continue;
      if (value && typeof value === 'object') {
        messages.push(...flattenErrors(value, visited));
      }
      if (messages.length > 5) break;
    }
    return messages;
  };

  const errorMessages = flattenErrors(errors);
  if (errorMessages.length === 0) return null;

  return (
    <ul className="space-y-1 text-sm font-normal text-red-600">
      {errorMessages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
};
