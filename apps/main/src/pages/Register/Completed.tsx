import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useSetAtom } from "jotai";

import { ShieldTickIcon } from "@arc/ui/icons/shield-tick";

import { mainButtonAtom } from "@/atoms/ui";
import { AppRoute } from "@/routes";

export const RegisterCompleted = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setMainButton = useSetAtom(mainButtonAtom);

  useEffect(() => {
    setMainButton({
      title: t("REGISTER.LETSGO"),
      onClick: () => navigate(AppRoute.home),
    });

    return () => {
      setMainButton({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1 className="text-title-1 mb-2 mt-4 font-medium">{t("REGISTER.COMPLETED")}</h1>

      <div className="text-text-secondary text-base">
        Congratulations, you have completed the wallet registration process.{" "}
        <span className="text-accent">Architec.TON</span> will do everything to make you feel comfortable!
      </div>

      <ShieldTickIcon className="stroke-accent mx-auto my-16 h-40 w-40 fill-none" />
    </>
  );
};
