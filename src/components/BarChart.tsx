/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import React from "react";
import {
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
  TooltipProps,
} from "recharts";

// Sample data with two groups (e.g., actual vs. projected attendees)
const data = [
  { month: "Jan", actual: 225, projected: 256 },
  { month: "Feb", actual: 176, projected: 189 },
  { month: "Mar", actual: 43, projected: 394 },
  { month: "Apr", actual: 35, projected: 37 },
  { month: "May", actual: 35, projected: 37 },
  { month: "Jun", actual: 5, projected: 10 },
  { month: "Jul", actual: 5, projected: 10 },
  { month: "Aug", actual: 1, projected: 1 },
];

// Custom Tooltip
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F4FB6] text-white px-3 py-1 rounded-[5px] shadow-[#00000099] text-sm">
        <p className="font-semibold">{payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const BarChart = () => {
  const { clientWidth } = useResponsiveSizes();
  const responsiveData =
    clientWidth && clientWidth < 490
      ? data.filter((_, i) => i < 4)
      : clientWidth && clientWidth > 400
      ? data.filter((_, i) => i < 8)
      : [];
  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <Chart
          data={responsiveData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          barCategoryGap={30} // Increased gap for better spacing
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />

          {/* Grouped Bars with thinner width */}
          <Bar
            dataKey="actual"
            fill="#2E589B"
            radius={[6, 6, 0, 0]}
            barSize={12}
          >
            <LabelList
              dataKey="actual"
              position="top"
              fill="#0000006E"
              fontSize={12}
            />
          </Bar>
          <Bar
            dataKey="projected"
            fill="#025FF345"
            radius={[6, 6, 0, 0]}
            barSize={12}
          >
            <LabelList
              dataKey="projected"
              position="top"
              fill="#0000006E"
              fontSize={12}
            />
          </Bar>
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
