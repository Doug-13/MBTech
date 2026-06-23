const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://mbtech-back-back.yph90z.easypanel.host/api"
).replace(/\/$/, "");

const CLIENT_STORAGE_KEY = "mb_tech_client_session";
const ADMIN_STORAGE_KEY = "mb_tech_admin_session";

console.log("[FRONT][API] API_URL configurada =>", API_URL);

function isAdminRoute() {
  return window.location.pathname.startsWith("/admin");
}

function safeJsonParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getSavedSession() {
  return safeJsonParse(localStorage.getItem(CLIENT_STORAGE_KEY));
}

export function saveSession(data) {
  const previous = getSavedSession();

  const session = {
    token: data.token || previous?.token,
    user: data.user,
    company: data.company,
  };

  localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function clearSession() {
  localStorage.removeItem(CLIENT_STORAGE_KEY);
}

export function getSavedAdminSession() {
  return safeJsonParse(localStorage.getItem(ADMIN_STORAGE_KEY));
}

export function saveAdminSession(data) {
  const previous = getSavedAdminSession();

  const session = {
    token: data.token || previous?.token,
    user: data.user,
  };

  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));

  return session;
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

function getCurrentToken() {
  if (isAdminRoute()) {
    return getSavedAdminSession()?.token;
  }

  return getSavedSession()?.token;
}

async function request(path, options = {}) {
  const token =
    options.token !== undefined
      ? options.token
      : getCurrentToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_URL}${path}`;

  console.log("[FRONT][API] request =>", {
    url,
    method: options.method || "GET",
    path,
    isAdminRoute: isAdminRoute(),
    hasToken: Boolean(token),
  });

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "omit",
  });

  if (response.status === 204) {
    return {
      ok: true,
    };
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.error ||
      data?.message ||
      `Erro HTTP ${response.status}`;

    console.error("[FRONT][API] error =>", {
      url,
      status: response.status,
      data,
      message,
    });

    throw new Error(message);
  }

  return data;
}

function qs(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      search.set(key, value);
    }
  });

  const text = search.toString();

  return text ? `?${text}` : "";
}

export const api = {
  // ─────────────────────────────────────────────
  // ADMIN MB TECH
  // ─────────────────────────────────────────────

  adminLogin(email, password) {
    return request("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      token: null,
    });
  },

  adminMe() {
    return request("/admin/me", {
      token: getSavedAdminSession()?.token,
    });
  },

  adminGetCompanies(q) {
    return request(`/admin/companies${qs({ q })}`, {
      token: getSavedAdminSession()?.token,
    });
  },

  adminCreateCompany(data) {
    return request("/admin/companies", {
      method: "POST",
      body: JSON.stringify(data),
      token: getSavedAdminSession()?.token,
    });
  },

  adminUpdateCompany(id, data) {
    return request(`/admin/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token: getSavedAdminSession()?.token,
    });
  },

  adminGetCompanyUsers(companyId) {
    return request(`/admin/company-users${qs({ companyId })}`, {
      token: getSavedAdminSession()?.token,
    });
  },

  adminCreateCompanyUser(data) {
    return request("/admin/company-users", {
      method: "POST",
      body: JSON.stringify(data),
      token: getSavedAdminSession()?.token,
    });
  },

  adminUpdateCompanyUser(id, data) {
    return request(`/admin/company-users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token: getSavedAdminSession()?.token,
    });
  },

  // ─────────────────────────────────────────────
  // EMPRESA
  // ─────────────────────────────────────────────

  login(email, password) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      token: null,
    });
  },

  me() {
    return request("/auth/me", {
      token: getSavedSession()?.token,
    });
  },

  getDashboard(date) {
    return request(`/dashboard${qs({ date })}`);
  },

  getAppointments(q) {
    return request(`/appointments${qs({ q })}`);
  },

  createAppointment(data) {
    return request("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateAppointment(id, data) {
    return request(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteAppointment(id) {
    return request(`/appointments/${id}`, {
      method: "DELETE",
    });
  },

  getConversations(params = {}) {
    return request(`/conversations${qs(params)}`);
  },

  getConversationMessages(conversationId) {
    if (!conversationId) {
      throw new Error("ID da conversa não informado.");
    }

    return request(
      `/conversation-messages${qs({
        conversationId,
      })}`
    );
  },

  getAiParameters() {
    return request("/ai-parameters");
  },

  createAiParameter(data) {
    return request("/ai-parameters", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateAiParameter(id, data) {
    return request(`/ai-parameters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteAiParameter(id) {
    return request(`/ai-parameters/${id}`, {
      method: "DELETE",
    });
  },

  // ─────────────────────────────────────────────
  // AGENTES DE IA
  // ─────────────────────────────────────────────

  getAgents() {
    return request("/agents");
  },

  getAgent(id) {
    return request(`/agents/${id}`);
  },

  createAgent(data) {
    return request("/agents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateAgent(id, data) {
    return request(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteAgent(id) {
    return request(`/agents/${id}`, {
      method: "DELETE",
    });
  },

  testAgent(data) {
    return request("/agents/test", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // ─────────────────────────────────────────────
  // CANAIS DE ATENDIMENTO
  // ─────────────────────────────────────────────

  getChannels() {
    return request("/channels");
  },

  createChannel(data) {
    return request("/channels", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};