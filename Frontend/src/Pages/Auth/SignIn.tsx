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

import { LoaderCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { UserType } from "@/Utils/types";
import { useGlobals } from "@/Store/useGlobals";
import useHTTP from "@/Hooks/useHTTP";

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
  type SignInType = { email: string; password: string; oauth?: boolean };
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignInSchema>>({ resolver: zodResolver(SignInSchema) });
  const { loading, http } = useHTTP();
  const { setUser } = useGlobals();
  const navigate = useNavigate();

  const signIn = async ({ email, password, oauth }: SignInType) =>
    await http({
      url: "/sign-in",
      method: "POST",
      body: { email, password, oauth },
      handleData: ({ token, user }: { token: string; user: UserType }) => {
        localStorage.setItem("jwt", token);
        localStorage.setItem("chat-user", JSON.stringify(user));
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
                    type="password"
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

          <Button type="submit" className="hover:cursor-pointer">
            {loading ? <LoaderCircle className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
