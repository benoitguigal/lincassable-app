import { Authenticated, Refine } from "@refinedev/core";
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
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import authProvider from "./authProvider";
import { Header } from "./components/header";
import { supabaseClient } from "./utility";
import { LincassableTitle } from "./components/title";
import {
  PointDeCollecteCreate,
  PointDeCollecteEdit,
  PointDeCollecteList,
  PointDeCollecteShow,
} from "./pages/points-de-collecte";
import {
  TauxDeRemplissageCreate,
  TauxDeRemplissageEdit,
  TauxDeRemplissageList,
  TauxDeRemplissageShow,
} from "./pages/taux-remplissage";
import { CreateTauxDeRemplissage } from "./pages/points-de-collecte/createTauxDeRemplissage";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#253d39",
              colorPrimaryBg: "#bbc7c3",
              borderRadius: 2,
              // Alias Token
              colorBgContainer: "#eaedeb",
            },
          }}
        >
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(supabaseClient)}
                liveProvider={liveProvider(supabaseClient)}
                authProvider={authProvider}
                routerProvider={routerBindings}
                notificationProvider={useNotificationProvider}
                resources={[
                  {
                    name: "point_de_collecte",
                    list: "/point-de-collecte",
                    create: "/point-de-collecte/create",
                    edit: "/point-de-collecte/edit/:id",
                    show: "/point-de-collecte/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "taux_de_remplissage",
                    list: "/taux-de-remplissage",
                    create: "/taux-de-remplissage/create",
                    edit: "/taux-de-remplissage/edit/:id",
                    show: "/taux-de-remplissage/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
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
                    <Route
                      index
                      element={
                        <NavigateToResource resource="point_de_collecte" />
                      }
                    />
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
                    <Route path="/taux-de-remplissage">
                      <Route index element={<TauxDeRemplissageList />} />
                      <Route
                        path="create"
                        element={<TauxDeRemplissageCreate />}
                      />
                      <Route
                        path="edit/:id"
                        element={<TauxDeRemplissageEdit />}
                      />
                      <Route
                        path="show/:id"
                        element={<TauxDeRemplissageShow />}
                      />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  {/* Formulaire point de vente */}
                  <Route
                    path="/point-de-collecte/taux-de-remplissage/:id"
                    element={<CreateTauxDeRemplissage />}
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
