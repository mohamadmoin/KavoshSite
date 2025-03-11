import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: theme('colors.primary.DEFAULT'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'var(--foreground)',
              'margin-top': '1.5em',
              'margin-bottom': '0.5em',
            },
            h1: {
              fontSize: '2.5rem',
            },
            h2: {
              fontSize: '2rem',
            },
            h3: {
              fontSize: '1.5rem',
            },
            'ul, ol': {
              padding: '0 1.5rem',
            },
            blockquote: {
              borderLeftColor: 'var(--primary)',
              backgroundColor: 'var(--muted)',
              fontStyle: 'normal',
              padding: '1rem',
              borderRadius: '0.25rem',
            },
            code: {
              backgroundColor: 'var(--muted)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              color: 'var(--foreground)',
            },
            pre: {
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
            },
            '.info-box': {
              backgroundColor: 'var(--muted)',
              borderLeft: '4px solid var(--primary)',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '0.25rem',
            },
            '.highlight-box': {
              backgroundColor: 'var(--accent)',
              border: '1px solid var(--border)',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '0.25rem',
            },
            figure: {
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            figcaption: {
              fontSize: '0.875rem',
              color: 'var(--muted-foreground)',
              textAlign: 'center',
              marginTop: '0.5rem',
            },
            img: {
              borderRadius: '0.25rem',
            },
          },
        },
        dark: {
          css: {
            color: 'var(--foreground)',
            blockquote: {
              borderLeftColor: 'var(--primary)',
              backgroundColor: 'var(--muted)',
            },
            code: {
              backgroundColor: 'var(--muted)',
            },
            pre: {
              backgroundColor: 'var(--muted)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config; 