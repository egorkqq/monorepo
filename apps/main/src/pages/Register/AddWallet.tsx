import { Link, useLocation } from "react-router-dom";

import { RegisterRoute } from "@/routes";

export const RegisterAddWallet = () => {
  const location = useLocation();

  return (
    <>
      Its <b>RegisterRoute.add-wallet --- {location.pathname}</b>
      <Link
        className="bg-accent flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 text-white shadow-md"
        to={RegisterRoute["secret-key"]}
      >
        Create wallet
      </Link>
      <Link
        className="bg-accent flex h-10 w-fit items-center gap-1 rounded-full p-2 pl-3 pr-4 text-white shadow-md"
        to={RegisterRoute.existing}
      >
        Add existing
      </Link>
    </>
  );
};
