import React from "react";
import ScannerComponent from "./_partials/ScannerComponent";
const VISITOR_TOKEN = process.env.VISITOR_ACCESS_TOKEN;

export default function page() {
  return <ScannerComponent token={VISITOR_TOKEN as string} />;
}
