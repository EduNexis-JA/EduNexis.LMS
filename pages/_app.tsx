import type { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";

// Wrap app with header so auth UI appears on every page
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}
