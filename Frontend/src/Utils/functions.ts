/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  <StoreType>(set: any) =>
  <T extends keyof StoreType>(key: T) =>
  (value: StoreType[T] | ((prev: StoreType[T]) => StoreType[T])) =>
    set((state: StoreType) => ({
      [key]:
        typeof value === "function"
          ? (value as (prev: StoreType[T]) => StoreType[T])(state[key])
          : value,
    }));

export function verificationTemplate(code: string, ip: string, time: string) {
  return `
    <div style="font-family:Helvetica,Arial,sans-serif;margin:0;padding:0;background-color:#ffffff">
      <span style="color:transparent;display:none;">Your GradeHub verification code</span>
      
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%; background-color:#f4f4f4; padding: 40px 0;">
        <tbody>
          <tr>
            <td align="center">
              
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; background-color:#ffffff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <tbody>
                
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding: 32px 0;">
                      <img src="https://yourdomain.com/logo.png" alt="GradeHub Logo" width="128" style="display:block; max-width:128px; width:100%;">
                    </td>
                  </tr>
                  
                  <!-- Verification Code -->
                  <tr>
                    <td style="padding: 0 40px 40px;">
                      <h1 style="font-size: 32px; color: #333333; margin: 0 0 24px;">Verification Code</h1>
                      
                      <p style="font-size: 16px; color: #555555; margin: 0 0 16px;">
                        Enter the following verification code when prompted:
                      </p>
                      
                      <p style="font-size: 40px; color: #000000; font-weight: bold; margin: 16px 0;">
                        ${code}
                      </p>
                      
                      <p style="font-size: 14px; color: #555555; margin: 0 0 16px;">
                        To protect your account, do not share this code.
                      </p>
                      
                      <p style="font-size: 14px; color: #555555; margin: 32px 0 0;">
                        <b>Didn't request this?</b>
                      </p>
                      
                      <p style="font-size: 14px; color: #777777; margin: 4px 0 0;">
                        This code was requested from <b>${ip}</b> at <b>${time}</b>. 
                        If you didn't make this request, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                </tbody>
              </table>
              
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
