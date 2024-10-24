import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useBackButton } from "@telegram-apps/sdk-react";
import { useAtomValue } from "jotai";

import { isTmaEnvironmentAtom } from "@/atoms/ui";
import { AppRoute, RegisterRoute } from "@/routes";

const backButtonExclude: string[] = [
  AppRoute.home,
  AppRoute.catalog,
  AppRoute.news,
  AppRoute.market,
  AppRoute.settings,
  RegisterRoute.index,
  RegisterRoute.completed,
];

const BackButtonTMA = () => {
  const bb = useBackButton();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (!backButtonExclude.includes(location.pathname)) {
      bb.on("click", handleBackClick);
      bb.show();
    } else {
      bb.hide();
    }

    return () => {
      bb.off("click", handleBackClick);
    };
  }, [handleBackClick, bb, location.pathname]);

  return null;
};

const BackButton = () => {
  const isTma = useAtomValue(isTmaEnvironmentAtom);

  if (isTma) return <BackButtonTMA />;

  return null;
};

export default BackButton;
