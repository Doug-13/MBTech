import React from "react";

type SectionProps = {
  id?: string;
  title?: string;
  children: React.ReactNode;
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    margin: 0,
    background: "#F5F7FB",
    color: "#172033",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    lineHeight: 1.6,
  },
  header: {
    background:
      "linear-gradient(180deg, rgba(65,88,208,.18), rgba(65,88,208,0))",
    padding: "32px 16px 8px",
  },
  wrap: {
    maxWidth: 920,
    margin: "0 auto",
    padding: "0 16px 40px",
  },
  titleBox: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    margin: 0,
  },
  title: {
    fontSize: 28,
    margin: 0,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: "#5F6B7A",
    margin: 0,
    fontSize: 14,
  },
  chip: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(65,88,208,.12)",
    color: "#2739A7",
    fontSize: 12,
    marginRight: 6,
    border: "1px solid rgba(65,88,208,.25)",
    verticalAlign: "middle",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #E4E8F0",
    borderRadius: 14,
    boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
    padding: 18,
    marginTop: 16,
  },
  heading: {
    fontSize: 18,
    margin: "0 0 10px",
  },
  paragraph: {
    margin: "0 0 10px",
  },
  list: {
    margin: "0 0 10px 18px",
    padding: 0,
  },
  listItem: {
    margin: "6px 0",
  },
  note: {
    borderLeft: "4px solid #4158D0",
    padding: "10px 12px",
    background: "rgba(65,88,208,.10)",
    borderRadius: 10,
    color: "#172033",
    margin: "0 0 10px",
  },
  warning: {
    borderLeft: "4px solid #E0A100",
    padding: "10px 12px",
    background: "rgba(224,161,0,.12)",
    borderRadius: 10,
    color: "#172033",
    margin: "0 0 10px",
  },
  link: {
    color: "#2739A7",
    textDecoration: "none",
  },
  footer: {
    color: "#5F6B7A",
    fontSize: 13,
    paddingTop: 14,
  },
};

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} style={styles.card}>
      {title ? <h2 style={styles.heading}>{title}</h2> : null}
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={styles.paragraph}>{children}</p>;
}

function Li({ children }: { children: React.ReactNode }) {
  return <li style={styles.listItem}>{children}</li>;
}

