import React, { useMemo, useRef, useState } from "react";
import "./ClientChatWidget.css";

/**
 * Widget flutuante para testar atendimento IA via n8n.
 *
 * Agora, antes de iniciar a conversa, o usuário preenche seus dados.
 * Isso permite testar vários perfis/cenários no mesmo cliente.
 */
export default function ClientChatWidget({
  webhookUrl,
  clientProfile = {},
  title = "Atendimento IA",
  subtitle = "Teste IA n8n",
}) {
  const finalWebhookUrl =
    webhookUrl ||
    import.meta.env.VITE_N8N_TEST_CHAT_WEBHOOK_URL ||
    "";

  const [isOpen, setIsOpen] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const [visitorForm, setVisitorForm] = useState(() => ({
    name: clientProfile.userName || "",
    phone: onlyNumbers(clientProfile.userPhone) || "",
    email: "",
    scenario: clientProfile.segment || "Agenda - Eventos",
    notes: "",
  }));

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  const inputRef = useRef(null);

  const normalizedProfile = useMemo(() => {
    const visitorName = visitorForm.name || clientProfile.userName || "Visitante Teste";
    const visitorPhone =
      onlyNumbers(visitorForm.phone) ||
      onlyNumbers(clientProfile.userPhone) ||
      "5599999999999";

    return {
      clientId: clientProfile.clientId || "cliente-teste",
      clientName: clientProfile.clientName || "Cliente Teste",
      tenantId:
        clientProfile.tenantId ||
        clientProfile.clientId ||
        "tenant-teste",
      segment: visitorForm.scenario || clientProfile.segment || "geral",
      assistantName: clientProfile.assistantName || "Assistente IA",
      userName: visitorName,
      userPhone: visitorPhone,
      userEmail: visitorForm.email || "",
      testScenario: visitorForm.scenario || "geral",
      testNotes: visitorForm.notes || "",
      channel: "web-widget-test",
    };
  }, [clientProfile, visitorForm]);

  function toggleChat() {
    setIsOpen((current) => {
      const next = !current;

      setTimeout(() => {
        if (next && hasStartedChat && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      return next;
    });
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
      setFormError("Informe o nome para iniciar o teste.");
      return;
    }

    if (!phone) {
      setFormError("Informe o telefone para iniciar o teste.");
      return;
    }

    const welcomeMessage = {
      id: cryptoRandomId(),
      role: "bot",
      text: `Olá, ${name}! Eu sou o ${normalizedProfile.assistantName}. Como posso ajudar?`,
      createdAt: new Date().toISOString(),
    };

    setMessages([welcomeMessage]);
    setHasStartedChat(true);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 120);
  }

  function handleResetVisitor() {
    setHasStartedChat(false);
    setMessages([]);
    setInputText("");
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = inputText.trim();

    if (!message || isSending) {
      return;
    }

    console.log("[ClientChatWidget] Configuração inicial:", {
      webhookUrl,
      envUrl: import.meta.env.VITE_N8N_TEST_CHAT_WEBHOOK_URL,
      finalWebhookUrl,
      normalizedProfile,
    });

    if (!finalWebhookUrl) {
      addBotMessage(
        "Webhook do n8n não configurado. Defina VITE_N8N_TEST_CHAT_WEBHOOK_URL no .env do front."
      );

      console.warn("[ClientChatWidget] Webhook vazio:", {
        webhookUrl,
        envUrl: import.meta.env.VITE_N8N_TEST_CHAT_WEBHOOK_URL,
        finalWebhookUrl,
      });

      return;
    }

    const userMessage = {
      id: cryptoRandomId(),
      role: "user",
      text: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputText("");
    setIsSending(true);

    try {
      const remoteJid = `${normalizedProfile.userPhone}@s.whatsapp.net`;
      const fakeMessageId = `widget-${Date.now()}`;
      const nowIso = new Date().toISOString();

      const payload = {
        // Controle interno para o n8n saber que veio do widget
        _testMode: true,
        _channel: "web-widget-test",
        _source: "client-web-widget",

        // Dados do cliente logado
        channel: "web-widget-test",
        source: "client-web-widget",
        clientId: normalizedProfile.clientId,
        clientName: normalizedProfile.clientName,
        tenantId: normalizedProfile.tenantId,
        segment: normalizedProfile.segment,

        // Dados do visitante/testador
        name: normalizedProfile.userName,
        nome: normalizedProfile.userName,
        email: normalizedProfile.userEmail,
        phone: normalizedProfile.userPhone,
        number: normalizedProfile.userPhone,
        from: normalizedProfile.userPhone,
        contato: remoteJid,
        remoteJid,

        // Dados extras para testar cenários diferentes
        testScenario: normalizedProfile.testScenario,
        testNotes: normalizedProfile.testNotes,
        scenario: normalizedProfile.testScenario,
        observacoesTeste: normalizedProfile.testNotes,

        // Mensagem
        message,
        text: message,
        mensagem: message,
        conversation: message,

        // Flags simulando WhatsApp/Evolution
        messageType: "conversation",
        fromMe: false,
        isFromMe: false,
        isGroup: false,
        isStatus: false,
        isBroadcast: false,
        isAudio: false,
        hasBinaryAudio: false,
        binaryFieldName: "",
        isValidMessage: true,

        timestamp: nowIso,

        // Simulação do payload Evolution
        event: {
          event: "messages.upsert",
          instance: normalizedProfile.clientId,
          server_url: "web-widget-test",
          apikey: "web-widget-test",

          Info: {
            Id: fakeMessageId,
            RemoteJid: remoteJid,
            RemoteJidAlt: remoteJid,
            Sender: remoteJid,
            PushName: normalizedProfile.userName,
            FromMe: false,
            IsGroup: false,
            IsBroadcast: false,
            IsStatus: false,
            Type: "conversation",
            MessageTimestamp: Math.floor(Date.now() / 1000),
          },

          Message: {
            conversation: message,
          },
        },

        profile: normalizedProfile,

        visitor: {
          name: normalizedProfile.userName,
          phone: normalizedProfile.userPhone,
          email: normalizedProfile.userEmail,
          scenario: normalizedProfile.testScenario,
          notes: normalizedProfile.testNotes,
        },
      };

      console.log("[ClientChatWidget] Enviando payload para n8n:", payload);

      const response = await fetch(finalWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await safeReadJson(response);

      console.log("[ClientChatWidget] Resposta do n8n:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Erro ao chamar o n8n. Status HTTP: ${response.status}`;

        addBotMessage(errorMessage);
        return;
      }

      const reply =
        data?.reply ||
        data?.response ||
        data?.message ||
        data?.text ||
        data?.output ||
        data?.resposta ||
        data?.responseText ||
        "Recebi sua mensagem, mas o n8n não retornou um campo de resposta reconhecido.";

      addBotMessage(String(reply));
    } catch (error) {
      addBotMessage(
        "Não consegui conectar ao n8n. Verifique se a URL do webhook está correta e se o CORS está liberado."
      );

      console.error("[ClientChatWidget] Erro ao enviar mensagem:", error);
    } finally {
      setIsSending(false);
    }
  }

  function addBotMessage(text) {
    const botMessage = {
      id: cryptoRandomId(),
      role: "bot",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, botMessage]);
  }

  return (
    <div className="client-chat-widget">
      {isOpen && (
        <section
          className="client-chat-window"
          aria-label="Chat de teste com IA"
        >
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
              <div className="client-chat-start-title">
                Dados para iniciar o teste
              </div>

              <p className="client-chat-start-description">
                Preencha os dados abaixo para simular diferentes clientes,
                contatos e cenários de atendimento.
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
                <span>Telefone *</span>
                <input
                  value={visitorForm.phone}
                  onChange={(event) =>
                    updateVisitorField("phone", event.target.value)
                  }
                  placeholder="Ex.: 5551999999999"
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
                <span>Cenário de teste</span>
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
                <span>Observações do teste</span>
                <textarea
                  value={visitorForm.notes}
                  onChange={(event) =>
                    updateVisitorField("notes", event.target.value)
                  }
                  placeholder="Ex.: Cliente quer casamento para 150 pessoas em outubro."
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
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "client-chat-message client-chat-message-user"
                        : "client-chat-message client-chat-message-bot"
                    }
                  >
                    {message.text}
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
                  ref={inputRef}
                  value={inputText}
                  onChange={(event) => setInputText(event.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={isSending}
                />

                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                >
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
        {isOpen ? "×" : <ChatIcon />}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 5.8C4 4.80589 4.80589 4 5.8 4H18.2C19.1941 4 20 4.80589 20 5.8V14.2C20 15.1941 19.1941 16 18.2 16H9.5L5.8 19.2C5.14579 19.7655 4.125 19.3006 4.125 18.4358V16.0156C4.05347 16.0054 4 15.944 4 15.8717V5.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 9H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 12H13"
        stroke="currentColor"
        strokeWidth="1.8"
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
    return `+${only.slice(0, 2)} (${only.slice(2, 4)}) ${only.slice(4, 9)}-${only.slice(9)}`;
  }

  if (only.length === 11) {
    return `(${only.slice(0, 2)}) ${only.slice(2, 7)}-${only.slice(7)}`;
  }

  return only;
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
