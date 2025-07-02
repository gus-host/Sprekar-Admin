import React from "react";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";
import CookiesPolicy from "./CookiesPolicy";

export default function TermsAndPolicyDisplay({
  policyIndex,
}: {
  policyIndex: number;
}) {
  switch (policyIndex) {
    case 0:
      return <TermsOfService />;
    case 1:
      return <PrivacyPolicy />;
    case 2:
      return <CookiesPolicy />;

    default:
      return <TermsOfService />;
  }
}
