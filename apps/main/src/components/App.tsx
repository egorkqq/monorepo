/* eslint-disable no-use-before-define */

import type { ConnectionType } from "@/state/user";

import React, { Suspense, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";

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
import { AppRoute, BankRoute, CatalogRoute, DepositRoute, MarketRoute, RegisterRoute, SettingsRoute } from "@/routes";
import { activeUserWalletAtom, ConnectionTypes } from "@/state/user";

const Home = React.lazy(() => import("@/pages/Home").then((module) => ({ default: module.Home })));
const Send = React.lazy(() => import("@/pages/Home").then((module) => ({ default: module.Send })));
const Swap = React.lazy(() => import("@/pages/Home").then((module) => ({ default: module.Swap })));

const Bank = React.lazy(() => import("@/pages/Bank").then((module) => ({ default: module.Bank })));
const BankTasks = React.lazy(() => import("@/pages/Bank").then((module) => ({ default: module.BankTasks })));
const BankStake = React.lazy(() => import("@/pages/Bank").then((module) => ({ default: module.BankStake })));
const BankBuy = React.lazy(() => import("@/pages/Bank").then((module) => ({ default: module.BankBuy })));
const BankHistory = React.lazy(() => import("@/pages/Bank").then((module) => ({ default: module.BankHistory })));

const Deposit = React.lazy(() => import("@/pages/Deposit").then((module) => ({ default: module.Deposit })));
const DepositExternal = React.lazy(() =>
  import("@/pages/Deposit").then((module) => ({ default: module.DepositExternal })),
);

const Catalog = React.lazy(() => import("@/pages/Catalog").then((module) => ({ default: module.Catalog })));
const CatalogGame = React.lazy(() => import("@/pages/Catalog").then((module) => ({ default: module.CatalogGame })));
const CatalogLeaders = React.lazy(() =>
  import("@/pages/Catalog").then((module) => ({ default: module.CatalogLeaders })),
);
const CatalogCategory = React.lazy(() =>
  import("@/pages/Catalog").then((module) => ({ default: module.CatalogCategory })),
);

const Market = React.lazy(() => import("@/pages/Market").then((module) => ({ default: module.Market })));
const OrdersList = React.lazy(() => import("@/pages/Market").then((module) => ({ default: module.OrdersList })));
const Order = React.lazy(() => import("@/pages/Market").then((module) => ({ default: module.Order })));
const CreateOrder = React.lazy(() => import("@/pages/Market").then((module) => ({ default: module.CreateOrder })));
const ConfirmCreateOrder = React.lazy(() =>
  import("@/pages/Market").then((module) => ({ default: module.ConfirmCreateOrder })),
);

const News = React.lazy(() => import("@/pages/News").then((module) => ({ default: module.News })));

const Settings = React.lazy(() => import("@/pages/Settings").then((module) => ({ default: module.Settings })));
const WalletSafety = React.lazy(() => import("@/pages/Settings").then((module) => ({ default: module.WalletSafety })));

const TonConnectUIProvider = React.lazy(() =>
  import("@tonconnect/ui-react").then((module) => ({ default: module.TonConnectUIProvider })),
);

const RegisterAddWallet = React.lazy(() =>
  import("@/pages/Register").then((module) => ({ default: module.RegisterAddWallet })),
);

const RegisterSecretKey = React.lazy(() =>
  import("@/pages/Register").then((module) => ({ default: module.RegisterSecretKey })),
);

const RegisterExisting = React.lazy(() =>
  import("@/pages/Register").then((module) => ({ default: module.RegisterExisting })),
);

const RegisterWelcome = React.lazy(() =>
  import("@/pages/Register").then((module) => ({ default: module.RegisterWelcome })),
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
  const debug = useLaunchParams().initData?.startParam === "debug";

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
      {activeUserWallet && <code>{activeUserWallet?.address}</code>}
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
          <MainRoutes />
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

const MainRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route
        element={
          <div>
            <h1>MainRoutes</h1>
            <Outlet />
          </div>
        }
      >
        {/* Home group */}
        <Route path={AppRoute.home} element={<Home />} />
        <Route path={AppRoute.swap} element={<Swap />} />
        <Route path={AppRoute.send} element={<Send />} />
        {/* Home group --- Bank  */}
        <Route path={BankRoute.index} element={<Bank />} />
        <Route path={BankRoute.tasks} element={<BankTasks />} />
        <Route path={BankRoute.stake} element={<BankStake />} />
        <Route path={BankRoute.buy} element={<BankBuy />} />
        <Route path={BankRoute.history} element={<BankHistory />} />
        {/* Home group --- Deposit  */}
        <Route path={DepositRoute.index} element={<Deposit />} />
        <Route path={DepositRoute.external} element={<DepositExternal />} />

        {/* Catalog group */}
        <Route path={CatalogRoute.index} element={<Catalog />} />
        <Route path={CatalogRoute.game} element={<CatalogGame />} />
        <Route path={CatalogRoute.leaders} element={<CatalogLeaders />} />
        <Route path={CatalogRoute.category} element={<CatalogCategory />} />

        {/* Market group */}
        <Route path={MarketRoute.index} element={<Market />} />
        <Route path={MarketRoute.list} element={<OrdersList />} />
        <Route path={MarketRoute.order} element={<Order />} />
        <Route path={MarketRoute.create} element={<CreateOrder />} />
        <Route path={MarketRoute.confirm} element={<ConfirmCreateOrder />} />

        {/* News group */}
        <Route path={AppRoute.news} element={<News />} />

        {/* Settings group */}
        <Route path={SettingsRoute.index} element={<Settings />} />
        <Route path={SettingsRoute.walletSafety} element={<WalletSafety />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  </Suspense>
);

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

export const RegisterRoutes = () => {
  const manifestUrl = useMemo(() => new URL("https://architecton.site/tonconnect-manifest.json").toString(), []);

  return (
    <Suspense fallback={<Loading />}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <Routes>
          <Route path={RegisterRoute.index} element={<RegisterWelcome />} />

          <Route path={RegisterRoute["add-wallet"]} element={<RegisterAddWallet />} />

          <Route path={RegisterRoute["secret-key"]} element={<RegisterSecretKey />} />

          <Route
            path={RegisterRoute["confirm-secret-key"]}
            element={
              <div className="h-screen w-full bg-gray-300">
                Its <b>RegisterRoute.confirm-secret-key</b>
              </div>
            }
          />

          <Route path={RegisterRoute.existing} element={<RegisterExisting />} />

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
};

const Loading = () => <div>Loading...</div>;
