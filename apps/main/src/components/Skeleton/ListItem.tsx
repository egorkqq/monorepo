import { ListItem } from "@arc/ui/list-item";

const iconSkeleton = <div className="h-11 w-11 rounded-full bg-black/10 dark:bg-white/10" />;
const nameSkeleton = <div className="m-0.5 h-4 w-10 rounded-xl bg-black/10 dark:bg-white/10" />;
const priceSkeleton = <div className="m-0.5 h-3 w-6 rounded-xl bg-black/10 dark:bg-white/10" />;

export const SkeletonListItem = () => (
  <ListItem
    leftIcon={iconSkeleton}
    leftTopText={nameSkeleton}
    leftBottomText={priceSkeleton}
    rightTopText={nameSkeleton}
    rightBottomText={priceSkeleton}
    withSeparator
  />
);
