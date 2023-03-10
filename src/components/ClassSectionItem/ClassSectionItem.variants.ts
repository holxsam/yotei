import { ClassDay } from "../../database/types";

export const day_bg_color: Record<ClassDay, string> = {
  su: "bg-neutral-200 dark:bg-neutral-700/50",
  m: "bg-rose-200 dark:bg-rose-700/50",
  tu: "bg-emerald-200 dark:bg-emerald-700/50",
  w: "bg-amber-200 dark:bg-amber-700/50",
  th: "bg-sky-200 dark:bg-sky-700/50",
  f: "bg-fuchsia-200 dark:bg-fuchsia-700/50",
  sa: "bg-indigo-200 dark:bg-indigo-700/50",
  na: "bg-orange-200 dark:bg-orange-700/50",
  tba: "bg-orange-200 dark:bg-orange-700/50",
};

export const day_text_color: Record<ClassDay, string> = {
  su: "text-neutral-700 dark:text-neutral-300",
  m: "text-rose-700 dark:text-rose-300",
  tu: "text-emerald-700 dark:text-emerald-300",
  w: "text-amber-700 dark:text-amber-300",
  th: "text-sky-700 dark:text-sky-300",
  f: "text-fuchsia-700 dark:text-fuchsia-300",
  sa: "text-indigo-700 dark:text-indigo-300",
  na: "text-orange-700 dark:text-orange-300",
  tba: "text-orange-700 dark:text-orange-300",
};
