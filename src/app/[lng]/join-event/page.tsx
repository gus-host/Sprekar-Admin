import React from "react";
import ScannerComponent from "./_partials/ScannerComponent";
import { I8nParams } from "../page";
const VISITOR_TOKEN = process.env.VISITOR_ACCESS_TOKEN;

export const metadata = {
  title: "Join Event",
};
export default async function page({ params }: { params: I8nParams }) {
  const { lng } = await params;
  return <ScannerComponent token={VISITOR_TOKEN as string} lng={lng} />;
}
