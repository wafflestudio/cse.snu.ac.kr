export function Fonts() {
  return (
    <div className="max-w-[960px] space-y-4">
      <FontIntroduction
        name="Pretendard Variable"
        description="한글과 영문, 이름과 날짜가 함께 놓이는 화면의 기본 서체입니다. 서체를 늘리기보다 크기와 굵기의 차이로 제목, 본문, 보조 정보의 역할을 구분합니다."
        weights="Regular 400 · Medium 500 · Semibold 600 · Bold 700"
      />
      <FontIntroduction
        name="고운바탕"
        description="메인 화면의 한글 슬로건에 사용합니다. 일반 정보에 쓰이는 산세리프와 구분해 학부의 메시지를 강조하며, 메뉴나 본문에는 확대 적용하지 않습니다."
        weights="Regular 400"
        serif
      />
    </div>
  );
}

export function FontIntroduction({
  name,
  description,
  weights,
  serif = false,
}: {
  name: string;
  description: string;
  weights: string;
  serif?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-8 py-6 max-sm:grid-cols-1 max-sm:gap-4">
      <p
        lang="ko"
        className={`text-3xl/[1.6] break-keep font-normal max-sm:text-2xl/[1.6] ${serif ? '[font-family:Gowun_Batang,serif]' : ''}`}
      >
        창의와 지식을 융합하여
      </p>
      <div>
        <h3 className="text-base/[1.5] font-semibold">{name}</h3>
        <p className="mt-3 text-md/[1.85] text-neutral-600">{description}</p>
        <p className="mt-3 text-xs/[1.7] text-neutral-500">{weights}</p>
      </div>
    </div>
  );
}
