// components/theme-script.tsx
'use client'

import { useServerInsertedHTML } from 'next/navigation'

export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      id="theme-init"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var saved = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', saved);
            } catch (e) {}
          })();
        `,
      }}
    />
  ))

  return null
}