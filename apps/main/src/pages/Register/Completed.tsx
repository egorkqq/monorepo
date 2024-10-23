import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ShieldTickIcon } from "@arc/ui/icons/shield-tick";

import { ShowMainButton } from "@/components/MainButton";
import { AppRoute } from "@/routes";

export const RegisterCompleted = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <ShowMainButton onClick={() => navigate(AppRoute.home)} title={t("REGISTER.LETSGO")}>
      <h1 className="text-title-1 mb-2 mt-4 font-medium">{t("REGISTER.COMPLETED")}</h1>

      <div className="text-text-secondary text-base">
        Congratulations, you have completed the wallet registration process.{" "}
        <span className="text-accent">Architec.TON</span> will do everything to make you feel comfortable!
      </div>

      <ShieldTickIcon className="stroke-accent mx-auto my-16 h-40 w-40 fill-none" />
    </ShowMainButton>
  );
};
