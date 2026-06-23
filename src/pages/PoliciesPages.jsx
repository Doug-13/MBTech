const PLATFORM = {
  supportEmail: "suporte@mbtech.com.br",
};

const pageStyle = {
  minHeight: "100vh",
  padding: "40px 20px",
  background: "#f8f7f4",
  color: "#1b1b18",
  fontFamily:
    "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const documentStyle = {
  width: "100%",
  maxWidth: 920,
  margin: "0 auto",
  padding: 32,
  border: "1px solid #eeeeeb",
  borderRadius: 28,
  background: "#ffffff",
  boxShadow: "0 20px 60px rgba(0,0,0,.08)",
};

const badgeStyle = {
  display: "inline-flex",
  marginBottom: 16,
  padding: "7px 12px",
  borderRadius: 999,
  background: "#fffbeb",
  color: "#b45309",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".08em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  marginBottom: 10,
  fontSize: 38,
  fontWeight: 800,
  letterSpacing: "-.04em",
  lineHeight: 1.1,
};

const subtitleStyle = {
  margin: "26px 0 10px",
  color: "#1b1b18",
  fontSize: 19,
  fontWeight: 800,
};

const paragraphStyle = {
  margin: "0 0 14px",
  color: "#4b4b46",
  fontSize: 15,
  lineHeight: 1.8,
};

