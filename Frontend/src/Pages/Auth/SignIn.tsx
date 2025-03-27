import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/UI/form";
import passwordEye from "@/Components/PasswordEye";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";

import { handleAction } from "@/Utils/functions";
import { useSignIn } from "@clerk/clerk-react";
import { LoaderCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import usePOST from "@/Hooks/usePOST";
import { useState } from "react";
import { Skeleton } from "@/Components/UI/skeleton";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

interface SignInProps {
  formData: { firstname: string; lastname: string; email: string; password: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{ firstname: string; lastname: string; email: string; password: string }>
  >;
}

const SignIn = ({ formData, setFormData }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({ resolver: zodResolver(SignInSchema) });
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const { post } = usePOST();

  async function handleSubmit(data: z.infer<typeof SignInSchema>) {
    await handleAction(isLoaded, setLoading, async () => {
      if (!signIn) return;
      await signIn.create({
        strategy: "password",
        identifier: data.email,
        password: data.password,
      });

      if (signIn.status !== "complete") {
        toast.error("Sign in failed");
        return;
      }

      await setActive({ session: signIn.createdSessionId });
      await post({ url: "/login", body: formData, handleData: () => {} });
      toast.success("Sign in successful");
      navigate("/dashboard");
    });
  }

  async function handleGoogleSignIn(tokenResponse: CredentialResponse) {
    await handleAction(isLoaded, setLoading, async () => {
      if (!signIn) return;
      const user: { email: string } = jwtDecode(tokenResponse.credential!);

      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });

      if (signIn.status !== "complete") {
        toast.error("Google login failed");
        return;
      }

      const body = {
        email: user.email,
        password: "",
      };

      await post({ url: "/login", body, handleData: () => {} });
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {isLoaded ? (
        <GoogleLogin
          onSuccess={handleGoogleSignIn}
          onError={() => toast.error("Google login failed")}
          size="large"
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
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
