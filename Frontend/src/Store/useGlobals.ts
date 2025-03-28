import { createSetter } from "@/Utils/functions";
import { AuthFormType, UserType } from "@/Utils/types";
import React from "react";
import { create } from "zustand";

interface GlobalsState {
  user: UserType;
  formData: AuthFormType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  setFormData: React.Dispatch<React.SetStateAction<AuthFormType>>;
}

export const useGlobals = create<GlobalsState>((set) => ({
  user: {} as UserType,
  formData: {} as AuthFormType,
  setUser: createSetter<GlobalsState>(set)("user"),
  setFormData: createSetter<GlobalsState>(set)("formData"),
}));