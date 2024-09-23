import { StrictMode } from "react";

import ReactDOM from "react-dom/client";

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
import "@/utils/mockEnv";
import "@/utils/i18n";

import { App } from "@/components/App";

import "./index.css";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
