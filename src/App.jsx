import { useEffect, useState } from "react";

import {
  api,
  clearSession,
  getSavedSession,
  saveSession,
} from "./services/api";

import "./styles/app.css";

import AdminApp from "./AdminApp";

import Sidebar from "./components/layout/Sidebar";
import LoadingPage from "./components/ui/LoadingPage";
import Badge from "./components/ui/Badge";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AgendaPage from "./pages/AgendaPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import AiParametersPage from "./pages/AiParametersPage";
import AgentsPage from "./pages/AgentsPage";
import PublicPolicyRouter from "./pages/PoliciesPages";

import { isPublicPolicyPath } from "./shared/appUtils";

const PLATFORM = {
  name: "MB Tech",
  productName: "MB Agenda IA",
};

const PAGE_TITLES = {
  dashboard: "Dashboard",
  agenda: "Agenda",
  whatsapp: "WhatsApp IA",
  parametros: "Parâmetros IA",
  agentes: "Agentes de IA",
};

export default function App() {
  const pathname = window.location.pathname;

  if (isPublicPolicyPath(pathname)) {
    return <PublicPolicyRouter />;
  }

  if (pathname.startsWith("/admin")) {
    return <AdminApp />;
  }

  const [session, setSession] = useState(() => getSavedSession());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboard, setDashboard] = useState(null);
  const [events, setEvents] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [booting, setBooting] = useState(
    Boolean(getSavedSession()?.token)
  );

  async function loadDashboard() {
    const savedSession = getSavedSession();

    if (!savedSession?.token) {
      return;
    }

    setDashboardLoading(true);

    try {
      const data = await api.getDashboard();

      setDashboard(data);
      setEvents(data.events || []);
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();

      if (
        message.includes("401") ||
        message.includes("sessão") ||
        message.includes("sessao")
      ) {
        clearSession();
        setSession(null);
      }

      console.error("[APP][DASHBOARD_ERROR]", error);
    } finally {
      setDashboardLoading(false);
      setBooting(false);
    }
  }

  useEffect(() => {
    async function restoreSession() {
      const savedSession = getSavedSession();

      if (!savedSession?.token) {
        setBooting(false);
        return;
      }

      try {
        const response = await api.me();

        const nextSession = {
          token: savedSession.token,
          user: response.user,
          company: response.company,
        };

        saveSession(nextSession);

        setSession(nextSession);
      } catch (error) {
        console.error("[APP][SESSION_ERROR]", error);

        clearSession();
        setSession(null);
      } finally {
        setBooting(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    if (session?.token) {
      loadDashboard();
    }
  }, [session?.token]);

  function handleLogin(nextSession) {
    setSession(nextSession);
    setActiveTab("dashboard");
  }

  function handleLogout() {
    clearSession();

    setSession(null);
    setDashboard(null);
    setEvents([]);
    setActiveTab("dashboard");
  }

  function renderPage() {
    const company = session?.company;

    switch (activeTab) {
      case "agenda":
        return (
          <AgendaPage
            company={company}
            events={events}
            setEvents={setEvents}
            refreshDashboard={loadDashboard}
          />
        );

      case "whatsapp":
        return <WhatsAppPage dashboard={dashboard} />;

      case "parametros":
        return <AiParametersPage company={company} />;

      case "agentes":
        return <AgentsPage company={company} />;

      case "dashboard":
      default:
        return (
          <DashboardPage
            company={company}
            dashboard={dashboard}
            loading={dashboardLoading}
          />
        );
    }
  }

  if (!session && !booting) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (booting || !session) {
    return <LoadingPage text="Carregando sessão..." />;
  }

  const { user, company } = session;

  return (
    <div className="app">
      <Sidebar
        user={user}
        company={company}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="main">
        <header className="topbar">
          <div>
            <div className="topbar-title">
              {PAGE_TITLES[activeTab] || "MB Agenda IA"}
            </div>

            <div className="topbar-sub">
              Cliente: {company?.name || "Empresa"} · Powered by{" "}
              {PLATFORM.name}
            </div>
          </div>

          <Badge status="active">IA ativa</Badge>
        </header>

        {renderPage()}
      </main>
    </div>
  );
}