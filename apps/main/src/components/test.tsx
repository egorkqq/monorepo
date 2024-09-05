import { useEffect, useState } from "react";

export const Test = () => {
  const [a, setA] = useState(0);

  useEffect(() => {
    setInterval(() => setA(a + 1), 1000);
  }, []);

  return (
    <div>
      Test ===
      {a}
    </div>
  );
};
