import { useSignUp } from "@clerk/clerk-react";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/UI/form";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";
import { LoaderCircle } from "lucide-react";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import usePOST from "@/Hooks/usePOST";
import passwordEye from "@/Components/PasswordEye";
import { handleAction } from "@/Utils/functions";
import { Skeleton } from "@/Components/UI/skeleton";

const SignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

interface SignUpProps {
  setPendingVerification: React.Dispatch<React.SetStateAction<boolean>>;
  formData: { firstname: string; lastname: string; email: string; password: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ firstname: string; lastname: string; email: string; password: string }>
  >;
}

const SignUp = ({ setPendingVerification, formData, setFormData }: SignUpProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({ resolver: zodResolver(SignUpSchema) });
  const { isLoaded, signUp } = useSignUp();
  const { post } = usePOST();

  async function handleSubmit(data: z.infer<typeof SignUpSchema>) {
    await handleAction(isLoaded, setLoading, async () => {
      if (!signUp) return;

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        unsafeMetadata: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      toast.success("Verification code sent to your email");
    });
  }

  async function handleGoogleSignUp(tokenResponse: CredentialResponse) {
    await handleAction(isLoaded, setLoading, async () => {
      if (!signUp) return;
      type GoogleUser = { given_name: string; family_name: string; email: string };
      const user: GoogleUser = jwtDecode(tokenResponse.credential!);

      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });

      if (signUp.status !== "complete") {
        toast.error("Google login failed");
        return;
      }

      const body = {
        firstname: user.given_name,
        lastname: user.family_name,
        email: user.email,
        password: "",
      };

      await post({ url: "/register", body, handleData: () => {} });
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isLoaded ? (
        <GoogleLogin
          onSuccess={handleGoogleSignUp}
          onError={() => toast.error("Google login failed")}
          size="large"
          text="signup_with"
          shape="pill"
          width="300"
        />
      ) : (
        <Skeleton className="w-[300px] h-10 rounded-full" />
      )}
      <div className="flex items-center w-full gap-4">
        <div className="flex-1 border border-gray-300" />
        <span className="text-sm text-gray-500">or continue with</span>
        <div className="flex-1 border border-gray-300" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 w-full">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    {isLoaded ? (
                      <Input
                        placeholder="First Name"
                        {...field}
                        onChange={(e) => {
                          setFormData({ ...formData, firstname: e.target.value });
                          field.onChange(e);
                        }}
                      />
                    ) : (
                      <Skeleton className="w-full h-[40px] rounded-md" />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    {isLoaded ? (
                      <Input
                        placeholder="Last Name"
                        {...field}
                        onChange={(e) => {
                          setFormData({ ...formData, lastname: e.target.value });
                          field.onChange(e);
                        }}
                      />
                    ) : (
                      <Skeleton className="w-full h-[40px] rounded-md" />
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  {isLoaded ? (
                    <Input
                      type="email"
                      placeholder="Email"
                      {...field}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        field.onChange(e);
                      }}
                    />
                  ) : (
                    <Skeleton className="w-full h-[40px] rounded-md" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  {isLoaded ? (
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        field.onChange(e);
                      }}
                      endIcon={passwordEye(showPassword, setShowPassword)}
                    />
                  ) : (
                    <Skeleton className="w-full h-[40px] rounded-md" />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="hover:cursor-pointer">
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
