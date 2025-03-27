import { Eye, EyeOff } from "lucide-react";
import React from "react";

const passwordEye = (showPassword: boolean, setShowPassword: React.Dispatch<React.SetStateAction<boolean>>) => {
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

export default passwordEye;