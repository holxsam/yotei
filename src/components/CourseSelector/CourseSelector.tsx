"use client";

import { Combobox, Popover } from "@headlessui/react";
import { IconAdjustmentsHorizontal, IconCheck, IconTrash } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import {
  forwardRef,
  Fragment,
  memo,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CourseItem, courseItemsAtom } from "../../state/course-cart";

import { Semester } from "../../database/types";
import { PrettyColor } from "../../utils/colors";
import { formatTitle } from "../../utils/util";
import { SectionSelector } from "../SectionSelector/SectionSelector";
import {
  placeholder_text_color,
  text_color,
  ring_color,
  bg_color_base,
  bg_color_highlight,
  text_color_active,
  bg_color_hover,
  // glow,
  bg_color_highlight_hover,
  helper_hover_text,
  option_on,
} from "./CourseSelector.variants";
import { fetchDistinctCourseIds, fetchDistinctDepts } from "../../database/api";
import clsx from "clsx";
import { PrettyColorPicker } from "../PrettyColorPicker/PrettyColorPicker";
import { selectedTabAtom } from "../CoursePlan/CoursePlan";

const staleTime = 60 * 60 * 1000;

export interface ComboOption {
  id: string;
  label: string;
  value: string;
  title: string;
}

export type CourseSelectorProps = {
  semester: Semester;
  year: number;
  courseItemAtom: PrimitiveAtom<CourseItem>;
};

export const CourseSelector = memo(function CourseSelector({
  semester,
  year,
  courseItemAtom,
}: CourseSelectorProps) {
  const deptRef = useRef<HTMLInputElement>(null!);
  const courseCodeRef = useRef<HTMLInputElement>(null!);

  const [courseItem, setCourseItem] = useAtom(courseItemAtom);

  const { data: distinctDepts } = useQuery({
    queryKey: ["fetchDistinctDepts", semester, year],
    queryFn: () => fetchDistinctDepts(semester, year),
    staleTime,
  });

  const { data: distinctCourseIds } = useQuery({
    queryKey: [
      "fetchDistinctCourseIds",
      semester,
      year,
      courseItem.selectedDept.value,
    ],
    queryFn: () =>
      fetchDistinctCourseIds(semester, year, courseItem.selectedDept.value),
    enabled: courseItem.selectedDept.id !== "",
    staleTime,
  });

  const deptOptions: ComboOption[] = useMemo(
    () =>
      (distinctDepts ?? []).map((v) => ({
        id: v.uid,
        label: v.dept_abbr,
        value: v.dept_abbr,
        title: v.dept_title,
      })),
    [distinctDepts]
  );

  const courseOptions: ComboOption[] = useMemo(
    () =>
      (distinctCourseIds ?? []).map((v) => ({
        id: v.uid,
        label: v.course_number,
        value: v.course_number,
        title: v.course_title,
      })),
    [distinctCourseIds]
  );

  const updateSelectedDept = (updateItem: ComboOption) => {
    const oldId = courseItem.selectedDept.id;
    const newId = updateItem.id;
    if (oldId === newId) return;

    setCourseItem({
      ...courseItem,
      selectedDept: updateItem,
      selectedCourse: {
        id: "",
        value: "",
        label: "",
        title: "",
      },
      availableSections: [],
    });
  };

  const updateSelectedCourse = (updateItem: ComboOption) => {
    const oldId = courseItem.selectedCourse.id;
    const newId = updateItem.id;
    if (oldId === newId) return;

    setCourseItem({
      ...courseItem,
      selectedCourse: updateItem,
      availableSections: [],
    });
  };

  const title = formatTitle(courseItem.selectedCourse.title);
  const disableCourseSelect = !courseItem.selectedDept.value;

  const { color } = courseItem;

  // style tokens:
  const bgc = bg_color_base[color];
  const textColor = text_color[color];
  const ringColor = ring_color[color];
  const highlightBgColor = bg_color_highlight_hover[color];

  // repeated styles:
  const ringStyle = `${ringColor} ring-0 focus-visible:ring-2 ring-inset appearance-none outline-none`;

  return (
    <div className="isolate relative flex flex-col gap-8">
      <div
        className={clsx(
          "z-10 isolate flex gap-0 w-full text-sm font-medium",
          textColor,
          bgc
        )}
      >
        <div className="pack-content w-full">
          <div className="relative flex gap-3 py-3">
            <ActionDropdown
              courseItemAtom={courseItemAtom}
              buttonStyle={clsx(ringStyle, highlightBgColor)}
            />
            <AutoCompleteInput
              ref={deptRef}
              options={deptOptions}
              selectedOption={courseItem.selectedDept}
              onChange={updateSelectedDept}
              placeholder="Dept"
              color={color}
            />
            <AutoCompleteInput
              ref={courseCodeRef}
              options={courseOptions}
              selectedOption={courseItem.selectedCourse}
              onChange={updateSelectedCourse}
              placeholder="Code"
              color={color}
              disabled={disableCourseSelect}
            />
            <h1
              className={clsx(
                "overflow-hidden flex items-center flex-grow flex-shrink rounded-md font-semibold text-sm whitespace-nowrap",
                ringStyle
              )}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative z-0 pack-content w-full">
        {courseItem.selectedDept.value !== "" &&
        courseItem.selectedCourse.value !== "" ? (
          <SectionSelector
            semester={semester}
            year={year}
            courseItemAtom={courseItemAtom}
          />
        ) : (
          <HelpMessage
            deptInputRef={deptRef}
            courseCodeInputRef={courseCodeRef}
            color={color}
            disableCourseCode={courseItem.selectedDept.value === ""}
          />
        )}
      </div>
    </div>
  );
},
arePropsEqual);

