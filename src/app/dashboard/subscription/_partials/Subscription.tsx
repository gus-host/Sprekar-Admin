"use client";

// import RadioInput from "./_partials/RadioInput";
import CheckIcon from "@/app/_svgs/CheckIcon";
import { useState } from "react";
import ActiveCheckedSub from "@/app/_svgs/ActiveCheckedSub";
import UncheckedSub from "@/app/_svgs/UncheckedSub";
import CheckoutButton from "./CheckoutButton";
import { LucideMessageCircleWarning } from "lucide-react";
import ModalMUI from "@/components/ModalMUI";
import SuccessIcon from "@/app/_svgs/SuccessIcon";
import { useRouter, useSearchParams } from "next/navigation";
import FailedIcon from "@/app/_svgs/FailedIcon";

export default function Subscription({ priceId }: { priceId: string }) {
  const [plan, setPlan] = useState("monthly");
  const router = useRouter();

  const searchParams = useSearchParams();

  const status = searchParams.get("subscriptionStatus");
  const period = searchParams.get("period");
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(
    status === "canceled" && period === "monthly"
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(
    status === "success" && period === "monthly"
  );

  console.log(status, period);

  const plans = [
    {
      id: "yearly",
      label: "Yearly",
      price: "$79.99",
      period: "Yearly",
      discount: "30% off",
    },
    {
      id: "monthly",
      label: "Monthly",
      price: "$49.00",
      period: "Month",
      discount: null,
    },
  ];

  const features = [
    "Unlimited 1-on-1 & group translations",
    "Speech-to-speech translation in all supported languages",
    "AI-powered summaries & smart folders",
    "Custom translation voice & accent",
    "Remove all usage limits",
  ];

  return (
    <div className="max-w-4xl rounded border border-[#9E9E9E] pl-6 max-[932px]:pr-6 grid grid-cols-1 min-[932px]:grid-cols-11 min-h-[707px] max-[932px]:pb-[30px]">
      {/* Left Panel */}
      <div className="min-[932px]:col-start-1 min-[932px]:col-end-6">
        <div className="mb-[30px]">
          <h2 className="text-[26px] text-[#323232] my-[20px]">
            Start your free 14-days pro trial
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center">
              <CheckIcon />
              <span className="ml-2 text-[14px] text-[#323232]">
                Ideal for daily users, students, expats & global communicators.
              </span>
            </li>
          </ul>
        </div>

        <h3 className="text-[#323232] font-semibold text-[14px] mb-[20px]">
          Choose a plan
        </h3>

        <div className="space-y-4">
          {plans.map((p) => (
            <label
              key={p.id}
              className={`flex rounded-[8px] py-[20px] px-[15px] cursor-pointer transition-all border-[3px] gap-[30px] max-[932px]:relative
           ${plan === p.id ? "border-[#025FF3]" : "border-[#4C4C4C24]"} `}
              onClick={() => setPlan((plan) => (plan !== p.id ? p.id : plan))}
            >
              <div className="flex items-center gap-[30px]">
                {plan === p.id ? (
                  <span>
                    <ActiveCheckedSub />
                  </span>
                ) : (
                  <span
                    onClick={() =>
                      setPlan((plan) => (plan !== p.id ? p.id : plan))
                    }
                  >
                    <UncheckedSub />
                  </span>
                )}

                <div className="text-[#323232]">
                  <span className="">{p.label}</span>
                  <div className="text-[20px] font-semibold">
                    {p.price} / {p.period}
                  </div>
                </div>
              </div>
              <div className="">
                {p.discount && (
                  <div className="text-center text-[12px] text-[#025FF3] min-w-[100px] py-1 bg-[#025FF317] rounded-[8px] max-[932px]:absolute max-[932px]:right-0 max-[932px]:top-0">
                    {p.discount}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
        <div className="mt-[50px]">
          {plan === "monthly" ? (
            <CheckoutButton priceId={priceId} />
          ) : (
            <div className="flex justify-center gap-2 items-center">
              <LucideMessageCircleWarning color="#676767" />
              <p className="text-[14px] text-[#676767]">
                This plan is not yet active do check back later!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="min-[932px]:flex min-[932px]:items-center  pl-6 min-[932px]:col-start-7 min-[932px]:col-end-12 bg-[#E8E8E86B] max-[932px]:py-4 max-[932px]:mt-7 max-[932px]:rounded">
        <div className="min-[932px]:mt-[-260px]">
          <h3 className="text-[#1E1E1E] text-[18px] mb-[50px]">Features</h3>
          <ul className="space-y-3">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center">
                <CheckIcon />
                <span className="ml-2 text-[14px] text-[#1E1E1E]">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isSuccessModalOpen && (
        <ModalMUI
          isModalOpen={isSuccessModalOpen}
          setIsModalOpen={setIsSuccessModalOpen}
        >
          <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
            <SuccessIcon />
            <p className="mt-4 text-center">
              You have successfully subscribed to <strong>monthly</strong>{" "}
              <strong>pro</strong> plan
            </p>
            <button
              type="button"
              className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2 w-full mt-7 cursor-pointer"
              style={{
                fontFamily: "Helvetica Compressed, sans-serif",
                boxShadow: "0px 0px 6.4px 4px #0255DA57",
              }}
              onClick={() => router.push("/dashboard")}
            >
              <span>Go to dashboard</span>
            </button>
          </div>
        </ModalMUI>
      )}
      {isFailedModalOpen && (
        <ModalMUI
          isModalOpen={isFailedModalOpen}
          setIsModalOpen={setIsFailedModalOpen}
        >
          <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
            <FailedIcon />
            <p className="mt-4 text-center">Subscription failed</p>

            <CheckoutButton priceId={priceId} text="Retry" />
          </div>
        </ModalMUI>
      )}
    </div>
  );
}
