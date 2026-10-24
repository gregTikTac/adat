"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Dialog } from "@base-ui/react/dialog";
import { brand } from "@/config/brand";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button variant="ghost" size="icon" aria-label="Открыть меню" className="lg:hidden" />
        }
      >
        <Menu className="size-6" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-[#ebe0cc] p-6 shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-[0.2em] text-[#443A2C]">
              {brand.name}
            </span>
            <Dialog.Close
              render={
                <Button variant="ghost" size="icon" aria-label="Закрыть меню" />
              }
            >
              <X className="size-6" />
            </Dialog.Close>
          </div>
          <nav aria-label="Мобильное меню" className="mt-10 flex flex-col gap-2">
            {brand.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-2xl font-light text-[#443A2C] transition-colors hover:text-[#315059]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-10">
            <a
              href={brand.phoneHref}
              className="inline-flex items-center gap-2 text-lg font-medium text-[#315059]"
            >
              {brand.phone}
            </a>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
