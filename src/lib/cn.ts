import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// DS 타이포 토큰(text-body-3 등)을 글자 크기로 인식시켜 text-neutral-* 색상과 충돌로 오인하지 않게 합니다.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [(v: string) => /^(heading|body)-\d$/.test(v)] }],
    },
  },
});

/** className 결합 + 충돌 정리 (뒤에 온 클래스가 이김: 사용처의 className으로 덮어쓰기 가능) */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
