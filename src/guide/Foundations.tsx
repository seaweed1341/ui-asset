import { cn } from '../lib/cn';
import { colorGroups, semanticTokens, typeTokens, type ColorToken } from './tokens';
import { SectionTitle, useCopy, useCssVar } from './ui';

function Swatch({ token }: { token: ColorToken }) {
  const value = useCssVar(token.cssVar);
  const { copied, copy } = useCopy();
  const ref = `var(--${token.cssVar})`;
  return (
    <li>
      <button
        type="button"
        onClick={() => copy(ref)}
        title={`${ref} 복사`}
        className="flex w-full items-center gap-3 py-1.5 text-left hover:bg-neutral-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70"
      >
        <span
          aria-hidden
          className="size-12 shrink-0 ring-1 ring-inset ring-neutral-20"
          style={{ backgroundColor: ref }}
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-body-4 font-bold text-neutral-100">{token.tw}</span>
            <span className="font-mono text-[12px] text-neutral-70">{value.toUpperCase()}</span>
          </span>
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate font-mono text-[11px] text-neutral-70">--{token.cssVar}</span>
            <span aria-live="polite" className={cn('shrink-0 text-body-5 text-primary-70', copied !== ref && 'invisible')}>
              복사됨
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}

export function Colors() {
  return (
    <section id="color" aria-labelledby="color-title" className="scroll-mt-36 md:scroll-mt-6 border-t border-neutral-100 py-14">
      <SectionTitle id="color" title="Color">
        Figma의 Theme 변수 24개를 그대로 옮겼습니다. 칸을 누르면 CSS 변수가 복사됩니다. Tailwind에서는{' '}
        <code className="font-mono text-[13px] text-neutral-100">bg-neutral-70</code>처럼 씁니다.
      </SectionTitle>

      <div className="flex flex-col gap-10">
        {colorGroups.map((g) => (
          <div key={g.name} className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
            <div>
              <h3 className="text-body-2 font-bold text-neutral-100">{g.name}</h3>
              <p className="mt-1 text-body-4 text-neutral-70">{g.description}</p>
            </div>
            <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {g.tokens.map((t) => (
                <Swatch key={t.cssVar} token={t} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h3 className="text-body-2 font-bold text-neutral-100">역할 토큰</h3>
        <p className="mt-1 max-w-xl text-body-4 text-neutral-70">
          Color 가이드 문서의 역할을 위 색상에 연결한 이름입니다. 값은 직접 갖지 않고 원시 색상을 참조합니다.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-body-5 text-neutral-70">
                <th className="py-2 pr-4 font-medium">토큰</th>
                <th className="py-2 pr-4 font-medium">참조</th>
                <th className="py-2 font-medium">쓰임</th>
              </tr>
            </thead>
            <tbody>
              {semanticTokens.map((s) => (
                <tr key={s.cssVar} className="border-b border-neutral-20">
                  <td className="py-2.5 pr-4 font-mono text-[13px] text-neutral-100">--{s.cssVar}</td>
                  <td className="py-2.5 pr-4">
                    <span className="inline-flex items-center gap-2 font-mono text-[12px] text-neutral-70">
                      <span
                        aria-hidden
                        className="size-3 rounded-full ring-1 ring-inset ring-neutral-40"
                        style={{ backgroundColor: `var(--${s.cssVar})` }}
                      />
                      --{s.ref}
                    </span>
                  </td>
                  <td className="py-2.5 text-body-4 text-neutral-70">{s.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function TypeRow({ tw, figma, sample, k }: { tw: string; figma: string; sample: string; k: string }) {
  const size = useCssVar(`font-size-${k}`);
  const lh = useCssVar(`font-line-height-${k}`);
  const weight = useCssVar(`font-weight-${k}`);
  const px = size.endsWith('rem') ? `${parseFloat(size) * 16}px` : size;
  return (
    <li className="grid items-baseline gap-2 border-b border-neutral-20 py-5 md:grid-cols-[200px_minmax(0,1fr)]">
      <div className="flex flex-col">
        <span className="font-mono text-[13px] text-neutral-100">{tw}</span>
        <span className="text-body-5 text-neutral-70">
          {figma}, {px} / {lh} / {weight}
        </span>
      </div>
      <p className={cn(tw, 'truncate text-neutral-100')}>{sample}</p>
    </li>
  );
}

export function Typography() {
  return (
    <section id="typography" aria-labelledby="typography-title" className="scroll-mt-36 md:scroll-mt-6 border-t border-neutral-100 py-14">
      <SectionTitle id="typography" title="Typography">
        서체는 Noto Sans 하나입니다. 제목은 Bold에 줄높이 130%, 본문은 Medium·Regular에 줄높이 140%입니다. 클래스 하나로
        크기, 줄높이, 자간, 굵기가 함께 적용됩니다.
      </SectionTitle>
      <ul className="border-t border-neutral-20">
        {typeTokens.map((t) => (
          <TypeRow key={t.key} k={t.key} tw={t.tw} figma={t.figma} sample={t.sample} />
        ))}
      </ul>
    </section>
  );
}
