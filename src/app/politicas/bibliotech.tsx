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
    background: "#F8F9FA",
    color: "#2D3436",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    lineHeight: 1.6,
  },
  header: {
    background:
      "linear-gradient(180deg, rgba(243,208,15,.25), rgba(243,208,15,0))",
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
    color: "#636E72",
    margin: 0,
    fontSize: 14,
  },
  chip: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(78,140,255,.12)",
    color: "#1f4fbf",
    fontSize: 12,
    marginRight: 6,
    border: "1px solid rgba(78,140,255,.25)",
    verticalAlign: "middle",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #E0E0E0",
    borderRadius: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
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
    borderLeft: "4px solid #F3D00F",
    padding: "10px 12px",
    background: "rgba(243,208,15,.18)",
    borderRadius: 10,
    color: "#2D3436",
    margin: "0 0 10px",
  },
  link: {
    color: "#1f4fbf",
    textDecoration: "none",
  },
  footer: {
    color: "#636E72",
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

export default function PoliticaPrivacidadeBibliotech() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.wrap}>
          <div style={styles.titleBox}>
            <h1 style={styles.title}>Política de Privacidade — Bibliotech</h1>

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
            O <strong>Bibliotech</strong> é um aplicativo para organizar,
            gerenciar e compartilhar bibliotecas de livros. Esta Política de
            Privacidade descreve, de forma simples, como tratamos informações
            ao usar o aplicativo.
          </P>
        </Section>

        <Section id="responsavel" title="1) Responsável pelo tratamento">
          <P>
            <strong>App:</strong> Bibliotech
          </P>

          <P>
            <strong>Contato:</strong>{" "}
            <a href="mailto:bibliotechdosdev@gmail.com" style={styles.link}>
              bibliotechdosdev@gmail.com
            </a>
          </P>

          <p style={styles.note}>
            O Bibliotech pode ser mantido como projeto independente/portfólio.
            Caso futuramente exista uma empresa responsável, esta Política será
            atualizada com os dados correspondentes.
          </p>
        </Section>

        <Section id="dados" title="2) Quais dados coletamos">
          <P>
            O Bibliotech coleta apenas os dados necessários para funcionamento
            do aplicativo, organização da biblioteca e melhoria da experiência
            do usuário.
          </P>

          <P>
            Nós <strong>não solicitamos dados sensíveis</strong>, como dados de
            saúde, biometria, religião, orientação sexual ou dados financeiros.
          </P>

          <P>
            <strong>a) Dados informados por você</strong>
          </P>

          <ul style={styles.list}>
            <Li>Informações de perfil que você escolher preencher, como nome, apelido, foto e bio.</Li>
            <Li>Dados da sua biblioteca, como livros cadastrados, status de leitura, avaliações, notas, categorias e preferências.</Li>
            <Li>Configurações de privacidade, como biblioteca pública ou privada e livros públicos ou privados.</Li>
            <Li>Mensagens, solicitações ou dúvidas enviadas voluntariamente para nosso canal de contato.</Li>
          </ul>

          <P>
            <strong>b) Dados técnicos coletados automaticamente</strong>
          </P>

          <ul style={styles.list}>
            <Li>Informações básicas do dispositivo e do aplicativo, como versão do sistema, versão do app e idioma.</Li>
            <Li>Registros de erro, desempenho e diagnóstico para correção de falhas.</Li>
            <Li>Endereço IP e dados de conexão que podem aparecer em logs de hospedagem, banco de dados ou infraestrutura.</Li>
          </ul>
        </Section>

        <Section id="visibilidade" title="3) Como funciona a visibilidade da biblioteca">
          <ul style={styles.list}>
            <Li>
              <strong>Biblioteca privada:</strong> apenas você visualiza sua
              biblioteca.
            </Li>
            <Li>
              <strong>Biblioteca pública:</strong> outros usuários podem
              visualizar sua biblioteca conforme as funcionalidades disponíveis
              no aplicativo.
            </Li>
            <Li>
              <strong>Livros privados:</strong> mesmo que sua biblioteca esteja
              pública, livros marcados como privados não devem aparecer para
              outras pessoas.
            </Li>
          </ul>

          <p style={styles.note}>
            Você poderá ajustar essas configurações dentro do aplicativo,
            conforme os recursos estiverem disponíveis.
          </p>
        </Section>

        <Section id="finalidades" title="4) Para que usamos os dados">
          <ul style={styles.list}>
            <Li>Manter o funcionamento do aplicativo.</Li>
            <Li>Salvar e organizar sua biblioteca de livros.</Li>
            <Li>Exibir corretamente suas configurações de privacidade.</Li>
            <Li>Melhorar desempenho, corrigir bugs e aumentar a segurança.</Li>
            <Li>Responder solicitações enviadas ao nosso e-mail.</Li>
          </ul>
        </Section>

        <Section id="compartilhamento" title="5) Compartilhamento de dados">
          <ul style={styles.list}>
            <Li>
              <strong>Não vendemos</strong> dados pessoais.
            </Li>
            <Li>
              Podemos compartilhar dados somente com provedores de tecnologia
              necessários para operar o aplicativo, como hospedagem, banco de
              dados, armazenamento, autenticação, notificações e logs de erro.
            </Li>
            <Li>
              Podemos divulgar informações se houver obrigação legal, ordem de
              autoridade competente ou necessidade de proteger direitos,
              segurança e integridade do Bibliotech e de seus usuários.
            </Li>
          </ul>
        </Section>

        <Section id="retencao" title="6) Armazenamento, retenção e exclusão">
          <ul style={styles.list}>
            <Li>
              Mantemos os dados enquanto forem necessários para as finalidades
              descritas nesta Política.
            </Li>
            <Li>
              Você pode solicitar exclusão de dados ou conta, quando aplicável,
              pelo e-mail{" "}
              <a href="mailto:bibliotechdosdev@gmail.com" style={styles.link}>
                bibliotechdosdev@gmail.com
              </a>
              .
            </Li>
            <Li>
              A exclusão será realizada respeitando limitações técnicas,
              registros de segurança, backups e obrigações legais.
            </Li>
          </ul>
        </Section>

        <Section id="seguranca" title="7) Segurança">
          <P>
            Adotamos boas práticas de segurança, como controle de acesso,
            proteção de dados em trânsito quando aplicável e uso de provedores
            de infraestrutura confiáveis. Mesmo assim, nenhum sistema é
            totalmente livre de riscos.
          </P>
        </Section>

        <Section id="menores" title="8) Menores de idade">
          <P>
            O Bibliotech pode ser usado por leitores de diferentes idades.
            Recomendamos acompanhamento de um responsável para crianças e
            adolescentes.
          </P>

          <P>
            Se um responsável identificar conteúdo ou informação que deva ser
            removida, pode solicitar pelo e-mail{" "}
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
            <p>© Bibliotech — Política de Privacidade</p>
          </footer>
        </Section>
      </main>
    </div>
  );
}
