import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/UI/form";
import passwordEye from "@/Components/PasswordEye";
import { Button } from "@/Components/UI/button";
import { Input } from "@/Components/UI/input";

import { LoaderCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { AuthFormType, UserType } from "@/Utils/types";
import { useGlobals } from "@/Store/useGlobals";
import useHTTP from "@/Hooks/useHTTP";
import AuthCard from "./AuthCard";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({ resolver: zodResolver(SignInSchema) });
  const { loading, http } = useHTTP();
  const { formData, setFormData, setUser } = useGlobals();
  const navigate = useNavigate();

  const signIn = async ({ email, password, oauth }: AuthFormType) =>
    await http({
      url: "/auth/sign-in",
      method: "POST",
      body: { email, password, oauth },
      handleData: ({ token, user }: { token: string; user: UserType }) => {
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      },
      handleSuccess: () => {
        toast.success("Sign In Successful");
        navigate("/dashboard");
      },
    });

  async function handleGoogleSignIn(tokenResponse: CredentialResponse) {
    const googleUser: { email: string } = jwtDecode(tokenResponse.credential!);
    signIn({ email: googleUser.email, password: "", oauth: true });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <GoogleLogin
        onSuccess={handleGoogleSignIn}
        onError={() => toast.error("Google login failed")}
        size="large"
        shape="pill"
        width="300"
      />
      <div className="flex items-center w-full gap-4">
        <div className="flex-1 border border-gray-300" />
        <span className="text-sm text-gray-500">or continue with</span>
        <div className="flex-1 border border-gray-300" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(() => signIn(formData))}
          className="flex flex-col gap-4 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...field}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      field.onChange(e);
                    }}
                  />
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
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      field.onChange(e);
                    }}
                    endIcon={passwordEye(showPassword, setShowPassword)}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  <Link to="/auth/forgot-password" className="underline text-blue-500">
                    Forgot Password?
                  </Link>
                </FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" className="hover:cursor-pointer" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

function SignIn() {
  return (
    <AuthCard
      title="Sign In"
      description="Welcome back! Please fill in the details to sign in."
      form={<SignInForm />}
      footer={
        <p>
          Don't have an account?{" "}
          <Link to="/auth/sign-up" className="underline text-blue-500">
            Sign Up
          </Link>
        </p>
      }
    />
  );
}

export default SignIn;
