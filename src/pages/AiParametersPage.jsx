import { useEffect, useState } from "react";

import { api } from "../services/api";
import { Icons } from "../components/ui/Icons";
import Badge from "../components/ui/Badge";
import { getErrorMessage } from "../shared/appUtils";

const EMPTY_PARAMETER = {
  parameter_key: "",
  parameter_value: "",
  description: "",
  is_active: true,
};

function ParameterModal({ parameter, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_PARAMETER,
    ...(parameter || {}),
  }));
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

    try {
      const response = parameter?.id
        ? await api.updateAiParameter(parameter.id, form)
        : await api.createAiParameter(form);

      onSaved(response.param);
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
      <form className="modal" style={{ maxWidth: 620 }} onSubmit={handleSubmit}>
        <div className="m-head">
          <div>
            <div className="m-title">
              {parameter ? "Editar parâmetro" : "Novo parâmetro"}
            </div>

            <div className="m-sub">
              Informação interna que será usada pelo agente de IA.
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

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label className="fld">
              <span>Chave *</span>

              <input
                required
                value={form.parameter_key}
                onChange={(event) =>
                  setField(
                    "parameter_key",
                    event.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "_")
                      .replace(/[^a-z0-9_]/g, "")
                  )
                }
                placeholder="Ex.: servicos_oferecidos"
              />
            </label>

            <label className="fld">
              <span>Valor *</span>

              <textarea
                required
                value={form.parameter_value}
                onChange={(event) =>
                  setField("parameter_value", event.target.value)
                }
                placeholder="Informação que a IA poderá utilizar nas respostas..."
                style={{ minHeight: 150 }}
              />
            </label>

            <label className="fld">
              <span>Descrição interna</span>

              <input
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
                placeholder="Ex.: Lista dos serviços disponíveis."
              />
            </label>

            <button
              type="button"
              className="tg-wrap"
              style={{
                width: "fit-content",
                border: 0,
                background: "transparent",
              }}
              onClick={() => setField("is_active", !form.is_active)}
            >
              <div className={`tg ${form.is_active ? "on" : ""}`} />

              <span
                style={{
                  color: "var(--n700)",
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                Parâmetro ativo
              </span>
            </button>
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
            disabled={
              saving ||
              !form.parameter_key.trim() ||
              !form.parameter_value.trim()
            }
          >
            {saving ? "Salvando..." : "Salvar parâmetro"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AiParametersPage({ company }) {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingParameter, setEditingParameter] = useState(undefined);

  async function loadParameters() {
    setLoading(true);
    setError("");

    try {
      const response = await api.getAiParameters();

      setParameters(response.params || response.ai_parameters || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadParameters();
  }, []);

  function handleSaved(savedParameter) {
    setParameters((current) => {
      const exists = current.some(
        (parameter) => parameter.id === savedParameter.id
      );

      if (!exists) {
        return [savedParameter, ...current];
      }

      return current.map((parameter) =>
        parameter.id === savedParameter.id ? savedParameter : parameter
      );
    });

    setEditingParameter(undefined);
  }

  async function handleToggle(parameter) {
    setError("");

    try {
      const response = await api.updateAiParameter(parameter.id, {
        parameter_key: parameter.parameter_key,
        parameter_value: parameter.parameter_value,
        description: parameter.description || "",
        is_active: !parameter.is_active,
      });

      setParameters((current) =>
        current.map((item) =>
          item.id === parameter.id ? response.param : item
        )
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function handleDelete(parameter) {
    const confirmed = window.confirm(
      `Deseja remover o parâmetro "${parameter.parameter_key}"?`
    );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await api.deleteAiParameter(parameter.id);

      setParameters((current) =>
        current.filter((item) => item.id !== parameter.id)
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <div className="page">
      {editingParameter !== undefined && (
        <ParameterModal
          parameter={editingParameter}
          onClose={() => setEditingParameter(undefined)}
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
          <div className="tx-title">Parâmetros da IA</div>

          <div className="tx-meta" style={{ marginTop: 3 }}>
            Informações que os agentes podem usar ao atender clientes de{" "}
            {company?.name || "sua empresa"}.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-gold"
          onClick={() => setEditingParameter(null)}
        >
          {Icons.plus}
          Novo parâmetro
        </button>
      </div>

      <section
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
          <div className="tx-section">Como usar</div>

          <p className="tx-body" style={{ marginTop: 4 }}>
            Cadastre políticas, serviços, regras, perguntas frequentes e dados
            comerciais. Estes parâmetros serão incorporados ao contexto do
            agente nas próximas etapas da integração.
          </p>
        </div>
      </section>

      {error && <div className="l-err">{error}</div>}

      {loading ? (
        <div className="card p24" style={{ textAlign: "center" }}>
          <span className="spinner" />

          <div className="tx-meta" style={{ marginTop: 10 }}>
            Carregando parâmetros...
          </div>
        </div>
      ) : parameters.length === 0 ? (
        <div className="card p24" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 38 }}>🔑</div>

          <div className="tx-section" style={{ marginTop: 10 }}>
            Nenhum parâmetro cadastrado
          </div>

          <div className="tx-meta" style={{ marginTop: 5 }}>
            Cadastre informações importantes para melhorar as respostas da IA.
          </div>

          <button
            type="button"
            className="btn btn-gold"
            style={{ marginTop: 16 }}
            onClick={() => setEditingParameter(null)}
          >
            {Icons.plus}
            Criar parâmetro
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {parameters.map((parameter, index) => (
            <article
              key={parameter.id}
              className="card p20"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                animation: `fadeUp .32s ease ${index * 0.04}s both`,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  <code
                    style={{
                      padding: "4px 8px",
                      borderRadius: 5,
                      background: "var(--n800)",
                      color: "#fff",
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {parameter.parameter_key}
                  </code>

                  {!parameter.is_active && (
                    <Badge status="inactive">Inativo</Badge>
                  )}
                </div>

                <div
                  style={{
                    color: "var(--n700)",
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {parameter.parameter_value}
                </div>

                {parameter.description && (
                  <div className="tx-meta" style={{ marginTop: 6 }}>
                    {parameter.description}
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  className="tg-wrap"
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                  }}
                  title={
                    parameter.is_active
                      ? "Desativar parâmetro"
                      : "Ativar parâmetro"
                  }
                  onClick={() => handleToggle(parameter)}
                >
                  <div
                    className={`tg ${parameter.is_active ? "on" : ""}`}
                    style={{ transform: "scale(.85)" }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditingParameter(parameter)}
                >
                  {Icons.edit}
                </button>

                <button
                  type="button"
                  className="btn btn-del btn-sm"
                  onClick={() => handleDelete(parameter)}
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