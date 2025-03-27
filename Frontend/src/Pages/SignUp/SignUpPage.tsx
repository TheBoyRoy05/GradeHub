import SignUp from "@/Pages/SignUp/SignUp";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../Components/UI/card";
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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {pendingVerification ? "Verify Email Address" : "Create GradeHub Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingVerification ? (
            <Verification formData={formData} />
          ) : (
            <SignUp setPendingVerification={setPendingVerification} formData={formData} setFormData={setFormData} />
          )}
        </CardContent>
        <CardFooter>
          <p>
            Already have an account?{" "}
            <a href="/login" className="underline text-blue-500">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
