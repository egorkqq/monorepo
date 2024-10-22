import type { DefaultToastOptions } from "react-hot-toast";

import { Toaster } from "react-hot-toast";

const toastOptions: DefaultToastOptions = {
  duration: 2000,
  className: "bg-[#2D2D2E] rounded-2xl py-2 px-4 text-white font-medium text-headline shadow-elevation3",
  error: {
    duration: 5000,
    className: "bg-accent rounded-2xl py-2 px-4 text-white font-medium text-headline shadow-elevation3",
  },
};

export const StyledToaster = () => <Toaster toastOptions={toastOptions} />;
