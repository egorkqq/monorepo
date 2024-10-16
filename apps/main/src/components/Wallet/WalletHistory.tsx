import { trimAddress } from "@arc/sdk";
import { cn } from "@arc/ui/cn";
import { ArrowCircleDown2Icon } from "@arc/ui/icons/arrow-circle-down-2";
import { ArrowCircleUp2Icon } from "@arc/ui/icons/arrow-circle-up-2";
import { List } from "@arc/ui/list";
import { ListItem } from "@arc/ui/list-item";

import { useWalletsInfo } from "@/api/architecton/useWalletsInfo";
import { formatDate } from "@/utils/format";

import { SkeletonListItem } from "../Skeleton/ListItem";

export const WalletHistory = () => {
  const { data, isLoading } = useWalletsInfo();

  if (isLoading)
    return (
      <>
        <h3 className="text-title-1 text-text mb-2 font-medium">History</h3>
        <List>
          <SkeletonListItem />
          <SkeletonListItem />
          <SkeletonListItem />
        </List>
      </>
    );

  if (!data || !data.wallets[0]?.history) return null;

  const { history } = data.wallets[0];

  return (
    <>
      <h3 className="text-title-1 text-text mb-2 font-medium">History</h3>

      {history.length === 0 && <div className="text-text-secondary">Empty transaction history</div>}

      <List className={history.length <= 1 ? "p-0" : undefined} onExpand={() => console.log("expand")}>
        {history.slice(0, 4).map((tx) => (
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
              >{`${tx.type === "in" ? "+" : "-"}${tx.value} ${tx.symbol}`}</p>
            }
            rightBottomText={formatDate(new Date(tx.utime * 1000))}
            withSeparator
          />
        ))}
      </List>
    </>
  );
};
