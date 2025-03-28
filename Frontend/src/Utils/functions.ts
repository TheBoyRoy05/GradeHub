import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function handleAction(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  action: () => Promise<void>
) {
  type AuthError = { errors: { longMessage: string }[] };
  setLoading(true);

  try {
    await action();
  } catch (err: unknown) {
    console.log(JSON.stringify(err));
    toast.error((err as AuthError).errors[0].longMessage);
  } finally {
    setLoading(false);
  }
}

export const createSetter =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <StoreType>(set: any) =>
  <T extends keyof StoreType>(key: T) =>
  (value: StoreType[T] | ((prev: StoreType[T]) => StoreType[T])) =>
    set((state: StoreType) => ({
      [key]:
        typeof value === "function"
          ? (value as (prev: StoreType[T]) => StoreType[T])(state[key])
          : value,
    }));