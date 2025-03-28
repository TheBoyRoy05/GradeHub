import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/UI/card";

interface AuthCardProps {
  title: string;
  description?: string;
  form: React.ReactNode;
  footer?: React.ReactNode;
}

const AuthCard = ({ title, description, footer, form }: AuthCardProps) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm flex flex-col gap-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{title}</CardTitle>
          {description && <CardDescription className="text-center">{description}</CardDescription>}
        </CardHeader>
        <CardContent>{form}</CardContent>
        {footer && <CardFooter className="flex justify-center">{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthCard;