const HelpMessage = ({
  disableCourseCode,
  color,
  deptInputRef,
  courseCodeInputRef,
}: {
  disableCourseCode: boolean;
  color: PrettyColor;
  deptInputRef: RefObject<HTMLInputElement>;
  courseCodeInputRef: RefObject<HTMLInputElement>;
}) => {
  const helperTextHover = helper_hover_text[color];
  const focusDeptInput = () => deptInputRef?.current?.focus();
  const focusCourseCodeInput = () => courseCodeInputRef?.current?.focus();

  return (
    <div className="relative">
      <div className="text-xl w-full rounded-xl flex gap-8">
        <div className="rounded-2xl w-full h-80 bg-slate-100 dark:bg-neutral-700" />
        <div className="rounded-2xl w-full h-80 bg-slate-100 dark:bg-neutral-700" />
        <div className="rounded-2xl w-full h-80 bg-slate-100 dark:bg-neutral-700 hidden md:flex" />
      </div>

      <div className="absolute inset-0 grid place-content-center text-4xl font-extrabold p-6 text-slate-500 dark:text-neutral-500">
        <div className="w-full max-w-lg text-center">
          To pick a course, first select a
          <button
            type="button"
            className={clsx(
              "inline whitespace-pre text-slate-900 dark:text-neutral-100",
              helperTextHover
            )}
            onClick={focusDeptInput}
          >
            {" department "}
          </button>
          then a
          <button
            type="button"
            className={clsx(
              "inline whitespace-pre text-slate-900 dark:text-neutral-100 disabled:cursor-not-allowed",
              helperTextHover
            )}
            onClick={focusCourseCodeInput}
            disabled={disableCourseCode}
          >
            {" course code"}
          </button>
          .
        </div>
      </div>
    </div>
  );
};

const ActionDropdown = ({
  buttonStyle = "",
  courseItemAtom,
}: {
  courseItemAtom: PrimitiveAtom<CourseItem>;
  buttonStyle?: string;
}) => {
  const [courseItem, setCourseItem] = useAtom(courseItemAtom);
  const setCourseItems = useSetAtom(courseItemsAtom);
  const setSelectedTab = useSetAtom(selectedTabAtom);

  const { color } = courseItem;

  const removeSelf = () => {
    setCourseItems((list) => {
      const idx = list.findIndex((item) => item.id === courseItem.id);
      if (idx === -1) return list;
      return [...list.slice(0, idx), ...list.slice(idx + 1)];
    });

    setSelectedTab(0);
  };

  const setColor = (color: PrettyColor) =>
    setCourseItem((v) => ({ ...v, color }));

  return (
    <Popover as="div" className="relative flex flex-col">
      <Popover.Button
        className={clsx(
          "grid place-items-center rounded-md w-8 aspect-square",
          buttonStyle
        )}
      >
        <IconAdjustmentsHorizontal size={20} />
      </Popover.Button>

      {/* this extra div allows us to anchor the Menu.Items container to the bottom of Menu.Button*/}
      <div className="relative">
        <Popover.Panel
          className={clsx(
            "absolute left-0 top-0 flex flex-col gap-10 p-6 mt-6 text-slate-900",
            "rounded-xl bg-white shadow-lg ring-1 ring-black/5",
            "dark:bg-neutral-900 dark:ring-white/5"
          )}
        >
          {({ close }) => (
            <>
              <PrettyColorPicker selectedColor={color} onChange={setColor} />
              <button
                type="button"
                onClick={() => {
                  close();
                  removeSelf();
                }}
                className={clsx(
                  "flex justify-center items-center gap-2 px-4 py-2 rounded-lg font-semibold",
                  "bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600",
                  "dark:bg-red-500 dark:text-white dark:hover:bg-red-600 dark:hover:text-white"
                )}
              >
                <IconTrash />
                <span className="whitespace-nowrap">Remove Course</span>
              </button>
            </>
          )}
        </Popover.Panel>
      </div>
    </Popover>
  );
};

const fuzzy = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
const fuzzyCompare = (searchTerm: string, comparedTerm: string) =>
  fuzzy(comparedTerm).includes(fuzzy(searchTerm));

interface AutoCompleteProps {
  options: ComboOption[];
  selectedOption: ComboOption;
  onChange: (opt: ComboOption) => void;
  disabled?: boolean;
  placeholder?: string;
  color?: PrettyColor;
}

