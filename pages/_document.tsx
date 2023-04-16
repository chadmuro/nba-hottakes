import { Html, Head, Main, NextScript } from "next/document";
import LoginModal from "../components/Modal/LoginModal";

export default function Document() {
  return (
    <Html data-theme="night">
      <Head />
      <LoginModal />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
