import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { formatCurrency, formatDate, formatTokenValue } from "@/utils/format";

export const useFormatter = () => {
  const { i18n } = useTranslation();
  const { language } = i18n;

  return useMemo(
    () => ({
      formatCurrency: (price: number | undefined) => formatCurrency(price, language),
      formatTokenValue: (value: number | bigint | undefined) => formatTokenValue(value, language),
      formatPrice: (date: Date | undefined) => formatDate(date, language),
    }),
    [language],
  );
};
