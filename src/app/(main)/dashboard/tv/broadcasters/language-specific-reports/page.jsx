import Heatmap from "@/components/ui/heatmap";

export default function Home() {
  const data = [
    [0.1, 0.3, 0.5, 0.7, 0.9],
    [0.2, 0.4, 0.6, 0.8, 1.0],
    [0.3, 0.5, 0.7, 0.9, 0.8],
    [0.4, 0.6, 0.8, 1.0, 0.7],
    [0.5, 0.7, 0.9, 0.8, 0.6],
  ];

  const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const yLabels = ["Morning", "Noon", "Afternoon", "Evening", "Night"];

  return (
    <div className="container mx-auto p-4">
      <Heatmap
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
      />

      <Heatmap
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        primaryColor="#FF0000" // Red heatmap
      />
    </div>
  );
}