export const AutoCompleteInput = forwardRef<
  HTMLInputElement,
  AutoCompleteProps
>(
  (
    {
      options,
      selectedOption,
      onChange,
      disabled = false,
      placeholder = "",
      color = "sky",
    },
    inputRef
  ) => {
    // const inputRef = useRef<HTMLInputElement>(null!);
    const buttonRef = useRef<HTMLButtonElement>(null!);

    const [query, setQuery] = useState("");
    const resetQuery = () => {
      setQuery("");

      if (inputRef != null && typeof inputRef !== "function")
        inputRef?.current?.focus();
    };
    const clickButton = (opened: boolean) =>
      !opened && buttonRef.current?.click();

    const filteredOptions =
      query === ""
        ? options
        : options.filter(
            (opt) =>
              fuzzyCompare(query, opt.value) || fuzzyCompare(query, opt.title)
          );

    // style tokens:
    const highlightBgColor = bg_color_highlight[color];
    const highlightTextColor = text_color_active[color];
    const placeholderTextColor = placeholder_text_color[color];
    const optionOn = option_on[color];

    return (
      <Combobox
        disabled={disabled}
        value={selectedOption}
        onChange={onChange}
        by="id"
      >
        {({ open }) => (
          <>
            <div className="relative">
              <Combobox.Input
                ref={inputRef}
                autoComplete="off"
                placeholder={placeholder}
                className={clsx(
                  "relative z-50 flex justify-between px-3 h-8 w-full max-w-[62px] min-w-[62px] rounded-md text-base font-mono font-semibold caret-black disabled:cursor-not-allowed",
                  `${placeholderTextColor} placeholder:text-base placeholder:uppercase appearance-none outline-none`,
                  highlightBgColor
                )}
                displayValue={(dept: ComboOption) =>
                  open ? query : dept.value
                }
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => clickButton(open)}
                required
              />
              {/* 
                Taking advantage of this button in TWO ways:
                1. as a graphic element to let the user know they must fill in the input field (red dot)
                2. as a way to force headless-ui to open the options menu when the input is clicked (using refs)
            */}
              <Combobox.Button
                className="absolute z-50 flex h-1 w-1 top-[5px] right-[5px] text-red-500 pointer-events-none"
                ref={buttonRef}
                disabled
              >
                {selectedOption.value === "" && (
                  <>
                    <span className="absolute rounded-full h-2 w-2 -top-[0.125rem] -left-[0.125rem] animate-ping-slow bg-red-500/75" />
                    <span className="relative rounded-full h-full w-full bg-red-500" />
                  </>
                )}
              </Combobox.Button>
            </div>

            <Combobox.Options
              as="div"
              className={clsx(
                "absolute z-40 top-0 left-0 p-4 pr-1 mt-[4.25rem] bg-white dark:bg-neutral-900 rounded-xl w-full sm:w-min min-w-[18rem] mb-32",
                "appearance-none outline-none shadow-lg ring-1 ring-black/5 dark:ring-white/5"
              )}
            >
              <ul className="flex flex-col gap-[1px] custom-scrollbar-tiny overflow-y-auto overflow-x-hidden max-h-[calc(5*2.5rem+4px)] pr-3">
                {filteredOptions.length === 0 && (
                  <li className="w-full">
                    <button
                      type="button"
                      className="w-full flex justify-center items-center gap-4 px-3 h-12 whitespace-nowrap rounded-lg font-bold bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 dark:bg-red-500/50 dark:text-red-100 dark:hover:bg-red-500/60 dark:hover:text-red-200 dark:font-semibold"
                      onClick={resetQuery}
                    >
                      No results. Click to reset.
                    </button>
                  </li>
                )}
                {filteredOptions.map((option) => (
                  <Combobox.Option key={option.id} value={option} as={Fragment}>
                    {({ active, selected }) => (
                      <li
                        className={clsx(
                          "flex items-center gap-4 px-3 min-h-[2.5rem] rounded cursor-pointer whitespace-nowrap text-sm",
                          active || selected ? optionOn : "bg-transparent ",
                          active || selected
                            ? highlightTextColor
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        <span className="min-w-[2rem] font-mono font-bold dark:font-medium">
                          {option.label}
                        </span>
                        <span className="flex-1 dark:font-light">
                          {formatTitle(option.title)}
                        </span>
                        {selected && <IconCheck size={20} stroke={3} />}
                      </li>
                    )}
                  </Combobox.Option>
                ))}
              </ul>
            </Combobox.Options>
          </>
        )}
      </Combobox>
    );
  }
);

function arePropsEqual(
  prev: Readonly<CourseSelectorProps>,
  next: Readonly<CourseSelectorProps>
) {
  if (prev.courseItemAtom.toString() !== next.courseItemAtom.toString())
    return false;
  if (prev.semester !== next.semester) return false;
  if (prev.year !== next.year) return false;

  return true;
}
