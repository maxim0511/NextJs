import {  QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import  { AppProps } from 'next/app';
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }:AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    //@ts-expect-error
    <QueryClientProvider client={queryClient}>
        <NextNProgress color="#ED5992" startPosition={0.3} stopDelayMs={200} height={3}/>
        <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;