import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiCalendarBlankLight,
  PiCaretDownLight,
  PiCaretLeftBold,
  PiCaretRightBold,
} from "react-icons/pi";

const MONTH_OPTIONS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const BRAND_BLUE = "#3572EF";

const pad2 = (value) => String(value).padStart(2, "0");

const toValueString = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const toDisplayString = (date) =>
  `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;

const parseValueString = (value) => {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

const getMonthMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const startDayIndex = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startDayIndex);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + index);
    return day;
  });
};

const DatePickerField = ({
  value,
  onChange,
  placeholder = "Select date",
  minYear = 2020,
  maxYear = 2035,
  disabled = false,
  triggerClassName = "",
  iconClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = useMemo(() => parseValueString(value), [value]);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleMouseDown = (event) => {
      if (wrapperRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsOpen(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const years = useMemo(
    () =>
      Array.from(
        { length: maxYear - minYear + 1 },
        (_, index) => minYear + index,
      ),
    [maxYear, minYear],
  );

  const monthDays = useMemo(
    () => getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  );

  const today = new Date();
  const todayValue = toValueString(today);
  const selectedValue = selectedDate ? toValueString(selectedDate) : "";

  const goPrevMonth = () => {
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() - 1);
      return nextDate;
    });
  };

  const goNextMonth = () => {
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    });
  };

  const handleMonthChange = (event) => {
    const nextMonth = Number(event.target.value);
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setMonth(nextMonth);
      return nextDate;
    });
  };

  const handleYearChange = (event) => {
    const nextYear = Number(event.target.value);
    setViewDate((currentDate) => {
      const nextDate = new Date(currentDate);
      nextDate.setFullYear(nextYear);
      return nextDate;
    });
  };

  const handlePickDate = (day) => {
    if (disabled) {
      return;
    }

    onChange(toValueString(day));
    setIsOpen(false);
  };

  const toggleCalendar = () => {
    if (disabled) {
      return;
    }

    setIsOpen((currentOpen) => {
      const nextOpen = !currentOpen;

      if (nextOpen) {
        setViewDate(selectedDate ?? new Date());
      }

      return nextOpen;
    });
  };

  const displayValue = selectedDate
    ? toDisplayString(selectedDate)
    : placeholder;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={toggleCalendar}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`h-12 w-full rounded-xl border px-4 pr-10 text-left text-base outline-none transition md:h-13 md:px-5 ${
          disabled
            ? "cursor-not-allowed border-[#E8E8E8] bg-[#F7F7F7] text-[#C6C6C6]"
            : isOpen
              ? "border-[#A9C4FF] bg-white shadow-[0_0_0_2px_rgba(53,114,239,0.14)]"
              : "border-[#DCDCDC] bg-white"
        } ${selectedDate && !disabled ? "text-[#535353]" : "text-[#B6B6B6]"} ${triggerClassName}`}
      >
        <span>{displayValue}</span>
        <PiCalendarBlankLight
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] ${
            disabled ? "text-[#D5D5D5]" : "text-[#A8A8A8]"
          } ${iconClassName}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-76 overflow-hidden rounded-xl border border-[#E6EAF3] bg-white shadow-[0_16px_36px_rgba(21,33,62,0.14)]">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 border-b border-[#F0F0F0] px-3 py-3">
            <div className="relative">
              <select
                value={viewDate.getMonth()}
                onChange={handleMonthChange}
                className="h-8 w-full appearance-none rounded-md border border-[#E2E6ED] bg-white px-2 pr-6 text-xs text-[#595959] outline-none"
              >
                {MONTH_OPTIONS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <PiCaretDownLight className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-[#9BA3B3]" />
            </div>

            <div className="relative">
              <select
                value={viewDate.getFullYear()}
                onChange={handleYearChange}
                className="h-8 w-full appearance-none rounded-md border border-[#E2E6ED] bg-white px-2 pr-6 text-xs text-[#595959] outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <PiCaretDownLight className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-[#9BA3B3]" />
            </div>

            <button
              type="button"
              aria-label="Previous month"
              onClick={goPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E6ED] text-[#77829A] transition hover:bg-[#F8FAFF]"
            >
              <PiCaretLeftBold className="text-[11px]" />
            </button>

            <button
              type="button"
              aria-label="Next month"
              onClick={goNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E6ED] text-[#77829A] transition hover:bg-[#F8FAFF]"
            >
              <PiCaretRightBold className="text-[11px]" />
            </button>
          </div>

          <div
            className="px-3 py-2 text-center text-xs font-medium text-white"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            {MONTH_OPTIONS[viewDate.getMonth()].label} {viewDate.getFullYear()}
          </div>

          <div className="px-3 pb-3 pt-2">
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAY_LABELS.map((label) => (
                <span
                  key={label}
                  className="flex h-7 items-center justify-center text-[11px] font-medium text-[#8A8F9D]"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day) => {
                const dayValue = toValueString(day);
                const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                const isSelected = dayValue === selectedValue;
                const isToday = dayValue === todayValue;

                return (
                  <button
                    key={dayValue}
                    type="button"
                    onClick={() => handlePickDate(day)}
                    className={`flex h-8 items-center justify-center rounded-md border text-xs transition ${
                      isSelected
                        ? "border-transparent font-medium text-white"
                        : isCurrentMonth
                          ? "border-transparent text-[#4D4D4D] hover:bg-[#F3F6FF]"
                          : "border-transparent text-[#C8C8C8] hover:bg-[#F6F6F6]"
                    } ${isToday && !isSelected ? "border-[#C9D9FB] font-semibold text-[#3E6FED]" : ""}`}
                    style={
                      isSelected ? { backgroundColor: BRAND_BLUE } : undefined
                    }
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DatePickerField;
