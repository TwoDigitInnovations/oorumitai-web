import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { Api } from "@/services/service";

function MainHeader() {
  const router = useRouter();
  const [carouselImg, setCarouselImg] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await Api("get", "getsetting", "", router);
      setCarouselImg(res?.setting[0]?.carousel || []);
    }
    fetchData();
  }, [router]);

  // Auto-change image every 3 seconds
  useEffect(() => {
    if (carouselImg.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % carouselImg.length
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [carouselImg]);

  const responsive = {
    desktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    },
  };

  const CustomLeftArrow = ({ ...rest }) => (
    <div {...rest} className="hidden group-hover:flex absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-10 cursor-pointer transition">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );

  const CustomRightArrow = ({ ...rest }) => (
    <div {...rest} className="hidden group-hover:flex absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-10 cursor-pointer transition">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
  const ratio = 1 / 1;
  
  return (
    <>
      {/* Carousel - Commented Out */}
      {/* <div className="group relative md:mt-7">
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={5000}
          arrows
          showDots
          className="w-full"
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {carouselImg.map((img, idx) => (
            <div key={idx} className=" flex items-center justify-center overflow-hidden ">
              <div
                className=" flex items-center justify-center overflow-hidden rounded-[28px] w-full md:w-full"
                style={{
                  position: "relative",
                  aspectRatio: ratio,
                }}
              >
                <Image
                  src={img.image || "/fallback.jpg"}
                  alt={`Oorumittai banner ${idx}`}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </Carousel>
      </div> */}

      {/* New Hero Section */}
      <div className="relative w-full bg-transparent overflow-hidden md:mt-7">
        <div className="relative w-full min-h-[600px] md:h-[600px]">
          {/* Main Content Container */}
          <div className="relative max-w-7xl mx-auto px-4 md:px-4 h-full flex items-center py-8 md:py-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full items-center">
              
              {/* Left Side - Text Content */}
              <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                  Balanced Meals.
                  <br />
                  Authentic Taste.
                </h1>
                
                <p className="text-base md:text-xl text-gray-700">
                  Order online or visit us for a dinning
                  <br className="hidden md:block" />
                  experience to remember.
                </p>

                <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                  <button className="bg-[#F9C60A] text-black font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-[#e0b309] transition text-sm md:text-base">
                    Order Now
                  </button>
                  <button className="bg-white border-2 border-[#F9C60A] text-black font-semibold px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-gray-50 transition text-sm md:text-base">
                    Menu
                  </button>
                </div>

                {/* Idli Section */}
                <div className="flex items-center gap-3 md:gap-4 mt-6 md:mt-8 justify-center md:justify-start">
                  <div className="relative w-20 h-20 md:w-32 md:h-32">
                    <Image
                      src="/idli.png"
                      alt="Idli"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="relative w-28 h-14 md:w-40 md:h-20">
                    <Image
                      src="/idlitext.png"
                      alt="Idli description"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Images */}
              <div className="relative h-[350px] md:h-full flex items-center justify-center mt-4 md:mt-0">
                {/* Main Thali Image - Dynamic Carousel Images */}
                <div className="relative w-[280px] h-[280px] md:w-[500px] md:h-[500px] z-10 rounded-full overflow-hidden">
                  {carouselImg.length > 0 && (
                    <Image
                      src={carouselImg[currentImageIndex]?.image || "/spicy.png"}
                      alt="Food Image"
                      fill
                      className="object-cover transition-opacity duration-500 rounded-full"
                      key={currentImageIndex}
                    />
                  )}
                  {carouselImg.length === 0 && (
                    <Image
                      src="/spicy.png"
                      alt="Traditional Indian Thali"
                      fill
                      className="object-cover rounded-full"
                    />
                  )}
                </div>

                {/* Customer Reviews Badge - Top Right */}
                <div className="absolute top-0 md:top-8 right-0 md:right-0 z-10">
                  <div className="relative w-[140px] h-[80px] md:w-[180px] md:h-[100px]">
                    <Image
                      src="/happy.png"
                      alt="Happy customers"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainHeader;