function ListPage() {
  const pages = [
    {
      href: "/politicas/bibliotech",
      title: "Bibliotech",
      description: "Política de privacidade do aplicativo Bibliotech.",
    },
    {
      href: "/politicas/churchapp",
      title: "ChurchApp",
      description: "Política de privacidade do aplicativo ChurchApp.",
    },
    {
      href: "/politicas/excluir-conta-churchapp",
      title: "Exclusão de Conta — ChurchApp",
      description: "Solicitação pública de exclusão de conta e dados.",
    },
    {
      href: "/politicas/seguranca-infantil-churchapp",
      title: "Segurança Infantil — ChurchApp",
      description: "Normas de proteção infantil e combate à exploração.",
    },
  ];

  return (
    <main
      style={{
        ...pageStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section style={{ ...documentStyle, maxWidth: 760 }}>
        <div style={badgeStyle}>MB Tech</div>

        <h1 style={titleStyle}>Políticas de Privacidade</h1>

        <p style={paragraphStyle}>
          Esta página reúne as políticas e documentos públicos disponibilizados
          pela MB Tech.
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 24,
          }}
        >
          {pages.map((page) => (
            <a
              key={page.href}
              href={page.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                padding: 18,
                border: "1px solid #eeeeeb",
                borderRadius: 18,
                background: "#fafaf8",
                color: "#1b1b18",
                textDecoration: "none",
              }}
            >
              <div>
                <strong
                  style={{
                    display: "block",
                    marginBottom: 4,
                    fontSize: 16,
                  }}
                >
                  {page.title}
                </strong>

                <span
                  style={{
                    color: "#777771",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {page.description}
                </span>
              </div>

              <span
                style={{
                  display: "flex",
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "#101010",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                →
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function PrivacyPolicyPage({ app }) {
  const isBibliotech = app === "bibliotech";
  const appName = isBibliotech ? "Bibliotech" : "ChurchApp";

  return (
    <main style={pageStyle}>
      <article style={documentStyle}>
        <header
          style={{
            marginBottom: 26,
            paddingBottom: 22,
            borderBottom: "1px solid #eeeeeb",
          }}
        >
          <div style={badgeStyle}>{appName}</div>

          <h1 style={titleStyle}>Política de Privacidade</h1>

          <p style={{ ...paragraphStyle, marginBottom: 0, color: "#777771" }}>
            Última atualização: 22 de maio de 2026
          </p>
        </header>

        <p style={paragraphStyle}>
          Esta Política de Privacidade descreve como o aplicativo {appName}
          coleta, utiliza, armazena e protege as informações dos usuários.
        </p>

        <h2 style={subtitleStyle}>1. Informações coletadas</h2>

        <p style={paragraphStyle}>
          O {appName} pode coletar informações fornecidas diretamente pelo
          usuário, como nome, e-mail, telefone, dados de perfil e demais
          informações necessárias para o funcionamento da plataforma.
        </p>

        {isBibliotech ? (
          <p style={paragraphStyle}>
            No Bibliotech, também podem ser tratados dados relacionados a
            bibliotecas pessoais, livros cadastrados, preferências de leitura,
            status de leitura e interações sociais realizadas pelo usuário.
          </p>
        ) : (
          <p style={paragraphStyle}>
            No ChurchApp, também podem ser tratados dados relacionados à igreja,
            células, membros, eventos, avisos, aniversários, funções e
            permissões de acesso.
          </p>
        )}

        <h2 style={subtitleStyle}>2. Uso das informações</h2>

        <p style={paragraphStyle}>
          Os dados são utilizados para autenticação, segurança, funcionamento
          das funcionalidades, suporte ao usuário, prevenção de uso indevido e
          melhoria contínua da experiência oferecida.
        </p>

        <h2 style={subtitleStyle}>3. Compartilhamento de informações</h2>

        <p style={paragraphStyle}>
          A MB Tech não vende dados pessoais. As informações poderão ser
          compartilhadas apenas quando necessário para execução do serviço,
          cumprimento de obrigações legais, proteção de direitos ou mediante
          autorização do usuário.
        </p>

        <h2 style={subtitleStyle}>4. Armazenamento e segurança</h2>

        <p style={paragraphStyle}>
          As informações são armazenadas em ambientes protegidos e tratadas com
          medidas técnicas e organizacionais razoáveis. Nenhum sistema
          eletrônico, porém, é totalmente livre de riscos.
        </p>

        <h2 style={subtitleStyle}>5. Direitos do usuário</h2>

        <p style={paragraphStyle}>
          O usuário pode solicitar acesso, correção ou exclusão de seus dados,
          quando aplicável, entrando em contato pelos canais de suporte.
        </p>

        <h2 style={subtitleStyle}>6. Contato</h2>

        <p style={paragraphStyle}>
          Em caso de dúvidas sobre privacidade ou dados pessoais, entre em
          contato pelo e-mail:
        </p>

        <p
          style={{
            margin: 0,
            color: "#b45309",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          {PLATFORM.supportEmail}
        </p>
      </article>
    </main>
  );
}

function DeleteAccountPage() {
  const subject = encodeURIComponent(
    "Solicitação de exclusão de conta — ChurchApp"
  );

  return (
    <main style={pageStyle}>
      <article style={documentStyle}>
        <div style={badgeStyle}>ChurchApp</div>

        <h1 style={titleStyle}>Exclusão de Conta e Dados</h1>

        <p style={paragraphStyle}>
          Para solicitar a exclusão da sua conta e dos dados associados ao
          ChurchApp, envie um e-mail para:
        </p>

        <p
          style={{
            marginBottom: 20,
            color: "#b45309",
            fontSize: 16,
            fontWeight: 800,
          }}
        >
          <a
            href={`mailto:${PLATFORM.supportEmail}?subject=${subject}`}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {PLATFORM.supportEmail}
          </a>
        </p>

        <h2 style={subtitleStyle}>Dados necessários</h2>

        <p style={paragraphStyle}>
          Informe no e-mail seu nome completo, e-mail utilizado no aplicativo,
          telefone cadastrado, nome da igreja vinculada quando houver e a
          confirmação de que deseja excluir a conta.
        </p>

        <h2 style={subtitleStyle}>Tratamento da solicitação</h2>

        <p style={paragraphStyle}>
          A solicitação será analisada após a confirmação da identidade do
          solicitante. Alguns dados podem permanecer quando necessários para
          obrigações legais, segurança, prevenção a fraudes ou integridade de
          backups.
        </p>
      </article>
    </main>
  );
}

function ChildSafetyPage() {
  return (
    <main style={pageStyle}>
      <article style={documentStyle}>
        <div style={badgeStyle}>ChurchApp</div>

        <h1 style={titleStyle}>Normas de Segurança Infantil</h1>

        <p style={paragraphStyle}>
          O ChurchApp proíbe qualquer conteúdo, conduta, comunicação, imagem,
          perfil ou atividade que promova, facilite, normalize ou represente
          abuso, exploração, aliciamento ou sexualização de crianças e
          adolescentes.
        </p>

        <h2 style={subtitleStyle}>Condutas proibidas</h2>

        <ul
          style={{
            ...paragraphStyle,
            marginLeft: 22,
            paddingLeft: 6,
          }}
        >
          <li>
            Publicar, enviar, solicitar ou compartilhar material de abuso ou
            exploração sexual infantil.
          </li>
          <li>
            Utilizar a plataforma para aliciar, manipular, coagir ou assediar
            crianças e adolescentes.
          </li>
          <li>
            Criar conteúdos, perfis ou comunicações que sexualizem menores.
          </li>
          <li>
            Incentivar ou encobrir qualquer prática que coloque menores em
            risco.
          </li>
        </ul>

        <h2 style={subtitleStyle}>Medidas adotadas</h2>

        <p style={paragraphStyle}>
          O ChurchApp pode remover conteúdo, suspender contas, restringir
          funcionalidades, analisar denúncias e cooperar com autoridades
          competentes quando houver indício de risco ou obrigação legal.
        </p>

        <h2 style={subtitleStyle}>Canal de denúncia</h2>

        <p style={paragraphStyle}>
          Para comunicar conteúdo ou comportamento suspeito, envie uma denúncia
          para:
        </p>

        <p
          style={{
            margin: 0,
            color: "#b45309",
            fontSize: 15,
            fontWeight: 800,
          }}
        >
          {PLATFORM.supportEmail}
        </p>
      </article>
    </main>
  );
}

export default function PublicPolicyRouter() {
  const path =
    String(window.location.pathname || "/").replace(/\/+$/, "") || "/";

  if (path === "/politicas/bibliotech") {
    return <PrivacyPolicyPage app="bibliotech" />;
  }

  if (path === "/politicas/churchapp") {
    return <PrivacyPolicyPage app="churchapp" />;
  }

  if (path === "/politicas/excluir-conta-churchapp") {
    return <DeleteAccountPage />;
  }

  if (path === "/politicas/seguranca-infantil-churchapp") {
    return <ChildSafetyPage />;
  }

  return <ListPage />;
}