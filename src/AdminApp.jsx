import { useEffect, useMemo, useState } from "react";
import {
  api,
  clearAdminSession,
  getSavedAdminSession,
  saveAdminSession,
} from "./services/api";

const STORAGE_ADMIN_PATH = "/admin";

function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fmtDate(value) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("pt-BR");
}

function getError(error) {
  return error?.message || "Não foi possível concluir a operação.";
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8f7f4;
    color: #1b1b18;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
    border: none;
  }

  .admin-login {
    min-height: 100vh;
    background: #101010;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .login-card {
    width: min(440px, 100%);
    background: #fff;
    border-radius: 26px;
    padding: 34px;
    box-shadow: 0 40px 120px rgba(0,0,0,.28);
    animation: fade .25s ease both;
  }

  .brand {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 24px;
  }

  .mark {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(135deg,#111827 0%,#020617 58%,#d97706 160%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    letter-spacing: -.08em;
  }

  .brand-title {
    font-size: 17px;
    font-weight: 800;
  }

  .brand-sub {
    font-size: 12px;
    color: #8a8a85;
    margin-top: 2px;
  }

  .h1 {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -.03em;
    margin-bottom: 6px;
  }

  .muted {
    color: #777771;
    font-size: 13px;
    line-height: 1.5;
  }

  .field {
    display: block;
    margin-top: 14px;
  }

  .field span {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #595954;
    margin-bottom: 6px;
  }

  .field input,
  .field select {
    width: 100%;
    border: 1.5px solid #e4e4e1;
    background: #fbfbfa;
    border-radius: 10px;
    padding: 11px 12px;
    outline: none;
  }

  .field input:focus,
  .field select:focus {
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217,119,6,.1);
    background: #fff;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 800;
    font-size: 13px;
  }

  .btn-dark {
    background: #1a1a18;
    color: #fff;
  }

  .btn-gold {
    background: #d97706;
    color: #fff;
  }

  .btn-light {
    background: #fff;
    border: 1.5px solid #e4e4e1;
    color: #292925;
  }

  .btn-red {
    background: #fef2f2;
    border: 1.5px solid #fee2e2;
    color: #dc2626;
  }

  .btn-sm {
    padding: 7px 10px;
    font-size: 12px;
  }

  .err {
    margin-top: 12px;
    padding: 11px 13px;
    border-radius: 10px;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    color: #b91c1c;
    font-weight: 700;
    font-size: 13px;
  }

  .ok {
    margin-top: 12px;
    padding: 11px 13px;
    border-radius: 10px;
    background: #ecfdf5;
    border: 1px solid #d1fae5;
    color: #047857;
    font-weight: 700;
    font-size: 13px;
  }

  .layout {
    min-height: 100vh;
    display: flex;
  }

  .side {
    width: 270px;
    min-height: 100vh;
    background: #101010;
    color: #fff;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
  }

  .side-head {
    padding: 22px 18px;
    border-bottom: 1px solid rgba(255,255,255,.08);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .side .mark {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .nav {
    padding: 16px 10px;
  }

  .nav-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: .09em;
    color: rgba(255,255,255,.28);
    font-weight: 800;
    padding: 0 10px 8px;
  }

  .nav-btn {
    width: 100%;
    text-align: left;
    border-radius: 10px;
    padding: 10px 12px;
    color: rgba(255,255,255,.52);
    background: transparent;
    font-weight: 700;
  }

  .nav-link {
    display: block;
    text-decoration: none;
  }

  .nav-btn.on,
  .nav-btn:hover {
    background: rgba(245,158,11,.14);
    color: #fde68a;
  }

  .side-foot {
    margin-top: auto;
    padding: 14px;
    border-top: 1px solid rgba(255,255,255,.08);
  }

  .user-card {
    display: flex;
    gap: 10px;
    align-items: center;
    background: rgba(255,255,255,.04);
    border-radius: 12px;
    padding: 10px;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #d97706;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 12px;
  }

  .main {
    flex: 1;
    min-width: 0;
  }

  .top {
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(248,247,244,.92);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid #eeeeeb;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -.02em;
  }

  .page {
    padding: 26px 28px;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 14px;
    margin-bottom: 18px;
  }

  .metric {
    background: #fff;
    border: 1px solid #eeeeeb;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }

  .metric-label {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: #9b9b95;
  }

  .metric-num {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -.05em;
    margin-top: 8px;
  }

  .panel {
    background: #fff;
    border: 1px solid #eeeeeb;
    border-radius: 22px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    overflow: hidden;
  }

  .panel-head {
    padding: 18px 20px;
    border-bottom: 1px solid #eeeeeb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .section-title {
    font-size: 15px;
    font-weight: 800;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .search {
    border: 1.5px solid #e4e4e1;
    border-radius: 10px;
    background: #fff;
    padding: 9px 12px;
    outline: none;
  }

  .table-wrap {
    overflow: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    background: #fafaf8;
    padding: 12px 15px;
    text-align: left;
    font-size: 11px;
    color: #8a8a85;
    text-transform: uppercase;
    letter-spacing: .07em;
  }

  td {
    padding: 13px 15px;
    border-top: 1px solid #eeeeeb;
    font-size: 13px;
    color: #383834;
  }

  tr:hover td {
    background: #fffbeb;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 4px 9px;
    font-size: 11px;
    font-weight: 800;
  }

  .green {
    background: #ecfdf5;
    color: #047857;
  }

  .amber {
    background: #fffbeb;
    color: #b45309;
  }

  .red {
    background: #fef2f2;
    color: #b91c1c;
  }

  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .form {
    padding: 20px;
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 18px;
  }

  .empty {
    padding: 34px;
    text-align: center;
    color: #8a8a85;
  }

  .selected {
    outline: 2px solid #fbbf24;
    background: #fffbeb;
  }

  .row-main {
    font-weight: 800;
    color: #1b1b18;
  }

  .row-sub {
    font-size: 12px;
    color: #8a8a85;
    margin-top: 2px;
  }

  .modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.48);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal {
    width: min(720px,100%);
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 24px 80px rgba(0,0,0,.18);
    overflow: hidden;
  }

  .modal-head {
    padding: 18px 20px;
    border-bottom: 1px solid #eeeeeb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-body {
    padding: 20px;
  }

  .note {
    background: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 14px;
    padding: 13px;
    margin-bottom: 16px;
    color: #92400e;
    font-size: 13px;
    line-height: 1.5;
  }

  @keyframes fade {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media(max-width:900px) {
    .layout {
      display: block;
    }

    .side {
      width: 100%;
      min-height: auto;
      position: relative;
    }

    .cards,
    .grid2 {
      grid-template-columns: 1fr;
    }

    .page {
      padding: 18px 14px;
    }

    .top {
      padding: 0 14px;
    }

    .side-foot {
      display: none;
    }
  }
`;

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("admin@mbtech.com.br");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();

    setLoading(true);
    setErr("");

    try {
      const data = await api.adminLogin(email, password);
      const session = saveAdminSession(data);

      onLogin(session);
    } catch (error) {
      setErr(getError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <style>{css}</style>

      <form className="login-card" onSubmit={submit}>
        <div className="brand">
          <div className="mark">MB</div>

          <div>
            <div className="brand-title">MB Tech</div>
            <div className="brand-sub">Administração da plataforma</div>
          </div>
        </div>

        <div className="h1">Acesso administrativo</div>

        <p className="muted">
          Área interna da MB Tech para criar empresas e liberar usuários de
          acesso ao sistema.
        </p>

        {err && <div className="err">{err}</div>}

        <label className="field">
          <span>E-mail</span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Senha</span>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          className="btn btn-dark"
          style={{ width: "100%", marginTop: 18 }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar no admin"}
        </button>

        <p className="muted" style={{ textAlign: "center", marginTop: 14 }}>
          Acesse esta tela por <strong>/admin</strong>
        </p>
      </form>
    </div>
  );
}

function CompanyModal({ company, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    name: company?.name || "",
    trade_name: company?.trade_name || "",
    slug: company?.slug || "",
    email: company?.email || "",
    phone: company?.phone || "",
    whatsapp_number: company?.whatsapp_number || "",
    timezone: company?.timezone || "America/Sao_Paulo",
    segment_code: company?.segment_code || "events",
    is_active: company?.is_active ?? true,
  }));

  const [err, setErr] = useState("");

  function set(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setErr("");

    try {
      await onSave(form);
    } catch (error) {
      setErr(getError(error));
    }
  }

  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <div className="section-title">
            {company ? "Editar empresa" : "Nova empresa"}
          </div>

          <button type="button" className="btn btn-light btn-sm" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="modal-body">
          <div className="note">
            A empresa criada aqui será o cliente que acessa a MB Agenda IA.
            Depois crie um usuário vinculado a ela.
          </div>

          {err && <div className="err">{err}</div>}

          <div className="grid2">
            <label className="field">
              <span>Nome da empresa *</span>

              <input
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);

                  if (!company) {
                    set("slug", slugify(e.target.value));
                  }
                }}
                required
              />
            </label>

            <label className="field">
              <span>Slug *</span>

              <input
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                required
                disabled={Boolean(company)}
              />
            </label>

            <label className="field">
              <span>Nome fantasia</span>

              <input
                value={form.trade_name}
                onChange={(e) => set("trade_name", e.target.value)}
              />
            </label>

            <label className="field">
              <span>Segmento</span>

              <select
                value={form.segment_code}
                onChange={(e) => set("segment_code", e.target.value)}
                disabled={Boolean(company)}
              >
                <option value="events">Eventos</option>
                <option value="healthcare">Clínicas</option>
                <option value="general_services">Serviços Gerais</option>
                <option value="commerce">Comércio</option>
                <option value="education">Educação</option>
              </select>
            </label>

            <label className="field">
              <span>E-mail</span>

              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </label>

            <label className="field">
              <span>Telefone</span>

              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </label>

            <label className="field">
              <span>WhatsApp</span>

              <input
                value={form.whatsapp_number}
                onChange={(e) => set("whatsapp_number", e.target.value)}
                placeholder="5551999999999"
              />
            </label>

            <label className="field">
              <span>Timezone</span>

              <input
                value={form.timezone}
                onChange={(e) => set("timezone", e.target.value)}
              />
            </label>

            <label className="field">
              <span>Status</span>

              <select
                value={form.is_active ? "1" : "0"}
                onChange={(e) => set("is_active", e.target.value === "1")}
              >
                <option value="1">Ativa</option>
                <option value="0">Inativa</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancelar
            </button>

            <button className="btn btn-gold">Salvar empresa</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function UserModal({ company, user, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    company_id: company?.id || user?.company_id || "",
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "admin",
    password: "",
    is_active: user?.is_active ?? true,
  }));

  const [err, setErr] = useState("");

  function set(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    setErr("");

    try {
      await onSave(form);
    } catch (error) {
      setErr(getError(error));
    }
  }

  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <div>
            <div className="section-title">
              {user ? "Editar usuário" : "Novo usuário da empresa"}
            </div>

            <p className="muted">Empresa: {company?.name || "—"}</p>
          </div>

          <button type="button" className="btn btn-light btn-sm" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="modal-body">
          {err && <div className="err">{err}</div>}

          <div className="grid2">
            <label className="field">
              <span>Nome *</span>

              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>E-mail *</span>

              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span>Perfil</span>

              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Gerente</option>
                <option value="viewer">Visualizador</option>
              </select>
            </label>

            <label className="field">
              <span>Status</span>

              <select
                value={form.is_active ? "1" : "0"}
                onChange={(e) => set("is_active", e.target.value === "1")}
              >
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
              </select>
            </label>

            <label className="field">
              <span>{user ? "Nova senha" : "Senha inicial *"}</span>

              <input
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                required={!user}
                placeholder={user ? "Deixe em branco para manter" : "Mínimo 6 caracteres"}
              />
            </label>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancelar
            </button>

            <button className="btn btn-gold">Salvar usuário</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState(() => getSavedAdminSession());
  const [tab, setTab] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [companyModal, setCompanyModal] = useState(null);
  const [creatingCompany, setCreatingCompany] = useState(false);
  const [userModal, setUserModal] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);

  const adminUser = session?.user?.kind === "platform" ? session.user : null;

  const selectedCompany = useMemo(() => {
    return (
      companies.find((company) => company.id === selectedCompanyId) ||
      companies[0]
    );
  }, [companies, selectedCompanyId]);

  async function loadCompanies(search = q) {
    setLoading(true);
    setErr("");

    try {
      const data = await api.adminGetCompanies(search);
      const list = data.companies || [];

      setCompanies(list);

      if (!selectedCompanyId && list[0]) {
        setSelectedCompanyId(list[0].id);
      }
    } catch (error) {
      setErr(getError(error));
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers(companyId = selectedCompany?.id) {
    if (!companyId) return;

    setLoading(true);
    setErr("");

    try {
      const data = await api.adminGetCompanyUsers(companyId);

      setUsers(data.users || []);
    } catch (error) {
      setErr(getError(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function boot() {
      if (!getSavedAdminSession()?.token) return;

      try {
        const me = await api.adminMe();

        if (!me.user) {
          throw new Error("Sessão administrativa inválida.");
        }
      } catch {
        clearAdminSession();
        setSession(null);
      }
    }

    boot();
  }, []);

  useEffect(() => {
    if (adminUser) {
      loadCompanies("");
    }
  }, [adminUser?.id]);

  useEffect(() => {
    if (selectedCompany?.id) {
      loadUsers(selectedCompany.id);
    }
  }, [selectedCompany?.id]);

  async function saveCompany(form) {
    setOk("");

    if (companyModal) {
      const data = await api.adminUpdateCompany(companyModal.id, form);

      setCompanies((list) =>
        list.map((company) =>
          company.id === data.company.id
            ? {
                ...company,
                ...data.company,
              }
            : company
        )
      );

      setOk("Empresa atualizada com sucesso.");
    } else {
      const data = await api.adminCreateCompany(form);

      setCompanies((list) => [data.company, ...list]);
      setSelectedCompanyId(data.company.id);
      setOk("Empresa criada com sucesso. Agora crie o usuário de acesso.");
    }

    setCompanyModal(null);
    setCreatingCompany(false);
  }

  async function saveUser(form) {
    setOk("");

    if (userModal) {
      const data = await api.adminUpdateCompanyUser(userModal.id, form);

      setUsers((list) =>
        list.map((user) =>
          user.id === data.user.id
            ? {
                ...user,
                ...data.user,
              }
            : user
        )
      );

      setOk("Usuário atualizado com sucesso.");
    } else {
      const data = await api.adminCreateCompanyUser({
        ...form,
        company_id: selectedCompany.id,
      });

      setUsers((list) => [data.user, ...list]);
      setOk("Usuário criado com sucesso. Ele já pode acessar o painel do cliente.");
    }

    setUserModal(null);
    setCreatingUser(false);
  }

  function logout() {
    clearAdminSession();
    setSession(null);
    window.history.replaceState(null, "", STORAGE_ADMIN_PATH);
  }

  if (!adminUser) {
    return <AdminLogin onLogin={setSession} />;
  }

  return (
    <>
      <style>{css}</style>

      {(creatingCompany || companyModal) && (
        <CompanyModal
          company={companyModal}
          onClose={() => {
            setCreatingCompany(false);
            setCompanyModal(null);
          }}
          onSave={saveCompany}
        />
      )}

      {(creatingUser || userModal) && (
        <UserModal
          company={selectedCompany}
          user={userModal}
          onClose={() => {
            setCreatingUser(false);
            setUserModal(null);
          }}
          onSave={saveUser}
        />
      )}

      <div className="layout">
        <aside className="side">
          <div className="side-head">
            <div className="mark">MB</div>

            <div>
              <div style={{ fontWeight: 800 }}>MB Tech</div>
              <div style={{ color: "rgba(255,255,255,.35)", fontSize: 12 }}>
                Admin Plataforma
              </div>
            </div>
          </div>

          <div className="nav">
            <div className="nav-label">Menu</div>

            <button
              className={`nav-btn ${tab === "companies" ? "on" : ""}`}
              onClick={() => setTab("companies")}
            >
              Empresas
            </button>

            <button
              className={`nav-btn ${tab === "users" ? "on" : ""}`}
              onClick={() => setTab("users")}
            >
              Usuários por empresa
            </button>

            <div className="nav-label" style={{ marginTop: 18 }}>
              Políticas
            </div>

            <a
              className="nav-btn nav-link"
              href="/politicas/bibliotech"
              target="_blank"
              rel="noreferrer"
            >
              Política Bibliotech
            </a>

            <a
              className="nav-btn nav-link"
              href="/politicas/churchapp"
              target="_blank"
              rel="noreferrer"
            >
              Política ChurchApp
            </a>
          </div>

          <div className="side-foot">
            <div className="user-card">
              <div className="avatar">{initials(adminUser.name)}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>
                  {adminUser.name}
                </div>

                <div style={{ color: "rgba(255,255,255,.35)", fontSize: 11 }}>
                  {adminUser.role}
                </div>
              </div>

              <button
                className="btn btn-sm"
                style={{
                  color: "rgba(255,255,255,.45)",
                  background: "transparent",
                }}
                onClick={logout}
              >
                Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="top">
            <div>
              <div className="title">Gerenciamento da plataforma</div>

              <p className="muted">
                Crie empresas e usuários para acesso ao sistema
              </p>
            </div>

            <button className="btn btn-gold" onClick={() => setCreatingCompany(true)}>
              + Nova empresa
            </button>
          </div>

          <div className="page">
            {err && (
              <div className="err" style={{ marginBottom: 14 }}>
                {err}
              </div>
            )}

            {ok && (
              <div className="ok" style={{ marginBottom: 14 }}>
                {ok}
              </div>
            )}

            <div className="cards">
              <div className="metric">
                <div className="metric-label">Empresas</div>
                <div className="metric-num">{companies.length}</div>
                <p className="muted">Clientes cadastrados</p>
              </div>

              <div className="metric">
                <div className="metric-label">Ativas</div>
                <div className="metric-num">
                  {companies.filter((company) => company.is_active).length}
                </div>
                <p className="muted">Liberadas para acesso</p>
              </div>

              <div className="metric">
                <div className="metric-label">Usuários da empresa</div>
                <div className="metric-num">{users.length}</div>
                <p className="muted">
                  {selectedCompany?.name || "Selecione uma empresa"}
                </p>
              </div>
            </div>

            {tab === "companies" && (
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <div className="section-title">Empresas clientes</div>
                    <p className="muted">
                      Selecione uma empresa para gerenciar os usuários dela.
                    </p>
                  </div>

                  <div className="toolbar">
                    <input
                      className="search"
                      placeholder="Buscar empresa..."
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          loadCompanies(q);
                        }
                      }}
                    />

                    <button className="btn btn-light" onClick={() => loadCompanies(q)}>
                      Buscar
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Segmento</th>
                        <th>Contato</th>
                        <th>Usuários</th>
                        <th>Status</th>
                        <th>Criada em</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {companies.map((company) => (
                        <tr
                          key={company.id}
                          className={
                            selectedCompany?.id === company.id ? "selected" : ""
                          }
                          onClick={() => setSelectedCompanyId(company.id)}
                        >
                          <td>
                            <div className="row-main">{company.name}</div>
                            <div className="row-sub">{company.slug}</div>
                          </td>

                          <td>
                            {company.segment_name || company.segment_code || "—"}
                          </td>

                          <td>
                            <div>{company.email || "—"}</div>
                            <div className="row-sub">
                              {company.whatsapp_number || company.phone || "—"}
                            </div>
                          </td>

                          <td>{company.users_count || 0}</td>

                          <td>
                            <span
                              className={`badge ${
                                company.is_active ? "green" : "red"
                              }`}
                            >
                              {company.is_active ? "Ativa" : "Inativa"}
                            </span>
                          </td>

                          <td>{fmtDate(company.created_at)}</td>

                          <td>
                            <button
                              className="btn btn-light btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompanyModal(company);
                              }}
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))}

                      {!companies.length && (
                        <tr>
                          <td colSpan="7">
                            <div className="empty">Nenhuma empresa encontrada.</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "users" && (
              <div className="grid2">
                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <div className="section-title">Selecionar empresa</div>
                      <p className="muted">
                        Clique na empresa para visualizar os usuários.
                      </p>
                    </div>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <tbody>
                        {companies.map((company) => (
                          <tr
                            key={company.id}
                            className={
                              selectedCompany?.id === company.id ? "selected" : ""
                            }
                            onClick={() => setSelectedCompanyId(company.id)}
                          >
                            <td>
                              <div className="row-main">{company.name}</div>
                              <div className="row-sub">{company.slug}</div>
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  company.is_active ? "green" : "red"
                                }`}
                              >
                                {company.is_active ? "Ativa" : "Inativa"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head">
                    <div>
                      <div className="section-title">Usuários de acesso</div>
                      <p className="muted">
                        {selectedCompany?.name || "Selecione uma empresa"}
                      </p>
                    </div>

                    <button
                      className="btn btn-gold"
                      disabled={!selectedCompany}
                      onClick={() => setCreatingUser(true)}
                    >
                      + Novo usuário
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Usuário</th>
                          <th>Perfil</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="row-main">{user.name}</div>
                              <div className="row-sub">{user.email}</div>
                            </td>

                            <td>{user.role}</td>

                            <td>
                              <span
                                className={`badge ${
                                  user.is_active ? "green" : "red"
                                }`}
                              >
                                {user.is_active ? "Ativo" : "Inativo"}
                              </span>
                            </td>

                            <td>
                              <button
                                className="btn btn-light btn-sm"
                                onClick={() => setUserModal(user)}
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}

                        {!users.length && (
                          <tr>
                            <td colSpan="4">
                              <div className="empty">
                                Nenhum usuário cadastrado para esta empresa.
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <p className="muted" style={{ marginTop: 12 }}>
                Carregando...
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}