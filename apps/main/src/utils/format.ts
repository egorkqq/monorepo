export const formatDate = (date: Date | undefined, lang: string = "en-US") => {
  if (!date) return "";

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };

  if (isToday) {
    return `Today, ${date.toLocaleTimeString(lang, options)}`;
  } else if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString(lang, options)}`;
  } else {
    return `${date.toLocaleDateString(lang, { day: "numeric", month: "long" })}, ${date.toLocaleTimeString(lang, options)}`;
  }
};

export const formatTokenValue = (value: number | bigint | undefined, lang: string = "en-US") => {
  if (value === undefined) return "N/A";
  if (Number.isNaN(value)) return "N/A";

  let amount;

  if (value < 0.01) {
    // Для маленьких значений используем maximumSignificantDigits
    amount = new Intl.NumberFormat(lang, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumSignificantDigits: 6,
      useGrouping: true,
    }).format(value);
  } else {
    // Для остальных значений используем maximumFractionDigits
    amount = new Intl.NumberFormat(lang, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(value);
  }

  return amount;
};

export const formatCurrency = (price: number | undefined, lang: string = "en-US") => {
  if (price === undefined) return "N/A";
  if (Number.isNaN(price)) return "N/A";

  let value;

  if (price < 0.01) {
    // Для маленьких значений используем maximumSignificantDigits
    value = new Intl.NumberFormat(lang, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumSignificantDigits: 2,
      useGrouping: true,
    }).format(price);
  } else {
    // Для остальных значений используем maximumFractionDigits
    value = new Intl.NumberFormat(lang, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(price);
  }

  return value;
};

export const formatFromNano = (value: string | bigint | number | undefined, decimals: number = 18) => {
  if (value === undefined) return "N/A";

  let bigValue: bigint;

  if (typeof value === "string") {
    bigValue = BigInt(value);
  } else if (typeof value === "number") {
    bigValue = BigInt(Math.round(value));
  } else {
    bigValue = value;
  }

  const divisor = BigInt(10) ** BigInt(decimals);
  const beforeDecimal = bigValue / divisor;
  const afterDecimal = bigValue % divisor;

  const beforeDecimalStr = beforeDecimal.toString();
  const afterDecimalStr = afterDecimal.toString().padStart(decimals, "0");

  const numValue = Number(beforeDecimalStr + "." + afterDecimalStr);

  return numValue;
};
