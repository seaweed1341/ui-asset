import { useState, type ReactNode } from 'react';
import { Button, Checkbox, Dropdown, Radio, Switch, Tabs, TextField } from '../components';
import { CodeBlock } from './ui';

type Variant = 'primary' | 'secondary' | 'text';
type Height = 'h33' | 'h26' | 'h20';

/** 히어로: DS 컴포넌트로 Button props를 바꾸고, 결과 JSX를 그대로 보여 줍니다. */
export function Hero() {
  const [variant, setVariant] = useState<Variant>('primary');
  const [height, setHeight] = useState<Height>('h33');
  const [label, setLabel] = useState('기기 추가');
  const [icon, setIcon] = useState(true);
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [disabled, setDisabled] = useState(false);
  const [badge, setBadge] = useState(false);

  const attrs = [
    variant !== 'primary' && `variant="${variant}"`,
    height !== 'h33' && `height="${height}"`,
    `label="${label}"`,
    icon && 'icon',
    icon && position === 'right' && 'iconPosition="right"',
    disabled && 'disabled',
    badge && 'badge',
  ].filter(Boolean);
  const code = `<Button ${attrs.join(' ')} />`;

  return (
    <section id="overview" aria-labelledby="overview-title" className="scroll-mt-36 md:scroll-mt-6 pb-16 pt-12">
      <p className="text-body-4 text-primary-70">[DS] UI Asset 1.0.2</p>
      <h1 id="overview-title" className="mt-2 max-w-2xl text-heading-1 text-neutral-100">
        디자인과 같은 부품으로 화면을 만듭니다
      </h1>
      <p className="mt-4 max-w-xl text-body-2 text-neutral-70">
        Figma 라이브러리의 색상, 글꼴, 컴포넌트를 React 코드로 옮겼습니다. 아래 조작부도 이 시스템의 컴포넌트로
        만들어졌습니다. 값을 바꾸면 버튼과 코드가 함께 바뀝니다.
      </p>

      <div className="mt-10 grid overflow-hidden ring-1 ring-inset ring-neutral-40 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-h-[280px] flex-col">
          <div className="flex flex-1 items-center justify-center bg-primary-15 px-6 py-12">
            <Button
              variant={variant}
              height={height}
              label={label || ' '}
              icon={icon}
              iconPosition={position}
              disabled={disabled}
              badge={badge}
            />
          </div>
          <CodeBlock code={code} />
        </div>

        <form
          aria-label="Button props"
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-5 border-t border-neutral-40 bg-neutral-10 p-5 lg:border-l lg:border-t-0"
        >
          <Field label="variant">
            <Tabs
              aria-label="variant"
              height="h36"
              type="full"
              value={variant}
              onChange={(v) => setVariant(v as Variant)}
              items={[
                { value: 'primary', label: 'primary' },
                { value: 'secondary', label: 'secondary' },
                { value: 'text', label: 'text' },
              ]}
            />
          </Field>
          <Field label="height">
            <Dropdown
              className="w-full"
              value={height}
              onChange={(v) => setHeight(v as Height)}
              options={[
                { value: 'h33', label: 'h33 (15px)' },
                { value: 'h26', label: 'h26 (10px)' },
                { value: 'h20', label: 'h20 (8px)' },
              ]}
            />
          </Field>
          <Field label="label">
            <TextField
              className="w-full"
              height="h36"
              value={label}
              onValueChange={setLabel}
              maxLength={20}
              showCount
              clearable
              placeholder="버튼 텍스트"
            />
          </Field>
          <Field label="icon">
            <div className="flex flex-wrap items-center gap-4">
              <Switch label={icon ? '있음' : '없음'} checked={icon} onChange={setIcon} />
              <Radio name="pos" label="왼쪽" checked={position === 'left'} disabled={!icon} onChange={() => setPosition('left')} />
              <Radio name="pos" label="오른쪽" checked={position === 'right'} disabled={!icon} onChange={() => setPosition('right')} />
            </div>
          </Field>
          <div className="flex flex-wrap gap-5">
            <Checkbox label="disabled" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
            <Checkbox label="badge" checked={badge} onChange={(e) => setBadge(e.target.checked)} />
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[12px] text-neutral-70">{label}</span>
      {children}
    </div>
  );
}
