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
        <script
          src="https://cdn.openai.com/apps-sdk-js/latest/apps-sdk.js"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

