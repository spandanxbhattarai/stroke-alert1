interface Props {
  label: string;
  value: string | number;
  icon: string;
  color?: "red" | "green" | "blue";
}

const colors = {
  red: "bg-red-50 text-red-700 border-red-200",
  green: "bg-green-50 text-green-700 border-green-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function StatCard({ label, value, icon, color = "blue" }: Props) {
  return (
    <div className={`rounded-2xl border-2 p-5 ${colors[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm font-medium mt-1 opacity-80">{label}</div>
    </div>
  );
}
