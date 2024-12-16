import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MDXProvider } from '@mdx-js/react';
import Video from '../components/Video';

const components = {
  Video,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  );
}
