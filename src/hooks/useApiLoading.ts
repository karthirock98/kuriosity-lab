
import { useEffect, useState } from "react";
import { subscribeToLoading } from "@/services/api-axios";

export const useApiLoading = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return subscribeToLoading(setLoading);
  }, []);

  return loading;
};
