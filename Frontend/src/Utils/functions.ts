import { toast } from "sonner";

export async function handleAction(
  isLoaded: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  action: () => Promise<void>
) {
  if (!isLoaded) return;
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
