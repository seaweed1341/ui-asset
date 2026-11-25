import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { ComponentSection, docs } from './ComponentDocs';
import { Colors, Typography } from './Foundations';
import { Hero } from './Hero';

const nav = [
  { group: '시작', items: [{ id: 'overview', label: '개요' }] },
  {
    group: '스타일',
    items: [
      { id: 'color', label: 'Color' },
      { id: 'typography', label: 'Typography' },
    ],
  },
  { group: '컴포넌트', items: docs.map((d) => ({ id: d.id, label: d.name })) },
];
const ids = nav.flatMap((g) => g.items.map((i) => i.id));

/** 화면 상단 1/3 지점을 지나는 섹션을 현재 위치로 봅니다. */
function useActiveSection() {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-30% 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

export function GuidePage() {
  const active = useActiveSection();

  // 첫 진입 시 주소의 #섹션으로 이동 (React가 그린 뒤에 위치를 잡습니다)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-10 md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:bg-neutral-100 focus:px-3 focus:py-2 focus:text-neutral-10"
      >
        본문으로 건너뛰기
      </a>

      <aside className="sticky top-0 z-10 border-b border-neutral-40 bg-neutral-20 md:h-screen md:overflow-y-auto md:border-b-0 md:border-r">
        <div className="px-5 pb-3 pt-5 md:pb-6 md:pt-8">
          <p className="text-body-3 font-bold text-neutral-100">UI Asset</p>
          <p className="text-body-5 text-neutral-70">디자인 시스템 1.0.2</p>
        </div>
        <nav aria-label="가이드 목차" className="overflow-x-auto px-3 pb-3 md:pb-8">
          <ul className="flex gap-1 md:flex-col md:gap-6">
            {nav.map((g) => (
              <li key={g.group} className="shrink-0">
                <p className="hidden px-2 pb-1.5 text-body-5 text-neutral-70 md:block">{g.group}</p>
                <ul className="flex gap-1 md:flex-col md:gap-0">
                  {g.items.map((i) => (
                    <li key={i.id}>
                      <a
                        href={`#${i.id}`}
                        aria-current={active === i.id ? 'location' : undefined}
                        className={cn(
                          'block whitespace-nowrap px-2 py-1.5 text-body-4 transition-colors',
                          'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70',
                          active === i.id
                            ? 'bg-neutral-10 font-bold text-neutral-100 md:shadow-[inset_3px_0_0_var(--color-primary-70)]'
                            : 'text-neutral-70 hover:text-neutral-100',
                        )}
                      >
                        {i.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main id="main" className="min-w-0 px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-[920px]">
          <Hero />
          <Colors />
          <Typography />
          {docs.map((d) => (
            <ComponentSection key={d.id} doc={d} />
          ))}
          <footer className="border-t border-neutral-100 py-10 text-body-4 text-neutral-70">
            원본: Figma [DS] UI Asset 1.0.2. 토큰은 src/styles/theme.css, 컴포넌트는 src/components에 있습니다.
          </footer>
        </div>
      </main>
    </div>
  );
}
