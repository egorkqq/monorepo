import { type ComponentProps } from "react";

export const Button = (props: ComponentProps<"button">) => {
  const { type = "button", ...rest } = props;

  return <button className="bg-blue-400 p-5 text-zinc-400" type={type} {...rest} />;
};

export default Button;
