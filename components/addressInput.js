"use client";
import { useRef, useState, useEffect } from "react";
// Google Maps temporarily disabled - will be enabled in future
// import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";

// const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
// const libraries = ["places"];

const AddressInput = ({ profileData, setProfileData, className, value }) => {
  const { t } = useTranslation();
  // const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || "");

  // Google Maps API loader - temporarily disabled
  // const { isLoaded, loadError } = useJsApiLoader({
  //   googleMapsApiKey: GOOGLE_API_KEY,
  //   libraries,
  // });

  useEffect(() => {
    if (value) {
      setInputValue(value);
    }
  }, [value]);

  // Google Maps place select handler - temporarily disabled
  // const handlePlaceSelect = () => {
  //   const place = autocompleteRef.current?.getPlace();

  //   if (place && place.geometry) {
  //     const formattedAddress = place.formatted_address || "Unknown Address";
  //     const addressComponents = place.address_components || [];

  //     const city =
  //       addressComponents.find((comp) => comp.types.includes("locality"))
  //         ?.long_name || "";

  //     const state =
  //       addressComponents.find((comp) =>
  //         comp.types.includes("administrative_area_level_1")
  //       )?.long_name || "";

  //     const country =
  //       addressComponents.find((comp) => comp.types.includes("country"))
  //         ?.long_name || "";

  //     const latitude = place.geometry.location.lat();
  //     const longitude = place.geometry.location.lng();

  //     setInputValue(formattedAddress);

  //     setProfileData((prev) => ({
  //       ...prev,
  //       address: formattedAddress,
  //       city,
  //       state,
  //       country,
  //       location: {
  //         type: "Point",
  //         coordinates: [longitude, latitude],
  //       },
  //     }));
  //   }
  // };

  useEffect(() => {
    if (profileData?.address) {
      setInputValue(profileData.address);
    }
  }, [profileData]);

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    // Update profile data with manual address input
    setProfileData((prev) => ({
      ...prev,
      address: val,
    }));
  };

  // Google Maps loading states - temporarily disabled
  // if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  // if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="!z-[99999999] space-y-3">
      {/* Simple address input - Google Maps Autocomplete temporarily disabled */}
      <input
        className={className}
        type="text"
        placeholder={t("Shipping Address")}
        value={inputValue}
        onChange={handleAddressChange}
        required
      />
      
      {/* Google Maps Autocomplete - will be enabled in future
      <Autocomplete
        onLoad={(autoC) => (autocompleteRef.current = autoC)}
        onPlaceChanged={handlePlaceSelect}
        options={{ types: ["address"] }}
      >
        <input
          className={className}
          type="text"
          placeholder={t("Shipping Address")}
          value={inputValue}
          onChange={handleAddressChange}
          required
        />
      </Autocomplete>
      */}
    </div>
  );
};

export default AddressInput;
