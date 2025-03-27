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
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

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
  type SignUpError = { errors: { longMessage: string }[] };
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isLoaded, signUp } = useSignUp();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
  });

  if (!isLoaded) return null;

  const passwordEye = () => {
    return showPassword
      ? React.forwardRef<SVGSVGElement, React.ComponentProps<typeof Eye>>((props, ref) => (
          <Eye
            {...props}
            ref={ref}
            onClick={() => setShowPassword(false)}
            className="hover:cursor-pointer"
          />
        ))
      : React.forwardRef<SVGSVGElement, React.ComponentProps<typeof EyeOff>>((props, ref) => (
          <EyeOff
            {...props}
            ref={ref}
            onClick={() => setShowPassword(true)}
            className="hover:cursor-pointer"
          />
        ));
  };

  async function handleSubmit(data: z.infer<typeof SignUpSchema>) {
    if (!isLoaded) return;
    setLoading(true);

    try {
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
    } catch (err: unknown) {
      console.log(JSON.stringify(err));
      toast.error((err as SignUpError).errors[0].longMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                    onChange={(e) => {
                      setFormData({ ...formData, firstname: e.target.value });
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
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                    onChange={(e) => {
                      setFormData({ ...formData, lastname: e.target.value });
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
                  endIcon={passwordEye()}
                />
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
  );
};

export default SignUp;
