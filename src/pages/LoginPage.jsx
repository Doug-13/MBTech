import { useState } from "react";

import { api, saveSession } from "../services/api";
import LogoMark from "../components/layout/LogoMark";
import { getErrorMessage } from "../shared/appUtils";

const PLATFORM = {
  name: "MB Tech",
  productName: "MB Agenda IA",
};

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@danonagourmet.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.login(email, password);
      const session = saveSession(response);

      onLogin(session);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="l-page">
      <section className="l-shell">
        <div className="l-hero">
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 13px",
                borderRadius: 999,
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.09)",
                color: "rgba(255,255,255,.6)",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--a500)",
                }}
              />
              MB Tech · Plataforma SaaS
            </div>

            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(34px,4.6vw,60px)",
                lineHeight: 1.08,
                fontWeight: 800,
                letterSpacing: "-.03em",
                maxWidth: 520,
              }}
            >
              Gestão inteligente
              <br />
              com <span style={{ color: "var(--a500)" }}>IA</span> para seu
              negócio
            </h1>

            <p
              style={{
                marginTop: 18,
                maxWidth: 460,
                color: "rgba(255,255,255,.48)",
                fontSize: 15,
                lineHeight: 1.7,
              }}
            >
              Centralize o atendimento, agenda, parâmetros da IA e conversas da
              sua empresa em uma única plataforma.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 9,
                maxWidth: 440,
                marginTop: 38,
              }}
            >
              {[
                ["24/7", "IA ativa"],
                ["SaaS", "Multiempresa"],
                ["100%", "Isolado"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  style={{
                    padding: 15,
                    borderRadius: 16,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 27,
                      fontWeight: 800,
                      letterSpacing: "-.04em",
                    }}
                  >
                    {number}
                  </div>

                  <div
                    style={{
                      marginTop: 5,
                      color: "rgba(255,255,255,.38)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="l-form">
          <div className="l-logo">
            <LogoMark variant="light" />

            <div>
              <div className="l-logo-name">{PLATFORM.name}</div>
              <div className="l-logo-sub">{PLATFORM.productName}</div>
            </div>
          </div>

          <h2 className="l-title">Acesso do cliente</h2>

          <p className="l-sub2">
            Acesse o painel da sua empresa com segurança.
          </p>

          {error && <div className="l-err">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="fld" style={{ marginBottom: 13 }}>
              <span>E-mail</span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="cliente@empresa.com"
                required
              />
            </label>

            <label className="fld" style={{ marginBottom: 18 }}>
              <span>Senha</span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-ink"
              style={{
                width: "100%",
                minHeight: 44,
              }}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar no painel"}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{
                width: "100%",
                minHeight: 44,
                marginTop: 10,
              }}
              onClick={() => {
                window.location.href = "/admin";
              }}
            >
              Acesso administrativo MB Tech
            </button>
          </form>

          <p
            style={{
              marginTop: 14,
              color: "var(--n400)",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Administração da plataforma: <strong>/admin</strong>
          </p>
        </div>
      </section>
    </main>
  );
}