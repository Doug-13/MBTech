import React, { useMemo, useState } from "react";
import "./ClientChatWidget.css";

/**
 * Widget flutuante para atendimento IA via backend.
 *
 * Fluxo:
 * 1. Usuário abre o chat.
 * 2. Antes de conversar, informa nome, telefone, e-mail e contexto.
 * 3. O componente envia as mensagens para o backend:
 *    https://mbtech-back-back.yph90z.easypanel.host/api/chat-widget
 * 4. O backend chama o webhook do n8n.
 *
 * Exemplo de uso:
 *
 * <ClientChatWidget
 *   backendUrl="https://mbtech-back-back.yph90z.easypanel.host/api/chat-widget"
 *   clientProfile={{
 *     clientId: company?.id || "a95ec1d1-f8a8-4f50-8956-46ae42388422",
 *     clientName: company?.name || "Danona Gourmet",
 *     tenantId: company?.id || "a95ec1d1-f8a8-4f50-8956-46ae42388422",
 *     instanceName: "agentechatbot",
 *     evolutionInstance: "agentechatbot",
 *     segment: "Agenda - Eventos",
 *     assistantName: `Assistente ${company?.name || "Danona Gourmet"}`,
 *   }}
 * />
 */

export default function ClientChatWidget({
  backendUrl,
  clientProfile = {},
  title = "Atendimento IA",
  subtitle = "Teste do assistente",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const [visitorForm, setVisitorForm] = useState(() => ({
    name: "",
    phone: "",
    email: "",
    scenario: clientProfile.segment || "Agenda - Eventos",
    notes: "",
  }));

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  const finalBackendUrl = useMemo(() => {
    if (backendUrl) return backendUrl;

    const directBackendUrl = import.meta.env.VITE_CHAT_WIDGET_BACKEND_URL;

    if (directBackendUrl) {
      return directBackendUrl;
    }

    const apiUrl = import.meta.env.VITE_API_URL;

    if (apiUrl) {
      return `${String(apiUrl).replace(/\/$/, "")}/chat-widget`;
    }

    return "";
  }, [backendUrl]);

  const normalizedProfile = useMemo(() => {
    const visitorName = String(visitorForm.name || "").trim();
    const visitorPhone = onlyNumbers(visitorForm.phone || "");

    return {
      clientId:
        clientProfile.clientId || clientProfile.companyId || "cliente-teste",

      clientName:
        clientProfile.clientName ||
        clientProfile.companyName ||
        "Cliente Teste",

      tenantId:
        clientProfile.tenantId || clientProfile.companyId || "tenant-teste",

      segment:
        visitorForm.scenario ||
        clientProfile.segment ||
        "Agenda - Eventos",

      assistantName: clientProfile.assistantName || "Assistente IA",

      userName: visitorName,
      userPhone: visitorPhone,
      userEmail: String(visitorForm.email || "").trim(),
      testScenario: visitorForm.scenario || "Agenda - Eventos",
      testNotes: String(visitorForm.notes || "").trim(),

      instanceName: clientProfile.instanceName || "agentechatbot",

      evolutionInstance:
        clientProfile.evolutionInstance ||
        clientProfile.instanceName ||
        "agentechatbot",

      channel: "web-widget-test",
    };
  }, [clientProfile, visitorForm]);

  function toggleChat() {
    setIsOpen((current) => !current);
  }

  function updateVisitorField(field, value) {
    setVisitorForm((current) => ({
      ...current,
      [field]: field === "phone" ? onlyNumbers(value) : value,
    }));

    if (formError) {
      setFormError("");
    }
  }

  function handleStartChat(event) {
    event.preventDefault();

    const name = String(visitorForm.name || "").trim();
    const phone = onlyNumbers(visitorForm.phone || "");

    if (!name) {
      setFormError("Informe o nome para iniciar o atendimento.");
      return;
    }

    if (!phone) {
      setFormError("Informe o telefone para iniciar o atendimento.");
      return;
    }

    if (phone.length < 10) {
      setFormError("Informe um telefone válido com DDD.");
      return;
    }

    setMessages([
      {
        id: makeChatId(),
        role: "bot",
        text: `Olá, ${name}! Eu sou o ${
          clientProfile.assistantName || "Assistente IA"
        }. Como posso ajudar?`,
        createdAt: new Date().toISOString(),
      },
    ]);

    setHasStartedChat(true);
  }

  function handleResetVisitor() {
    setHasStartedChat(false);
    setMessages([]);
    setInputText("");
    setFormError("");

    setVisitorForm((current) => ({
      ...current,
      name: "",
      phone: "",
      email: "",
      notes: "",
    }));
  }

  function addBotMessage(text) {
    setMessages((current) => [
      ...current,
      {
        id: makeChatId(),
        role: "bot",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = inputText.trim();

    if (!message || isSending) return;

    if (!hasStartedChat) {
      setFormError("Preencha seus dados antes de iniciar a conversa.");
      return;
    }

    if (!finalBackendUrl) {
      addBotMessage(
        "Backend do chat não configurado. Defina VITE_CHAT_WIDGET_BACKEND_URL ou VITE_API_URL no .env do front."
      );
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: makeChatId(),
        role: "user",
        text: message,
        createdAt: new Date().toISOString(),
      },
    ]);

    setInputText("");
    setIsSending(true);

    try {
      const payload = {
        _testMode: true,
        _channel: "web-widget-test",
        _source: "client-web-widget",

        channel: normalizedProfile.channel,
        source: "client-web-widget",

        clientId: normalizedProfile.clientId,
        clientName: normalizedProfile.clientName,
        tenantId: normalizedProfile.tenantId,
        segment: normalizedProfile.segment,

        instanceName: normalizedProfile.instanceName,
        evolutionInstance: normalizedProfile.evolutionInstance,
        instance: normalizedProfile.instanceName,

        name: normalizedProfile.userName,
        nome: normalizedProfile.userName,
        customerName: normalizedProfile.userName,
        pushName: normalizedProfile.userName,

        phone: normalizedProfile.userPhone,
        number: normalizedProfile.userPhone,
        from: normalizedProfile.userPhone,
        customerPhone: normalizedProfile.userPhone,

        email: normalizedProfile.userEmail,
        customerEmail: normalizedProfile.userEmail,

        remoteJid: `${normalizedProfile.userPhone}@web-widget.local`,
        remoteJidAlt: `${normalizedProfile.userPhone}@web-widget.local`,
        contato: `${normalizedProfile.userPhone}@web-widget.local`,

        message,
        text: message,
        mensagem: message,
        conversation: message,

        testScenario: normalizedProfile.testScenario,
        scenario: normalizedProfile.testScenario,
        testNotes: normalizedProfile.testNotes,
        observacoesTeste: normalizedProfile.testNotes,

        messageType: "conversation",
        fromMe: false,
        isFromMe: false,
        isGroup: false,
        isStatus: false,
        isBroadcast: false,
        timestamp: new Date().toISOString(),

        event: {
          event: "messages.upsert",
          instance: normalizedProfile.instanceName,
          server_url: "web-widget-test",
          apikey: "web-widget-test",
          Info: {
            Type: "conversation",
            PushName: normalizedProfile.userName,
            Sender: `${normalizedProfile.userPhone}@web-widget.local`,
            Chat: `${normalizedProfile.userPhone}@web-widget.local`,
            FromMe: false,
          },
          Message: {
            conversation: message,
          },
        },

        visitor: {
          name: normalizedProfile.userName,
          phone: normalizedProfile.userPhone,
          email: normalizedProfile.userEmail,
          scenario: normalizedProfile.testScenario,
          notes: normalizedProfile.testNotes,
        },

        profile: {
          ...normalizedProfile,
          name: normalizedProfile.userName,
          phone: normalizedProfile.userPhone,
          email: normalizedProfile.userEmail,
        },
      };

      console.log("[ClientChatWidget] Enviando mensagem para backend:", {
        finalBackendUrl,
        payload,
      });

      const response = await fetch(finalBackendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await safeReadJson(response);

      console.log("[ClientChatWidget] Resposta do backend:", {
        ok: response.ok,
        status: response.status,
        data,
      });

      if (!response.ok) {
        addBotMessage(
          data?.message ||
            data?.error ||
            `Erro ao chamar o backend do chat. Status HTTP: ${response.status}`
        );
        return;
      }

      const reply =
        data?.reply ||
        data?.response ||
        data?.message ||
        data?.text ||
        data?.output ||
        data?.resposta ||
        data?.resposta_ai ||
        data?.n8n?.reply ||
        data?.n8n?.response ||
        data?.n8n?.message ||
        data?.n8n?.resposta ||
        data?.n8n?.resposta_ai ||
        "Recebi sua mensagem, mas o backend não retornou o campo reply.";

      addBotMessage(String(reply));
    } catch (error) {
      console.error("[ClientChatWidget] Erro ao enviar mensagem:", error);

      addBotMessage(
        "Não consegui conectar ao backend do chat. Verifique se a API está publicada e se o CORS está liberado."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="client-chat-widget">
      {isOpen && (
        <section className="client-chat-window" aria-label="Chat de teste com IA">
          <header className="client-chat-header">
            <div>
              <strong>{title}</strong>
              <span>
                {subtitle} • {normalizedProfile.clientName}
              </span>
            </div>

            <button
              type="button"
              className="client-chat-close"
              onClick={toggleChat}
              aria-label="Fechar chat"
            >
              ×
            </button>
          </header>

          <div className="client-chat-profile">
            <span>Perfil ativo:</span>
            <strong>{normalizedProfile.segment}</strong>
          </div>

          {!hasStartedChat ? (
            <form className="client-chat-start-form" onSubmit={handleStartChat}>
              <div className="client-chat-start-title">Antes de começar</div>

              <p className="client-chat-start-description">
                Informe seus dados para que a IA consiga manter o contexto do
                atendimento.
              </p>

              {formError && (
                <div className="client-chat-form-error">{formError}</div>
              )}

              <label className="client-chat-field">
                <span>Nome *</span>
                <input
                  value={visitorForm.name}
                  onChange={(event) =>
                    updateVisitorField("name", event.target.value)
                  }
                  placeholder="Ex.: Douglas Mello"
                />
              </label>

              <label className="client-chat-field">
                <span>Telefone com DDD *</span>
                <input
                  value={visitorForm.phone}
                  onChange={(event) =>
                    updateVisitorField("phone", event.target.value)
                  }
                  placeholder="Ex.: 51999999999"
                  inputMode="numeric"
                />
              </label>

              <label className="client-chat-field">
                <span>E-mail</span>
                <input
                  value={visitorForm.email}
                  onChange={(event) =>
                    updateVisitorField("email", event.target.value)
                  }
                  placeholder="Ex.: cliente@email.com"
                  type="email"
                />
              </label>

              <label className="client-chat-field">
                <span>O que você procura?</span>
                <select
                  value={visitorForm.scenario}
                  onChange={(event) =>
                    updateVisitorField("scenario", event.target.value)
                  }
                >
                  <option value="Agenda - Eventos">Agenda - Eventos</option>
                  <option value="Orçamento">Orçamento</option>
                  <option value="Dúvidas sobre serviços">
                    Dúvidas sobre serviços
                  </option>
                  <option value="Contrato">Contrato</option>
                  <option value="Suporte">Suporte</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>

              <label className="client-chat-field">
                <span>Observações</span>
                <textarea
                  value={visitorForm.notes}
                  onChange={(event) =>
                    updateVisitorField("notes", event.target.value)
                  }
                  placeholder="Ex.: Quero orçamento para uma festa de 15 anos com 60 pessoas."
                  rows={3}
                />
              </label>

              <button type="submit" className="client-chat-start-button">
                Iniciar conversa
              </button>
            </form>
          ) : (
            <>
              <div className="client-chat-visitor-bar">
                <div>
                  <strong>{normalizedProfile.userName}</strong>
                  <span>{formatPhone(normalizedProfile.userPhone)}</span>
                </div>

                <button type="button" onClick={handleResetVisitor}>
                  Trocar dados
                </button>
              </div>

              <main className="client-chat-messages">
                {messages.map((messageItem) => (
                  <div
                    key={messageItem.id}
                    className={
                      messageItem.role === "user"
                        ? "client-chat-message client-chat-message-user"
                        : "client-chat-message client-chat-message-bot"
                    }
                  >
                    {messageItem.text}
                  </div>
                ))}

                {isSending && (
                  <div className="client-chat-message client-chat-message-bot client-chat-loading">
                    Digitando...
                  </div>
                )}
              </main>

              <form className="client-chat-form" onSubmit={handleSubmit}>
                <input
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={isSending}
                />

                <button type="submit" disabled={isSending || !inputText.trim()}>
                  Enviar
                </button>
              </form>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        className="client-chat-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
      >
        {isOpen ? "×" : <BotIcon />}
      </button>
    </div>
  );
}

function BotIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="11"
        width="18"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="5"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 16h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 16h.01"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

async function safeReadJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPhone(value) {
  const only = onlyNumbers(value);

  if (!only) return "Sem telefone";

  if (only.length === 13) {
    return `+${only.slice(0, 2)} (${only.slice(2, 4)}) ${only.slice(
      4,
      9
    )}-${only.slice(9)}`;
  }

  if (only.length === 11) {
    return `(${only.slice(0, 2)}) ${only.slice(2, 7)}-${only.slice(7)}`;
  }

  if (only.length === 10) {
    return `(${only.slice(0, 2)}) ${only.slice(2, 6)}-${only.slice(6)}`;
  }

  return only;
}

function makeChatId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
