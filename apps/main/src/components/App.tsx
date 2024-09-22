/* eslint-disable no-use-before-define */

import type { ConnectionType } from "@/state/user";

import React, { Suspense, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  SDKProvider,
  useBackButton,
  useLaunchParams,
  useMainButton,
  useMiniApp,
  useThemeParams,
  useViewport,
} from "@telegram-apps/sdk-react";
import { useAtomValue } from "jotai/react";

import { ErrorBoundary, ErrorBoundaryError } from "@/components/ErrorBoundary";
import { SecretKey } from "@/pages/SecretKey";
import { AppRoute, RegisterRoute } from "@/routes";
import { activeUserWalletAtom, ConnectionTypes } from "@/state/user";

const IndexPage = React.lazy(() =>
  import("@/pages/IndexPage/IndexPage").then((module) => ({ default: module.IndexPage })),
);

const TonConnectUIProvider = React.lazy(() =>
  import("@tonconnect/ui-react").then((module) => ({ default: module.TonConnectUIProvider })),
);

const TonConnectButton = React.lazy(() =>
  import("@tonconnect/ui-react").then((module) => ({ default: module.TonConnectButton })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  const debug = useLaunchParams().startParam === "debug";
  const manifestUrl = useMemo(() => new URL("https://architecton.site/tonconnect-manifest.json").toString(), []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <SDKProvider>
        <QueryClientProvider client={queryClient}>
          <TWALayer />
        </QueryClientProvider>
      </SDKProvider>
    </ErrorBoundary>
  );
};

const TWALayer = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => bindMiniAppCSSVars(miniApp, themeParams), [miniApp, themeParams]);

  useEffect(() => bindThemeParamsCSSVars(themeParams), [themeParams]);

  useEffect(() => viewport && bindViewportCSSVars(viewport), [viewport]);

  if (!viewport) return null; // TODO: Loader

  // TODO: все взаимодействия со стилями тут (Сетаем тему например)
  // TODO: также, если будем хранить в глобальном сторе наш core SDK объект, то конеткст/стор будем инициалиизровать тут.
  return (
    <Router>
      <div className="rounded-lg border border-gray-300 bg-red-300 p-3">
        <h4>TWA Layer</h4>
        <I18NLayer />
      </div>
    </Router>
  );
};

const I18NLayer = () => (
  // TODO: i18n Provider context?

  <div className="rounded-lg border border-gray-300 bg-yellow-300 p-3">
    <h4>I18N Layer </h4>
    <AuthLayer />
    <InitTelegramDataListener />
  </div>
);

const AuthLayer = () => {
  const activeUserWallet = useAtomValue(activeUserWalletAtom);

  // TODO: аналог Loader, тут мы забираем из сторейджа инфу о прошлых логинах пользователя, засовываем их в глобальное состояние/контекст иделаем запрос на наш бек за токеном и тп

  // TODO: также, тут желательно показывать юзеру какой то лоадер, пока идет запрос на бек

  // TODO: если юзер не залогинен, то показываем ему RegisterRoutes
  // TODO: если юзер залогинен, то показываем ему Web3Layer, в который мы прокинем тип авторизации пользователя (ton-connect или наш sdk/core)

  // инициализация нашего глобального состояния авторизации или сдк объекта должна быть выше, то есть внутри роутов авторизации мы будем к нему обращаться и менять его состояние
  return (
    <div className="flex flex-col rounded-lg border border-gray-300 bg-pink-300 p-3">
      <h4>Auth Layer</h4>
      <code>{activeUserWallet ? "Authorised" : "Not Authorised"}</code>
      <code>Connect Mode: {activeUserWallet?.connectionType}</code>

      {activeUserWallet ? <Web3Layer connectionType={activeUserWallet?.connectionType} /> : <RegisterRoutes />}
    </div>
  );
};

