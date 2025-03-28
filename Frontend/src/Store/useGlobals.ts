import { createSetter } from "@/Utils/functions";
import { UserType } from "@/Utils/types";
import { create } from "zustand";

interface GlobalsState {
  user: UserType;
  setUser: (user: UserType) => void;
}

export const useGlobals = create<GlobalsState>((set) => ({
  user: {} as UserType,
  setUser: createSetter<GlobalsState>(set)("user"),
}));