export default function PoliticaPrivacidadeChurchApp() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.wrap}>
          <div style={styles.titleBox}>
            <h1 style={styles.title}>Política de Privacidade — ChurchApp</h1>

            <p style={styles.subtitle}>
              <span style={styles.chip}>LGPD</span>
              Última atualização: <strong>22/05/2026</strong>
            </p>
          </div>
        </div>
      </header>

      <main style={styles.wrap}>
        <Section>
          <P>
            O <strong>ChurchApp</strong> é um aplicativo voltado para gestão,
            comunicação e organização de igrejas, membros, eventos, células,
            ministérios, avisos e recursos relacionados à comunidade local.
            Esta Política de Privacidade explica como tratamos informações ao
            usar o aplicativo.
          </P>
        </Section>

        <Section id="responsavel" title="1) Responsável pelo tratamento">
          <P>
            <strong>App:</strong> ChurchApp
          </P>

          <P>
            <strong>Contato:</strong>{" "}
            <a href="mailto:bibliotechdosdev@gmail.com" style={styles.link}>
              bibliotechdosdev@gmail.com
            </a>
          </P>

          <p style={styles.note}>
            Caso o ChurchApp seja utilizado por uma igreja específica, a igreja
            poderá ser responsável por parte dos dados cadastrados e
            administrados dentro do aplicativo.
          </p>
        </Section>

        <Section id="dados" title="2) Quais dados podemos coletar">
          <P>
            Coletamos somente os dados necessários para cadastro, autenticação,
            organização da igreja, comunicação interna e funcionamento das
            funcionalidades disponíveis.
          </P>

          <P>
            <strong>a) Dados de cadastro e perfil</strong>
          </P>

          <ul style={styles.list}>
            <Li>Nome, e-mail, telefone, foto de perfil e demais dados informados voluntariamente.</Li>
            <Li>Informações de vínculo com a igreja, como igreja associada, status de membro, função, perfil de acesso e permissões.</Li>
            <Li>Data de nascimento, quando utilizada para exibição de aniversariantes.</Li>
            <Li>Informações públicas do perfil, conforme configuração e regras do aplicativo.</Li>
          </ul>

          <P>
            <strong>b) Dados relacionados à igreja</strong>
          </P>

          <ul style={styles.list}>
            <Li>Participação em células, ministérios, eventos, avisos e atividades da igreja.</Li>
            <Li>Registros administrativos cadastrados por usuários autorizados.</Li>
            <Li>Imagens relacionadas à igreja, eventos, células ou perfil do usuário.</Li>
          </ul>

          <P>
            <strong>c) Dados técnicos coletados automaticamente</strong>
          </P>

          <ul style={styles.list}>
            <Li>Informações básicas do dispositivo e do aplicativo, como versão do sistema, versão do app e idioma.</Li>
            <Li>Logs de erro, desempenho, autenticação e segurança.</Li>
            <Li>Endereço IP e dados de conexão que podem aparecer em logs de hospedagem, banco de dados, armazenamento ou infraestrutura.</Li>
          </ul>

          <p style={styles.warning}>
            Como o ChurchApp é destinado ao contexto de igrejas, alguns dados
            cadastrados ou visualizados no aplicativo podem revelar vínculo ou
            participação em uma comunidade religiosa. Esses dados devem ser
            tratados com cuidado adicional, conforme a LGPD.
          </p>
        </Section>

        <Section id="finalidades" title="3) Para que usamos os dados">
          <ul style={styles.list}>
            <Li>Cadastrar usuários, membros e igrejas.</Li>
            <Li>Permitir login, autenticação e controle de permissões.</Li>
            <Li>Exibir informações da igreja, membros, aniversariantes, células, ministérios, eventos e avisos.</Li>
            <Li>Permitir que administradores autorizados gerenciem conteúdos e cadastros.</Li>
            <Li>Enviar ou exibir comunicações, notificações e informações relevantes da igreja.</Li>
            <Li>Melhorar desempenho, corrigir falhas e aumentar a segurança.</Li>
            <Li>Atender solicitações enviadas ao canal de contato.</Li>
          </ul>
        </Section>

        <Section id="perfis" title="4) Perfis de acesso e visibilidade">
          <ul style={styles.list}>
            <Li>
              Usuários comuns podem visualizar informações permitidas da igreja
              à qual estão vinculados.
            </Li>
            <Li>
              Administradores, líderes ou proprietários podem ter acesso a
              recursos adicionais, conforme permissões configuradas.
            </Li>
            <Li>
              Dados como membros, aniversariantes, eventos, células e avisos
              podem ser exibidos para usuários da igreja, conforme regras do
              aplicativo e permissões internas.
            </Li>
            <Li>
              Algumas informações podem ficar restritas a administradores ou
              usuários autorizados.
            </Li>
          </ul>
        </Section>

        <Section id="compartilhamento" title="5) Compartilhamento de dados">
          <ul style={styles.list}>
            <Li>
              <strong>Não vendemos</strong> dados pessoais.
            </Li>
            <Li>
              Podemos compartilhar dados com provedores de tecnologia
              necessários para operar o aplicativo, como hospedagem, banco de
              dados, autenticação, armazenamento de imagens, notificações e logs
              de erro.
            </Li>
            <Li>
              Dados podem ser visualizados por administradores autorizados da
              igreja, conforme função e permissões dentro do aplicativo.
            </Li>
            <Li>
              Podemos divulgar informações se houver obrigação legal, ordem de
              autoridade competente ou necessidade de proteger direitos,
              segurança e integridade do ChurchApp, das igrejas e dos usuários.
            </Li>
          </ul>
        </Section>

        <Section id="armazenamento" title="6) Armazenamento, retenção e exclusão">
          <ul style={styles.list}>
            <Li>
              Mantemos os dados enquanto forem necessários para as finalidades
              descritas nesta Política.
            </Li>
            <Li>
              Dados vinculados à igreja podem depender de regras administrativas
              da própria igreja, quando ela for responsável pelo cadastro e
              gestão das informações.
            </Li>
            <Li>
              Você pode solicitar exclusão ou correção dos seus dados pelo e-mail{" "}
              <a href="mailto:bibliotechdosdev@gmail.com" style={styles.link}>
                bibliotechdosdev@gmail.com
              </a>
              .
            </Li>
            <Li>
              A exclusão será realizada respeitando limitações técnicas,
              registros de segurança, backups, prevenção a fraudes e obrigações
              legais.
            </Li>
          </ul>
        </Section>

        <Section id="seguranca" title="7) Segurança">
          <P>
            Adotamos boas práticas de segurança, incluindo controle de acesso,
            autenticação, permissões por perfil, proteção de dados em trânsito
            quando aplicável e uso de provedores de infraestrutura confiáveis.
            Mesmo assim, nenhum sistema é totalmente livre de riscos.
          </P>
        </Section>

        <Section id="menores" title="8) Menores de idade">
          <P>
            O ChurchApp pode conter informações de membros de diferentes idades,
            inclusive crianças e adolescentes, quando cadastradas pela igreja ou
            por responsáveis autorizados.
          </P>

          <P>
            Recomendamos que dados de menores sejam cadastrados e gerenciados
            apenas por responsáveis, administradores autorizados ou pela própria
            igreja, observando a legislação aplicável.
          </P>

          <P>
            Solicitações de correção ou remoção podem ser enviadas para{" "}
            <a href="mailto:bibliotechdosdev@gmail.com" style={styles.link}>
              bibliotechdosdev@gmail.com
            </a>
            .
          </P>
        </Section>

        <Section id="direitos" title="9) Seus direitos conforme a LGPD">
          <P>Você pode solicitar:</P>

          <ul style={styles.list}>
            <Li>Acesso aos seus dados.</Li>
            <Li>Correção de dados incompletos, inexatos ou desatualizados.</Li>
            <Li>Exclusão de dados pessoais, quando aplicável.</Li>
            <Li>Informações sobre o tratamento e compartilhamento dos dados.</Li>
            <Li>Revogação de consentimento, quando o tratamento depender dele.</Li>
          </ul>

          <P>
            Contato:{" "}
            <a href="mailto:bibliotechdosdev@gmail.com" style={styles.link}>
              bibliotechdosdev@gmail.com
            </a>
          </P>
        </Section>

        <Section id="alteracoes" title="10) Alterações nesta Política">
          <P>
            Podemos atualizar esta Política periodicamente para refletir
            melhorias no aplicativo, mudanças legais ou ajustes operacionais.
            Sempre indicaremos a data de “Última atualização” no início do
            documento.
          </P>

          <footer style={styles.footer}>
            <p>© ChurchApp — Política de Privacidade</p>
          </footer>
        </Section>
      </main>
    </div>
  );
}
