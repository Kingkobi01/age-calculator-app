import { useState } from "react";

function App() {
  interface Date {
    day: {
      value: number | "";
      err: string;
    };
    month: {
      value: number | "";
      err: string;
    };
    year: {
      value: number | "";
      err: string;
    };
    valid: "yes" | "no" | "not yet" | "empty";
  }
  interface Diff {
    years: number;
    months: number;
    days: number;
    isnegative: boolean;
    filled: boolean;
  }

  const [date, setDate] = useState<Date>({
    day: {
      value: "",
      err: "",
    },
    month: {
      value: "",
      err: "",
    },
    year: {
      value: "",
      err: "",
    },
    valid: "not yet",
  });

  const [diff, setDiff] = useState<Diff>({
    days: 0,
    months: 0,
    years: 0,
    isnegative: false,
    filled: false,
  });

  const daysPerMonthNonLeapYear = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];
  const daysPerMonthLeapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const validateDate = (day: number, month: number, year: number) => {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (isLeapYear) {
      return day <= daysPerMonthLeapYear[month - 1] && month <= 12;
    }

    return day <= daysPerMonthNonLeapYear[month - 1] && month <= 12;
  };

  const validateField = (field: String, value: number) => {
    if (field === "day") {
      if (!value) {
        setDate((prevState) => ({
          ...prevState,
          day: { ...date.day, err: "This field is required" },
        }));
      } else if (value > 31) {
        setDate((prevState) => ({
          ...prevState,
          day: { ...date.day, err: "Must be a valid day" },
        }));
      } else {
        setDate((prevState) => ({
          ...prevState,
          day: { ...prevState.day, err: "" },
        }));
      }
    }
    if (field === "month") {
      if (!value) {
        setDate((prevState) => ({
          ...prevState,
          month: { ...date.month, err: "This field is required" },
        }));
      } else if (value > 12) {
        setDate((prevState) => ({
          ...prevState,
          month: { ...date.month, err: "Must be a valid month" },
        }));
      } else {
        setDate((prevState) => ({
          ...prevState,
          month: { ...prevState.month, err: "" },
        }));
      }
    }
    if (field === "year") {
      const currentYear = new Date().getFullYear();
      if (!value) {
        setDate((prevState) => ({
          ...prevState,
          year: { ...date.year, err: "This field is required" },
        }));
      } else if (value > currentYear) {
        setDate((prevState) => ({
          ...prevState,
          year: { ...date.year, err: "Must be a valid year" },
        }));
      } else {
        setDate((prevState) => ({
          ...prevState,
          year: { ...prevState.year, err: "" },
        }));
      }
    }
  };

  const handleChange = (value: number, unit: string) => {
    unit === "day"
      ? setDate({
          ...date,
          day: value >= 0 ? { ...date.day, value } : { ...date.day, value: "" },
        })
      : unit === "month"
      ? setDate({
          ...date,
          month:
            value >= 0
              ? { ...date.month, value }
              : { ...date.month, value: "" },
        })
      : setDate({
          ...date,
          year:
            value >= 0 ? { ...date.year, value } : { ...date.year, value: "" },
        });
  };

  const handleSubmit = () => {
    const newDate = new Date(`
      ${date.year.value ? date.year.value : 0}/
      ${date.month.value ? date.month.value : 0}/
      ${date.day.value ? date.day.value : 0}`);

    if (
      date.day.value === "" ||
      date.month.value === "" ||
      date.year.value === ""
    ) {
      setDate({ ...date, valid: "empty" });
      return;
    }

    if (newDate.toString() === "Invalid Date") {
      setDate({ ...date, valid: "no" });
      return;
    }

    if (!validateDate(date.day.value, date.month.value, date.year.value)) {
      setDate({ ...date, valid: "no" });
      return;
    }

    setDate({ ...date, valid: "yes" });

    const today = new Date();
    console.log("Today:", today);
    console.log("Submitted:", newDate);

    const diff = today.getTime() - newDate.getTime();

    if (diff >= 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      const years = Math.floor(days / 365);

      const daysLeft = days % 365;

      const months = Math.floor(daysLeft / 30);

      console.log(years, months, daysLeft % 30);

      setDiff({
        years,
        months,
        days: daysLeft % 30,
        isnegative: false,
        filled: true,
      });
    } else {
      setDiff((prevState) => ({
        ...prevState,
        isnegative: true,
        filled: false,
      }));
    }
  };

  return (
    <article className="space-y-4 bg-white shadow-md mx-auto p-8 md:p-[3.75rem] rounded-lg rounded-br-[3rem] w-[95%] max-w-[52.5rem]">
      <form className="flex flex-col justify-between items-center gap-4 mb-4 w-full font-bold">
        <div className="flex justify-center items-start gap-4 mr-auto w-full md:w-5/6">
          <div className="relative flex flex-col gap-1 w-full" key="day">
            <label
              htmlFor="day"
              className={`${
                date.valid === "empty" || date.day.err
                  ? "text-secondary"
                  : "text-neutral-300"
              } md:text-lg uppercase`}
            >
              day
            </label>
            <input
              value={date.day.value}
              onChange={(e) => {
                handleChange(Number(e.target.value), "day");
                validateField("day", Number(e.target.value));
              }}
              type="number"
              id="day"
              placeholder={"dd"}
              className={`border-1 ${
                date.day.err
                  ? "border-secondary focus:ring-1 focus:ring-secondary"
                  : date.valid === "empty"
                  ? "border-secondary focus:ring-1 focus:ring-secondary"
                  : "border-neutral-200 focus:ring-2 focus:ring-blue-600"
              } focus:border-none border w-full text-3xl md:text-5xl uppercase focus:outline-none  px-3 rounded-lg font-extrabold text-center`}
            />
            {date.day.err && (
              <p className="w-full font-light text-[11px] text-secondary italic">
                {date.day.err}
              </p>
            )}
            {date.valid === "empty" && (
              <p className="w-full font-light text-[11px] text-secondary italic">
                THis field is required
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="month"
              className={`${
                date.valid === "empty" ? "text-secondary" : "text-neutral-300"
              } md:text-lg uppercase`}
            >
              month
            </label>
            <input
              value={date.month.value}
              onChange={(e) => {
                handleChange(Number(e.target.value), "month");
                validateField("month", Number(e.target.value));
              }}
              type="number"
              id="month"
              placeholder={"mm"}
              className={`border-1 ${
                date.month.err
                  ? "border-secondary focus:ring-1 focus:ring-secondary"
                  : date.valid === "empty"
                  ? "border-secondary focus:ring-1 focus:ring-secondary"
                  : "border-neutral-200 focus:ring-2 focus:ring-blue-600"
              } focus:border-none border w-full text-3xl md:text-5xl uppercase focus:outline-none  px-3 rounded-lg font-extrabold text-center`}
            />
            {date.month.err && (
              <p className="w-full font-light text-[11px] text-secondary italic">
                {date.month.err}
              </p>
            )}
            {date.valid === "empty" && (
              <p className="w-full font-light text-[11px] text-secondary italic">
                THis field is required
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="year"
              className={`${
                date.valid === "empty" ? "text-secondary" : "text-neutral-300"
              } md:text-lg uppercase`}
            >
              year
            </label>
            <input
              value={date.year.value}
              onChange={(e) => {
                handleChange(Number(e.target.value), "year");
                validateField("year", Number(e.target.value));
              }}
              type="number"
              id="year"
              placeholder={"yyyy"}
              className={`border-1 ${
                date.year.err
                  ? "border-secondary focus:ring-1 focus:ring-secondary"
                  : date.valid === "empty"
                  ? "border-secondary focus:ring-1 focus:ring-secondary"
                  : "border-neutral-200 focus:ring-2 focus:ring-blue-600"
              } focus:border-none border w-full text-3xl md:text-5xl uppercase focus:outline-none  px-3 rounded-lg font-extrabold text-center`}
            />
            {date.year.err && (
              <p className="w-full font-light text-[11px] text-secondary italic">
                {date.year.err}
              </p>
            )}
            {date.valid === "empty" && (
              <p className="w-full font-light text-[11px] text-secondary italic">
                THis field is required
              </p>
            )}
          </div>
        </div>
        <button
          className="place-items-center grid bg-primary hover:bg-neutral-400 shadow-sm hover:shadow-lg md:ml-auto p-8 rounded-full duration-150 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <img
            className="self-end"
            src="./assets/images/icon-arrow.svg"
            alt=""
          />
        </button>
      </form>
      <div className="flex flex-col font-extrabold text-6xl md:text-8xl italic">
        {["years", "months", "days"].map((unit) => (
          <p key={unit}>
            <span className="text-primary tracking-wider">
              {diff.filled && !diff.isnegative
                ? diff[unit as keyof typeof diff]
                : "--"}
            </span>{" "}
            {unit}
          </p>
        ))}
      </div>
    </article>
  );
}

export default App;
