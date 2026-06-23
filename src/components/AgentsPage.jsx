import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const EMPTY_AGENT = {
  name: "",
  description: "",
  is_active: true,
  model: "gpt-4.1-mini",
  greeting_message: "Olá! Como posso ajudar você hoje?",
  system_prompt:
    "Você é um assistente virtual cordial, profissional e objetivo. Use somente informações confirmadas no contexto. Nunca invente valores, prazos, disponibilidade ou políticas. Quando faltar informação, faça uma pergunta curta e objetiva.",
  tone: "acolhedor, profissional e objetivo",
  handoff_enabled: true,
  handoff_keywords: [
    "humano",
    "atendente",
    "pagamento",
    "contrato",
    "cancelamento",
    "reclamação",
  ],
  settings: {},
};

function errorMessage(error) {
  return error?.message || "Não foi possível concluir a operação.";
}

function normalizeKeywords(value) {
  return String(value || "")
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 50);
}

function toForm(agent) {
  if (!agent) {
    return {
      ...EMPTY_AGENT,
      handoff_keywords: [...EMPTY_AGENT.handoff_keywords],
    };
  }

  return {
    name: agent.name || "",
    description: agent.description || "",
    is_active: agent.is_active ?? true,
    model: agent.model || "gpt-4.1-mini",
    greeting_message: agent.greeting_message || "",
    system_prompt: agent.system_prompt || "",
    tone: agent.tone || "",
    handoff_enabled: agent.handoff_enabled ?? true,
    handoff_keywords: Array.isArray(agent.handoff_keywords)
      ? agent.handoff_keywords
      : [],
    settings: agent.settings || {},
  };
}

