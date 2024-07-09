import { useState, useEffect } from "react";

const useDebounce = <T,>(
  value: T,
  initialValue: T,
  threshold: number = 800
) => {
  const [debounce, setDebounce] = useState<T>(initialValue);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounce(value);
    }, threshold);
    return () => {
      clearTimeout(timeOut);
    };
  }, [value]);

  return debounce;
};

export default useDebounce;
