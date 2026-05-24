import type React from "react";
import Link from "next/link";

export const metadata = {
  title: "Políticas de Privacidade | MB Tech",
  description: "Páginas públicas de políticas de privacidade dos aplicativos.",
};

export default function PoliticasPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.badge}>MB Tech</div>

        <h1 style={styles.title}>Políticas de Privacidade</h1>

        <p style={styles.description}>
          Consulte abaixo as políticas de privacidade públicas dos aplicativos
          disponibilizados pela MB Tech.
        </p>

        <div style={styles.links}>
          <Link href="/politicas/bibliotech" style={styles.linkCard}>
            <div>
              <strong style={styles.linkTitle}>Bibliotech</strong>
              <p style={styles.linkDescription}>
                Política de privacidade do aplicativo Bibliotech.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </Link>

          <Link href="/politicas/churchapp" style={styles.linkCard}>
            <div>
              <strong style={styles.linkTitle}>ChurchApp</strong>
              <p style={styles.linkDescription}>
                Política de privacidade do aplicativo ChurchApp.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </Link>

          <Link
            href="/politicas/excluir-conta-churchapp"
            style={styles.linkCard}
          >
            <div>
              <strong style={styles.linkTitle}>
                Exclusão de Conta — ChurchApp
              </strong>
              <p style={styles.linkDescription}>
                Página pública para solicitar a exclusão de conta e dados
                associados ao ChurchApp.
              </p>
            </div>

            <span style={styles.arrow}>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f4",
    color: "#1b1b18",
    fontFamily:
      "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 760,
    background: "#ffffff",
    border: "1px solid #eeeeeb",
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0,0,0,.08)",
  },
  badge: {
    display: "inline-flex",
    padding: "7px 12px",
    borderRadius: 999,
    background: "#fffbeb",
    color: "#b45309",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: ".08em",
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-.04em",
    margin: 0,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 1.7,
    color: "#6b6b66",
    margin: 0,
    marginBottom: 24,
  },
  links: {
    display: "grid",
    gap: 12,
  },
  linkCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: 18,
    borderRadius: 18,
    background: "#fafaf8",
    border: "1px solid #eeeeeb",
    textDecoration: "none",
    color: "#1b1b18",
  },
  linkTitle: {
    display: "block",
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 13,
    color: "#777771",
    margin: 0,
    lineHeight: 1.5,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "#101010",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    flexShrink: 0,
  },
};
