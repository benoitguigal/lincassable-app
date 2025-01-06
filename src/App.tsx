import { Authenticated, Refine, I18nProvider } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  AuthPage,
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import authProvider from "./authProvider";
import accessControlProvider from "./accessControlProvider";
import { supabaseClient } from "./utility";
import { DashboardOutlined, EuroCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import locale from "antd/locale/fr_FR";
import dayjs from "dayjs";
import Dashboard from "./pages/Dashboard";
import PointDeCollecteCreate from "./pages/point-de-collecte/PointDeCollecteCreate";
import PointDeCollecteEdit from "./pages/point-de-collecte/PointDeCollecteEdit";
import PointDeCollecteList from "./pages/point-de-collecte/PointDeCollecteList";
import PointDeCollecteShow from "./pages/point-de-collecte/PointDeCollecteShow";
import TourneeList from "./pages/tournee/TourneeList";
import TourneeCreate from "./pages/tournee/TourneeCreate";
import TourneeEdit from "./pages/tournee/TourneeEdit";
import TourneeShow from "./pages/tournee/TourneeShow";
import DemandeCollecte from "./pages/demande-collecte/DemandeDeCollecte";
import DemandeDeCollecteSuccess from "./pages/demande-collecte/DemandeDeCollecteSuccess";
import DemandeDeCollecteList from "./pages/demande-collecte/DemandeDeCollecteList";
import PrevisionList from "./pages/PrevisionList";
import CollecteList from "./pages/collecte/CollecteList";
import Header from "./components/Header";
import LincassableTitle from "./components/LincassableTitle";
import { BouteilleIconSvg } from "./components/icons";

import "dayjs/locale/fr";
import ConsigneList from "./pages/consigne/ConsigneList";
import ConsigneCreate from "./pages/consigne/ConsigneCreate";
import ConsigneCreateSuccess from "./pages/consigne/ConsigneCreateSuccess";

dayjs.locale("fr");

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider: I18nProvider = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    translate: (key: string, options?: any) => String(t(key, options)),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider
          locale={locale}
          theme={{
            algorithm: theme.compactAlgorithm,
            token: {
              // Seed Token
              colorPrimary: "#253d39",
              colorPrimaryBg: "#bbc7c3",
              borderRadius: 2,
              // Alias Token
              colorBgContainer: "#eaedeb",
            },
            components: { Carousel: { arrowOffset: 0, dotOffset: 0 } },
          }}
        >
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(supabaseClient)}
                i18nProvider={i18nProvider}
                liveProvider={liveProvider(supabaseClient)}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                routerProvider={routerBindings}
                notificationProvider={useNotificationProvider}
                resources={[
                  {
                    name: "dashboard",
                    list: "/",
                    meta: {
                      label: "Tableau de bord",
                      icon: <DashboardOutlined />,
                    },
                  },
                  {
                    name: "collecte_menu",
                    meta: {
                      label: "Collecte",
                      icon: BouteilleIconSvg({}),
                    },
                  },
                  {
                    name: "point_de_collecte",
                    list: "/point-de-collecte",
                    create: "/point-de-collecte/create",
                    edit: "/point-de-collecte/edit/:id",
                    show: "/point-de-collecte/show/:id",
                    meta: {
                      canDelete: true,
                      parent: "collecte_menu",
                      label: "Points de collecte",
                    },
                  },
                  {
                    name: "remplissage_contenants",
                    list: "remplissage-contenants",
                    meta: {
                      parent: "collecte_menu",
                      label: "Réponses formulaire",
                    },
                  },
                  {
                    name: "previsions",
                    list: "/previsions",
                    meta: { label: "Prévisions", parent: "collecte_menu" },
                  },
                  {
                    name: "tournee",
                    list: "/tournee",
                    create: "/tournee/create",
                    edit: "/tournee/edit/:id",
                    show: "/tournee/show/:id",
                    meta: {
                      canDelete: true,
                      parent: "collecte_menu",
                      label: "Tournées",
                    },
                  },
                  {
                    name: "consigne",
                    list: "/consigne",
                    meta: { label: "Consigne", icon: <EuroCircleOutlined /> },
                  },
                  {
                    name: "collecte",
                    list: "/collecte",
                    meta: {
                      label: "Collectes par point",
                      parent: "collecte_menu",
                    },
                  },
                  { name: "transporteur" },
                  { name: "transporteur_users" },
                  { name: "zone_de_collecte" },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "MeOLim-ema9ch-jmxa9G",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Sider={(props) => (
                            <ThemedSiderV2
                              {...props}
                              fixed
                              Title={(titleProps) => (
                                <LincassableTitle {...titleProps} />
                              )}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="/point-de-collecte">
                      <Route index element={<PointDeCollecteList />} />
                      <Route
                        path="create"
                        element={<PointDeCollecteCreate />}
                      />
                      <Route
                        path="edit/:id"
                        element={<PointDeCollecteEdit />}
                      />
                      <Route
                        path="show/:id"
                        element={<PointDeCollecteShow />}
                      />
                    </Route>
                    <Route path="/remplissage-contenants">
                      <Route index element={<DemandeDeCollecteList />} />
                    </Route>
                    <Route path="/tournee">
                      <Route index element={<TourneeList />} />
                      <Route path="create" element={<TourneeCreate />} />
                      <Route path="edit/:id" element={<TourneeEdit />} />
                      <Route path="show/:id" element={<TourneeShow />} />
                    </Route>
                    <Route path="previsions">
                      <Route index element={<PrevisionList />} />
                    </Route>
                    <Route path="collecte">
                      <Route index element={<CollecteList />} />
                    </Route>
                    <Route path="/consigne">
                      <Route index element={<ConsigneList />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  {/* Formulaire point de vente */}
                  <Route
                    path="/point-de-collecte/taux-de-remplissage/:id"
                    element={<DemandeCollecte />}
                  />
                  <Route
                    path="/point-de-collecte/taux-de-remplissage/success"
                    element={<DemandeDeCollecteSuccess />}
                  />
                  <Route
                    path="/point-de-collecte/consigne/:id"
                    element={<ConsigneCreate />}
                  />
                  <Route
                    path="/point-de-collecte/consigne/success"
                    element={<ConsigneCreateSuccess />}
                  />
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route
                      path="/login"
                      element={
                        <AuthPage
                          type="login"
                          registerLink={false}
                          title={<LincassableTitle collapsed={false} />}
                        />
                      }
                    />
                    <Route
                      path="/register"
                      element={<AuthPage type="register" />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<AuthPage type="forgotPassword" />}
                    />
                    <Route
                      path="/update-password"
                      element={<AuthPage type="updatePassword" />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
