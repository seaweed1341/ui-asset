import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/** CSS 변수의 실제 계산값을 읽습니다. theme.css가 바뀌면 화면도 따라 바뀝니다. */
export function useCssVar(name: string) {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim());
  }, [name]);
  return value;
}

export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1400);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
    } catch {
      setCopied(null);
    }
  };
  return { copied, copy };
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className={cn('relative bg-neutral-100 text-neutral-10', className)}>
      <pre className="overflow-x-auto px-4 py-3.5 pr-20 font-mono text-[13px] leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => copy(code)}
        className={cn(
          'absolute right-2 top-2 rounded-full px-2.5 py-1 text-body-5 ring-1 ring-inset transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-15',
          copied === code
            ? 'bg-primary-70 text-neutral-10 ring-primary-70'
            : 'text-neutral-40 ring-neutral-70 hover:text-neutral-10',
        )}
      >
        {copied === code ? '복사됨' : '복사'}
      </button>
    </div>
  );
}

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-neutral-100 text-body-5 text-neutral-70">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">타입</th>
            <th className="py-2 pr-4 font-medium">기본값</th>
            <th className="py-2 font-medium">설명</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-neutral-20 align-top">
              <td className="py-2.5 pr-4 font-mono text-[13px] text-neutral-100">{r.name}</td>
              <td className="py-2.5 pr-4 font-mono text-[12px] text-primary-90">{r.type}</td>
              <td className="py-2.5 pr-4 font-mono text-[12px] text-neutral-70">{r.defaultValue ?? '–'}</td>
              <td className="py-2.5 text-body-4 text-neutral-70">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionTitle({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 max-w-2xl">
      <h2 id={`${id}-title`} className="text-heading-3 text-neutral-100">
        {title}
      </h2>
      {children && <p className="mt-2 text-body-3 text-neutral-70">{children}</p>}
    </header>
  );
}
