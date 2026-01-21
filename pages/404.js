import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Head from "next/head";
import Image from "next/image";

export default function Custom404() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Page Not Found - Oorumittai</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>
      
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <Image
              src="/2logo.png"
              alt="Oorumittai Logo"
              width={200}
              height={80}
              className="mx-auto mb-8"
            />
          </div>
          
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-[#F9C60A] mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t("Product Not Found")}
            </h2>
            <p className="text-gray-600 mb-8">
              {t("The product you're looking for doesn't exist or has been moved.")}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#F9C60A] text-black font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              {t("Go to Home")}
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full border-2 border-[#F9C60A] text-[#F9C60A] font-semibold py-3 px-6 rounded-lg hover:bg-[#F9C60A] hover:text-black transition-colors"
            >
              {t("Go Back")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}