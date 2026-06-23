import { useEffect, useState } from "react";

import { api } from "../services/api";
import Badge from "../components/ui/Badge";
import { Icons } from "../components/ui/Icons";
import {
  getErrorMessage,
  initials,
  TODAY,
  WEEK_PT,
} from "../shared/appUtils";

function getMessageText(message) {
  return (
    message?.message ||
    message?.text ||
    message?.content ||
    message?.body ||
    message?.mensagem ||
    message?.response ||
    message?.reply ||
    ""
  );
}

function getMessageRole(message) {
  const rawRole = String(
    message?.role ||
      message?.sender_type ||
      message?.senderType ||
      message?.direction ||
      message?.type ||
      ""
  ).toLowerCase();

  const fromMe =
    message?.from_me === true ||
    message?.fromMe === true ||
    message?.is_from_me === true ||
    message?.isFromMe === true;

  if (
    fromMe ||
    rawRole.includes("assistant") ||
    rawRole.includes("bot") ||
    rawRole.includes("ai") ||
    rawRole.includes("out") ||
    rawRole.includes("sent")
  ) {
    return "assistant";
  }

  return "customer";
}

function getMessageDate(message) {
  return (
    message?.created_at ||
    message?.createdAt ||
    message?.message_timestamp ||
    message?.messageTimestamp ||
    message?.timestamp ||
    ""
  );
}

function normalizeMessages(conversation, messagesFromApi = []) {
  const source =
    Array.isArray(messagesFromApi) && messagesFromApi.length > 0
      ? messagesFromApi
      : Array.isArray(conversation?.messages)
        ? conversation.messages
        : Array.isArray(conversation?.dialogue)
          ? conversation.dialogue
          : [];

  const normalized = source
    .map((message, index) => ({
      id:
        message?.id ||
        message?.message_id ||
        `${conversation?.id || "conversation"}-${index}`,
      role: getMessageRole(message),
      text: String(getMessageText(message) || "").trim(),
      createdAt: getMessageDate(message),
    }))
    .filter((message) => message.text);

  if (normalized.length > 0) {
    return normalized;
  }

  const lastMessage = String(conversation?.last_message || "").trim();
  const aiSummary = String(conversation?.ai_summary || "").trim();

  return [
    lastMessage
      ? {
          id: `${conversation?.id || "conversation"}-last`,
          role: "customer",
          text: lastMessage,
          createdAt:
            conversation?.last_message_at || conversation?.created_at || "",
        }
      : null,
    aiSummary
      ? {
          id: `${conversation?.id || "conversation"}-summary`,
          role: "assistant",
          text: aiSummary,
          createdAt:
            conversation?.updated_at ||
            conversation?.last_message_at ||
            "",
        }
      : null,
  ].filter(Boolean);
}

