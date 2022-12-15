import Head from "next/head";
import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>NBA Hot Takes</title>
        <meta name="description" content="NBA Hot Takes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-1 px-4">{children}</main>
      <Footer />
    </div>
  );
}
