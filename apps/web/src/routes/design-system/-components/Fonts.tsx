export function Fonts() {
  return (
    <div className="space-y-10">
      <FontIntroduction
        name="Pretendard Variable"
        description="한글과 영문, 이름과 날짜가 함께 놓이는 화면의 기본 서체입니다. 서체를 늘리기보다 크기와 굵기의 차이로 제목, 본문, 보조 정보의 역할을 구분합니다."
      />
      <FontIntroduction
        name="고운바탕"
        description="메인 화면의 한글 슬로건에 사용합니다. 일반 정보에 쓰이는 산세리프와 구분해 학부의 메시지를 강조하며, 메뉴나 본문에는 확대 적용하지 않습니다."
        serif
      />
    </div>
  );
}

export function FontIntroduction({
  name,
  description,
  serif = false,
}: {
  name: string;
  description: string;
  serif?: boolean;
}) {
  return (
    <figure>
      <h4 className="max-w-[560px] text-base/[1.5] font-bold text-neutral-900">
        {name}
      </h4>
      <p className="mt-2 mb-4 max-w-[560px] text-md/[1.7] text-neutral-600">
        {description}
      </p>
      <div className="max-w-[560px] border border-neutral-200 px-5 py-6">
        <p
          lang="ko"
          className={`text-3xl/[1.6] break-keep font-normal max-sm:text-2xl/[1.6] ${serif ? '[font-family:Gowun_Batang,serif]' : ''}`}
        >
          창의와 지식을 융합하여
        </p>
      </div>
    </figure>
  );
}
