import { IconAward, IconTruckDelivery, IconRotate } from "@tabler/icons-react";

const benefits = [
  { icon: IconTruckDelivery, label: "FREE GLOBAL", sublabel: "SHIPPING" },
  { icon: IconAward, label: "100% AUTHENTIC", sublabel: "PRODUCT" },
  { icon: IconRotate, label: "EASY 15 DAYS", sublabel: "RETURNS" },
];

export default function ProductBenefits() {
  return (
    <div className="grid grid-cols-3 divide-x divide-input border-b border-input pb-5 pt-1">
      {benefits.map(({ icon: Icon, label, sublabel }) => (
        <div key={label} className="flex flex-col items-center gap-2 text-center text-[10px] text-muted-foreground">
          <Icon size={24} stroke={1.5} className="text-secondary" />
          <span className="leading-4">
            {label}
            <br />
            {sublabel}
          </span>
        </div>
      ))}
    </div>
  );
}
