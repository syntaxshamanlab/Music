import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts({ items }) {
  const sagaCounts = useMemo(() => {
    if (!items || !Array.isArray(items)) return {};
    const counts = {};
    items.forEach(it => {
      const saga = it.get?.("saga") || (it.sections && it.sections.body && it.sections.body.slice(0,50)) || "unknown";
      counts[saga] = (counts[saga] || 0) + 1;
    });
    return counts;
  }, [items]);

  const labels = Object.keys(sagaCounts).slice(0,10);
  const data = {
    labels,
    datasets: [
      {
        label: "Items per saga/section (sample)",
        data: labels.map(l => sagaCounts[l]),
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  return (
    <div style={{maxWidth:800}}>
      <Bar data={data} />
    </div>
  );
}