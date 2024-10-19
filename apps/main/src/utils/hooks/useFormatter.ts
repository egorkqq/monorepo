import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { formatCurrency, formatDate, formatFromNano, formatTokenValue, formatToNano } from "@/utils/format";

export const useFormatter = () => {
  const { i18n } = useTranslation();
  const { language } = i18n;

  return useMemo(
    () => ({
      formatCurrency: (price: number | undefined) => formatCurrency(price, language),
      formatTokenValue: (value: number | bigint | undefined) => formatTokenValue(value, language),
      formatPrice: (date: Date | undefined) => formatDate(date, language),
      formatFromNano: (value: string | bigint | number | undefined, decimals: number = 9) =>
        formatFromNano(value, decimals),
      formatToNano: (value: string | number | undefined, decimals: number = 9) => formatToNano(value, decimals),
    }),
    [language],
  );
};
