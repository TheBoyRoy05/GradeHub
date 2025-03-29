/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import schools from "./cleanedSchools.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function searchSchools(searchString: string) {
  const search = searchString.toUpperCase();

  return schools.filter((school) => {
    return school.name.includes(search) || school.aliases?.some((alias) => alias.includes(search));
  });
}

export const createSetter =
  <StoreType>(set: any) =>
  <T extends keyof StoreType>(key: T) =>
  (value: StoreType[T] | ((prev: StoreType[T]) => StoreType[T])) =>
    set((state: StoreType) => ({
      [key]:
        typeof value === "function"
          ? (value as (prev: StoreType[T]) => StoreType[T])(state[key])
          : value,
    }));
