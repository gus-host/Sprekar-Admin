"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const revalidate = 0;
const data = [
  { name: "", value: 100 - (5 + 14 + 10 + 22 + 35), color: "#ADB4F3" },
  { name: "Pidgin", value: 35, color: "#2B3695" },
  { name: "Dutch", value: 22, color: "#C8029D" },
  { name: "French", value: 10, color: "#C8BE02" },
  { name: "Greek", value: 14, color: "#474747" },
  { name: "Spanish", value: 5, color: "#FF0000" },
];

const colors = data.filter((d) => d.color !== "#ADB4F3");

const DonutChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR rendering
  return (
    <>
      <ResponsiveContainer height={150} minHeight={150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={65}
            fill="#8884d8"
            dataKey="value"
            cornerRadius={0} // Ensures sharp edges
            stroke="none" // Removes any unwanted space
            strokeWidth={0} // No border gaps
            startAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="max-w-[200px] mx-auto mt-5 flex flex-col gap-[15px]">
        {colors.map((color, i) => (
          <div
            key={i}
            className="py-[10px] rounded-[5px] border-l-8"
            style={{
              borderColor: color.color,
              boxShadow: "0px 14px 17.6px 0px #0000000A",
            }}
          >
            <p className="text-center flex justify-center gap-4 items-center">
              <strong className="text-[12px]">{color.value}%</strong>
              <span className="text-[12px] text-[#161A4169] font-semibold">
                {color.name}
              </span>{" "}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonutChart;
