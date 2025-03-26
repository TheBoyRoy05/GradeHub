import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface Result {
  error?: string;
}

interface GETProps {
  url: string;
  handleData?: (data: Result) => void;
}

const useGet = ({ url, handleData }: GETProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Result>(null!);

  // useCallback ensures fetchData doesn't get recreated on every render
  const fetchData = useCallback(
    async (abortSignal: AbortSignal) => {
      setLoading(true);

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: abortSignal, // Attach AbortController signal
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const result: Result = await res.json();
        console.log(result);
        if (result.error) throw new Error(result.error);

        setData(result);
        if (handleData) handleData(result);
      } catch (err) {
        if (!abortSignal.aborted) {
          console.error(err);
          toast.error(err instanceof Error ? err.message : "An unexpected error occurred");
        }
      } finally {
        if (!abortSignal.aborted) setLoading(false);
      }
    },
    [url, handleData] // Ensure dependencies update properly
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal); // Now fetchData is properly updated

    return () => controller.abort(); // Cleanup on unmount
  }, [fetchData]); // Depend on fetchData to refetch when URL or handleData changes

  return { data, loading };
};

export default useGet;
