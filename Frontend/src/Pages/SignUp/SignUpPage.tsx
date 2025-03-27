import SignUp from "@/Pages/SignUp/SignUp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../Components/UI/card";
import { useState } from "react";
import Verification from "./Verification";

const SignUpPage = () => {
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
            {pendingVerification ? "Verify Email Address" : "Create GradeHub Account"}
          </CardTitle>
          <CardDescription className="text-center">
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingVerification ? (
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
            Already have an account?{" "}
            <a href="/signin" className="underline text-blue-500">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
