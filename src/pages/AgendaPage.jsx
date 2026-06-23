import { useEffect, useMemo, useState } from "react";

import { api } from "../services/api";
import Badge from "../components/ui/Badge";
import { Icons } from "../components/ui/Icons";
import {
  fmtDateFull,
  getErrorMessage,
  getWeekDays,
  initials,
  TODAY,
  WEEK_PT,
} from "../shared/appUtils";

const EMPTY_EVENT = {
  customer_name: "",
  customer_phone: "",
  document: "",
  street: "",
  number: "",
  district: "",
  city: "",
  zip_code: "",
  room_name: "",
  room_address: "",
  ceremonial_contact: "",
  event_date: "",
  event_time: "",
  event_type: "",
  guests: "",
  notes: "",
  status: "pendente",
};

function EventModal({ event, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_EVENT,
    ...(event || {}),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        guests: Number(form.guests || 0),
      };

      const response = event?.id
        ? await api.updateAppointment(event.id, payload)
        : await api.createAppointment(payload);

      onSaved(response.event);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="m-bg"
      onClick={(clickEvent) => {
        if (clickEvent.target === clickEvent.currentTarget) {
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
              {event ? "Editar evento" : "Novo evento"}
            </div>

            <div className="m-sub">
              Informações do cliente, local e detalhes do evento.
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
            <div className="fsect">Cliente</div>

            <label className="fld c2">
              <span>Nome completo *</span>

              <input
                required
                value={form.customer_name}
                onChange={(eventInput) =>
                  setField("customer_name", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>CPF / CNPJ</span>

              <input
                value={form.document}
                onChange={(eventInput) =>
                  setField("document", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Telefone</span>

              <input
                value={form.customer_phone}
                onChange={(eventInput) =>
                  setField("customer_phone", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Rua</span>

              <input
                value={form.street}
                onChange={(eventInput) =>
                  setField("street", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Número</span>

              <input
                value={form.number}
                onChange={(eventInput) =>
                  setField("number", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Bairro</span>

              <input
                value={form.district}
                onChange={(eventInput) =>
                  setField("district", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Cidade</span>

              <input
                value={form.city}
                onChange={(eventInput) =>
                  setField("city", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>CEP</span>

              <input
                value={form.zip_code}
                onChange={(eventInput) =>
                  setField("zip_code", eventInput.target.value)
                }
              />
            </label>

            <div className="fsect">Evento</div>

            <label className="fld">
              <span>Tipo *</span>

              <select
                required
                value={form.event_type}
                onChange={(eventInput) =>
                  setField("event_type", eventInput.target.value)
                }
              >
                <option value="">Selecione...</option>
                <option value="Casamento">Casamento</option>
                <option value="15 anos">15 anos</option>
                <option value="Aniversário">Aniversário</option>
                <option value="Corporativo">Corporativo</option>
                <option value="Formatura">Formatura</option>
                <option value="Batizado">Batizado</option>
                <option value="Outro">Outro</option>
              </select>
            </label>

            <label className="fld">
              <span>Data *</span>

              <input
                required
                type="date"
                value={form.event_date}
                onChange={(eventInput) =>
                  setField("event_date", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Horário</span>

              <input
                type="time"
                value={form.event_time}
                onChange={(eventInput) =>
                  setField("event_time", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Convidados</span>

              <input
                min="0"
                type="number"
                value={form.guests}
                onChange={(eventInput) =>
                  setField("guests", eventInput.target.value)
                }
              />
            </label>

            <label className="fld c2">
              <span>Nome do salão</span>

              <input
                value={form.room_name}
                onChange={(eventInput) =>
                  setField("room_name", eventInput.target.value)
                }
              />
            </label>

            <label className="fld c3">
              <span>Endereço do evento</span>

              <input
                value={form.room_address}
                onChange={(eventInput) =>
                  setField("room_address", eventInput.target.value)
                }
              />
            </label>

            <label className="fld c2">
              <span>Contato da cerimonialista</span>

              <input
                value={form.ceremonial_contact}
                onChange={(eventInput) =>
                  setField("ceremonial_contact", eventInput.target.value)
                }
              />
            </label>

            <label className="fld">
              <span>Status</span>

              <select
                value={form.status}
                onChange={(eventInput) =>
                  setField("status", eventInput.target.value)
                }
              >
                <option value="pendente">Pendente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>

            <label className="fld c3">
              <span>Observações</span>

              <textarea
                value={form.notes}
                onChange={(eventInput) =>
                  setField("notes", eventInput.target.value)
                }
                placeholder="Cascata de chocolate, restrições alimentares, horário de montagem..."
              />
            </label>
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
            {saving ? "Salvando..." : "Salvar evento"}
          </button>
        </div>
      </form>
    </div>
  );
}

function EventsTable({ events, onEdit }) {
  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          minWidth: 920,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "var(--n50)" }}>
            {[
              "Cliente",
              "Tipo",
              "Data",
              "Salão / Cidade",
              "Convidados",
              "Status",
              "",
            ].map((label) => (
              <th
                key={label || "actions"}
                style={{
                  padding: "12px 15px",
                  borderBottom: "1px solid var(--n100)",
                  color: "var(--n400)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".07em",
                  textAlign: "left",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {events.length === 0 && (
            <tr>
              <td
                colSpan="7"
                style={{
                  padding: 42,
                  color: "var(--n400)",
                  textAlign: "center",
                }}
              >
                Nenhum evento encontrado.
              </td>
            </tr>
          )}

          {events.map((event) => (
            <tr key={event.id} style={{ borderBottom: "1px solid var(--n100)" }}>
              <td style={{ padding: "13px 15px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 32,
                      height: 32,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background: "var(--a100)",
                      color: "var(--a700)",
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {initials(event.customer_name)}
                  </div>

                  <div>
                    <div
                      style={{
                        color: "var(--n800)",
                        fontSize: 13.5,
                        fontWeight: 700,
                      }}
                    >
                      {event.customer_name}
                    </div>

                    <div className="tx-meta">
                      {event.document || event.customer_phone || "—"}
                    </div>
                  </div>
                </div>
              </td>

              <td style={{ padding: "13px 15px", fontWeight: 600 }}>
                {event.event_type || "—"}
              </td>

              <td style={{ padding: "13px 15px" }}>
                {fmtDateFull(event.event_date)}

                {event.event_time && (
                  <span className="tx-meta"> · {event.event_time}</span>
                )}
              </td>

              <td style={{ padding: "13px 15px" }}>
                <div style={{ color: "var(--n700)", fontWeight: 600 }}>
                  {event.room_name || "—"}
                </div>

                <div className="tx-meta">{event.city || "—"}</div>
              </td>

              <td style={{ padding: "13px 15px", fontWeight: 700 }}>
                {event.guests || "—"}
              </td>

              <td style={{ padding: "13px 15px" }}>
                <Badge status={event.status} />
              </td>

              <td style={{ padding: "13px 15px" }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onEdit(event)}
                >
                  {Icons.edit}
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventsWeekView({ events, onEdit }) {
  const days = getWeekDays();

  return (
    <div className="card p20">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(120px, 1fr))",
          gap: 9,
          overflowX: "auto",
        }}
      >
        {days.map((day, index) => {
          const dayEvents = events.filter(
            (event) => event.event_date === day
          );

          return (
            <section
              key={day}
              style={{
                minHeight: 160,
                padding: "11px 9px",
                border: `1px solid ${
                  day === TODAY ? "var(--a200)" : "var(--n100)"
                }`,
                borderRadius: 12,
                background: day === TODAY ? "var(--a50)" : "var(--n50)",
              }}
            >
              <div className="tx-label">{WEEK_PT[index]}</div>

              <div
                style={{
                  marginTop: 3,
                  color: day === TODAY ? "var(--a600)" : "var(--n800)",
                  fontSize: 19,
                  fontWeight: 800,
                }}
              >
                {day.slice(8)}/{day.slice(5, 7)}
              </div>

              {dayEvents.length === 0 && (
                <div className="tx-meta" style={{ marginTop: 9 }}>
                  Sem eventos
                </div>
              )}

              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => onEdit(event)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 8,
                    padding: "7px 8px",
                    border: 0,
                    borderRadius: 7,
                    background:
                      event.status === "confirmado"
                        ? "var(--g100)"
                        : "var(--a100)",
                    color:
                      event.status === "confirmado"
                        ? "#065f46"
                        : "#92400e",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1.4,
                    textAlign: "left",
                  }}
                >
                  {event.event_time && `${event.event_time} · `}
                  {event.event_type}

                  <br />

                  <span style={{ fontWeight: 500 }}>
                    {event.customer_name}
                  </span>
                </button>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function AgendaPage({
  company,
  events,
  setEvents,
  refreshDashboard,
}) {
  const [search, setSearch] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const response = await api.getAppointments(search);
      setEvents(response.events || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return events;
    }

    return events.filter((event) =>
      [
        event.customer_name,
        event.event_type,
        event.room_name,
        event.city,
        event.status,
        event.event_date,
      ].some((value) =>
        String(value || "").toLowerCase().includes(normalizedSearch)
      )
    );
  }, [events, search]);

  function closeModal() {
    setCreating(false);
    setEditingEvent(null);
  }

  async function handleSaved(savedEvent) {
    setEvents((current) => {
      const exists = current.some((event) => event.id === savedEvent.id);

      if (!exists) {
        return [savedEvent, ...current];
      }

      return current.map((event) =>
        event.id === savedEvent.id ? savedEvent : event
      );
    });

    closeModal();

    if (typeof refreshDashboard === "function") {
      await refreshDashboard();
    }
  }

  return (
    <div className="page">
      {(creating || editingEvent) && (
        <EventModal
          event={editingEvent}
          onClose={closeModal}
          onSaved={handleSaved}
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
          <div className="tx-title">Agenda de eventos</div>

          <div className="tx-meta" style={{ marginTop: 3 }}>
            {filteredEvents.length} evento(s) · {company?.name || "Empresa"}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-gold"
          onClick={() => setCreating(true)}
        >
          {Icons.plus}
          Novo evento
        </button>
      </div>

      <div
        className="card p20"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              minWidth: 250,
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
                  loadEvents();
                }
              }}
              placeholder="Buscar cliente, tipo ou cidade..."
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
            onClick={loadEvents}
          >
            Buscar
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 3,
            padding: 3,
            borderRadius: "var(--r8)",
            background: "var(--n100)",
          }}
        >
          <button
            type="button"
            className={`btn btn-sm ${
              view === "table" ? "btn-outline" : ""
            }`}
            style={{
              border: view === "table" ? "none" : "none",
              background: view === "table" ? "#fff" : "transparent",
            }}
            onClick={() => setView("table")}
          >
            Lista
          </button>

          <button
            type="button"
            className={`btn btn-sm ${
              view === "week" ? "btn-outline" : ""
            }`}
            style={{
              border: view === "week" ? "none" : "none",
              background: view === "week" ? "#fff" : "transparent",
            }}
            onClick={() => setView("week")}
          >
            Semana
          </button>
        </div>
      </div>

      {error && <div className="l-err">{error}</div>}

      {loading && (
        <div className="tx-meta" style={{ marginBottom: 12 }}>
          Carregando eventos...
        </div>
      )}

      {view === "table" ? (
        <EventsTable events={filteredEvents} onEdit={setEditingEvent} />
      ) : (
        <EventsWeekView events={events} onEdit={setEditingEvent} />
      )}
    </div>
  );
}