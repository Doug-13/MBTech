import Badge from "../components/ui/Badge";

import {
  fmtDateFull,
  getWeekDays,
  initials,
  TODAY,
  WEEK_PT,
} from "../shared/appUtils";

function ConversationItem({ conversation, index }) {
  const customerName =
    conversation?.customer_name ||
    conversation?.customerName ||
    "Cliente sem nome";

  const customerPhone =
    conversation?.customer_phone ||
    conversation?.customer_username ||
    conversation?.phone ||
    "—";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 11,
        padding: "13px 0",
        borderBottom: "1px solid var(--n100)",
        animation: `fadeUp .32s ease ${index * 0.05}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 36,
          height: 36,
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

          <Badge status={conversation?.status} />
        </div>

        <div
          style={{
            marginTop: 3,
            color: "var(--n600)",
            fontSize: 13,
            lineHeight: 1.45,
          }}
        >
          {conversation?.last_message || "Sem mensagem registrada."}
        </div>

        <div className="tx-meta" style={{ marginTop: 4 }}>
          📱 {customerPhone}
        </div>
      </div>

      <div className="tx-meta">
        {String(
          conversation?.last_message_at ||
            conversation?.created_at ||
            ""
        )
          .slice(11, 16)
          .replace("T", " ")}
      </div>
    </div>
  );
}

export default function DashboardPage({ company, dashboard, loading }) {
  if (loading) {
    return (
      <div className="page">
        <div className="card p24" style={{ textAlign: "center" }}>
          <span className="spinner" />
          <div className="tx-meta" style={{ marginTop: 10 }}>
            Carregando dashboard...
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    total_chats: 0,
    new_leads: 0,
    contracts_requested: 0,
    events_created: 0,
    pending_human_review: 0,
    conversion_rate: 0,
    avg_response_time_seconds: 0,
    weekly: [0, 0, 0, 0, 0, 0, 0],
    recent: [],
  };

  const events = dashboard?.events || [];
  const weekDays = getWeekDays(dashboard?.today || TODAY);
  const maxWeeklyValue = Math.max(1, ...(stats.weekly || [0]));

  const metrics = [
    {
      label: "Conversas hoje",
      value: stats.total_chats,
      description: `${stats.new_leads} novos leads`,
      icon: "💬",
    },
    {
      label: "Leads captados",
      value: stats.new_leads,
      description: "Contatos interessados",
      icon: "🎯",
    },
    {
      label: "Contratos pedidos",
      value: stats.contracts_requested,
      description: "Aguardando envio",
      icon: "📋",
    },
    {
      label: "Taxa de conversão",
      value: `${stats.conversion_rate || 0}%`,
      description: `Resposta média: ${
        stats.avg_response_time_seconds || 0
      }s`,
      icon: "📈",
    },
  ];

  return (
    <div className="page">
      <div style={{ marginBottom: 22 }}>
        <div className="tx-title">Visão geral</div>

        <div className="tx-meta" style={{ marginTop: 3 }}>
          Hoje, {fmtDateFull(dashboard?.today || TODAY)} ·{" "}
          {company?.name || "Empresa"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="card p20"
            style={{
              position: "relative",
              overflow: "hidden",
              animation: `fadeUp .4s ease ${index * 0.06}s both`,
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

                <div className="tx-meta" style={{ marginTop: 5 }}>
                  {metric.description}
                </div>
              </div>

              <span style={{ fontSize: 24 }}>{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 250px",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <section className="card p20">
          <div className="tx-section">Agenda da semana</div>

          <div className="tx-meta" style={{ marginTop: 2, marginBottom: 14 }}>
            Eventos programados
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
              gap: 9,
            }}
          >
            {weekDays.map((day, index) => {
              const dayEvents = events.filter(
                (event) => event.event_date === day
              );

              const isToday = day === (dashboard?.today || TODAY);

              return (
                <div
                  key={day}
                  style={{
                    minHeight: 112,
                    padding: "11px 9px",
                    border: `1px solid ${
                      isToday ? "var(--a200)" : "var(--n100)"
                    }`,
                    borderRadius: 12,
                    background: isToday ? "var(--a50)" : "var(--n50)",
                  }}
                >
                  <div className="tx-label">{WEEK_PT[index]}</div>

                  <div
                    style={{
                      marginTop: 2,
                      color: isToday ? "var(--a600)" : "var(--n800)",
                      fontSize: 20,
                      fontWeight: 800,
                    }}
                  >
                    {day.slice(8)}
                  </div>

                  {dayEvents.length === 0 && (
                    <div className="tx-meta" style={{ marginTop: 8 }}>
                      Livre
                    </div>
                  )}

                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      style={{
                        marginTop: 7,
                        padding: "5px 7px",
                        borderRadius: 6,
                        background:
                          event.status === "confirmado"
                            ? "var(--g100)"
                            : "var(--a100)",
                        color:
                          event.status === "confirmado"
                            ? "#065f46"
                            : "#92400e",
                        fontSize: 10.5,
                        fontWeight: 700,
                        lineHeight: 1.35,
                      }}
                    >
                      {event.event_time && `${event.event_time} · `}
                      {event.event_type}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>

        <section className="card p20">
          <div className="tx-section">Conversas</div>

          <div className="tx-meta" style={{ marginTop: 2 }}>
            Últimos 7 dias
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 4,
              height: 95,
              marginTop: 16,
            }}
          >
            {(stats.weekly || []).map((value, index) => (
              <div
                key={`${WEEK_PT[index]}-${index}`}
                style={{
                  display: "flex",
                  flex: 1,
                  height: "100%",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: 4,
                }}
              >
                <div
                  title={`${WEEK_PT[index]}: ${value}`}
                  style={{
                    height: `${Math.max(
                      5,
                      (Number(value) / maxWeeklyValue) * 72
                    )}px`,
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span className="tx-body" style={{ fontSize: 12.5 }}>
              Revisão humana
            </span>

            <strong style={{ color: "var(--r600)" }}>
              {stats.pending_human_review || 0}
            </strong>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="tx-body" style={{ fontSize: 12.5 }}>
              Eventos criados
            </span>

            <strong style={{ color: "var(--g600)" }}>
              {stats.events_created || 0}
            </strong>
          </div>
        </section>
      </div>

      <section className="card p20">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div className="tx-section">Atendimentos recentes</div>

            <div className="tx-meta" style={{ marginTop: 2 }}>
              Conversas registradas hoje
            </div>
          </div>

          <Badge status="open">
            {stats.total_chats || 0} conversas
          </Badge>
        </div>

        {(stats.recent || []).length === 0 ? (
          <div
            style={{
              padding: 38,
              color: "var(--n400)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, opacity: 0.45 }}>💬</div>
            <div style={{ marginTop: 8, fontSize: 13 }}>
              Nenhum atendimento registrado ainda.
            </div>
          </div>
        ) : (
          stats.recent.map((conversation, index) => (
            <ConversationItem
              key={conversation.id || index}
              conversation={conversation}
              index={index}
            />
          ))
        )}
      </section>

      <style>{`
        @media (max-width: 1100px) {
          .page > div[style*="repeat(4"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 840px) {
          .page > div[style*="minmax(0, 1fr) 250px"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 560px) {
          .page > div[style*="repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}