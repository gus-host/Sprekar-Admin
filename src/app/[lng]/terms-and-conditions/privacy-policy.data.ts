import { PolicySection } from "./privacy-policy.types";

export const privacyPolicySections: PolicySection[] = [
  {
    id: 1,
    title: "Acceptance of Terms",
    text: "By using Sprekar, you agree to be bound by these Terms of Service",
  },
  {
    id: 2,
    title: "User Conduct",
    items: [
      "You agree to use the app only for lawful purposes .",
      "You will not impersonate others or engage in any abusive behaviours.",
    ],
  },
  {
    id: 3,
    title: "Account Management",
    items: [
      "You are responsible for maintaining the confidentiality of your account.",
      "Sprekar may suspend or terminate account that violates terms.",
    ],
  },
  {
    id: 4,
    title: "Service Availability ",
    text: "Sprekar is provided “as-is” and “as-available”. We make no guarantee of uptime or accuracy.",
  },
  {
    id: 5,
    title: "Intellectual Property",
    text: "All content and technology used in Sprekar are owned  by us or our licensors. You may not reverse- engineer or copy them",
  },
  {
    id: 6,
    title: "Limitation of Liability",
    text: "Sprekar is not liable for any indirect or consequential damages arising from the use of the app.",
  },
  {
    id: 7,
    title: "Governing Law",
    text: "These terms are governed by the laws of Netherlands.",
  },
  {
    id: 8,
    title: "Modifications",
    text: "We reserve the rights to modify these Terms. Continued use of the app means you accept the updated terms.",
  },
  {
    id: 9,
    title: "Contact Us",
    text: `For questions about this  Terms, email: <strong>hello@sprekar.com</strong>.`,
  },
];