const Web3Layer = ({ connectionType }: { connectionType: ConnectionType }) => {
  // TODO: детектим что ипользует юзер: ton-connect или наш sdk/core
  // SDK должен быть классом, который мы можем потом екстендануть и обвязать тон-коннектовским дерьмом (для всяких сенд и тд)
  const Provider = connectionType === ConnectionTypes.TonConnect ? TonConnectUIProvider : WalletSDKProvider;

  return (
    <div className="rounded-lg border border-gray-300 bg-purple-300 p-3">
      <h4>Web3 Layer</h4>
      <Suspense fallback={<Loading />}>
        <Provider manifestUrl="https://architecton.site/tonconnect-manifest.json">
          <Content />
        </Provider>
      </Suspense>
    </div>
  );
};

// TODO: выносим в кор сдк пакет
const SDKContext = React.createContext<null>(null);
const WalletSDKProvider = ({ children, manifestUrl }: { children: React.ReactNode; manifestUrl: string }) => (
  <SDKContext.Provider value={null}>
    <div className="rounded-lg border border-gray-300 bg-red-900 p-3">
      <h4>WalletSDKProvider Layer</h4>
      {children}
    </div>
  </SDKContext.Provider>
);

const Content = () => {
  console.log("a");
  return (
    <div className="rounded-lg border border-gray-300 bg-green-300 p-3">
      <h4>Content</h4>

      <Routes>
        <Route path={AppRoute.home} element={<IndexPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const InitTelegramDataListener = () => {
  const { t: _t, i18n } = useTranslation();
  const launchParams = useLaunchParams();

  const button = useMainButton();
  const backButton = useBackButton();

  useEffect(() => {
    button.hide();
    backButton.hide();
  }, []);

  useEffect(() => {
    if (launchParams.initData?.user?.languageCode) {
      i18n.languages.forEach((lang) => {
        if (launchParams.initData?.user?.languageCode === lang) {
          i18n.reloadResources([lang]).then(() => i18n.changeLanguage(lang));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchParams.initData?.user?.languageCode]);
  return null;
};

export const RegisterRoutes = () => (
  <Suspense fallback={<Loading />}>
    <TonConnectUIProvider manifestUrl="https://architecton.site/tonconnect-manifest.json">
      <Routes>
        <Route
          path={RegisterRoute.index}
          element={
            <div className="h-screen w-full bg-gray-300">
              Its <b>RegisterRoute.index</b>
              <pre>
                Welcome to Architec.TON <br />
                <br />
                Low transaction fees <br />
                Combining Game <br />
                Data Sec Level <br />
                <br />
              </pre>
              <Link to={RegisterRoute["add-wallet"]}>Add wallet</Link>
            </div>
          }
        />

        <Route
          path={RegisterRoute["add-wallet"]}
          element={
            <div className="flex h-screen w-full flex-col gap-3 bg-gray-300">
              Its <b>RegisterRoute.add-wallet</b>
              <Link
                className="flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md"
                to={RegisterRoute["secret-key"]}
              >
                Create wallet
              </Link>
              <Link
                className="flex h-10 w-fit items-center gap-1 rounded-full bg-[#0098EA] p-2 pl-3 pr-4 text-white shadow-md"
                to={RegisterRoute.existing}
              >
                Add existing
              </Link>
              <TonConnectButton />
            </div>
          }
        />

        <Route path={RegisterRoute["secret-key"]} element={<SecretKey />} />

        <Route
          path={RegisterRoute["confirm-secret-key"]}
          element={
            <div className="h-screen w-full bg-gray-300">
              Its <b>RegisterRoute.confirm-secret-key</b>
            </div>
          }
        />

        <Route
          path={RegisterRoute.existing}
          element={
            <div className="h-screen w-full bg-gray-300">
              Its <b>RegisterRoute.existing</b>
            </div>
          }
        />

        <Route
          path={RegisterRoute.finish}
          element={
            <div className="h-screen w-full bg-gray-300">
              Its <b>RegisterRoute.finish</b>
            </div>
          }
        />
        <Route path="*" element={<Navigate to={RegisterRoute.index} />} />
      </Routes>
    </TonConnectUIProvider>
  </Suspense>
);

const Loading = () => <div>Loading...</div>;
