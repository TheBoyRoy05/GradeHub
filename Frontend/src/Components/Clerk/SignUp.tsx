import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { isLoaded, setActive, signUp } = useSignUp();
  const navigate = useNavigate();
  type SignUpError = { errors: { message: string }[] };

  if (!isLoaded) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      console.log(JSON.stringify(err));
      setError((err as SignUpError).errors[0].message);
    }
  }

  async function handleVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;

    try {
      const verificationResult = await signUp.attemptEmailAddressVerification({ code });

      if (verificationResult.status === "complete") {
        await setActive({ session: verificationResult.createdSessionId });
        navigate("/dashboard");
      } else {
        console.log(JSON.stringify(verificationResult));
      }
    } catch (err: unknown) {
      console.log(JSON.stringify(err));
      setError((err as SignUpError).errors[0].message);
    }
  }

  return <div>SignUp</div>;
};

export default SignUp;
