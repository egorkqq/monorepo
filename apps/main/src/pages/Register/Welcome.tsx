import { Link, useLocation } from "react-router-dom";

import { RegisterRoute } from "@/routes";

export const RegisterWelcome = () => {
  const location = useLocation();
  return (
    <>
      Its <b>RegisterRoute.index --- {location.pathname}</b>
      <pre>
        Welcome to Architec.TON <br />
        <br />
        Low transaction fees <br />
        Combining Game <br />
        Data Sec Level <br />
        <br />
      </pre>
      <Link to={RegisterRoute["add-wallet"]}>Add wallet</Link>
    </>
  );
};
