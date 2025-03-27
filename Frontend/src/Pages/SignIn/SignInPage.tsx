import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/UI/card";
import { useState } from "react";
import SignIn from "./SignIn";

const SignInPage = () => {
  const [formData, setFormData] = useState({
      email: "",
      password: "",
    });

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm flex flex-col gap-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Sign In to GradeHub
          </CardTitle>
          <CardDescription className="text-center">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn formData={formData} setFormData={setFormData} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="underline text-blue-500">
              Sign Up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
