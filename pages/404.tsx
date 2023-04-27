import Lottie from "lottie-react";
import Link from "next/link";
import Layout from "../components/Layout";
import trashAnimation from "../public/lottie/trash.json";

export default function Custom404() {
  return (
    <Layout>
      <div className="w-full prose flex flex-col items-center relative">
        <h1 className="mt-20 text-center">404 - Page Not Found</h1>
        <Link href="/" className="btn mb-4">
          Back to Home
        </Link>
        <Lottie animationData={trashAnimation} loop={true} className="w-3/4" />
      </div>
    </Layout>
  );
}
