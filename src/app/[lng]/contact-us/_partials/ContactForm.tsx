"use client";

import React from "react";
import useContactusFormik from "../useContactusFormik";
import { FormField } from "../../_partials/FormField";
import { useTranslation } from "@/app/i18n/client";

export default function ContactForm({ lng }: { lng: string }) {
  const { formik, isSubmitting } = useContactusFormik(lng);
  const { t } = useTranslation(lng, "contact");
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[674px] py-[28px] px-[40px] mx-auto bg-white"
    >
      <div className="flex flex-col md:flex-row gap-x-3 gap-y-6 mb-6">
        <FormField
          as="input"
          label={`${t("contact.form.fields.firstName.label")}`}
          placeholder={`${t("contact.form.fields.firstName.placeholder")}`}
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.submitCount > 0 && formik.errors.firstName}
        />
        <FormField
          as="input"
          label={`${t("contact.form.fields.lastName.label")}`}
          placeholder={`${t("contact.form.fields.lastName.placeholder")}`}
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
          label={`${t("contact.form.fields.email.label")}`}
          placeholder={`${t("contact.form.fields.email.placeholder")}`}
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
          label={`${t("contact.form.fields.message.label")}`}
          placeholder={`${t("contact.form.fields.message.placeholder")}`}
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
        {isSubmitting
          ? `${t("contact.form.button.loading")}`
          : `${t("contact.form.button.default")}`}
      </button>
    </form>
  );
}
