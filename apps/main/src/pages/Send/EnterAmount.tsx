import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { trimAddress } from "@arc/sdk";
import { cn } from "@arc/ui/cn";
import { ArrowCircleUp2Icon } from "@arc/ui/icons/arrow-circle-up-2";

import { useAssetDetails } from "@/api/stonFi/useAssetDetails";
import { ShowMainButton } from "@/components/MainButton";
import { useAssetBalance } from "@/hooks/useAssetBalance";
import { useFormatter } from "@/utils/hooks/useFormatter";
import { NATIVE_TON_ADDRESS } from "@/utils/isNativeAddress";

export const EnterAmount = ({ assetAddress, toAddress }: { assetAddress: string; toAddress: string }) => {
  const { data: asset } = useAssetDetails(assetAddress);
  const balanceInNano = useAssetBalance(assetAddress);

  const navigate = useNavigate();
  const { formatCurrency, formatFromNano } = useFormatter();

  const [amount, setAmount] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const amountInUsd = useMemo(() => {
    const assetPrice = asset?.asset.dex_price_usd || asset?.asset.third_party_price_usd;

    if (!assetPrice) return null;
    if (Number.isNaN(Number(amount))) return null;
    if (Number.isNaN(Number(assetPrice))) return null;

    return formatCurrency(Number(amount) * Number(assetPrice));
  }, [amount, asset?.asset.dex_price_usd, asset?.asset.third_party_price_usd, formatCurrency]);

  const balance = useMemo(
    () => Number(formatFromNano(balanceInNano, asset?.asset.decimals)),
    [balanceInNano, asset?.asset.decimals, formatFromNano],
  );

  const isEnoughBalance = useMemo(() => {
    if (assetAddress !== NATIVE_TON_ADDRESS) return balance >= Number(amount);

    return balance >= Number(amount) + 0.01;
  }, [balance, amount, assetAddress]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <ShowMainButton
      onClick={() => navigate(`/send?assetAddress=${assetAddress}&toAddress=${toAddress}&amount=${amount}`)}
      title="Continue"
      hidden={!isEnoughBalance || !amount || amount === "0"}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2">
          <ArrowCircleUp2Icon className="bg-accent flex h-8 w-8 items-center justify-center rounded-full stroke-white p-1" />

          <h2 className="text-title-2 text-text font-medium">Send to {trimAddress(toAddress)}</h2>
        </div>

        <div className="bg-separator -mx-4 my-4 h-0.5 w-[calc(100%+2rem)]" />

        <div className="flex h-16 max-w-full gap-3 pb-2 pt-3">
          <TokenAmountInput
            className={cn("text-text bg-background w-0 min-w-[1ch] text-[40px] font-medium outline-none", {
              "text-negative": !isEnoughBalance,
            })}
            value={amount}
            onChange={(value) => setAmount(value)}
          />
          <div
            className={cn("text-text-secondary flex-shrink-0 self-end text-[20px] font-medium", {
              "text-negative": !isEnoughBalance,
            })}
          >
            {asset?.asset.symbol}
          </div>
        </div>
        {amountInUsd && isEnoughBalance && (
          <div className="text-text-secondary text-headline overflow-hidden text-ellipsis whitespace-nowrap">
            ≈ $ {amountInUsd}
          </div>
        )}
        {!isEnoughBalance && <div className="text-negative text-headline">Not enough balance</div>}

        <div className="mt-auto flex items-center gap-2 pt-3">
          <div className="h-8 w-8 flex-shrink-0">
            <img className="h-full w-full rounded-full" src={asset?.asset.image_url} alt={asset?.asset.display_name} />
          </div>

          <div className="flex w-full flex-col gap-0.5">
            <div className="text-caption-1 text-text-secondary">From Balance</div>
            <div className="text-subhead text-text">
              {balance} {asset?.asset.symbol}
            </div>
          </div>
        </div>
      </div>
    </ShowMainButton>
  );
};

interface TokenAmountInputProps {
  className?: string;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = forwardRef<HTMLInputElement, TokenAmountInputProps>(
  ({ className, onChange, value, placeholder }, ref) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value;

      // Заменяем запятую на точку
      newValue = newValue.replace(",", ".");

      // Проверяем, что введено допустимое число
      if (/^(\d*\.?\d{0,6})$/.test(newValue) || newValue === "") {
        onChange(newValue);
      }
    };

    const style = useMemo(() => {
      const fontSize = value.length < 10 ? 40 : 40 - (value.length - 10);

      return {
        width: `${value.length}ch`,
        lineHeight: 1,
        fontSize: fontSize > 30 ? fontSize : "30px",
      };
    }, [value]);

    return (
      <input
        ref={ref}
        className={className}
        onChange={handleInputChange}
        value={value}
        inputMode="decimal"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        placeholder={placeholder ?? "0"}
        spellCheck="false"
        style={style}
      />
    );
  },
);

TokenAmountInput.displayName = "TokenAmountInput";
