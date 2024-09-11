import { useEffect, useState } from "react";

export const Test = () => {
  const [a, setA] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setA((ar) => ar + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      TestValue ===
      {a}
    </div>
  );
};
