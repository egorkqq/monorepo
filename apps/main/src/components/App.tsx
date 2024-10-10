/* eslint-disable no-use-before-define */

import React, { Suspense, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

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
import { useSetAtom } from "jotai/react";

import { useNetwork, useTonWallet, useTonWallets } from "@arc/sdk";

import { useAuth } from "@/api/architecton/useAuth";
import { showMenuAtom } from "@/atoms/ui";
import { ErrorBoundary, ErrorBoundaryError } from "@/components/ErrorBoundary";
import { AppRoute, BankRoute, CatalogRoute, DepositRoute, MarketRoute, RegisterRoute, SettingsRoute } from "@/routes";

import { Layout } from "./Layout";

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
      staleTime: 60000, // 1 min
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export const App = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <SDKProvider>
      <QueryClientProvider client={queryClient}>
        <TWALayer />
      </QueryClientProvider>
    </SDKProvider>
  </ErrorBoundary>
);

const TWALayer = () => {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (lp.initData?.startParam === "debug") {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [lp.initData?.startParam]);

  useEffect(() => bindMiniAppCSSVars(miniApp, themeParams), [miniApp, themeParams]);

  useEffect(() => bindThemeParamsCSSVars(themeParams), [themeParams]);

  useEffect(() => viewport && bindViewportCSSVars(viewport), [viewport]);

  useEffect(() => {
    if (!viewport) return;

    const handler = (height: number) => {
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    };

    viewport.on("change:height", handler);

    return () => {
      viewport.off("change:height", handler);
    };
  }, [viewport]);

  if (!viewport) return null; // TODO: Loader

  // TODO: все взаимодействия со стилями тут (Сетаем тему например)
  // TODO: также, если будем хранить в глобальном сторе наш core SDK объект, то конеткст/стор будем инициалиизровать тут.
  return <I18NLayer />;
};

const I18NLayer = () => (
  // TODO: i18n Provider context?
  <>
    <AuthLayer />
    <InitTelegramDataListener />
  </>
);

const AuthLayer = () => {
  const activeWallet = useTonWallet();
  const { network } = useNetwork();
  // const { initDataRaw } = useLaunchParams();

  const authMutation = useAuth();

  const initTon = useMemo(() => {
    if (!activeWallet) return undefined;

    return {
      network,
      address: activeWallet.address?.toString(),
      publicKey: activeWallet.publicKey,
    };
  }, [network, activeWallet]);

  useEffect(() => {
    authMutation.mutate({ authType: "telegram", initDataRaw: undefined, initTon });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTon]);

  // TODO: аналог Loader, тут мы забираем из сторейджа инфу о прошлых логинах пользователя, засовываем их в глобальное состояние/контекст иделаем запрос на наш бек за токеном и тп

  // TODO: также, тут желательно показывать юзеру какой то лоадер, пока идет запрос на бек

  // TODO: если юзер не залогинен, то показываем ему RegisterRoutes
  // TODO: если юзер залогинен, то показываем ему Web3Layer, в который мы прокинем тип авторизации пользователя (ton-connect или наш sdk/core)

  // инициализация нашего глобального состояния авторизации или сдк объекта должна быть выше, то есть внутри роутов авторизации мы будем к нему обращаться и менять его состояние

  return <Router>{activeWallet ? <MainRoutes /> : <RegisterRoutes />}</Router>;
};

AuthLayer.displayName = "AuthLayer";

const MainRoutes = () => {
  const lp = useLaunchParams();
  const showMenu = useSetAtom(showMenuAtom);

  useEffect(() => {
    showMenu(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route element={<Layout platform={lp.platform} />}>
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
  );
};

const InitTelegramDataListener = () => {
  const { t: _t, i18n } = useTranslation();
  const lp = useLaunchParams();

  const mb = useMainButton();
  const backButton = useBackButton();

  useEffect(() => {
    mb.hide();
    backButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mb.setBgColor("#07ACFF");
    mb.setTextColor("#FFFFFF");
  }, [mb]);

  useEffect(() => {
    if (lp.initData?.user?.languageCode) {
      i18n.languages.forEach((lang) => {
        if (lp.initData?.user?.languageCode === lang) {
          i18n.reloadResources([lang]).then(() => i18n.changeLanguage(lang));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lp.initData?.user?.languageCode]);
  return null;
};

export const RegisterRoutes = () => {
  const lp = useLaunchParams();
  const backButton = useBackButton();
  const { list, selectWallet } = useTonWallets();

  const showMenu = useSetAtom(showMenuAtom);

  useEffect(() => {
    if (list.length === 0) {
      return;
    }

    const handler = () => {
      selectWallet(list[0]?.id);
    };

    backButton.show();
    backButton.on("click", handler);

    return () => {
      backButton.off("click", handler);
      backButton.hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  useEffect(() => {
    showMenu(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout platform={lp.platform} />}>
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
        </Route>
      </Routes>
    </Suspense>
  );
};

const Loading = () => <div>Loading...</div>;
