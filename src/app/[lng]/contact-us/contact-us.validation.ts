import * as Yup from "yup";

export function getValidationSchema(t: (key: string) => string) {
  return Yup.object().shape({
    firstName: Yup.string().required(
      t("contact.form.validation.firstName.required")
    ),
    lastName: Yup.string().required(
      t("contact.form.validation.lastName.required")
    ),
    email: Yup.string()
      .email(t("contact.form.validation.email.invalid"))
      .required(t("contact.form.validation.email.required")),
    message: Yup.string().required(
      t("contact.form.validation.message.required")
    ),
  });
}