function ConversationModal({
  conversation,
  messages,
  loading,
  error,
  onClose,
}) {
  if (!conversation) {
    return null;
  }

  const customerName =
    conversation.customer_name ||
    conversation.customerName ||
    conversation.name ||
    "Conversa";

  const customerPhone =
    conversation.customer_phone ||
    conversation.customerPhone ||
    conversation.customer_username ||
    conversation.phone ||
    "—";

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
            <div className="m-title">{customerName}</div>

            <div className="m-sub">
              📱 {customerPhone} · {messages.length} mensagem(ns)
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onClose}
          >
            {Icons.close}
          </button>
        </div>

        <div className="m-body">
          {conversation.human_review_required && (
            <div className="l-err">
              Esta conversa está marcada para revisão humana.
            </div>
          )}

          {conversation.ai_summary && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--a50)",
                color: "#92400e",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong>🤖 Resumo da IA:</strong> {conversation.ai_summary}
            </div>
          )}

          {error && <div className="l-err">{error}</div>}

          {loading ? (
            <div
              style={{
                padding: 42,
                color: "var(--n400)",
                textAlign: "center",
              }}
            >
              <span className="spinner" />

              <div style={{ marginTop: 10 }}>Carregando diálogo...</div>
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                padding: 42,
                color: "var(--n400)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 34 }}>💬</div>

              <div style={{ marginTop: 8 }}>
                Nenhuma mensagem encontrada para esta conversa.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((message) => {
                const isAssistant = message.role === "assistant";

                return (
                  <div
                    key={message.id}
                    style={{
                      display: "flex",
                      justifyContent: isAssistant
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "11px 13px",
                        border: isAssistant
                          ? "none"
                          : "1px solid var(--n100)",
                        borderRadius: 16,
                        borderBottomLeftRadius: isAssistant ? 16 : 5,
                        borderBottomRightRadius: isAssistant ? 5 : 16,
                        background: isAssistant ? "var(--n800)" : "#fff",
                        color: isAssistant ? "#fff" : "var(--n800)",
                        boxShadow: "var(--sh0)",
                        fontSize: 13.5,
                        lineHeight: 1.5,
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 4,
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: ".06em",
                          opacity: 0.68,
                          textTransform: "uppercase",
                        }}
                      >
                        {isAssistant ? "IA / Atendente" : customerName}
                      </div>

                      <div>{message.text}</div>

                      {message.createdAt && (
                        <div
                          style={{
                            marginTop: 7,
                            fontSize: 10,
                            opacity: 0.62,
                            textAlign: "right",
                          }}
                        >
                          {String(message.createdAt)
                            .slice(0, 16)
                            .replace("T", " ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

function ConversationItem({ conversation, index, onOpen }) {
  const customerName =
    conversation.customer_name ||
    conversation.customerName ||
    "Cliente sem nome";

  const customerPhone =
    conversation.customer_phone ||
    conversation.customer_username ||
    conversation.phone ||
    "—";

  return (
    <button
      type="button"
      onClick={() => onOpen(conversation)}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "flex-start",
        gap: 11,
        padding: "13px 0",
        border: 0,
        borderBottom: "1px solid var(--n100)",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        animation: `fadeUp .32s ease ${index * 0.04}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 38,
          height: 38,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "var(--a100)",
          color: "var(--a700)",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {initials(customerName)}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            flexWrap: "wrap",
          }}
        >
          <strong style={{ color: "var(--n800)", fontSize: 13.5 }}>
            {customerName}
          </strong>

          <Badge status={conversation.status} />

          {conversation.human_review_required && (
            <span
              title="Revisão humana necessária"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--r500)",
                animation: "pulse 1.4s ease infinite",
              }}
            />
          )}
        </div>

        <div
          style={{
            marginTop: 3,
            overflow: "hidden",
            color: "var(--n600)",
            fontSize: 13,
            lineHeight: 1.45,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {conversation.last_message || "Sem mensagem registrada."}
        </div>

        <div className="tx-meta" style={{ marginTop: 4 }}>
          📱 {customerPhone}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 5,
        }}
      >
        <div className="tx-meta">
          {String(
            conversation.last_message_at || conversation.created_at || ""
          )
            .slice(11, 16)
            .replace("T", " ")}
        </div>

        <span
          style={{
            color: "var(--n400)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          Ver diálogo
        </span>
      </div>
    </button>
  );
}

export default function WhatsAppPage({ dashboard }) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [dialogueLoading, setDialogueLoading] = useState(false);
  const [dialogueError, setDialogueError] = useState("");

  const stats = dashboard?.stats || {
    total_chats: 0,
    new_leads: 0,
    contracts_requested: 0,
    pending_human_review: 0,
    conversion_rate: 0,
    avg_response_time_seconds: 0,
    weekly: [0, 0, 0, 0, 0, 0, 0],
  };

  const maxWeeklyValue = Math.max(1, ...(stats.weekly || [0]));

  async function loadConversations() {
    setLoading(true);
    setError("");

    try {
      const response = await api.getConversations({
        q: search,
      });

      setConversations(response.conversations || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  async function openConversation(conversation) {
    setSelectedConversation(conversation);
    setSelectedMessages(normalizeMessages(conversation));
    setDialogueError("");

    if (!conversation?.id) {
      return;
    }

    setDialogueLoading(true);

    try {
      const response = await api.getConversationMessages(conversation.id);

      const messages =
        response?.messages ||
        response?.dialogue ||
        response?.dialog ||
        response?.conversation?.messages ||
        [];

      setSelectedMessages(normalizeMessages(conversation, messages));
    } catch (requestError) {
      setDialogueError(getErrorMessage(requestError));
      setSelectedMessages(normalizeMessages(conversation));
    } finally {
      setDialogueLoading(false);
    }
  }

  function closeConversation() {
    setSelectedConversation(null);
    setSelectedMessages([]);
    setDialogueError("");
    setDialogueLoading(false);
  }

  return (
    <div className="page">
      {selectedConversation && (
        <ConversationModal
          conversation={selectedConversation}
          messages={selectedMessages}
          loading={dialogueLoading}
          error={dialogueError}
          onClose={closeConversation}
        />
      )}

      <div style={{ marginBottom: 22 }}>
        <div className="tx-title">Atendimentos WhatsApp</div>

        <div className="tx-meta" style={{ marginTop: 3 }}>
          Hoje, {TODAY.split("-").reverse().join("/")}
        </div>
      </div>

      <div
        className="whatsapp-metrics"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Conversas",
            value: stats.total_chats || 0,
            icon: "💬",
          },
          {
            label: "Novos leads",
            value: stats.new_leads || 0,
            icon: "🎯",
          },
          {
            label: "Contratos",
            value: stats.contracts_requested || 0,
            icon: "📋",
          },
          {
            label: "Revisão humana",
            value: stats.pending_human_review || 0,
            icon: "⚠️",
          },
        ].map((metric, index) => (
          <section
            key={metric.label}
            className="card p20"
            style={{
              animation: `fadeUp .4s ease ${index * 0.06}s both`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div className="tx-label">{metric.label}</div>

                <div
                  style={{
                    marginTop: 8,
                    color: "var(--n800)",
                    fontSize: 33,
                    fontWeight: 800,
                    letterSpacing: "-.045em",
                  }}
                >
                  {metric.value}
                </div>
              </div>

              <span style={{ fontSize: 23 }}>{metric.icon}</span>
            </div>
          </section>
        ))}
      </div>

      <div
        className="whatsapp-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr)",
          gap: 16,
        }}
      >
        <section className="card p20">
          <div className="tx-section">Volume semanal</div>

          <div className="tx-meta" style={{ marginTop: 2 }}>
            WhatsApp · 7 dias
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 5,
              height: 105,
              marginTop: 16,
            }}
          >
            {(stats.weekly || []).map((value, index) => (
              <div
                key={`${WEEK_PT[index]}-${index}`}
                style={{
                  display: "flex",
                  height: "100%",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: 5,
                }}
              >
                <span
                  style={{
                    color: "var(--n400)",
                    fontSize: 9,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {value}
                </span>

                <div
                  title={`${WEEK_PT[index]}: ${value}`}
                  style={{
                    minHeight: 5,
                    height: `${(Number(value) / maxWeeklyValue) * 68}px`,
                    borderRadius: "4px 4px 0 0",
                    background: "var(--a500)",
                    opacity: index === 6 ? 1 : 0.45,
                  }}
                />

                <span
                  style={{
                    color: "var(--n400)",
                    fontSize: 9,
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {WEEK_PT[index]}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              height: 1,
              margin: "18px 0",
              background: "var(--n100)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
            }}
          >
            <div
              style={{
                padding: 11,
                borderRadius: 8,
                background: "var(--g50)",
              }}
            >
              <div
                style={{
                  color: "#065f46",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                Conversão
              </div>

              <div
                style={{
                  marginTop: 3,
                  color: "#065f46",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                {stats.conversion_rate || 0}%
              </div>
            </div>

            <div
              style={{
                padding: 11,
                borderRadius: 8,
                background: "var(--b50)",
              }}
            >
              <div
                style={{
                  color: "#1e40af",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}
              >
                Resp. média
              </div>

              <div
                style={{
                  marginTop: 3,
                  color: "#1e40af",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                {stats.avg_response_time_seconds || 0}s
              </div>
            </div>
          </div>
        </section>

        <section className="card p20">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            <div>
              <div className="tx-section">Conversas recentes</div>

              <div className="tx-meta" style={{ marginTop: 2 }}>
                Clique em uma conversa para visualizar o diálogo.
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  minWidth: 220,
                  padding: "8px 12px",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--r8)",
                  background: "#fff",
                }}
              >
                {Icons.search}

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      loadConversations();
                    }
                  }}
                  placeholder="Buscar conversa..."
                  style={{
                    width: "100%",
                    border: 0,
                    outline: 0,
                    background: "transparent",
                  }}
                />
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={loadConversations}
              >
                Buscar
              </button>
            </div>
          </div>

          {error && <div className="l-err">{error}</div>}

          {loading ? (
            <div
              style={{
                padding: 38,
                color: "var(--n400)",
                textAlign: "center",
              }}
            >
              <span className="spinner" />

              <div style={{ marginTop: 10 }}>Carregando conversas...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div
              style={{
                padding: 42,
                color: "var(--n400)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 34 }}>💬</div>

              <div style={{ marginTop: 8 }}>
                Nenhuma conversa encontrada.
              </div>
            </div>
          ) : (
            conversations.map((conversation, index) => (
              <ConversationItem
                key={conversation.id || index}
                conversation={conversation}
                index={index}
                onOpen={openConversation}
              />
            ))
          )}
        </section>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .whatsapp-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 840px) {
          .whatsapp-layout {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .whatsapp-metrics {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}