import Lottie from "lottie-react";
import loadingAnimation from "../public/lottie/basketballLoading.json";

export default function Loading() {
  return <Lottie animationData={loadingAnimation} loop={true} />;
}
