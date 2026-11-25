import { useState, type ReactNode } from 'react';
import {
  AreaChart,
  BarChart,
  ChartCard,
  ChartLegend,
  ChartTrailing,
  DonutChart,
  DonutChartCard,
  LineChart,
  ProgressBar,
  ProgressCircle,
} from '../../components/chart';
import type { ComponentDoc } from '../ComponentDocs';

/** 차트 묶음(src/components/chart) 가이드 문서 */

function Stage({ children, label, column }: { children: ReactNode; label?: string; column?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className={column ? 'flex min-w-0 flex-col gap-4' : 'flex min-w-0 flex-wrap items-start gap-4'}>{children}</div>
    </div>
  );
}

/** Figma 카드 폭 356 */
const Card = ({ children }: { children: ReactNode }) => <div className="w-full max-w-[356px] min-w-0">{children}</div>;

const MONTHS = ['1월', '2월', '3월', '4월', '5월'];
const PERIOD = [
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
  { value: '90d', label: '최근 90일' },
];
const SERIES3 = [
  { name: '정상', data: [32, 38, 41, 36, 44] },
  { name: '경고', data: [12, 18, 9, 22, 15] },
  { name: '오류', data: [4, 7, 3, 9, 5] },
];
const DONUT = [
  { label: '정상', value: 512 },
  { label: '경고', value: 256 },
  { label: '오류', value: 154 },
  { label: '미확인', value: 102 },
];

function PeriodTrailing() {
  const [v, setV] = useState('7d');
  return <ChartTrailing options={PERIOD} value={v} onChange={setV} />;
}

