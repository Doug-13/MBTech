import { Icons } from "../ui/Icons";
import LogoMark from "./LogoMark";
import { initials } from "../../shared/appUtils";

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Icons.dashboard,
  },
  {
    id: "agenda",
    label: "Agenda",
    icon: Icons.calendar,
  },
  {
    id: "whatsapp",
    label: "WhatsApp IA",
    icon: Icons.whatsapp,
  },
  {
    id: "parametros",
    label: "Parâmetros IA",
    icon: Icons.bot,
  },
  {
    id: "agentes",
    label: "Agentes de IA",
    icon: Icons.bot,
  },
];

export default function Sidebar({
  user,
  company,
  activeTab,
  onChangeTab,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <LogoMark variant="dark" />

        <div>
          <div className="sb-name">{company?.name || "Empresa"}</div>
          <div className="sb-app">Cliente MB Tech</div>
        </div>
      </div>

      <nav className="sb-nav">
        <div className="sb-lbl">Menu</div>

        {navigationItems.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`sb-item ${activeTab === item.id ? "on" : ""}`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onChangeTab(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-av">{initials(user?.name)}</div>

          <div className="sb-user-info">
            <div className="sb-uname">{user?.name || "Usuário"}</div>
            <div className="sb-urole">{user?.role || "Cliente"}</div>
          </div>

          <button
            type="button"
            className="sb-logout"
            title="Sair"
            onClick={onLogout}
          >
            {Icons.logout}
          </button>
        </div>
      </div>
    </aside>
  );
}