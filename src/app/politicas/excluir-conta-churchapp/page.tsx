import React from "react";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#F5F7FB",
    color: "#172033",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    lineHeight: 1.6,
    padding: "32px 16px",
  },
  container: {
    maxWidth: 880,
    margin: "0 auto",
  },
  hero: {
    background:
      "linear-gradient(135deg, rgba(65,88,208,0.15), rgba(78,140,255,0.08))",
    border: "1px solid #E4E8F0",
    borderRadius: 18,
    padding: 24,
    marginBottom: 18,
  },
  title: {
    margin: "0 0 8px",
    fontSize: 30,
    lineHeight: 1.2,
    letterSpacing: -0.4,
  },
  subtitle: {
    margin: 0,
    color: "#5F6B7A",
    fontSize: 15,
  },
  chip: {
    display: "inline-block",
    padding: "5px 11px",
    borderRadius: 999,
    background: "rgba(65,88,208,.12)",
    color: "#2739A7",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 12,
    border: "1px solid rgba(65,88,208,.22)",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #E4E8F0",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
    padding: 20,
    marginTop: 16,
  },
  h2: {
    margin: "0 0 10px",
    fontSize: 20,
  },
  p: {
    margin: "0 0 10px",
  },
  list: {
    margin: "0 0 10px 20px",
    padding: 0,
  },
  li: {
    margin: "6px 0",
  },
  emailBox: {
    display: "inline-block",
    padding: "10px 14px",
    borderRadius: 12,
    background: "#EEF2FF",
    color: "#2739A7",
    fontWeight: 700,
    textDecoration: "none",
    wordBreak: "break-word",
  },
  note: {
    borderLeft: "4px solid #4158D0",
    padding: "12px 14px",
    background: "rgba(65,88,208,.10)",
    borderRadius: 12,
    margin: "12px 0 0",
  },
  warning: {
    borderLeft: "4px solid #E0A100",
    padding: "12px 14px",
    background: "rgba(224,161,0,.12)",
    borderRadius: 12,
    margin: "12px 0 0",
  },
  footer: {
    marginTop: 18,
    color: "#5F6B7A",
    fontSize: 13,
    textAlign: "center",
  },
};

export default function ExcluirContaChurchApp() {
  const email = "bibliotechdosdev@gmail.com";
  const subject = "Solicitação de exclusão de conta — ChurchApp";
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <section style={styles.hero}>
          <span style={styles.chip}>ChurchApp</span>

          <h1 style={styles.title}>Exclusão de Conta e Dados</h1>

          <p style={styles.subtitle}>
            Página oficial para solicitação de exclusão de conta e dados
            associados ao aplicativo ChurchApp.
          </p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Como solicitar a exclusão</h2>

          <p style={styles.p}>
            Para solicitar a exclusão da sua conta e dos dados associados ao
            ChurchApp, envie um e-mail para:
          </p>

          <p style={styles.p}>
            <a href={mailto} style={styles.emailBox}>
              {email}
            </a>
          </p>

          <div style={styles.note}>
            <p style={styles.p}>
              No assunto do e-mail, informe:
              <br />
              <strong>Solicitação de exclusão de conta — ChurchApp</strong>
            </p>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Dados necessários para localizar sua conta</h2>

          <p style={styles.p}>
            Para que possamos localizar corretamente seu cadastro, informe no
            corpo do e-mail:
          </p>

          <ul style={styles.list}>
            <li style={styles.li}>Nome completo;</li>
            <li style={styles.li}>E-mail utilizado no aplicativo;</li>
            <li style={styles.li}>Telefone cadastrado, se houver;</li>
            <li style={styles.li}>Nome da igreja vinculada, se houver;</li>
            <li style={styles.li}>
              Uma breve confirmação de que deseja excluir sua conta e dados
              associados.
            </li>
          </ul>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>O que poderá ser excluído</h2>

          <p style={styles.p}>
            Após a confirmação da solicitação e validação da identidade do
            solicitante, poderemos excluir ou anonimizar, quando aplicável:
          </p>

          <ul style={styles.list}>
            <li style={styles.li}>Dados da conta do usuário;</li>
            <li style={styles.li}>Dados de perfil, como nome, e-mail, telefone e foto;</li>
            <li style={styles.li}>Vínculo do usuário com igreja, célula, ministério ou função;</li>
            <li style={styles.li}>Permissões de acesso associadas ao usuário;</li>
            <li style={styles.li}>Outras informações pessoais associadas à conta.</li>
          </ul>

          <div style={styles.warning}>
            <p style={styles.p}>
              Alguns dados poderão ser mantidos quando necessário para cumprir
              obrigações legais, preservar registros de segurança, prevenir
              fraudes, manter integridade administrativa ou respeitar limitações
              técnicas de backup.
            </p>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Dados que podem permanecer</h2>

          <p style={styles.p}>
            Dependendo do caso, alguns registros administrativos da igreja podem
            permanecer armazenados de forma limitada ou anonimizada, quando
            forem necessários para histórico, segurança, auditoria ou obrigação
            legal.
          </p>

          <p style={styles.p}>
            Quando possível, os dados pessoais serão removidos ou desvinculados
            da conta do usuário.
          </p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Prazo de processamento</h2>

          <p style={styles.p}>
            A solicitação será analisada e processada em prazo razoável após o
            recebimento do e-mail e confirmação da identidade do solicitante.
          </p>

          <p style={styles.p}>
            Caso sejam necessárias informações adicionais para confirmar a
            titularidade da conta, entraremos em contato pelo e-mail informado.
          </p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Contato</h2>

          <p style={styles.p}>
            Em caso de dúvidas sobre exclusão de conta, privacidade ou tratamento
            de dados pessoais no ChurchApp, entre em contato pelo e-mail:
          </p>

          <p style={styles.p}>
            <a href={mailto} style={styles.emailBox}>
              {email}
            </a>
          </p>
        </section>

        <footer style={styles.footer}>
          <p>© ChurchApp — Exclusão de Conta e Dados</p>
        </footer>
      </div>
    </main>
  );
}
