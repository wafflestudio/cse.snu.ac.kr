import { createFileRoute, redirect } from '@tanstack/react-router';

// `/academics/undergraduate`·`/academics/graduate` 에는 자기 화면이 없다(카테고리 카드는 하위 카드를
// 펼칠 뿐). 주소로 들어오면 빈 화면 대신 첫 하위 화면인 안내로 보낸다.
export const Route = createFileRoute('/$locale/academics/$studentType/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$locale/academics/$studentType/guide',
      params,
      statusCode: 301,
    });
  },
});
