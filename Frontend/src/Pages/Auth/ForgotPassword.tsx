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

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { loading, http } = useHTTP();
  const { formData, setFormData } = useGlobals();
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function handleForgotPassword(data: z.infer<typeof ForgotPasswordSchema>) {
    await http({
      url: "/auth/prepare-verification",
      method: "POST",
      body: data,
      handleSuccess: () => {
        toast.success("Reset code sent to your email");
        localStorage.setItem("email", data.email);
        navigate("/auth/verify");
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleForgotPassword)}
        className="flex flex-col gap-8 items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
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

        <Button type="submit" className="w-full hover:cursor-pointer" disabled={loading}>
          {loading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Send Reset Code
        </Button>
      </form>
    </Form>
  );
};

function ForgotPassword() {
  return (
    <AuthCard
      title="Forgot Password"
      description="Please enter your email to reset your password"
      form={<ForgotPasswordForm />}
    />
  );
}

export default ForgotPassword;
