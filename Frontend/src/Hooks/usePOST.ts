import { useState } from "react";
import { toast } from "sonner";

interface Result {
  error?: string;
}

interface POSTProps {
  url: string;
  body: never;
  handleData: (data: Result) => void;
}

const usePOST = () => {
  const [loading, setLoading] = useState(false);
  
  const post = async ({ url, body, handleData }: POSTProps) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data: Result = await res.json();
      if (data.error) throw new Error(data.error);

      handleData(data);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, post };
};

export default usePOST;