import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/UI/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/Components/UI/input-otp";
import { Button } from "@/Components/UI/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import usePOST from "@/Hooks/usePOST";
import { LoaderCircle } from "lucide-react";
import { handleAction } from "@/Utils/functions";

const VerificationSchema = z.object({
  code: z.string().length(6, { message: "Verification code must be 6 characters" }),
});

interface VerificationProps {
  formData: { firstname: string; lastname: string; email: string; password: string };
}

const Verification = ({ formData }: VerificationProps) => {
  const [time, setTime] = useState(30);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { post } = usePOST();

  const form = useForm<z.infer<typeof VerificationSchema>>({
    resolver: zodResolver(VerificationSchema),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleVerification() {
    await handleAction(setLoading, async () => {
      await post({ url: "/sign-up", body: formData, handleData: () => {} });
      toast.success("Verification successful");
      navigate("/dashboard");
    });
  }

  async function handleResend() {
    await handleAction(
      () => setLoading(false),
      async () => {
        if (time > 0) return;
        setTime(30);

        toast.success("Verification code sent to your email");
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleVerification)}
        className="flex flex-col gap-8 items-center"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <InputOTPGroup key={index}>
                        <InputOTPSlot index={index} className="w-12 h-12 text-lg font-bold" />
                      </InputOTPGroup>
                    ))}
                </InputOTP>
              </FormControl>

              <FormDescription>
                <span className="flex items-center justify-between gap-2">
                  <span>{`Code can be resent ${time > 0 ? `in ${time} seconds` : "now"}`}:</span>
                  <button
                    onClick={handleResend}
                    className={`underline ${
                      time > 0 ? "text-muted-foreground" : "text-blue-500 hover:cursor-pointer"
                    }`}
                  >
                    Resend Code
                  </button>
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="hover:cursor-pointer w-full">
          {loading ? <LoaderCircle className="animate-spin" /> : "Verify"}
        </Button>
      </form>
    </Form>
  );
};

export default Verification;
