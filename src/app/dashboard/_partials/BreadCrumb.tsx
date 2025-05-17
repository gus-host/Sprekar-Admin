"use client";

import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import SeperatorNext from "@/app/_svgs/SeperatorNext";

export default function BreadCrumb({
  links,
  active,
  href,
}: {
  links: string[];
  active: string;
  href: string[];
}) {
  const l = links.map((link, i) => (
    <Link
      key={i}
      color="inherit"
      href={href[i]}
      sx={{ fontSize: "14px", textDecoration: "none" }}
    >
      {link}
    </Link>
  ));
  const breadcrumbs = [
    ...l,
    <Typography key="3" sx={{ color: "text.primary", fontSize: "14px" }}>
      {active}
    </Typography>,
  ];

  return (
    <div className="px-2 py-1 border border-[#E8E8E8] rounded mt-[10px] mb-[40px]">
      <Breadcrumbs separator={<SeperatorNext />} aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
}
