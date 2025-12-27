import {  CreditCard } from "lucide-react"

export function PaymentBadge({ mode }) {
  const colors = {
    CASH: "bg-green-100 text-green-700 border-green-300",
    CARD: "bg-blue-100 text-blue-700 border-blue-300",
    UPI: "bg-purple-100 text-purple-700 border-purple-300"
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${colors[mode] || colors.CASH}`}>
      <CreditCard className="w-3 h-3" />
      {mode || "CASH"}
    </span>
  );
}