import { useState, type ReactNode } from 'react';
import {
  BadgeDot,
  Button,
  Checkbox,
  Dropdown,
  IconButton,
  IconSearch,
  Radio,
  Switch,
  Tabs,
  Tag,
  TextField,
} from './components';

/** 컴포넌트 베리언트 확인용 데모 페이지 */

function Section({ title, figma, children }: { title: string; figma: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-neutral-20 py-6">
      <header className="flex items-baseline gap-2">
        <h2 className="text-heading-4 text-neutral-100">{title}</h2>
        <code className="text-body-5 text-neutral-70">{figma}</code>
      </header>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="w-28 shrink-0 text-body-5 text-neutral-70">{label}</span>
      {children}
    </div>
  );
}

const heights = ['h33', 'h26', 'h20'] as const;
const styles = ['primary', 'secondary', 'text'] as const;

export function App() {
  const [radio, setRadio] = useState('a');
  const [sw, setSw] = useState(true);
  const [dd, setDd] = useState<string>();

  return (
    <main className="mx-auto max-w-5xl px-6 pb-16">
      <h1 className="pt-10 text-heading-2 text-neutral-100">[DS] UI Asset — Components</h1>
      <p className="text-body-3 text-neutral-70">Figma 컴포넌트 세트를 props 기반 베리언트로 구현했습니다.</p>

      <Section title="Button" figma="button · height × style × status × icon">
        {styles.map((s) =>
          heights.map((h) => (
            <Row key={s + h} label={`${s} / ${h}`}>
              <Button variant={s} height={h} label="Button" />
              <Button variant={s} height={h} label="Button" icon />
              <Button variant={s} height={h} label="Button" icon iconPosition="right" />
              <Button variant={s} height={h} label="Button" disabled />
              <Button variant={s} height={h} label="Button" icon disabled />
              <Button variant={s} height={h} label="Button" badge />
            </Row>
          )),
        )}
      </Section>

      <Section title="IconButton" figma="button_icon · style × hight × status">
        {(['outlined', 'filled', 'onlyicon'] as const).map((s) => (
          <Row key={s} label={s}>
            {(['h32', 'h24', 'h16'] as const).map((h) => (
              <IconButton key={h} variant={s} height={h} label="추가" />
            ))}
            {(['h32', 'h24', 'h16'] as const).map((h) => (
              <IconButton key={h + 'd'} variant={s} height={h} label="추가" disabled />
            ))}
            <IconButton variant={s} label="검색" icon={<IconSearch />} />
          </Row>
        ))}
      </Section>

      <Section title="Checkbox" figma="checkbox · checkbox_label">
        <Row label="default">
          <Checkbox aria-label="unselected" />
          <Checkbox aria-label="selected" defaultChecked />
          <Checkbox aria-label="indeterminate" indeterminate />
          <Checkbox aria-label="disabled" disabled />
          <Checkbox aria-label="disabled selected" disabled defaultChecked />
        </Row>
        <Row label="only icon">
          <Checkbox type="onlyIcon" aria-label="unselected" />
          <Checkbox type="onlyIcon" aria-label="selected" defaultChecked />
          <Checkbox type="onlyIcon" aria-label="indeterminate" indeterminate />
        </Row>
        <Row label="number">
          <Checkbox type="number" number={1} aria-label="1" defaultChecked />
          <Checkbox type="number" number={2} aria-label="2" defaultChecked disabled />
        </Row>
        <Row label="label">
          <Checkbox label="label" defaultChecked />
          <Checkbox label="label" />
          <Checkbox label="label" defaultChecked disabled />
        </Row>
      </Section>

      <Section title="Radio" figma="radio button · radio_label">
        <Row label="group">
          {['a', 'b', 'c'].map((v) => (
            <Radio key={v} name="demo" value={v} label={`label ${v}`} checked={radio === v} onChange={() => setRadio(v)} />
          ))}
          <Radio name="demo-d" label="disabled" disabled defaultChecked />
          <Radio name="demo-e" label="disabled" disabled />
        </Row>
      </Section>

      <Section title="Switch" figma="switch · switch_label">
        <Row label="states">
          <Switch aria-label="on" checked={sw} onChange={setSw} />
          <Switch aria-label="off" />
          <Switch label="label" defaultChecked />
          <Switch label="label" disabled defaultChecked />
          <Switch label="label" disabled />
        </Row>
      </Section>

      <Section title="TextField" figma="input_text · height × type × status">
        {(['h48', 'h36'] as const).map((h) => (
          <Row key={h} label={h}>
            <TextField height={h} />
            <TextField height={h} label="Label" icon clearable defaultValue="입력값" />
            <TextField height={h} label="Label" error="error text" showCount maxLength={100} defaultValue="오류" />
            <TextField height={h} type="password" defaultValue="password" />
            <TextField height={h} unit="unit" helperText="supporting text" showCount maxLength={100} />
            <TextField height={h} disabled />
            <TextField height={h} plain defaultValue="text" />
          </Row>
        ))}
      </Section>

      <Section title="Dropdown" figma="dropdown · status">
        <Row label="states">
          <Dropdown
            label="Label"
            value={dd}
            onChange={setDd}
            options={[
              { value: '1', label: 'list texts 1' },
              { value: '2', label: 'list texts 2' },
              { value: '3', label: 'list texts 3' },
              { value: '4', label: 'disabled', disabled: true },
            ]}
          />
          <Dropdown icon options={[{ value: '1', label: 'Option' }]} defaultValue="1" />
          <Dropdown disabled options={[]} />
          <Dropdown plain options={[{ value: '1', label: 'Text' }]} defaultValue="1" />
        </Row>
      </Section>

      <Section title="Tag / BadgeDot" figma="tag_text · element/badgedot">
        {(['medium', 'small'] as const).map((sz) => (
          <Row key={sz} label={sz}>
            {(['primary', 'secondary', 'error'] as const).map((st) => (
              <Tag key={st} size={sz} status={st} label="Text" />
            ))}
            {(['primary', 'secondary', 'error'] as const).map((st) => (
              <Tag key={st + 'i'} size={sz} status={st} label="Text" icon />
            ))}
          </Row>
        ))}
        <Row label="badgedot">
          <BadgeDot size="large" count={3} />
          <BadgeDot size="medium" />
        </Row>
      </Section>

      <Section title="Tabs" figma="tab_group_line · element/tab_line">
        {(['h48', 'h36'] as const).map((h) =>
          (['flex', 'full'] as const).map((t) => (
            <Row key={h + t} label={`${h} / ${t}`}>
              <div className={t === 'full' ? 'flex-1' : ''}>
                <Tabs
                  aria-label="데모 탭"
                  height={h}
                  type={t}
                  items={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: 'Text' }))}
                />
              </div>
            </Row>
          )),
        )}
      </Section>
    </main>
  );
}
