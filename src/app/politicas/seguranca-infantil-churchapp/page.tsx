import type React from "react";

export const metadata = {
  title: "Normas de Segurança Infantil | ChurchApp",
  description:
    "Página pública com as normas de segurança infantil e combate ao abuso e exploração sexual infantil do ChurchApp.",
};

const CONTACT_EMAIL = "suporte@mbtech.com.br";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f4",
    color: "#1b1b18",
    fontFamily:
      "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "40px 20px",
  },
  document: {
    width: "100%",
    maxWidth: 920,
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #eeeeeb",
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0,0,0,.08)",
  },
  header: {
    borderBottom: "1px solid #eeeeeb",
    paddingBottom: 22,
    marginBottom: 26,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    lineHeight: 1.1,
    fontWeight: 800,
    letterSpacing: "-.04em",
    margin: 0,
    marginBottom: 10,
  },
  updated: {
    color: "#777771",
    fontSize: 14,
    margin: 0,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: 800,
    margin: 0,
    marginBottom: 10,
    color: "#1b1b18",
  },
  description: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#4b4b46",
    margin: 0,
    marginBottom: 12,
  },
  list: {
    margin: "0 0 12px 20px",
    padding: 0,
    color: "#4b4b46",
    fontSize: 15,
    lineHeight: 1.8,
  },
  listItem: {
    marginBottom: 8,
  },
  note: {
    borderLeft: "4px solid #d97706",
    background: "#fffbeb",
    padding: "14px 16px",
    borderRadius: 14,
    color: "#4b4b46",
    fontSize: 15,
    lineHeight: 1.7,
    marginTop: 12,
  },
  contactBox: {
    background: "#fafaf8",
    border: "1px solid #eeeeeb",
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
  },
  contactEmail: {
    display: "inline-block",
    color: "#b45309",
    fontWeight: 800,
    textDecoration: "none",
    wordBreak: "break-word",
  },
  footer: {
    borderTop: "1px solid #eeeeeb",
    paddingTop: 18,
    marginTop: 26,
    color: "#777771",
    fontSize: 13,
    lineHeight: 1.6,
  },
};

