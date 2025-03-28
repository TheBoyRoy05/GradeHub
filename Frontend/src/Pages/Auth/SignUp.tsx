import { useState } from "react";

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
import passwordEye from "@/Components/PasswordEye";
import { Link, useNavigate } from "react-router-dom";
import { useGlobals } from "@/Store/useGlobals";
import { UserType } from "@/Utils/types";
import useHTTP from "@/Hooks/useHTTP";
import AuthCard from "./AuthCard";

const SignUpSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({ resolver: zodResolver(SignUpSchema) });
  const { loading, http } = useHTTP();
  const { formData, setFormData, setUser } = useGlobals();
  const navigate = useNavigate();

  async function handleSubmit() {
    await http({
      url: "/prepare-verification?signUp=true",
      method: "POST",
      body: formData,
      handleSuccess: () => {
        toast.success("Verification code sent to your email");
        navigate("/verify-sign-up");
      }
    })
  }

  async function handleGoogleSignUp(tokenResponse: CredentialResponse) {
    type GoogleUser = { given_name: string; family_name: string; email: string };
    const googleUser: GoogleUser = jwtDecode(tokenResponse.credential!);

    await http({
      url: "/sign-up",
      method: "POST",
      body: {
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
        oauth: true,
      },
      handleData: ({ token, user }: { token: string; user: UserType }) => {
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      },
      handleSuccess: () => {
        toast.success("Sign up successful");
        navigate("/dashboard");
      },
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <GoogleLogin
        onSuccess={handleGoogleSignUp}
        onError={() => toast.error("Google login failed")}
        size="large"
        text="signup_with"
        shape="pill"
        width="300"
      />
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
                    <Input
                      placeholder="First Name"
                      {...field}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        field.onChange(e);
                      }}
                    />
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
                    <Input
                      placeholder="Last Name"
                      {...field}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        field.onChange(e);
                      }}
                    />
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
              </FormItem>
            )}
          />

          <Button type="submit" className="hover:cursor-pointer" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

function SignUp() {
  return (
    <AuthCard
      title="Sign Up"
      description="Welcome! Please fill in the details to get started."
      form={<SignUpForm />}
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/sign-in" className="underline text-blue-500">
            Sign In
          </Link>
        </p>
      }
    />
  );
}

export default SignUp;
