import React from "react";
import ScannerComponent from "./_partials/ScannerComponent";
import { I8nParams } from "../page";
import { notFound } from "next/navigation";
const VISITOR_TOKEN = process.env.VISITOR_ACCESS_TOKEN;

export const metadata = {
  title: "Join Event",
};
export default async function page({ params }: { params: Promise<I8nParams> }) {
  const paramsTest = await params;
  const lng = paramsTest?.lng;

  if (!lng) {
    notFound();
  }
  return <ScannerComponent token={VISITOR_TOKEN as string} lng={lng} />;
}
