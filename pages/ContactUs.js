import React, { useState } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import { useTranslation } from "react-i18next";
import Head from "next/head";
const FeedbackForm = (props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    query: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full name is required";
        if (!/^[A-Za-z\s]+$/.test(value)) return "Only letters and spaces allowed";
        if (value.trim().split(/\s+/).length < 2) return "Please enter both first and last name";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
      case "phoneNumber":
        if (!value) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Phone number must be 10 digits";
        return "";
      case "query":
        if (!value.trim()) return "This field is required";
        if (value.length < 10) return "Message should be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName" && /[0-9]/.test(value)) {
      return;
    }
    if (name === "phoneNumber" && value && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const submitFeedback = (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        formValid = false;
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (!formValid) {
      props.toaster({
        type: "error",
        message: "Please fix the errors in the form",
      });
      return;
    }

    props.loader(true);

    Api("post", "createFeedback", formData).then(
      (res) => {
        props.loader(false);
        if (res?.status) {
          props.toaster({
            type: "success",
            message: "Query submitted successfully",
          });
          // Reset form
          setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            query: "",
            message: "",
          });
          router.push("/");
        } else {
          props.toaster({
            type: "error",
            message: res?.data?.message || "Failed to submit feedback",
          });
        }
      },
      (err) => {
        props.loader(false);
        props.toaster({
          type: "error",
          message: err?.data?.message || "Failed to submit feedback",
        });
      }
    );
  };

  return (
    <>
      <Head>
        <title>Contact Us – Oorumittai Specialty Food</title>
        <meta name="description" content="Join the Oorumittai family! Own a proven retail franchise with food, grocery & delivery services. Start your franchise journey" />
        <link
          rel="canonical"
          href="https://www.Oorumittai.com/ContactUs"
        />
      </Head>

      <div className="min-h-screen md:mt-5 mt-14 md:mb-0 mb-10">
        <div className="container mx-auto px-14 py-8 md:py-12">
          {/* Main Card with Background Image */}
          <div 
            className="relative  overflow-hidden shadow-2xl"
            style={{
              backgroundImage: 'url(/contactimage.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left Side - Content */}
              <div className="flex flex-col justify-center backdrop-blur-xs bg-gray-200/30 p-8 md:p-12 lg:p-16 h-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                  {t("Get in-touch")}<br />{t("with us")}!
                </h1>

                <p className="text-base md:text-lg mb-8 leading-relaxed text-gray-900">
                  {t("We're here to help! Whether you have a question about our services or need assistance with your account or want to provide feedback, our team is ready to assist you")}.
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1 text-gray-900">{t("Email")}:</p>
                    <a
                      href="mailto:contact@Oorumittai.com"
                      className="text-lg text-gray-900 hover:text-[#F9C60A] transition underline"
                    >
                      contact@Oorumittai.com
                    </a>
                  </div>

                  <div>
                    <p className="font-semibold mb-1 text-gray-900">{t("Phone No")}:</p>
                    <a
                      href="tel:1234567890"
                      className="text-lg text-gray-900 hover:text-[#F9C60A] transition underline"
                    >
                      1234567890
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 h-full">
                <form
                  className="backdrop-blur-xs bg-gray-100/30 p-8 md:p-10 rounded-3xl w-full max-w-xl"
                  onSubmit={submitFeedback}
                >
                  <div className="mb-5">
                    <label className="font-semibold text-gray-900 text-base block mb-2">
                      {t("Full Name")}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3.5 text-gray-700 bg-[#FFFBEA] rounded-xl outline-none border-0 placeholder:text-gray-500 ${
                        errors.fullName ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t("Enter your name")}
                      required
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="font-semibold text-gray-900 text-base block mb-2">
                      {t("Email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3.5 text-gray-700 bg-[#FFFBEA] rounded-xl outline-none border-0 placeholder:text-gray-500 ${
                        errors.email ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t("Enter your email name")}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="font-semibold text-gray-900 text-base block mb-2">
                      {t("Phone Number")}
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={10}
                      className={`w-full px-5 py-3.5 text-gray-700 bg-[#FFFBEA] rounded-xl outline-none border-0 placeholder:text-gray-500 ${
                        errors.phoneNumber ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t("Enter your Phone no")}
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="font-semibold text-gray-900 text-base block mb-2">
                      {t("Message")}
                    </label>
                    <textarea
                      name="query"
                      rows="5"
                      value={formData.query}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3.5 text-gray-700 bg-[#FFFBEA] rounded-xl outline-none resize-none border-0 placeholder:text-gray-500 ${
                        errors.query ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder={t("Enter your Message")}
                      required
                    ></textarea>
                    {errors.query && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.query}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-12 rounded-full transition-colors cursor-pointer shadow-md"
                    >
                      {t("Send Message")}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>

    </>

  );
};

export default FeedbackForm;