"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "@/components/icons";

type AddAction = "expense" | "yield-price" | "harvest" | null;

const menuItems = [
  { action: "expense" as const, label: "Log expense", hint: "Add a cost like seed, fertilizer or labor" },
  { action: "yield-price" as const, label: "Yield & price", hint: "Set expected yield and price" },
  { action: "harvest" as const, label: "Mark harvested", hint: "Record actual yield and revenue" },
];

export default function MobileAddSheet({
  expenseForm,
  yieldPriceForm,
  harvestForm,
  open,
  onOpenChange,
}: {
  expenseForm: React.ReactNode;
  yieldPriceForm: React.ReactNode;
  harvestForm: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [action, setAction] = useState<AddAction>(null);

  const openMenu = () => {
    setAction(null);
    onOpenChange(true);
  };

  const close = () => {
    setAction(null);
    onOpenChange(false);
  };

  const title =
    action === "expense"
      ? "Log expense"
      : action === "yield-price"
        ? "Yield & price"
        : action === "harvest"
          ? "Mark harvested"
          : "Add data";

  return (
    <>
      <button
        type="button"
        onClick={openMenu}
        aria-label="Add expense, yield or mark harvested"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-agro-canopy text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 lg:hidden"
      >
        <PlusIcon size={24} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-agro-night/50 sm:items-center lg:hidden"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-agro-sprout sm:hidden" />
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-agro-forest">{title}</h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-agro-slate transition-colors hover:bg-agro-paper"
              >
                <XIcon size={20} />
              </button>
            </div>

            {action === null ? (
              <div className="mt-4 grid gap-3">
                {menuItems.map((item) => (
                  <button
                    key={item.action}
                    type="button"
                    onClick={() => setAction(item.action)}
                    className="flex min-h-11 w-full items-center justify-between rounded-xl border border-agro-sprout bg-white px-4 py-3 text-left transition-colors hover:bg-agro-mint"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-agro-ink">{item.label}</span>
                      <span className="block text-xs text-agro-slate">{item.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : action === "expense" ? (
              <div className="mt-4">{expenseForm}</div>
            ) : action === "yield-price" ? (
              <div className="mt-4">{yieldPriceForm}</div>
            ) : (
              <div className="mt-4">{harvestForm}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
