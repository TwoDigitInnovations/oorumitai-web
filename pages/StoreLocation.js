import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Head from "next/head";

function StoreLocation(props) {
  const { t } = useTranslation();
  const [StoreLocation, setStoreLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getStoreLocation = () => {
    props.loader(true); 
    Api("get", "/content", router).then(
      (res) => {
        props.loader(false); 

        if (res?.status) {
          setStoreLocation(res?.data[0]?.StoreLocation);
          setLoading(false); 
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
          setLoading(false); 
        }
      },
      (err) => {
        props.loader(false); 
        props.toaster({ type: "error", message: err?.data?.message|| err?.message });
        setLoading(false); 
      }
    );
  };

  useEffect(() => {
    getStoreLocation();
  }, []);

  return (
    <>
      <Head>
        <title>
          Find a Oorumittai Store Near You</title>
        <meta name="description" content="Visit your nearest Oorumittai store for fresh foods, beauty, books & more. Curbside pickup & delivery available!" />
         <link
          rel="canonical"
          href="https://www.Oorumittai.com/StoreLocation"
        />
      </Head>
      <div className="min-h-screen md:mt-5 mt-14 md:mb-0 mb-10">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Main Card with Background Image */}
          <div 
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            style={{
              backgroundImage: 'url(/bgstore.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
              minHeight: '700px',
              width: '100%'
            }}
          >
            {/* Light blue overlay */}
            <div className="absolute inset-0 bg-blue-100/20"></div>
            
            <div className="relative z-10 flex items-center justify-center md:justify-end p-8 md:p-12 lg:p-16 min-h-[600px]">

              {/* Store Information - Direct on image without box */}
              <div className="max-w-xl w-full">
                {loading ? (
                  <p className="text-xl text-gray-900 font-medium">Loading...</p>
                ) : (
                  <div className="space-y-4">
                    <div
                      className="text-base md:text-lg text-gray-900 leading-relaxed store-content"
                      dangerouslySetInnerHTML={{ __html: StoreLocation }}
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>

  );
}

export default StoreLocation;
