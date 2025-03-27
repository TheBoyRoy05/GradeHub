import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card";
import { useState } from "react";
import SignIn from "./SignIn";
import Verification from "./Verification";
import SignUp from "./SignUp";

const AuthPage = ({ signIn }: { signIn?: boolean }) => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm flex flex-col gap-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {signIn
              ? "Sign In to GradeHub"
              : pendingVerification
              ? "Verify Email Address"
              : "Create GradeHub Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {signIn
              ? "Welcome back! Please fill in the details to sign in."
              : pendingVerification
              ? "Please enter the verification code sent to your email"
              : "Welcome! Please fill in the details to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signIn ? (
            <SignIn formData={formData} setFormData={setFormData} />
          ) : pendingVerification ? (
            <Verification formData={formData} />
          ) : (
            <SignUp
              setPendingVerification={setPendingVerification}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            {`${signIn ? "Don't" : "Already"} have an account? `}
            <a href={signIn ? "/signup" : "/signin"} className="underline text-blue-500">
              {signIn ? "Sign Up" : "Sign In"}
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
