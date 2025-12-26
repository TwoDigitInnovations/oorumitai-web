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

        <div className="bg-white p-3 shadow-md w-full hidden md:flex">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

                <div className="flex flex-1 justify-center ps-52">
                    <div className="flex items-center w-full max-w-lg bg-gray-50 rounded-full px-4 py-2 border-2 relative">
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

              
                <div className="flex items-center gap-3 pl-6">
                    {/* Track Order Link */}
                    {/* <div
                        className="cursor-pointer flex items-center gap-2 hover:text-custom-green transition-colors"
                        onClick={() => router.push("/track-order")}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-black" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                            />
                        </svg>
                        <span className="text-black font-medium">{t("Track Order")}</span>
                    </div> */}

                    <span className="text-md text-gray-600"> {t("Select Language")}:</span>
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


    );
};

export default LeftLayout;