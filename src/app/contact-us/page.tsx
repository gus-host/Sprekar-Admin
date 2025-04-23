"use client";

import Image from "next/image";
import { useFormik } from "formik";

import Header from "../_partials/Header";
import HomePageLayout from "../_partials/_layout/HomePageLayout";
import { nunitoSans, robotoSerif } from "../_partials/fontFamilies";

import bgImg from "@/../public/bgImg.png";
import { validationSchema } from "./contact-us.validation";
import { FormField } from "../_partials/FormField";

export default function page() {
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  return (
    <div className="bg-[#F8F8F8]">
      <HomePageLayout>
        <div style={{ overflowX: "hidden" }}>
          <section className="relative max-[750px]:pt-[80px] min-h-[1051px]">
            <div className="relative z-10">
              <Header />
              <div className="mx-auto px-[20px]">
                <h1
                  className={`mt-[146px] ${robotoSerif.className} text-[48px] text-center font-black max-[820px]:text-[48px] max-[820px]:${nunitoSans.className}`}
                >
                  We’d love to help
                </h1>
                <p className="text-[#323232B2] text-[16px] text-center max-w-[520px] mx-auto mb-[60px]">
                  Reach out and we’ll get back to you within 24 hours!
                </p>
              </div>
              <form
                onSubmit={formik.handleSubmit}
                className="w-full max-w-[674px] py-[28px] px-[40px] mx-auto bg-white"
              >
                <div className="flex flex-col md:flex-row gap-x-3 gap-y-6 mb-6">
                  <FormField
                    as="input"
                    label="First name"
                    placeholder="Enter your name"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.submitCount > 0 && formik.errors.firstName}
                  />
                  <FormField
                    as="input"
                    label="Last name"
                    placeholder="Enter your name"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.submitCount > 0 && formik.errors.lastName}
                  />
                </div>
                <div className="mb-6">
                  <FormField
                    as="input"
                    label="Email Address"
                    placeholder="Enter your email address"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.submitCount > 0 && formik.errors.email}
                  />
                </div>

                <div className="mb-[46px]">
                  <FormField
                    as="textarea"
                    label="Message"
                    placeholder="Enter your message"
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.submitCount > 0 && formik.errors.message}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-semibold py-3 rounded-[8px] shadow-md hover:opacity-90 transition-opacity duration-300"
                  style={{
                    backgroundImage: [
                      "radial-gradient(ellipse 100% 90% at center, #025FF3, transparent 50%)",
                      "linear-gradient(90deg, #01378D 0%,  #01378D 100%)",
                    ].join(", "),
                  }}
                >
                  Send message
                </button>
              </form>
            </div>
            <Image
              src={bgImg}
              alt="Hero background image"
              placeholder="blur"
              fill
              className="object-cover object-top"
              quality={100}
            />
          </section>
        </div>
      </HomePageLayout>
    </div>
  );
}
