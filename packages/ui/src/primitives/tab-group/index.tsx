import { memo } from "react";

interface TabGroupProps<T extends string> {
  items: { label: string; value: T }[];
  value: T;
  onSelect: (value: T) => void;
}

export const TabGroup = memo(<T extends string>({ items, value, onSelect }: TabGroupProps<T>) => (
  <div className="bg-background-secondary flex gap-2 rounded-xl p-2">
    {items.map((item) => (
      <button
        type="button"
        key={item.value}
        className={`text-caption-1 text-text-secondary rounded-lg px-2 py-1 ${value === item.value && "bg-accent text-white"}`}
        onClick={() => onSelect(item.value)}
      >
        {item.label}
      </button>
    ))}
  </div>
)) as <T extends string>(props: TabGroupProps<T>) => JSX.Element;

TabGroup.displayName = "TabGroup";
