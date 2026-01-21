import React, { useContext, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/router";
import {
  userContext,
  cartContext,
  openCartContext,
  favoriteProductContext,
  languageContext
} from "@/pages/_app";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { Api } from "@/services/service";
import { IoRemoveSharp } from "react-icons/io5";
import { IoAddSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import constant from "@/services/constant";
import Image from "next/image";

const GroceryCatories = ({ item, i, url, loader, toaster, onFavoriteChange }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [cartData, setCartData] = useContext(cartContext);
  const { lang } = useContext(languageContext);
  const [user] = useContext(userContext);
  const [Favorite, setFavorite] = useContext(favoriteProductContext);


  const handleAddToCart = () => {
    const itemQuantity = Number(item?.Quantity ?? 0);

    if (itemQuantity <= 0) {
      toaster({
        type: "error",
        message: "This item is currently out of stock. Please choose a different item.",
      });
      return;
    }

    const existingItem = cartData.find((f) => f._id === item?._id);

    if (existingItem) {
      toaster({ type: "info", message: "Item already in cart." });
      return;
    }

    const newItem = {
      ...item,
      id: item?._id,
      selectedColor: item?.varients?.[0] || {},
      selectedImage: item?.varients?.[0]?.image?.[0] || "",
      BarCode: item?.BarCode || "",
      qty: 1,
      price: item.price_slot?.[0]?.our_price ?? 0,
      total: Number(item.price_slot?.[0]?.our_price ?? 0),
      price_slot: item.price_slot?.[0] || {},
      tax: item?.tax,
    };

    const updatedCart = [...cartData, newItem];
    setCartData(updatedCart);
    localStorage.setItem("addCartDetail", JSON.stringify(updatedCart));

    toaster({ type: "success", message: "Product added to cart" });
  };

  const isFavorite = Favorite.some(
    (fav) => {
      const favId = fav?.product?._id || fav?._id;
      return favId === item?._id;
    }
  );

  const toggleFavorite = async () => {
    if (!user?.token) {
      return toaster({ type: "error", message: "Login required" });
    }

    loader(true);
    try {
      const data = { product: item?._id };
      const res = await Api("post", "addremovefavourite", data, router);

      if (res.status) {
        // Fetch fresh favorites from backend to ensure consistency
        const favRes = await Api("get", "getFavourite", null, router, { id: user._id });
        
        if (favRes.status && favRes.data) {
          const favoriteProducts = favRes.data.map(fav => fav.product).filter(Boolean);
          setFavorite(favoriteProducts);
          localStorage.setItem("Favorite", JSON.stringify(favoriteProducts));
          
          if (isFavorite) {
            toaster({ type: "error", message: "Item Removed From Favorite" });
            // Refresh the favorites page if callback provided
            if (onFavoriteChange) {
              onFavoriteChange();
            }
          } else {
            toaster({ type: "success", message: "Item Added to Favorite" });
          }
        }
      }
      loader(false);
    } catch (err) {
      loader(false);
      toaster({ type: "error", message: err?.message || "Something went wrong" });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("Favorite");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Remove duplicates based on _id
        const unique = parsed.filter((item, index, self) =>
          index === self.findIndex((t) => t._id === item._id)
        );
        setFavorite(unique);
        if (unique.length !== parsed.length) {
          localStorage.setItem("Favorite", JSON.stringify(unique));
        }
      } catch {
        localStorage.removeItem("Favorite");
      }
    }
  }, []);


  const cartItem = cartData.find((cartItem) => cartItem._id === item._id);
  const itemQuantity = cartItem ? cartItem.qty : 0;

  const handleProductClick = () => {
    if (loader) loader(true);  // Show global loader
    router.push(url);
  };

  return (
    <div
      key={i}
      className="bg-[#F9C60A29] w-full rounded-[20px] shadow-md hover:shadow-lg transition-all duration-300 md:p-5 p-3 relative border border-[#F9C60A]/20"
    >
      {/* Category Badge */}
      <div className="absolute top-3 left-3 bg-[#F9C60A] text-black text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-sm">
        {item.categoryName}
      </div>

      {/* Product Image */}
      <div className="relative w-full md:h-48 h-36 flex items-center justify-center mb-4 mt-6 z-0">
        <Image
          src={item.varients[0].image[0]}
          alt={item?.imageAltName || "Product Image"}
          className="object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={handleProductClick}
          fill
          sizes="(max-width: 768px) 150px, 200px"
          priority
        />
      </div>

      {/* Product Name with Wishlist Icon */}
      <div className="flex items-start justify-between gap-2">
        <h3 
          className="text-black md:text-base text-sm font-semibold min-h-[40px] line-clamp-2 cursor-pointer hover:text-custom-green transition-colors flex-1"
          onClick={handleProductClick}
        >
          {lang === "en"
            ? item.name
            : item.vietnamiesName || item.name}
        </h3>
        
        {/* Favorite Button - Next to Product Name */}
        <div
          className="border-2 border-black rounded-full bg-white md:w-8 md:h-8 h-7 w-7 flex justify-center items-center shadow-sm cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <FaHeart className="text-red-600 md:w-4 md:h-4 h-3 w-3" />
          ) : (
            <FaRegHeart className="text-black md:w-4 md:h-4 h-3 w-3" />
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col items-start mb-3">
        <p className="text-black md:text-lg text-base font-bold">
          {constant.currency}{" "}
          {Number(item?.price_slot[0]?.our_price || 0).toFixed(2)}
        </p>
        {item?.price_slot[0]?.other_price && (
          <del className="text-[#F9C60A] md:text-sm text-xs font-medium">
            {constant.currency}{" "}
            {Number(item?.price_slot[0]?.other_price || 0).toFixed(2)}
          </del>
        )}
      </div>

      {/* Add to Cart / Quantity Controls */}
      <div className="w-full flex justify-center">
        {item?.Quantity <= 0 ? (
          <button
            className="bg-gray-400 text-white font-semibold md:px-6 px-4 md:py-2 py-1.5 rounded-full md:text-sm text-xs cursor-not-allowed shadow-sm"
            disabled
          >
            {t("Out of Stock")}
          </button>
        ) : itemQuantity > 0 ? (
          <div className="bg-white rounded-full flex items-center justify-center px-2 py-1.5 border-2 border-[#F9C60A] shadow-sm">
            <div
              className="bg-[#F9C60A] cursor-pointer rounded-full md:w-7 md:h-7 w-6 h-6 flex justify-center items-center hover:bg-opacity-90 transition-colors"
              onClick={() => {
                const updatedCart = cartData.map((cartItem) => {
                  if (cartItem._id === item._id) {
                    if (cartItem.qty > 1) {
                      const newQty = cartItem.qty - 1;
                      return {
                        ...cartItem,
                        qty: newQty,
                        total: (newQty * (cartItem.price || 0)).toFixed(2),
                      };
                    } else {
                      return cartItem;
                    }
                  }
                  return cartItem;
                });

                setCartData(updatedCart);
                localStorage.setItem(
                  "addCartDetail",
                  JSON.stringify(updatedCart)
                );
              }}
            >
              <IoRemoveSharp className="text-black md:w-4 md:h-4 w-3.5 h-3.5" />
            </div>

            <p className="text-black md:text-base text-sm font-bold mx-4 min-w-[20px] text-center">
              {itemQuantity}
            </p>

            <div
              className="bg-[#F9C60A] cursor-pointer rounded-full md:w-7 md:h-7 w-6 h-6 flex justify-center items-center hover:bg-opacity-90 transition-colors"
              onClick={() => {
                const updatedCart = cartData.map((cartItem) => {
                  if (cartItem._id === item._id) {
                    if (cartItem.qty + 1 > item.Quantity) {
                      toaster({
                        type: "error",
                        message:
                          "Item is not available in this quantity in stock. Please choose a different item.",
                      });
                      return cartItem;
                    }
                    return {
                      ...cartItem,
                      qty: cartItem.qty + 1,
                      total: ((cartItem.price || 0) * (cartItem.qty + 1)).toFixed(2),
                    };
                  }
                  return cartItem;
                });

                setCartData(updatedCart);
                localStorage.setItem(
                  "addCartDetail",
                  JSON.stringify(updatedCart)
                );
              }}
            >
              <IoAddSharp className="text-black md:w-4 md:h-4 w-3.5 h-3.5" />
            </div>
          </div>
        ) : (
          <button
            className="bg-[#F9C60A] text-black font-bold md:px-8 px-6 md:py-2 py-1.5 rounded-full md:text-sm text-xs cursor-pointer hover:bg-opacity-90 transition-colors shadow-sm mx-auto block"
            onClick={handleAddToCart}
          >
            {t("Add To Cart")}
          </button>
        )}
      </div>
    </div>
  );
};

export default GroceryCatories;
