"use client";

import { useEffect, useState } from "react";

type PaymentModesProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const modes = [
  { id: "upi", label: "UPI" },
  { id: "netbanking", label: "Net Banking" },
];

export function PaymentModes({ value, onChange }: PaymentModesProps) {
  const [selected, setSelected] = useState<string>(value ?? "upi");

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleSelect = (mode: string) => {
    setSelected(mode);
    onChange?.(mode);
  };

  return (
    <div className="space-y-3">
      {modes.map((mode) => {
        const isActive = selected === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => handleSelect(mode.id)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition
              ${
                isActive
                  ? "border-[#0b3c5d] bg-[#ace4ff] text-[#0b3c5d]"
                  : "border-[#b7def3] bg-white text-[#0b3c5d]"
              }
            `}
          >
            <span className="font-medium">{mode.label}</span>
            {isActive && (
              <span className="text-sm font-semibold">Selected</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