export default function NormasSegurancaInfantilChurchAppPage() {
  const subject =
    "Denúncia de segurança infantil — ChurchApp";
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}`;

  return (
    <main style={styles.page}>
      <article style={styles.document}>
        <header style={styles.header}>
          <div style={styles.badge}>ChurchApp</div>

          <h1 style={styles.title}>Normas de Segurança Infantil</h1>

          <p style={styles.updated}>
            Última atualização: 24 de maio de 2026
          </p>
        </header>

        <section style={styles.section}>
          <p style={styles.description}>
            O ChurchApp é um aplicativo voltado à organização, comunicação e
            gestão de comunidades religiosas. A proteção de crianças e
            adolescentes é tratada como prioridade. Esta página apresenta nossas
            normas públicas de segurança infantil e de combate ao abuso e à
            exploração sexual infantil.
          </p>

          <p style={styles.description}>
            O ChurchApp não permite qualquer conteúdo, conduta, comunicação,
            imagem, texto, arquivo, perfil ou atividade que promova, facilite,
            normalize, incentive ou represente abuso, exploração, aliciamento,
            sexualização ou qualquer forma de dano contra crianças ou
            adolescentes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>1. Proibição de conteúdo de abuso e exploração sexual infantil</h2>

          <p style={styles.description}>
            É estritamente proibido no ChurchApp:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              Publicar, enviar, armazenar, solicitar ou compartilhar qualquer
              conteúdo de abuso sexual infantil, exploração sexual infantil ou
              material relacionado.
            </li>
            <li style={styles.listItem}>
              Usar o aplicativo para aliciar, assediar, manipular, coagir ou
              explorar crianças ou adolescentes.
            </li>
            <li style={styles.listItem}>
              Criar perfis, mensagens, eventos, avisos, imagens ou qualquer
              conteúdo que sexualize menores de idade.
            </li>
            <li style={styles.listItem}>
              Incentivar, organizar, facilitar ou encobrir qualquer prática
              relacionada a abuso, exploração, tráfico, exposição indevida ou
              risco contra menores.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>2. Medidas adotadas pelo ChurchApp</h2>

          <p style={styles.description}>
            Para apoiar um ambiente mais seguro, o ChurchApp pode adotar medidas
            como:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>
              Remoção de conteúdo inadequado, abusivo, ilegal ou que viole estas
              normas.
            </li>
            <li style={styles.listItem}>
              Suspensão ou bloqueio de contas envolvidas em violações.
            </li>
            <li style={styles.listItem}>
              Restrição de acesso a funcionalidades administrativas quando
              houver uso indevido.
            </li>
            <li style={styles.listItem}>
              Análise de denúncias recebidas por usuários, responsáveis,
              administradores de igrejas ou autoridades competentes.
            </li>
            <li style={styles.listItem}>
              Cooperação com autoridades competentes quando houver obrigação
              legal, risco à segurança ou indício de prática criminosa.
            </li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>3. Denúncia de violações</h2>

          <p style={styles.description}>
            Qualquer usuário, responsável, membro, administrador de igreja ou
            terceiro que identifique conteúdo ou comportamento suspeito
            envolvendo criança ou adolescente deve comunicar imediatamente a
            equipe responsável pelo ChurchApp.
          </p>

          <div style={styles.contactBox}>
            <p style={styles.description}>
              Canal de contato para denúncias e solicitações relacionadas à
              segurança infantil:
            </p>

            <a href={mailto} style={styles.contactEmail}>
              {CONTACT_EMAIL}
            </a>

            <p style={{ ...styles.description, marginTop: 12 }}>
              Assunto sugerido:
              <br />
              <strong>Denúncia de segurança infantil — ChurchApp</strong>
            </p>
          </div>

          <p style={styles.note}>
            Em situações de emergência, risco imediato ou suspeita de crime,
            procure imediatamente as autoridades competentes da sua região.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>4. Informações úteis para denúncia</h2>

          <p style={styles.description}>
            Ao enviar uma denúncia, informe, sempre que possível:
          </p>

          <ul style={styles.list}>
            <li style={styles.listItem}>Nome ou identificação do perfil envolvido;</li>
            <li style={styles.listItem}>Igreja ou comunidade vinculada, se houver;</li>
            <li style={styles.listItem}>Descrição objetiva do ocorrido;</li>
            <li style={styles.listItem}>Data, horário aproximado e local dentro do app;</li>
            <li style={styles.listItem}>Prints, links, nomes de telas ou outras evidências disponíveis.</li>
          </ul>

          <p style={styles.description}>
            As denúncias serão analisadas com prioridade e tratadas com o
            cuidado necessário para proteger possíveis vítimas e preservar
            informações relevantes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>5. Responsabilidades de administradores e igrejas</h2>

          <p style={styles.description}>
            Igrejas, líderes e administradores que utilizam o ChurchApp devem
            zelar pelo uso adequado da plataforma, orientar membros autorizados,
            revisar conteúdos cadastrados e agir prontamente diante de qualquer
            suspeita de risco, abuso, exposição indevida ou violação destas
            normas.
          </p>

          <p style={styles.description}>
            O uso de funcionalidades como cadastro de membros, células, eventos,
            ministérios, imagens e avisos deve respeitar a privacidade, a
            dignidade e a segurança de crianças e adolescentes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>6. Tratamento de dados de menores</h2>

          <p style={styles.description}>
            O ChurchApp pode conter informações de membros de diferentes idades,
            inclusive crianças e adolescentes, quando cadastradas por uma igreja,
            responsável ou usuário autorizado.
          </p>

          <p style={styles.description}>
            Dados de menores devem ser cadastrados e utilizados apenas quando
            necessários para as finalidades legítimas do aplicativo, observando
            a legislação aplicável, a proteção integral e o melhor interesse da
            criança e do adolescente.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>7. Atualizações destas normas</h2>

          <p style={styles.description}>
            Estas normas poderão ser atualizadas periodicamente para refletir
            melhorias de segurança, mudanças legais, orientações de plataformas
            de distribuição ou aperfeiçoamentos operacionais do ChurchApp.
          </p>
        </section>

        <footer style={styles.footer}>
          <p>
            © ChurchApp — Normas de Segurança Infantil.
            <br />
            Esta página é pública e pode ser utilizada para fins de conformidade
            com requisitos de segurança infantil em lojas de aplicativos.
          </p>
        </footer>
      </article>
    </main>
  );
}
