import clsx from "clsx";
import { PrettyColor } from "../../utils/colors";

const colors: PrettyColor[] = ["emerald", "yellow", "rose", "sky"];
const skeletonQuantity: number = 3;

export const SectionSelectorSkeleton = () => {
  //   return <div className="">LOADING</div>;
  return (
    <div className="flex flex-col gap-8 first:mt-0">
      <div className="isolate flex flex-row gap-4 p-6 rounded-xl bg-slate-200 dark:bg-neutral-900">
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="h-6 w-32 bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
          <div className="h-4 w-[17.1rem] bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
        </div>
        <div className="w-20 h-20 rounded-lg pl-2 pr-3 py-1 bg-slate-100  dark:bg-neutral-700 animate-pulse"></div>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-8 rounded-md bg-transparent">
        {[...Array(skeletonQuantity)].map((x, i) => (
          <ClassSectionItemSkeleton key={i}></ClassSectionItemSkeleton>
        ))}
      </ul>
    </div>
  );
};

export const ClassSectionItemSkeleton = () => {
  return (
    <li className="relative flex flex-col">
      <div
        className={clsx(
          "flex-grow h-auto",
          "flex flex-col gap-8 p-6 bg-white dark:bg-neutral-700/20",
          "rounded-2xl transition-[opacity_background-color_box-shadow] duration-300",
          "shadow-[rgba(149,157,165,0.15)_0px_8px_24px] dark:shadow-none"
        )}
      >
        <div className={clsx("flex flex-col gap-8 animate-pulse")}>
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-lg pl-2 pr-3 py-1 bg-slate-100  dark:bg-neutral-700"></div>
            <div className="flex flex-col justify-center gap-[0.35rem]">
              <div className="h-6 w-24 bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
              <div className="h-4 w-16 bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
              <div className="h-4 w-20 bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <div className="h-4 w-36 bg-slate-100 dark:bg-neutral-700 rounded-md "></div>
              <div className="h-4 w-16 bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
            </div>
            <div className="h-6 w-14 bg-slate-100 dark:bg-neutral-700 rounded-full"></div>
          </div>
          <div className="h-4 w-auto bg-slate-100 dark:bg-neutral-700 rounded-md"></div>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col items-center gap-2 h-min w-min animate-pulse">
        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-neutral-700"></div>
        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-neutral-700"></div>
      </div>
    </li>
  );
};
