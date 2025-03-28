import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface HTTPProps {
  url: string;
  method: string;
  body?: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleData?: (data: any) => void;
  handleSuccess?: () => void;
  handleError?: (error: unknown) => void;
}

const useHTTP = () => {
  const [loading, setLoading] = useState(false);

  const http = async ({ url, method, body, handleData, handleSuccess, handleError }: HTTPProps) => {
    setLoading(true);

    try {
      const { data } = await axios({
        method,
        url: `http://localhost:8080/api/v1${url}`,
        data: body,
      })

      // console.log(data);
      if (data.error) throw new Error(data.error);

      if (handleData) handleData(data);
      if (handleSuccess) handleSuccess();
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || error.message
        : "An unexpected error occurred";
      toast.error(message);
      if (handleError) handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return { http, loading };
};

export default useHTTP;
