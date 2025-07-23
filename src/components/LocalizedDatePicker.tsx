"use client";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Props = { selected: Date; onSelect: (d: Date) => void };

export default function LocalizedDatePicker({ selected, onSelect }: Props) {
  return (
    <Popover className="relative">
      <Popover.Button className="w-full px-3 py-2 rounded-md border text-sm border-border bg-background1 text-left">
        {format(selected, "EEEE, dd MMMM yyyy", { locale: id })}
      </Popover.Button>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute z-50 mt-1 bg-background1 border border-border rounded-lg shadow-lg p-2">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => d && onSelect(d)}
            locale={id}
            footer={format(selected, "EEEE, dd MMMM yyyy", { locale: id })}
          />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
