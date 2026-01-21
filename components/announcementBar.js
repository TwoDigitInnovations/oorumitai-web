import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";

function AnnouncementBar({ announcementBar, setAnnouncementBar, loader, toaster }) {
  const [shipmentCostMessage, setShipmentCostMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncementBar(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getShippingCosts();
  }, []);

  const getShippingCosts = async () => {
    try {
      const res = await Api("get", "getShippingCost", null, router);
      loader(false);
      if (res.shippingCosts && res.shippingCosts.length > 0) {
        const costs = res.shippingCosts[0];
        setShipmentCostMessage(costs.shipmentCostMessage || "");
      }
    } catch (err) {
      loader(false);
      toaster({
        type: "error",
        message: err?.message || "Failed to fetch shipping costs",
      });
    }
  };

  return (
    <>
      <style>
        {`
@keyframes marquee-mobile {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}

@media (max-width: 640px) {
  .animate-marquee-mobile {
    animation: marquee-mobile 15s linear infinite;
  }
}

@media (min-width: 641px) {
  .animate-marquee-mobile {
    animation: none; /* desktop: no animation */
  }
}
`}
      </style>

      <div
        className={`transition-all duration-500 ease-in-out ${announcementBar ? "opacity-100 max-h-12" : "opacity-0 max-h-0 overflow-hidden"
          }`}
      >
        <div className="relative overflow-hidden">
          {/* Yellow Stripe with hline pattern - Background for AnnouncementBar */}
          <div className="absolute top-0 right-0 w-[27%] h-full bg-[#F9C60A] z-[1] pointer-events-none hidden md:block">
            <div className="absolute inset-0 opacity-40 mix-blend-multiply">
              {/* <img
                src="/hline.png"
                alt="Pattern"
                className="w-full h-full object-cover"
              /> */}
            </div>
          </div>

          <div className="relative w-full h-12 overflow-hidden flex justify-center items-center bg-transparent text-black z-10"></div>
          <div
            className="absolute whitespace-nowrap animate-marquee-mobile left-8 md:left-[30%]"
          >
            <span className="pr-8">{shipmentCostMessage}</span>
          </div>

        </div>
      </div>
    </>
  );
}

export default AnnouncementBar;
