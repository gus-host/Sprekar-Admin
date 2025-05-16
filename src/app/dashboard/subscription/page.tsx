import React from "react";
import Subscription from "./_partials/Subscription";
const PRICEID = process.env.PRICEID;

export default function page() {
  return (
    <div>
      <h2 className="mb-[50px] text-[18px]">Subscription and billing</h2>
      <Subscription priceId={PRICEID as string} />
    </div>
  );
}