const CARTESIAN_PROPS = [
  { name: 'categories', type: 'string[]', description: '항목 이름(x축, 가로 막대는 y축).' },
  { name: 'series', type: '{ name; data: number[]; color?: ChartColor }[]', description: '계열. 색은 토큰 이름이며 생략하면 palette 순서(엔티티 고정, 토글해도 색 유지).' },
  { name: 'palette', type: "'neutral' | 'brand'", defaultValue: "'neutral'", description: 'neutral = Figma 와이어프레임 회색 단계, brand = primary-70 · warning-60 · info-60 · error-60 · primary-90 · success-60.' },
  { name: 'max', type: 'number', description: '축 최댓값. 생략하면 데이터에 맞춰 보기 좋은 값으로 올림.' },
  { name: 'tickCount', type: 'number', defaultValue: '6', description: 'Figma axis·bg line count(3~11). 눈금·격자 줄 수.' },
  { name: 'height', type: 'number', defaultValue: '156', description: 'SVG 높이(px). 폭은 컨테이너 100%를 따릅니다.' },
  { name: 'showXAxis / showYAxis', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ x축 / ♦ y축.' },
  { name: 'xUnit / yUnit', type: 'string', description: 'Figma ♦ x unit / ♦ y unit 단위 문구.' },
  { name: 'legend', type: 'boolean', defaultValue: '계열 2개 이상', description: '내장 범례. 항목을 눌러 계열을 표시/숨김(aria-pressed).' },
  { name: 'hiddenSeries / defaultHiddenSeries', type: 'string[]', description: '숨긴 계열(제어/비제어). onHiddenSeriesChange로 변경을 받습니다.' },
  { name: 'formatValue', type: '(v: number) => string', description: '축·라벨·툴팁 값 표기.' },
  { name: 'aria-label', type: 'string', description: '스크린리더 요약. 생략하면 자동 생성(숨긴 데이터 표도 함께 제공).' },
];

export const chartDocs: ComponentDoc[] = [
  {
    id: 'chart-card',
    name: 'ChartCard · ChartTrailing',
    figma: 'charts_bar/type1·type2, charts_line/type1, charts_area/type1, element/trailing_chart (2)',
    description:
      '차트를 담는 카드입니다. 제목(12px Medium) 오른쪽에 기간 드롭다운이나 버튼(trailing_chart)을 두고, 본문에 차트를 넣습니다. 차트는 카드 폭을 그대로 따릅니다.',
    Preview: () => (
      <>
        <Stage label="trailing: dropdown · button">
          <Card>
            <ChartCard title="기기 상태" trailing={<PeriodTrailing />}>
              <BarChart categories={MONTHS} series={[{ name: '기기', data: [40, 40, 40, 40, 40] }]} />
            </ChartCard>
          </Card>
          <Card>
            <ChartCard title="알림 추이" trailing={<ChartTrailing type="button" label="전체" />}>
              <LineChart categories={MONTHS} series={SERIES3} />
            </ChartCard>
          </Card>
        </Stage>
      </>
    ),
    code: `<ChartCard
  title="기기 상태"
  trailing={<ChartTrailing options={periods} value={period} onChange={setPeriod} />}
>
  <BarChart categories={months} series={[{ name: '기기', data }]} />
</ChartCard>

<ChartTrailing type="button" label="전체" onClick={openAll} />`,
    props: [
      { name: 'title', type: 'ReactNode', description: '제목(♦ title). 생략하면 제목 줄이 사라집니다.' },
      { name: 'trailing', type: 'ReactNode', description: '제목 오른쪽 컨트롤(♦ right). 보통 ChartTrailing.' },
      { name: 'tabs', type: 'ReactNode', description: '제목 아래 탭 슬롯(♦ tab).' },
      { name: 'legend', type: 'ReactNode', description: '차트 위 오른쪽 정렬 범례 슬롯(♦ legend).' },
      { name: 'ChartTrailing type', type: "'dropdown' | 'button'", defaultValue: "'dropdown'", description: 'dropdown: options·value·defaultValue·onChange·placeholder / button: label·onClick (h26 secondary).' },
    ],
  },
  {
    id: 'bar-chart',
    name: 'BarChart',
    figma: 'graph/bar (2), element/bar_vertical·bar_horizontal (9), bar_group_vertical·horizontal (3), bar_chart (2), bar_count_chart (10)',
    description:
      '항목별 크기를 비교합니다. 세로/가로 막대, 계열 1~3개 묶음, 누적(bar_count_chart)을 지원합니다. 막대에 마우스를 올리거나 차트에 포커스 후 화살표 키로 값을 확인합니다.',
    Preview: () => (
      <>
        <Stage label="shape=vertical · 단일 / 묶음(3) / 누적 + average">
          <Card>
            <BarChart categories={MONTHS} series={[{ name: '기기', data: [40, 32, 45, 28, 38] }]} />
          </Card>
          <Card>
            <BarChart categories={MONTHS} series={SERIES3} palette="brand" />
          </Card>
          <Card>
            <BarChart categories={MONTHS} series={SERIES3} stacked palette="brand" average={52} />
          </Card>
        </Stage>
        <Stage label="shape=horizontal · 단일 / 묶음(2) · unit">
          <Card>
            <BarChart shape="horizontal" categories={['A동', 'B동', 'C동', 'D동']} series={[{ name: '사용량', data: [44, 30, 22, 38] }]} />
          </Card>
          <Card>
            <BarChart
              shape="horizontal"
              categories={['A동', 'B동', 'C동', 'D동']}
              series={SERIES3.slice(0, 2).map((s) => ({ ...s, data: s.data.slice(0, 4) }))}
              xUnit="건"
              yUnit="구역"
              height={180}
            />
          </Card>
        </Stage>
      </>
    ),
    code: `<BarChart categories={months} series={[{ name: '기기', data: [40, 32, 45, 28, 38] }]} />
<BarChart categories={months} series={series} palette="brand" />
<BarChart categories={months} series={series} stacked average={52} />
<BarChart shape="horizontal" categories={zones} series={[{ name: '사용량', data }]} xUnit="건" />`,
    props: [
      { name: 'shape', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Figma graph/bar shape.' },
      { name: 'stacked', type: 'boolean', defaultValue: 'false', description: '누적 막대(bar_count_chart). 조각 사이 0.7px 흰 간격.' },
      { name: 'showValues', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ count — 막대 끝 값 라벨(8px). 묶음 막대가 좁으면 자동으로 생략.' },
      { name: 'average', type: 'number | { value; label? }', description: 'Figma ♦ average — primary-70 기준선 + 라벨.' },
      ...CARTESIAN_PROPS,
    ],
  },
  {
    id: 'line-chart',
    name: 'LineChart',
    figma: 'charts_line/type1, graph/line, element/line_graph (36), line_start·line_center·line_end, dot_chart (2)',
    description:
      '시간에 따른 변화를 보여줍니다. 열 가운데 점(dot_chart 5.4px)을 1px 선으로 잇고, hover/키보드로 고른 항목은 선택 점(흰 채움 + 검은 테두리)과 툴팁으로 표시합니다.',
    Preview: () => (
      <>
        <Stage label="palette=neutral (Figma color: grey · dark · default · light) / brand">
          <Card>
            <LineChart
              categories={MONTHS}
              series={[
                { name: 'dark', data: [20, 20, 20, 20, 20], color: 'neutral-100' },
                { name: 'grey', data: [10, 10, 10, 10, 10], color: 'neutral-70' },
                { name: 'default', data: [30, 30, 30, 30, 30], color: 'neutral-40' },
                { name: 'light', data: [39, 39, 39, 39, 39], color: 'neutral-20' },
              ]}
            />
          </Card>
          <Card>
            <LineChart categories={MONTHS} series={SERIES3} palette="brand" />
          </Card>
          <Card>
            <LineChart categories={MONTHS} series={SERIES3.slice(0, 1)} showPoints={false} yUnit="대" />
          </Card>
        </Stage>
      </>
    ),
    code: `<LineChart categories={months} series={series} />
<LineChart categories={months} series={series} palette="brand" />
<LineChart categories={months} series={[series[0]]} showPoints={false} yUnit="대" />`,
    props: [
      { name: 'showPoints', type: 'boolean', defaultValue: 'true', description: 'element/dot_chart 점 표시.' },
      ...CARTESIAN_PROPS,
    ],
  },
  {
    id: 'area-chart',
    name: 'AreaChart',
    figma: 'charts_area/type1, graph/area',
    description: '양의 누적·추세를 면으로 보여줍니다. 면은 계열 색 50%, 윗선 1.34px. 면은 그래프 좌우 끝까지 채웁니다.',
    Preview: () => (
      <>
        <Stage label="겹침 / stacked · brand">
          <Card>
            <AreaChart
              categories={MONTHS}
              series={[
                { name: 'A', data: [10, 15, 20, 30, 42], color: 'neutral-70' },
                { name: 'B', data: [5, 13, 21, 28, 40], color: 'neutral-70' },
                { name: 'C', data: [2, 9, 14, 21, 36], color: 'neutral-70' },
              ]}
            />
          </Card>
          <Card>
            <AreaChart categories={MONTHS} series={SERIES3} stacked palette="brand" />
          </Card>
        </Stage>
      </>
    ),
    code: `<AreaChart categories={months} series={series} />
<AreaChart categories={months} series={series} stacked palette="brand" />`,
    props: [
      { name: 'stacked', type: 'boolean', defaultValue: 'false', description: '계열을 위로 누적.' },
      { name: 'showLine', type: 'boolean', defaultValue: 'true', description: '면 윗선(1.34px).' },
      ...CARTESIAN_PROPS,
    ],
  },
  {
    id: 'donut-chart',
    name: 'DonutChart · DonutChartCard',
    figma: 'graph/donut chart (3), element/circle_segments (3), charts_circle/circle (4)',
    description:
      '전체 중 비율을 보여줍니다. 12시 방향부터 시계 방향으로 세그먼트를 쌓고, light 타입은 가운데에 라벨과 합계(Total / NN)를 표시합니다. 카드형은 범례 배치 4가지(type1~4)를 제공합니다.',
    Preview: () => (
      <>
        <Stage label="variant: light · bold · pie / brand">
          <DonutChart data={DONUT} />
          <DonutChart data={DONUT} variant="bold" />
          <DonutChart data={DONUT} variant="pie" />
          <DonutChart data={DONUT} palette="brand" centerLabel="전체 기기" />
        </Stage>
        <Stage label="DonutChartCard type1 · type2 · type3 · type4">
          {(['type1', 'type2', 'type3', 'type4'] as const).map((t) => (
            <Card key={t}>
              <DonutChartCard type={t} title="기기 상태" trailing={<PeriodTrailing />} data={DONUT} onItemClick={() => undefined} />
            </Card>
          ))}
        </Stage>
      </>
    ),
    code: `<DonutChart data={[{ label: '정상', value: 512 }, { label: '경고', value: 256 }]} />
<DonutChart data={data} variant="pie" />
<DonutChartCard type="type1" title="기기 상태" trailing={<ChartTrailing options={periods} />} data={data}
  onItemClick={(i) => navigate(data[i].label)} />`,
    props: [
      { name: 'data', type: '{ label; value; color?: ChartColor }[]', description: '세그먼트. 색 생략 시 neutral-100 → 70 → 40 → 20(Figma).' },
      { name: 'variant', type: "'light' | 'bold' | 'pie'", defaultValue: "'light'", description: 'Figma type. 안쪽 반지름 0.7 / 0.4 / 0.' },
      { name: 'size', type: 'number', defaultValue: '128', description: '지름(px).' },
      { name: 'showText', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ text — 가운데 라벨/값(light만).' },
      { name: 'centerLabel / centerValue', type: 'ReactNode', defaultValue: "'Total' / 합계", description: '가운데 문구.' },
      { name: 'palette', type: "'neutral' | 'brand'", defaultValue: "'neutral'", description: '세그먼트 색 순서.' },
      { name: 'DonutChartCard type', type: "'type1' | 'type2' | 'type3' | 'type4'", defaultValue: "'type1'", description: 'Figma Property 1 — 범례 배치.' },
      { name: 'DonutChartCard title / trailing / onItemClick', type: 'ReactNode / ReactNode / (i) => void', description: '제목, 오른쪽 컨트롤, 범례 항목(화살표) 클릭.' },
    ],
  },
  {
    id: 'chart-legend',
    name: 'ChartLegend',
    figma: 'legend (4), element/legend_item (3)',
    description:
      '계열의 색과 이름(값)을 알려줍니다. onToggle을 주면 항목이 토글 버튼이 되어 계열을 숨기고(투명도 40%), onItemClick을 주면 상세로 이동하는 버튼이 됩니다.',
    Preview: function LegendPreview() {
      const [hidden, setHidden] = useState<number[]>([1]);
      const items = DONUT.map((d, i) => ({
        label: d.label,
        value: d.value,
        color: (['neutral-100', 'neutral-70', 'neutral-40', 'neutral-20'] as const)[i],
        hidden: hidden.includes(i),
      }));
      return (
        <>
          <Stage label="type=horizon · direction=row (fix) / column">
            <ChartLegend items={items} />
            <ChartLegend items={items} direction="column" />
          </Stage>
          <Stage label="itemType=hug · onToggle (계열 토글)">
            <ChartLegend
              items={items}
              itemType="hug"
              showValue={false}
              onToggle={(i) => setHidden((h) => (h.includes(i) ? h.filter((x) => x !== i) : [...h, i]))}
            />
          </Stage>
          <Stage label="type=vertical · row / column">
            <ChartLegend items={items} type="vertical" />
            <ChartLegend items={items.slice(0, 3)} type="vertical" direction="column" />
          </Stage>
        </>
      );
    },
    code: `<ChartLegend items={[{ label: '정상', value: 512, color: 'neutral-100' }]} />
<ChartLegend items={items} itemType="hug" showValue={false} onToggle={toggle} />
<ChartLegend items={items} type="vertical" direction="column" />`,
    props: [
      { name: 'items', type: '{ label; value?; color?; hidden? }[]', description: '항목. hidden이면 투명도 40%.' },
      { name: 'type', type: "'horizon' | 'vertical'", defaultValue: "'horizon'", description: 'Figma type: Horizon series | Vertical series.' },
      { name: 'itemType', type: "'fix' | 'hug'", defaultValue: "'fix'", description: 'horizon 항목 모양: 01_fix(148 고정) | 02_hug(내용 폭).' },
      { name: 'direction', type: "'row' | 'column'", defaultValue: "'row'", description: 'Figma 정렬: 가로 | 세로.' },
      { name: 'showValue / showButton', type: 'boolean', defaultValue: 'true', description: 'Figma Show num / Show button(화살표, fix만).' },
      { name: 'onToggle', type: '(index) => void', description: '토글 버튼(aria-pressed)으로 만듭니다.' },
      { name: 'onItemClick', type: '(index) => void', description: '이동 버튼으로 만듭니다.' },
      { name: 'align', type: "'start' | 'center' | 'end'", defaultValue: "'start'", description: '정렬.' },
    ],
  },
  {
    id: 'progress',
    name: 'ProgressBar · ProgressCircle',
    figma: 'progress bar_line (6), progress bar_circle (6)',
    description:
      '작업 진행률이나 사용률을 보여줍니다. 트랙 neutral-20 위에 진행 neutral-70(또는 지정 토큰)을 채우며, 여러 조각(segments)을 이어 붙일 수 있습니다.',
    Preview: () => (
      <>
        <Stage label="ProgressBar · 0% / 50% / 100% / segments / label 없음">
          <ProgressBar label="Label" value={0} />
          <ProgressBar label="Label" value={50} />
          <ProgressBar label="Label" value={100} />
          <ProgressBar
            label="저장 공간"
            segments={[
              { value: 35, color: 'primary-70', label: '영상' },
              { value: 20, color: 'warning-60', label: '로그' },
              { value: 10, color: 'info-60', label: '기타' },
            ]}
          />
          <ProgressBar label="업로드" value={70} showLabel={false} />
        </Stage>
        <Stage label="ProgressCircle · small / large">
          <ProgressCircle value={0} label="Text" />
          <ProgressCircle value={50} label="Text" />
          <ProgressCircle value={100} label="Text" />
          <ProgressCircle size="large" value={0} label="Label" />
          <ProgressCircle size="large" value={50} label="Label" />
          <ProgressCircle size="large" value={100} label="Label" />
          <ProgressCircle size="large" value={72} label="CPU" color="primary-70" />
        </Stage>
      </>
    ),
    code: `<ProgressBar label="Label" value={50} />
<ProgressBar label="저장 공간" segments={[{ value: 35, color: 'primary-70' }, { value: 20, color: 'warning-60' }]} />
<ProgressCircle value={50} label="Text" />
<ProgressCircle size="large" value={72} label="CPU" color="primary-70" />`,
    props: [
      { name: 'value', type: 'number', defaultValue: '0', description: '0~100.' },
      { name: 'segments', type: '{ value; color?; label? }[]', description: '다중 조각(합계 ≤ 100). 주면 value 대신 사용.' },
      { name: 'label', type: 'ReactNode', description: '라벨. ProgressCircle small은 캡션, large는 아래 라벨.' },
      { name: 'showLabel', type: 'boolean', defaultValue: 'true', description: 'ProgressBar — Figma ♦ label(라벨·퍼센트 줄).' },
      { name: 'valueText', type: 'string', description: '퍼센트 대신 보여줄 문구.' },
      { name: 'size', type: "'medium' | 'large' / 'small' | 'large'", defaultValue: "'medium' / 'small'", description: 'ProgressBar(Figma 실측 동일, 높이 6) / ProgressCircle(36.2 · 80.4).' },
      { name: 'color', type: 'ChartColor', defaultValue: "'neutral-70'", description: '진행 색 토큰.' },
    ],
  },
];
