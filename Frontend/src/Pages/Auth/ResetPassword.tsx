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
import AuthCard from "./AuthCard";
import { Input } from "@/Components/UI/input";
import { Button } from "@/Components/UI/button";
import useHTTP from "@/Hooks/useHTTP";
import { useGlobals } from "@/Store/useGlobals";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import passwordEye from "@/Components/PasswordEye";
import { useState } from "react";

const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { loading, http } = useHTTP();
  const { formData, setFormData } = useGlobals();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  async function handleResetPassword(data: z.infer<typeof ResetPasswordSchema>) {
    let email: string | null | undefined = formData.email;
    if (!email) email = localStorage.getItem("email");

    await http({
      url: "/reset-password",
      method: "PATCH",
      body: {
        email,
        password: data.password
      },
      handleSuccess: () => {
        toast.success("Password reset successful");
        localStorage.removeItem("email");
        navigate("/sign-in");
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleResetPassword)}
        className="flex flex-col gap-8 items-center"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
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

        <Button type="submit" className="w-full hover:cursor-pointer" disabled={loading}>
          {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Reset Password
        </Button>
      </form>
    </Form>
  );
};

function ResetPassword() {
  return (
    <AuthCard
      title="Reset Password"
      description="Please enter your new password"
      form={<ResetPasswordForm />}
    />
  );
}

export default ResetPassword;
