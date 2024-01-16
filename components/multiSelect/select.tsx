"use client";

import { Span } from "next/dist/trace";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
// import { HiCheck } from "react-icons/hi2";

export type SelectOption = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};
type CustomSelectProps = {
  value: any;
  onChange: (value: SelectOption[]) => void;
  options: SelectOption[];
};

const Select: React.FC<CustomSelectProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<SelectOption[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectOption = useCallback(
    (option: SelectOption) => {
      setIsEmpty(false);
      setQuery(() => "");
      if (
        value?.some((val: any) => {
          return val.firstName == option.firstName;
        })
      ) {
        onChange(value.filter((o: any) => o != option));
      } else {
        setData(data.filter((val: any) => val?.id != option?.id));
        if (value) {
          onChange([...value, option]);
        } else {
          onChange([option]);
        }
      }
    },
    [data, value]
  );

  const removeOption = useCallback(
    (option: SelectOption) => {
      if (
        value?.some((val: any) => {
          return val.firstName == option.firstName;
        })
      ) {
        onChange(value.filter((o: any) => o != option));
        data.splice(parseInt(option?.id) - 1, 0, option);
      }
    },
    [data, value]
  );

  function toggle() {
    setIsOpen((prev) => !prev);
  }

  const filter = (data: any) => {
    return data?.filter(
      (ele: any) =>
        ele["firstName"]?.toLowerCase().indexOf(query.toLowerCase()) > -1
    );
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!value) {
      setIsEmpty(true);
    }
  }, [isEmpty]);

  useEffect(() => {
    const DivHandler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;

      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen && data.length != 0) selectOption(data[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < data.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
        case "Backspace":
          if (value?.length != undefined) {
            removeOption(value[value.length - 1]);
          }
      }
    };

    const InputHandler = (e: KeyboardEvent) => {
      if (e.target != innerRef.current) return;

      switch (e.code) {
        case "Enter":
          setIsOpen((prev) => !prev);
          if (isOpen && data.length != 0) selectOption(data[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < data.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
        case "Backspace":
          if (value?.length != undefined) {
            removeOption(value[value.length - 1]);
          }
      }
    };
    containerRef.current?.addEventListener("keydown", DivHandler);
    innerRef.current?.addEventListener("keydown", InputHandler);
    containerRef.current?.addEventListener("click", toggle);
    containerRef.current?.addEventListener("blur",() => setIsOpen(false))

    return () => {
      containerRef.current?.removeEventListener("keydown", DivHandler);
      innerRef.current?.removeEventListener("keydown", InputHandler);
      containerRef.current?.removeEventListener("click", toggle);
      containerRef.current?.removeEventListener("blur",() => setIsOpen(false))
    };
  }, [isOpen, highlightedIndex, data, value]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative w-full flex items-center min-h-4 border-b-4 border-b-sky-500 gap-1 p-2 outline-none"
    >
      <span className="flex-grow flex gap-2  flex-wrap items-center">
        {!isEmpty &&
          value?.map((v: any) => (
            <div
              key={v.id}
              className="flex items-center border p-[1px] border-gray-400 rounded-full pr-2 gap-4 cursor-pointer bg-gray-300 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
            >
              <img
                src={v.image}
                alt="image"
                width={30}
                height={30}
                fetchPriority="high"
                className="rounded-full bg-gray-600"
              />
              {`${v.firstName}  ${v.lastName}`}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(v);
                }}
                className="text-xl text-black hover:bg-red-400 h-6 w-6 flex items-center justify-center rounded-full"
              >
                &times;
              </button>
            </div>
          ))}
        <div>
          <input
            type="text"
            id="user"
            ref={innerRef}
            placeholder="Add new user..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="outline-none w-fit"
            autoComplete="off"
          />
        </div>
      </span>
      <div
        className={`
          absolute bg-white  w-fit border-gray-300 border z-50 p-0 list-none rounded-lg left-0 right-0 m-auto top-[calc(100%-.1rem)] max-h-80 overflow-y-auto overflow-x-hidden
          ${isOpen ? "block" : "hidden"}`}
      >
        <ul ref={listRef}>
          {filter(data).map((user: SelectOption, index: any) => (
            <li
              key={user.id}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(user);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`
              px-1 py-2  cursor-pointer rounded-sm 
              ${index == highlightedIndex ? "bg-neutral-300 .active" : ""}
            `}
            >
              <div className="flex flex-1 items-center flex-row mx-8 ">
                <img
                  src={user.image}
                  alt="image"
                  width={50}
                  height={50}
                  fetchPriority="high"
                  className="rounded-full bg-gray-600"
                />
                <p className="ml-4 w-full">{`${user.firstName}  ${user.lastName}`}</p>
                <p className="ml-4 w-full">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Select;
