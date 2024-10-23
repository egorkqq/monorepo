import { useEffect, useMemo } from "react";

import { useSetAtom } from "jotai";

import { trimAddress } from "@arc/sdk";
import { cn } from "@arc/ui/cn";
import { ArrowCircleDown2Icon } from "@arc/ui/icons/arrow-circle-down-2";
import { ArrowCircleUp2Icon } from "@arc/ui/icons/arrow-circle-up-2";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { useHistory } from "@/api/architecton/useHistory";
import { showMenuAtom } from "@/atoms/ui";
import { PageLoader } from "@/components/Loader";
import { useFormatter } from "@/utils/hooks/useFormatter";

export const History = () => {
  const { data, isLoading } = useHistory();
  const setShowMenu = useSetAtom(showMenuAtom);
  const { formatDate, formatTokenValue } = useFormatter();

  useEffect(() => {
    setShowMenu(false);

    return () => {
      setShowMenu(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupedTransactions = useMemo(() => {
    if (!data) return {};

    return data.reduce(
      (acc, transaction) => {
        const date = formatDate(new Date(transaction.utime * 1000), false);

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      },
      {} as Record<string, typeof data>,
    );
  }, [formatDate, data]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="pb-6">
      <h1 className="text-title-1 mt-4 font-medium">History</h1>

      {data?.length === 0 && <div className="text-text-secondary mt-5">Empty transaction history</div>}

      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <div key={date}>
          <h2 className="mb-2 mt-5 text-lg font-semibold">{date}</h2>
          <List className={transactions.length <= 1 ? "p-0" : undefined}>
            {transactions.map((tx) => (
              <ListItem
                key={tx.utime}
                leftIcon={
                  tx.type === "in" ? (
                    <ArrowCircleDown2Icon className="bg-accent flex h-11 w-11 items-center justify-center rounded-full stroke-white p-2" />
                  ) : (
                    <ArrowCircleUp2Icon className="bg-accent flex h-11 w-11 items-center justify-center rounded-full stroke-white p-2" />
                  )
                }
                leftTopText={<p className="font-normal">{tx.type === "in" ? "Received" : "Sent"}</p>}
                leftBottomText={trimAddress(tx.type === "in" ? tx.addressFrom : tx.addressTo)}
                rightTopText={
                  <p
                    className={cn("font-medium", tx.type === "in" && "text-positive")}
                  >{`${tx.type === "in" ? "+" : "-"}${formatTokenValue(tx.value)} ${tx.symbol}`}</p>
                }
                rightBottomText={formatDate(new Date(tx.utime * 1000))}
                withSeparator
              />
            ))}
          </List>
        </div>
      ))}
    </div>
  );
};
