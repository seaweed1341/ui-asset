/** @type {import('tailwindcss').Config} */
// 모든 값은 theme.css의 CSS 변수를 참조합니다. 헥스 값은 theme.css의 Primitive 레이어에만 있습니다.

const v = (name) => `var(--${name})`;

// Typography 헬퍼: [fontSize, { lineHeight, letterSpacing, fontWeight }]
const type = (key) => [
  v(`font-size-${key}`),
  {
    lineHeight: v(`font-line-height-${key}`),
    letterSpacing: v(`font-letter-spacing-${key}`),
    fontWeight: v(`font-weight-${key}`),
  },
];

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,vue,svelte,html}'],
  theme: {
    extend: {
      colors: {
        // Primitive — Figma "Theme" 변수
        neutral: {
          10: v('color-neutral-10'),
          20: v('color-neutral-20'),
          40: v('color-neutral-40'),
          70: v('color-neutral-70'),
          100: v('color-neutral-100'),
        },
        primary: {
          15: v('color-primary-15'),
          70: v('color-primary-70'),
          90: v('color-primary-90'),
        },
        success: {
          10: v('color-success-10'),
          20: v('color-success-20'),
          60: v('color-success-60'),
          '80-text': v('color-success-80-text'),
        },
        info: {
          10: v('color-info-10'),
          20: v('color-info-20'),
          60: v('color-info-60'),
          '80-text': v('color-info-80-text'),
        },
        warning: {
          10: v('color-warning-10'),
          20: v('color-warning-20'),
          60: v('color-warning-60'),
          '80-text': v('color-warning-80-text'),
        },
        error: {
          10: v('color-error-10'),
          20: v('color-error-20'),
          60: v('color-error-60'),
          '80-text': v('color-error-80-text'),
        },

        // Semantic
        background: {
          surface: v('color-background-surface'),
        },
        text: {
          sub: v('color-text-sub'),
          'on-color': v('color-text-on-color'),
        },
        icon: {
          sub: v('color-icon-sub'),
          'on-color': v('color-icon-on-color'),
        },
        button: {
          primary: {
            DEFAULT: v('color-button-primary'),
            pressed: v('color-button-primary-pressed'),
          },
          tertiary: v('color-button-tertiary'),
        },
        border: {
          DEFAULT: v('color-border'),
        },
        divider: {
          table: v('color-divider-table'),
        },
        dimmer: v('color-dimmer'),
        status: {
          success: {
            DEFAULT: v('color-status-success'),
            bg: v('color-status-success-bg'),
            subtle: v('color-status-success-subtle'),
            text: v('color-status-success-text'),
          },
          info: {
            DEFAULT: v('color-status-info'),
            bg: v('color-status-info-bg'),
            subtle: v('color-status-info-subtle'),
            text: v('color-status-info-text'),
          },
          warning: {
            DEFAULT: v('color-status-warning'),
            bg: v('color-status-warning-bg'),
            subtle: v('color-status-warning-subtle'),
            text: v('color-status-warning-text'),
          },
          error: {
            DEFAULT: v('color-status-error'),
            bg: v('color-status-error-bg'),
            subtle: v('color-status-error-subtle'),
            text: v('color-status-error-text'),
          },
        },
      },

      fontFamily: {
        sans: v('font-family-sans'),
      },

      fontWeight: {
        regular: v('font-weight-regular'),
        medium: v('font-weight-medium'),
        bold: v('font-weight-bold'),
      },

      fontSize: {
        'heading-1': type('heading-1'),
        'heading-2': type('heading-2'),
        'heading-3': type('heading-3'),
        'heading-4': type('heading-4'),
        'body-1': type('body-1'),
        'body-2': type('body-2'),
        'body-3': type('body-3'),
        'body-4': type('body-4'),
        'body-5': type('body-5'),
        'body-6': type('body-6'),
      },
    },
  },
  plugins: [],
};
