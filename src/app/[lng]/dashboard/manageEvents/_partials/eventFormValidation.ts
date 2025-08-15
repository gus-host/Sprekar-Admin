import * as Yup from "yup";

export const eventFormValidation = Yup.object().shape({
  name: Yup.string().required("Event name is required"),
  startDate: Yup.string().required("Start date is required!"),
  startTime: Yup.string().required("Start time is required!"),
  endDate: Yup.string().required("End Date is required!"),
  endTime: Yup.string().required("End Time is required!"),
  supportedLanguages: Yup.array()
    .min(2, "Please select at least two languages")
    .required("Required"),
  timezone: Yup.object({
    value: Yup.string().required("A timezone value is required"),
    label: Yup.string().required("A timezone label is required"),
  }).required("A timezone is required"),
  eventType: Yup.object({
    value: Yup.string().required("A event type value is required"),
    label: Yup.string().required("A event type label is required"),
  }).required("An event type is required"),
});