function AgentStatus({ active }) {
  return (
    <span className={`badge ${active ? "badge-green" : "badge-amber"}`}>
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

function AgentModal({ agent, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(agent));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      description: form.description.trim() || null,
      greeting_message: form.greeting_message.trim() || null,
      tone: form.tone.trim() || null,
      handoff_keywords: normalizeKeywords(form.handoff_keywords.join(", ")),
    };

    try {
      const response = agent
        ? await api.updateAgent(agent.id, payload)
        : await api.createAgent(payload);

      onSaved(response.data);
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="m-bg" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} style={{ maxWidth: 900 }}>
        <div className="m-head">
          <div>
            <div className="m-title">{agent ? "Editar agente de IA" : "Novo agente de IA"}</div>
            <div className="m-sub">
              Configure a personalidade, regras e transferência para atendimento humano.
            </div>
          </div>

          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="m-body">
          {error && <div className="l-err">{error}</div>}

          <div className="fg">
            <div className="fsect">Identificação</div>

            <label className="fld c2">
              <span>Nome do agente *</span>
              <input
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
                placeholder="Ex.: Assistente Comercial"
                required
              />
            </label>

            <label className="fld">
              <span>Modelo *</span>
              <input
                value={form.model}
                onChange={(event) => setField("model", event.target.value)}
                placeholder="gpt-4.1-mini"
                required
              />
            </label>

            <label className="fld c3">
              <span>Descrição interna</span>
              <input
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                placeholder="Ex.: Agente principal para atendimento comercial."
              />
            </label>

            <div className="fsect">Comportamento</div>

            <label className="fld">
              <span>Tom de voz</span>
              <input
                value={form.tone}
                onChange={(event) => setField("tone", event.target.value)}
                placeholder="Ex.: acolhedor, profissional e objetivo"
              />
            </label>

            <label className="fld c2">
              <span>Mensagem de saudação</span>
              <input
                value={form.greeting_message}
                onChange={(event) => setField("greeting_message", event.target.value)}
                placeholder="Olá! Como posso ajudar você hoje?"
              />
            </label>

            <label className="fld c3">
              <span>Prompt principal *</span>
              <textarea
                value={form.system_prompt}
                onChange={(event) => setField("system_prompt", event.target.value)}
                placeholder="Defina como o agente deve atender os clientes..."
                required
                style={{ minHeight: 190 }}
              />
            </label>

            <div className="fsect">Transferência humana</div>

            <label className="fld c3">
              <span>Palavras-chave para encaminhar ao humano</span>
              <textarea
                value={form.handoff_keywords.join(", ")}
                onChange={(event) =>
                  setField("handoff_keywords", normalizeKeywords(event.target.value))
                }
                placeholder="humano, atendente, pagamento, contrato"
                style={{ minHeight: 84 }}
              />
            </label>

            <div className="c3" style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <label className="tg-wrap" onClick={() => setField("is_active", !form.is_active)}>
                <div className={`tg ${form.is_active ? "on" : ""}`} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--n700)" }}>
                  Agente ativo
                </span>
              </label>

              <label
                className="tg-wrap"
                onClick={() => setField("handoff_enabled", !form.handoff_enabled)}
              >
                <div className={`tg ${form.handoff_enabled ? "on" : ""}`} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--n700)" }}>
                  Transferência para humano
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="m-foot">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-gold" disabled={saving}>
            {saving ? "Salvando..." : "Salvar agente"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AgentTester({ agent, onClose }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendTest(event) {
    event.preventDefault();

    const text = message.trim();

    if (!text || sending) return;

    setSending(true);
    setError("");

    const nextHistory = [
      ...history,
      {
        role: "user",
        content: text,
      },
    ];

    try {
      const response = await api.testAgent({
        agent_id: agent.id,
        message: text,
        history,
      });

      const reply = response?.data?.reply || "A IA não retornou uma resposta.";

      setHistory([
        ...nextHistory,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      setMessage("");
    } catch (sendError) {
      setError(errorMessage(sendError));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="m-bg" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" style={{ maxWidth: 760 }}>
        <div className="m-head">
          <div>
            <div className="m-title">Testar {agent.name}</div>
            <div className="m-sub">
              A resposta será processada pela OpenAI e registrada em agent_test_logs.
            </div>
          </div>

          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="m-body">
          <div
            style={{
              minHeight: 280,
              maxHeight: "48vh",
              overflowY: "auto",
              padding: 14,
              borderRadius: 14,
              background: "var(--n50)",
              border: "1px solid var(--n100)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {history.length === 0 && (
              <div className="empty" style={{ padding: 32 }}>
                <div className="empty-ico">🤖</div>
                <div className="empty-txt">Envie uma mensagem para iniciar o teste.</div>
              </div>
            )}

            {history.map((item, index) => {
              const bot = item.role === "assistant";

              return (
                <div
                  key={`${item.role}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: bot ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    className={
                      bot
                        ? "client-chat-message client-chat-message-bot"
                        : "client-chat-message client-chat-message-user"
                    }
                    style={{
                      marginBottom: 0,
                      maxWidth: "82%",
                    }}
                  >
                    {item.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div className="client-chat-message client-chat-message-bot client-chat-loading">
                A IA está respondendo...
              </div>
            )}
          </div>

          {error && <div className="l-err" style={{ marginTop: 14 }}>{error}</div>}

          <form onSubmit={sendTest} style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Digite a mensagem de teste..."
              disabled={sending}
              style={{
                flex: 1,
                minWidth: 0,
                border: "1.5px solid var(--border)",
                borderRadius: "var(--r8)",
                padding: "11px 12px",
                outline: "none",
              }}
            />

            <button className="btn btn-gold" disabled={sending || !message.trim()}>
              {sending ? "Enviando..." : "Testar"}
            </button>
          </form>
        </div>

        <div className="m-foot">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Fechar
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AgentsPage({ company }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalAgent, setModalAgent] = useState(undefined);
  const [testAgent, setTestAgent] = useState(null);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await api.getAgents();
      setAgents(response?.data || []);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const activeCount = useMemo(
    () => agents.filter((agent) => agent.is_active).length,
    [agents]
  );

  function saved(agent) {
    setAgents((current) => {
      const exists = current.some((item) => item.id === agent.id);

      if (!exists) {
        return [agent, ...current];
      }

      return current.map((item) => (item.id === agent.id ? agent : item));
    });

    setModalAgent(undefined);
  }

  async function remove(agent) {
    const confirmed = window.confirm(
      `Deseja excluir o agente "${agent.name}"? Essa ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    try {
      await api.deleteAgent(agent.id);
      setAgents((current) => current.filter((item) => item.id !== agent.id));
    } catch (removeError) {
      setError(errorMessage(removeError));
    }
  }

  async function toggleActive(agent) {
    try {
      const response = await api.updateAgent(agent.id, {
        is_active: !agent.is_active,
      });

      const updated = response.data;

      setAgents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (toggleError) {
      setError(errorMessage(toggleError));
    }
  }

  return (
    <div className="page">
      {modalAgent !== undefined && (
        <AgentModal
          agent={modalAgent}
          onClose={() => setModalAgent(undefined)}
          onSaved={saved}
        />
      )}

      {testAgent && (
        <AgentTester
          agent={testAgent}
          onClose={() => setTestAgent(null)}
        />
      )}

      <div className="sec-h" style={{ marginBottom: 20 }}>
        <div>
          <div className="tx-title">Agentes de IA</div>
          <div className="tx-meta" style={{ marginTop: 3 }}>
            Configure os assistentes da {company?.name || "empresa"} e teste as respostas antes de conectar aos canais.
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-outline" onClick={load} disabled={loading}>
            Atualizar
          </button>
          <button className="btn btn-gold" onClick={() => setModalAgent(null)}>
            + Novo agente
          </button>
        </div>
      </div>

      <div className="metric-grid" style={{ marginBottom: 20 }}>
        <div className="metric-card">
          <div className="tx-label" style={{ marginBottom: 8 }}>Agentes cadastrados</div>
          <div className="tx-num">{agents.length}</div>
          <div className="tx-meta" style={{ marginTop: 5 }}>Disponíveis para configuração</div>
        </div>

        <div className="metric-card">
          <div className="tx-label" style={{ marginBottom: 8 }}>Agentes ativos</div>
          <div className="tx-num">{activeCount}</div>
          <div className="tx-meta" style={{ marginTop: 5 }}>Liberados para responder testes</div>
        </div>

        <div className="metric-card">
          <div className="tx-label" style={{ marginBottom: 8 }}>Handoff humano</div>
          <div className="tx-num">
            {agents.filter((agent) => agent.handoff_enabled).length}
          </div>
          <div className="tx-meta" style={{ marginTop: 5 }}>Com transferência habilitada</div>
        </div>

        <div className="metric-card">
          <div className="tx-label" style={{ marginBottom: 8 }}>Modelo padrão</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "var(--n800)", marginTop: 8 }}>
            {agents[0]?.model || "—"}
          </div>
          <div className="tx-meta" style={{ marginTop: 8 }}>Modelo do primeiro agente listado</div>
        </div>
      </div>

      {error && <div className="l-err">{error}</div>}

      {loading ? (
        <div className="card p24" style={{ textAlign: "center" }}>
          <div className="tx-meta">Carregando agentes...</div>
        </div>
      ) : agents.length === 0 ? (
        <div className="card empty">
          <div className="empty-ico">🤖</div>
          <div className="empty-txt">Nenhum agente cadastrado para esta empresa.</div>
          <button
            className="btn btn-gold"
            style={{ marginTop: 14 }}
            onClick={() => setModalAgent(null)}
          >
            Criar primeiro agente
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="t-wrap">
            <table>
              <thead>
                <tr>
                  <th>Agente</th>
                  <th>Modelo</th>
                  <th>Tom</th>
                  <th>Handoff</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--n800)" }}>{agent.name}</div>
                      <div className="tx-meta" style={{ maxWidth: 320 }}>
                        {agent.description || "Sem descrição interna."}
                      </div>
                    </td>

                    <td>
                      <span className="p-key">{agent.model}</span>
                    </td>

                    <td>{agent.tone || "—"}</td>

                    <td>
                      <span className={`badge ${agent.handoff_enabled ? "badge-blue" : "badge-amber"}`}>
                        {agent.handoff_enabled ? "Habilitado" : "Desabilitado"}
                      </span>
                    </td>

                    <td>
                      <AgentStatus active={agent.is_active} />
                    </td>

                    <td>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 7, flexWrap: "wrap" }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setTestAgent(agent)}
                          disabled={!agent.is_active}
                        >
                          Testar
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => toggleActive(agent)}
                        >
                          {agent.is_active ? "Desativar" : "Ativar"}
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => setModalAgent(agent)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-del btn-sm"
                          onClick={() => remove(agent)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
