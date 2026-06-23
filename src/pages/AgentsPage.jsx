import { useEffect, useState } from "react";

import { api } from "../services/api";
import Badge from "../components/ui/Badge";
import { Icons } from "../components/ui/Icons";
import { getErrorMessage } from "../shared/appUtils";

const EMPTY_AGENT = {
  name: "",
  description: "",
  is_active: true,
  model: "gpt-4.1-mini",
  greeting_message: "Olá! Como posso ajudar você hoje?",
  system_prompt:
    "Você é um assistente virtual cordial, profissional e objetivo. Use somente informações confirmadas no contexto fornecido. Nunca invente valores, prazos, disponibilidade ou políticas. Quando faltar informação, faça uma pergunta curta e objetiva.",
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

function AgentEditorModal({ agent, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(agent));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
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
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="m-bg"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        className="modal"
        style={{ maxWidth: 900 }}
        onSubmit={handleSubmit}
      >
        <div className="m-head">
          <div>
            <div className="m-title">
              {agent ? "Editar agente de IA" : "Novo agente de IA"}
            </div>

            <div className="m-sub">
              Configure a personalidade, regras e transferência para humano.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
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
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                placeholder="Ex.: Agente principal para atendimento comercial."
              />
            </label>

            <div className="fsect">Comportamento</div>

            <label className="fld">
              <span>Tom de voz</span>

              <input
                value={form.tone}
                onChange={(event) => setField("tone", event.target.value)}
                placeholder="acolhedor, profissional e objetivo"
              />
            </label>

            <label className="fld c2">
              <span>Mensagem de saudação</span>

              <input
                value={form.greeting_message}
                onChange={(event) =>
                  setField("greeting_message", event.target.value)
                }
                placeholder="Olá! Como posso ajudar você hoje?"
              />
            </label>

            <label className="fld c3">
              <span>Prompt principal *</span>

              <textarea
                value={form.system_prompt}
                onChange={(event) =>
                  setField("system_prompt", event.target.value)
                }
                placeholder="Defina como o agente deve atender clientes..."
                required
                style={{ minHeight: 190 }}
              />
            </label>

            <div className="fsect">Transferência para humano</div>

            <label className="fld c3">
              <span>Palavras-chave</span>

              <textarea
                value={form.handoff_keywords.join(", ")}
                onChange={(event) =>
                  setField(
                    "handoff_keywords",
                    normalizeKeywords(event.target.value)
                  )
                }
                placeholder="humano, atendente, pagamento, contrato"
              />
            </label>

            <div
              className="c3"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              <label
                className="tg-wrap"
                onClick={() =>
                  setField("is_active", !form.is_active)
                }
              >
                <div className={`tg ${form.is_active ? "on" : ""}`} />

                <span
                  style={{
                    color: "var(--n700)",
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  Agente ativo
                </span>
              </label>

              <label
                className="tg-wrap"
                onClick={() =>
                  setField("handoff_enabled", !form.handoff_enabled)
                }
              >
                <div
                  className={`tg ${form.handoff_enabled ? "on" : ""}`}
                />

                <span
                  style={{
                    color: "var(--n700)",
                    fontSize: 13.5,
                    fontWeight: 600,
                  }}
                >
                  Transferência para humano
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="m-foot">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-gold"
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar agente"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AgentTesterModal({ agent, onClose }) {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(event) {
    event.preventDefault();

    const text = message.trim();

    if (!text || sending) {
      return;
    }

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

      const reply =
        response?.data?.reply ||
        "A IA não retornou uma resposta de texto.";

      setHistory([
        ...nextHistory,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      setMessage("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="m-bg"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="modal" style={{ maxWidth: 760 }}>
        <div className="m-head">
          <div>
            <div className="m-title">Testar {agent.name}</div>

            <div className="m-sub">
              A resposta será processada pela IA e gravada no histórico de
              testes.
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <div className="m-body">
          <div
            style={{
              display: "flex",
              minHeight: 280,
              maxHeight: "48vh",
              flexDirection: "column",
              gap: 10,
              overflowY: "auto",
              padding: 14,
              border: "1px solid var(--n100)",
              borderRadius: 14,
              background: "var(--n50)",
            }}
          >
            {history.length === 0 && (
              <div
                style={{
                  padding: 34,
                  color: "var(--n400)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32 }}>🤖</div>

                <div style={{ marginTop: 8, fontSize: 13 }}>
                  Envie uma mensagem para iniciar o teste.
                </div>
              </div>
            )}

            {history.map((item, index) => {
              const isAssistant = item.role === "assistant";

              return (
                <div
                  key={`${item.role}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: isAssistant ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "11px 13px",
                      border: isAssistant
                        ? "1px solid var(--n100)"
                        : "none",
                      borderRadius: 16,
                      borderBottomLeftRadius: isAssistant ? 5 : 16,
                      borderBottomRightRadius: isAssistant ? 16 : 5,
                      background: isAssistant ? "#fff" : "var(--n800)",
                      color: isAssistant ? "var(--n800)" : "#fff",
                      fontSize: 13.5,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.content}
                  </div>
                </div>
              );
            })}

            {sending && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#fff",
                  color: "var(--n400)",
                  fontSize: 13,
                  fontStyle: "italic",
                }}
              >
                A IA está respondendo...
              </div>
            )}
          </div>

          {error && (
            <div className="l-err" style={{ marginTop: 14 }}>
              {error}
            </div>
          )}

          <form
            style={{
              display: "flex",
              gap: 8,
              marginTop: 14,
            }}
            onSubmit={handleSend}
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Digite a mensagem de teste..."
              disabled={sending}
              style={{
                minWidth: 0,
                flex: 1,
                padding: "11px 12px",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--r8)",
                outline: "none",
              }}
            />

            <button
              type="submit"
              className="btn btn-gold"
              disabled={sending || !message.trim()}
            >
              {sending ? "Enviando..." : "Testar"}
            </button>
          </form>
        </div>

        <div className="m-foot">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
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
  const [editorAgent, setEditorAgent] = useState(undefined);
  const [testAgent, setTestAgent] = useState(null);

  async function loadAgents() {
    setLoading(true);
    setError("");

    try {
      const response = await api.getAgents();
      setAgents(response?.data || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAgents();
  }, []);

  function handleSaved(savedAgent) {
    setAgents((current) => {
      const alreadyExists = current.some(
        (agent) => agent.id === savedAgent.id
      );

      if (!alreadyExists) {
        return [savedAgent, ...current];
      }

      return current.map((agent) =>
        agent.id === savedAgent.id ? savedAgent : agent
      );
    });

    setEditorAgent(undefined);
  }

  async function handleToggle(agent) {
    try {
      const response = await api.updateAgent(agent.id, {
        is_active: !agent.is_active,
      });

      setAgents((current) =>
        current.map((item) =>
          item.id === agent.id ? response.data : item
        )
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleDelete(agent) {
    const confirmed = window.confirm(
      `Deseja realmente excluir o agente "${agent.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteAgent(agent.id);

      setAgents((current) =>
        current.filter((item) => item.id !== agent.id)
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <div className="page">
      {editorAgent !== undefined && (
        <AgentEditorModal
          agent={editorAgent}
          onClose={() => setEditorAgent(undefined)}
          onSaved={handleSaved}
        />
      )}

      {testAgent && (
        <AgentTesterModal
          agent={testAgent}
          onClose={() => setTestAgent(null)}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <div className="tx-title">Agentes de IA</div>

          <div className="tx-meta" style={{ marginTop: 3 }}>
            Configure os agentes responsáveis pelo atendimento de{" "}
            {company?.name || "sua empresa"}.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-gold"
          onClick={() => setEditorAgent(null)}
        >
          {Icons.plus}
          Novo agente
        </button>
      </div>

      <div
        className="card p20"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 13,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 24 }}>🤖</div>

        <div>
          <div className="tx-section">Como funciona</div>

          <div className="tx-body" style={{ marginTop: 4 }}>
            Cada agente possui instruções próprias, tom de voz, modelo,
            palavras de transferência humana e histórico de testes.
          </div>
        </div>
      </div>

      {error && <div className="l-err">{error}</div>}

      {loading ? (
        <div className="card p24" style={{ textAlign: "center" }}>
          <span className="spinner" />
          <div className="tx-meta" style={{ marginTop: 10 }}>
            Carregando agentes...
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className="card p24" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 38 }}>🤖</div>

          <div className="tx-section" style={{ marginTop: 10 }}>
            Nenhum agente cadastrado
          </div>

          <div className="tx-meta" style={{ marginTop: 5 }}>
            Crie o primeiro agente para começar os testes de atendimento.
          </div>

          <button
            type="button"
            className="btn btn-gold"
            style={{ marginTop: 16 }}
            onClick={() => setEditorAgent(null)}
          >
            {Icons.plus}
            Criar agente
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 14,
          }}
        >
          {agents.map((agent) => (
            <article
              key={agent.id}
              className="card p20"
              style={{
                display: "flex",
                minHeight: 260,
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "var(--n800)",
                      fontSize: 16,
                      fontWeight: 800,
                    }}
                  >
                    {agent.name}
                  </div>

                  <div className="tx-meta" style={{ marginTop: 3 }}>
                    {agent.model}
                  </div>
                </div>

                <Badge status={agent.is_active ? "active" : "inactive"} />
              </div>

              <p
                className="tx-body"
                style={{
                  marginTop: 14,
                  minHeight: 42,
                }}
              >
                {agent.description || "Sem descrição interna cadastrada."}
              </p>

              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--n50)",
                }}
              >
                <div className="tx-label">Tom de voz</div>

                <div
                  style={{
                    marginTop: 4,
                    color: "var(--n700)",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {agent.tone || "Não definido"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                  marginTop: 12,
                }}
              >
                {(agent.handoff_keywords || []).slice(0, 5).map((keyword) => (
                  <span
                    key={keyword}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: "var(--a50)",
                      color: "#92400e",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: "auto",
                  paddingTop: 16,
                }}
              >
                <button
                  type="button"
                  className="btn btn-gold btn-sm"
                  onClick={() => setTestAgent(agent)}
                >
                  Testar
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditorAgent(agent)}
                >
                  {Icons.edit}
                  Editar
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => handleToggle(agent)}
                >
                  {agent.is_active ? "Desativar" : "Ativar"}
                </button>

                <button
                  type="button"
                  className="btn btn-del btn-sm"
                  onClick={() => handleDelete(agent)}
                  title="Excluir agente"
                >
                  {Icons.trash}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}