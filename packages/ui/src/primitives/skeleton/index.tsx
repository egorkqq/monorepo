import { cn } from "@/utils/cn";

/**
 * A primitive component that renders a skeleton.
 * @param props HTML Div Element props.
 * @param props.className The className to apply to the skeleton.
 * @returns The skeleton component.
 */
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-md bg-[blue]", className)} {...props} />
);

export { Skeleton };
