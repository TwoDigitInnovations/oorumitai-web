import React, { useState, useEffect, useContext } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/router";
import { languageContext } from "@/pages/_app";
import { useTranslation } from "react-i18next";

const LeftLayout = (props) => {
    const [isLanguage, setIsLanguage] = useState(false);
    const [searchData, setSearchData] = useState("");
    const { lang, changeLang } = useContext(languageContext);
    const { i18n, t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    const handleClick = (language) => {
        try {
            changeLang(language);
            i18n.changeLanguage(language);
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        if (searchData.trim() === "") {
            props.toaster({
                type: "error",
                message: "Please enter search value",
            });
            return;
        }
        props.loader(true);
        router.push(`/Search/${searchData}`);
        // setSearchData("");
        props.loader(false);
    };

    return (
        <>
            <div className="relative overflow-hidden">
                {/* Yellow Stripe with hline pattern - Background for LeftLayout */}
                <div className="absolute top-0 right-0 w-[27%] h-full bg-[#F9C60A] z-[1] pointer-events-none hidden md:block">
                    <div className="absolute inset-0 opacity-40 mix-blend-multiply">
                        {/* <img
                            src="/hline.png"
                            alt="Pattern"
                            className="w-full h-full object-cover"
                        /> */}
                    </div>
                </div>

                <div className="bg-transparent p-3 shadow-md w-full relative z-10 hidden md:block">
                    <div className="flex items-center justify-center w-full mx-auto px-4 gap-8">
                        {/* Centered Search Box */}
                        <div className="flex justify-center flex-1">
                            <div className="flex items-center w-full max-w-lg bg-white rounded-full px-4 py-2 border-2 border-gray-300 relative shadow-sm">
                                <Search size={20} className="text-gray-400" />
                                <form onSubmit={handleSearchSubmit} className="flex-1">
                                    <input
                                        type="text"
                                        value={searchData}
                                        onChange={(e) => setSearchData(e.target.value)}
                                        placeholder={t("Search")}
                                        className="w-full bg-transparent text-black text-sm px-3 outline-none placeholder:text-gray-400"
                                    />
                                </form>

                                {searchData && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchData("")}
                                        className="absolute cursor-pointer right-3 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Select Language on Right */}
                        <div className="flex items-center gap-3 flex-shrink-0 relative z-20">
                            <div className="bg-[#F9C60A] px-4 py-2 relative z-20 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <span className="text-md text-black font-semibold whitespace-nowrap">{t("Select Language")}:</span>
                                    <div className="flex bg-gray-200 rounded-full overflow-hidden border border-gray-300 gap-2">
                                        <button
                                            onClick={() => handleClick("en")}
                                            className={`px-3 py-2 cursor-pointer text-[14px] transition ${lang === "en"
                                                    ? "bg-[#F9C60A] text-black font-bold rounded-full"
                                                    : "text-black font-semibold"
                                                }`}
                                        >
                                            EN
                                        </button>
                                        <button
                                            onClick={() => handleClick("fr")}
                                            className={`px-3 py-2 text-[14px] cursor-pointer transition ${lang === "fr"
                                                    ? "bg-[#F9C60A] text-black font-bold rounded-full"
                                                    : "text-black font-semibold"
                                                }`}
                                        >
                                            FR
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftLayout;
