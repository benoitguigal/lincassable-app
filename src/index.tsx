import React from "react";
import { createRoot } from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import * as Sentry from "@sentry/react";
import App from "./App";

import "./i18n";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <App />
    </React.Suspense>
  </React.StrictMode>
);
