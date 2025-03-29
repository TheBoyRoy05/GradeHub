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
import { LoaderCircle } from "lucide-react";
import useHTTP from "@/Hooks/useHTTP";
import { UserType } from "@/Utils/types";
import { useGlobals } from "@/Store/useGlobals";
import AuthCard from "./AuthCard";

const VerificationSchema = z.object({
  code: z.string().length(6, { message: "Verification code must be 6 characters" }),
});

const VerificationForm = ({ signUp }: { signUp?: boolean }) => {
  const [time, setTime] = useState(30);
  const { loading, http } = useHTTP();
  const { formData, setUser } = useGlobals();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof VerificationSchema>>({
    resolver: zodResolver(VerificationSchema),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((time) => (time > 0 ? time - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleSignUp() {
    await http({
      url: "/auth/sign-up",
      method: "POST",
      body: formData,
      handleData: ({ token, user }: { token: string; user: UserType }) => {
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      },
      handleSuccess: () => {
        toast.success("Sign Up Successful, Welcome to GradeHub");
        navigate("/dashboard");
      },
    });
  }

  async function handleVerification(data: z.infer<typeof VerificationSchema>) {
    const verified = await http({
      url: `/auth/attempt-verification?code=${data.code}`,
      method: "POST",
      body: formData,
      handleData: ({ token, user }: { token: string; user: UserType }) => {
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      },
      handleSuccess: () => {
        toast.success("Verification Successful");
      },
    });
    if (!verified) return; 

    if (signUp) handleSignUp();
    else navigate("/auth/reset-password");
  }

  async function handleResend() {
    if (time > 0) return;
    setTime(30);

    await http({
      url: "/auth/prepare-verification",
      method: "POST",
      body: formData,
      handleSuccess: () => {
        toast.success("Verification code sent to your email");
      },
    });
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

        <Button type="submit" className="hover:cursor-pointer w-full" disabled={loading}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Verify"}
        </Button>
      </form>
    </Form>
  );
};

const Verification = ({ signUp }: { signUp?: boolean }) => {
  return (
    <AuthCard
      title="Verification"
      description="Please enter the verification code sent to your email"
      form={<VerificationForm signUp={signUp} />}
    />
  );
};

export default Verification;
