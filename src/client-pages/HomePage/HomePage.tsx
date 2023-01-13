"use client";

import { Listbox } from "@headlessui/react";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import { PrettyColor } from "../../utils/colors";
import { CourseSelector } from "../../components/CourseSelector/CourseSelector";
import { ThemeSwitch } from "../../components/ThemeSwitch/ThemeSwitch";
import { ClassSection, Semester } from "../../database/types";
import { getRandomPrettyColor } from "../../utils/util";
import { PartialBy } from "../../utils/types";
import { IconSelector } from "@tabler/icons";
import { atom, useAtom, useSetAtom } from "jotai";
import { courseItemsAtomAtom } from "../../state/course-cart";
import { useHasMounted } from "../../hooks/useHasMounted";
import { WeeklyPreview } from "../../components/WeeklyPreview/WeeklyPreview";

export type Term = { semester: Semester; year: number };

export type HomePageProps = {
  terms: Term[];
};

export default function HomePage({ terms }: HomePageProps) {
  const mounted = useHasMounted(); // need to make sure we're mounted so we can use the localstorage in the courseItemsAtomAtom
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courseItems, setCourseItems] = useAtom(courseItemsAtomAtom);

  const toggleWeeklyView = () => setShowWeeklyView((v) => !v);

  const addCourseItem = () => {
    if (courseItems.length > 10) return;

    setCourseItems({
      type: "insert",
      value: {
        id: nanoid(),
        color: getRandomPrettyColor(),
        selectedCourse: { id: "", label: "", title: "", value: "" },
        selectedDept: { id: "", label: "", title: "", value: "" },
        availableSections: [],
      },
    });
  };

  const termOptions: SelectOption[] = useMemo(
    () =>
      [...terms]
        .sort((a, b) => {
          // sort by year (greatest year first, lowest year last):
          if (a.year < b.year) return 1;
          if (a.year > b.year) return -1;

          // if the years are equal then sort by semester:
          return a.semester.localeCompare(b.semester);
        })
        .map((term) => ({
          id: `${term.semester}-${term.year}`,
          label: `${term.semester}-${term.year}`,
          value: term,
        })),
    [terms]
  );

  console.log({ terms });

  const [term, setTerm] = useState<SelectOption>(termOptions[0]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative isolate ">
        <div className="-z-10 absolute -top-16 w-full h-[calc(100%+4rem)] bg-gradient-to-b from-white to-slate-100 overflow-hidden">
          {/* <div className="relative pack-content flex flex-col w-full h-full ">
            <div className="absolute rounded-full blur-xl w-[500px] h-[500px] bg-sky-300     -right-20 -bottom-20"></div>
            <div className="absolute rounded-full blur-xl w-[600px] h-[600px] bg-emerald-300 -left-10 right-0 "></div>
            <div className="absolute rounded-full blur-xl w-[400px] h-[400px] bg-amber-300   left-[20%] bottom-0"></div>
            <div className="absolute rounded-full blur-xl w-[500px] h-[500px] bg-rose-300    left-[50%]"></div>
          </div> */}
        </div>
        <div className="pack-content flex flex-col py-8">
          <WeeklyPreview />
        </div>
      </div>

      <div className="pack-content w-full flex flex-col gap-4">
        <ThemeSwitch />
        <div className="relative z-10 flex">
          <Select
            options={termOptions}
            onChange={setTerm}
            selectedOption={term}
          />
        </div>

        <ul className="relative z-0 flex flex-col gap-6">
          {courseItems.map((v, i) => (
            <CourseSelector
              key={v.toString()}
              courseItemAtom={v}
              semester={term.value.semester}
              year={term.value.year}
              index={i}
            />
          ))}
        </ul>

        <button
          className="rounded-md p-2 bg-gradient-to-r from-emerald-400 to-fuchsia-600 disabled:cursor-not-allowed"
          type="button"
          disabled={loading}
          onClick={addCourseItem}
        >
          ADD COURSE ITEM
        </button>
        <div className="min-h-[20rem]"></div>
      </div>

      <div className="sticky bottom-0 flex justify-end w-full pack-content py-2">
        <button type="button" className="bg-sky-500" onClick={toggleWeeklyView}>
          sldjf
        </button>
      </div>
    </div>
  );
}

interface SelectOption {
  id: string;
  label: string;
  value: Term;
}

interface SelectProps {
  options: SelectOption[];
  selectedOption: SelectOption;
  onChange: (opt: SelectOption) => void;
}

export const Select = ({ options, selectedOption, onChange }: SelectProps) => {
  return (
    <Listbox
      value={selectedOption}
      onChange={onChange}
      by="id"
      as="div"
      className="relative flex flex-col "
    >
      <Listbox.Button className="rounded-lg flex justify-center items-center gap-2 h-10 pl-4 pr-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold">
        <span className="flex ">{selectedOption.value.semester}</span>
        <span className="flex font-mono ">{selectedOption.value.year}</span>
        <IconSelector />
      </Listbox.Button>
      <Listbox.Options
        as="div"
        className="absolute top-12 p-2 pr-1 bg-white/60 shadow-xl rounded-lg backdrop-blur-sm outline-none  border border-slate-200"
      >
        <ul className="custom-scrollbar-tiny overflow-y-auto overflow-x-hidden max-h-48  pr-4 flex flex-col items-center">
          {options.map((opt) => (
            <Listbox.Option
              className="flex px-3 py-1 rounded cursor-pointer ui-active:bg-indigo-400 ui-active:text-white "
              key={opt.id}
              value={opt}
            >
              <span className="flex min-w-[5rem] font-semibold">
                {opt.value.semester}
              </span>
              <span className="flex font-mono">{opt.value.year}</span>
            </Listbox.Option>
          ))}
        </ul>
      </Listbox.Options>
    </Listbox>
  );
};
