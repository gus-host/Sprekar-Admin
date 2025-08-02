"use client";

import Image from "next/image";
import { useFormik } from "formik";

import Header from "@/app/[lng]/_partials/Header";
import HomePageLayout from "@/app/[lng]/_partials/_layout/HomePageLayout";

import bgImg from "@/../public/bgImg.png";
import { validationSchema } from "./contact-us.validation";
import { FormField } from "@/app/[lng]/_partials/FormField";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import H1 from "@/app/[lng]/_partials/H1";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      try {
        setIsSubmitting(true);
        const response = await axios.post("/api/contact-us", {
          ...values,
        });
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          console.log(response.data);
          toast.success("Message successfully sent!");
        } else {
          console.log(response.data);
          toast.error(response.data.data.message || "An error occured");
        }
      } catch (error) {
        if (axios.isAxiosError(error))
          toast.error(error?.response?.data?.message || "An error occured.");
        if (error instanceof Error) console.log(error);
      } finally {
        setIsSubmitting(false);
      }
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
                <H1>We’d love to help</H1>
                <p className="text-[#323232B2] text-[16px] text-center max-w-[520px] mx-auto mb-[60px]">
                  Reach out and we’ll get back to you within 24 hours!
                </p>
              </div>
              <div className="px-[30px]">
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
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? "0.5" : "1",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending Message..." : "Send message"}
                  </button>
                </form>
              </div>
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
