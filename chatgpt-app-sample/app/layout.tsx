import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoEngage Sample App - ChatGPT Integration',
  description: 'Sample application with MoEngage WebSDK integration for ChatGPT Apps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'self' https://chat.openai.com https://chatgpt.com; script-src 'self' 'unsafe-inline' https://js.moengage.com https://cdn.moengage.com https://cdn.openai.com; connect-src 'self' https://*.moengage.com https://api.openai.com;"
        />
        <script
          src="https://cdn.openai.com/apps-sdk-js/latest/apps-sdk.js"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

