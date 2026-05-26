import React, { useMemo, useRef, useState } from "react";
import "./ClientChatWidget.css";

/**
 * Widget flutuante para testar atendimento IA via BACKEND MB Tech.
 *
 * Fluxo correto:
 * ClientChatWidget -> Backend /api/chat-widget -> n8n -> Backend -> ClientChatWidget
 *
 * Variáveis aceitas no front:
 * VITE_CHAT_WIDGET_BACKEND_URL=https://mbtech-back-back.yph90z.easypanel.host/api/chat-widget
 *
 * ou, usando a API base:
 * VITE_API_URL=https://mbtech-back-back.yph90z.easypanel.host/api
 */
export default function ClientChatWidget({
  webhookUrl,
  clientProfile = {},
  title = "Atendimento IA",
  subtitle = "Teste IA n8n",
}) {
  const backendChatUrl = buildBackendChatUrl(webhookUrl);

  const [isOpen, setIsOpen] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const [visitorForm, setVisitorForm] = useState(() => ({
    name: clientProfile.userName || "",
    phone: onlyNumbers(clientProfile.userPhone) || "",
    email: clientProfile.userEmail || "",
    scenario: clientProfile.segment || "Agenda - Eventos",
    notes: "",
  }));

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  const inputRef = useRef(null);

  const normalizedProfile = useMemo(() => {
    const visitorName = String(visitorForm.name || clientProfile.userName || "Visitante Teste").trim();
    const visitorPhone = onlyNumbers(visitorForm.phone || clientProfile.userPhone || "5599999999999");
    const visitorEmail = String(visitorForm.email || clientProfile.userEmail || "").trim();
    const scenario = String(visitorForm.scenario || clientProfile.segment || "Agenda - Eventos").trim();
    const notes = String(visitorForm.notes || "").trim();

    return {
      clientId: clientProfile.clientId || "a95ec1d1-f8a8-4f50-8956-46ae42388422",
      clientName: clientProfile.clientName || "Danona Gourmet",
      tenantId:
        clientProfile.tenantId ||
        clientProfile.clientId ||
        "a95ec1d1-f8a8-4f50-8956-46ae42388422",

      instanceName:
        clientProfile.instanceName ||
        clientProfile.evolutionInstance ||
        "agentechatbot",

      evolutionInstance:
        clientProfile.evolutionInstance ||
        clientProfile.instanceName ||
        "agentechatbot",

      segment: scenario,
      assistantName: clientProfile.assistantName || "Assistente IA",
      userName: visitorName,
      userPhone: visitorPhone,
      userEmail: visitorEmail,
      testScenario: scenario,
      testNotes: notes,
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
      envChatBackendUrl: import.meta.env.VITE_CHAT_WIDGET_BACKEND_URL,
      envApiUrl: import.meta.env.VITE_API_URL,
      backendChatUrl,
      normalizedProfile,
    });

    if (!backendChatUrl) {
      addBotMessage(
        "Backend do chat não configurado. Defina VITE_CHAT_WIDGET_BACKEND_URL ou VITE_API_URL no .env do front."
      );

      console.warn("[ClientChatWidget] URL do backend vazia:", {
        webhookUrl,
        envChatBackendUrl: import.meta.env.VITE_CHAT_WIDGET_BACKEND_URL,
        envApiUrl: import.meta.env.VITE_API_URL,
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
        _testMode: true,
        _channel: "web-widget-test",
        _source: "client-web-widget",

        channel: "web-widget-test",
        source: "client-web-widget",
        clientId: normalizedProfile.clientId,
        clientName: normalizedProfile.clientName,
        tenantId: normalizedProfile.tenantId,
        segment: normalizedProfile.segment,

        instance: normalizedProfile.instanceName,
        instanceName: normalizedProfile.instanceName,
        evolutionInstance: normalizedProfile.evolutionInstance,

        name: normalizedProfile.userName,
        nome: normalizedProfile.userName,
        email: normalizedProfile.userEmail,
        phone: normalizedProfile.userPhone,
        number: normalizedProfile.userPhone,
        from: normalizedProfile.userPhone,
        contato: remoteJid,
        remoteJid,
        remoteJidAlt: remoteJid,

        testScenario: normalizedProfile.testScenario,
        testNotes: normalizedProfile.testNotes,
        scenario: normalizedProfile.testScenario,
        observacoesTeste: normalizedProfile.testNotes,

        message,
        text: message,
        mensagem: message,
        conversation: message,

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

        event: {
          event: "messages.upsert",
          instance: normalizedProfile.instanceName,
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

        visitor: {
          name: normalizedProfile.userName,
          phone: normalizedProfile.userPhone,
          email: normalizedProfile.userEmail,
          scenario: normalizedProfile.testScenario,
          notes: normalizedProfile.testNotes,
        },

        profile: normalizedProfile,
      };

      console.log("[ClientChatWidget] Enviando payload para o backend:", {
        backendChatUrl,
        payload,
      });

      const response = await fetch(backendChatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await safeReadJson(response);

      console.log("[ClientChatWidget] Resposta do backend:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Erro ao chamar o backend do chat. Status HTTP: ${response.status}`;

        addBotMessage(errorMessage);

        console.error("[ClientChatWidget] Erro HTTP backend:", {
          status: response.status,
          data,
        });

        return;
      }

      const reply = extractReply(data);

      addBotMessage(String(reply));
    } catch (error) {
      console.error("[ClientChatWidget] Erro completo ao chamar backend:", {
        error,
        message: error?.message,
        backendChatUrl,
      });

      addBotMessage(
        "Não consegui conectar ao backend do chat. Verifique se a URL /api/chat-widget está correta e se o backend está publicado."
      );
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
              <label>
                Nome
                <input
                  value={visitorForm.name}
                  onChange={(event) => updateVisitorField("name", event.target.value)}
                  placeholder="Seu nome"
                />
              </label>

              <label>
                Telefone
                <input
                  value={visitorForm.phone}
                  onChange={(event) => updateVisitorField("phone", event.target.value)}
                  placeholder="5599999999999"
                />
              </label>

              <label>
                E-mail
                <input
                  value={visitorForm.email}
                  onChange={(event) => updateVisitorField("email", event.target.value)}
                  placeholder="email@exemplo.com"
                />
              </label>

              <label>
                Cenário de teste
                <input
                  value={visitorForm.scenario}
                  onChange={(event) => updateVisitorField("scenario", event.target.value)}
                  placeholder="Agenda - Eventos"
                />
              </label>

              <label>
                Observações
                <textarea
                  value={visitorForm.notes}
                  onChange={(event) => updateVisitorField("notes", event.target.value)}
                  placeholder="Ex.: testar orçamento de festa para 60 pessoas"
                  rows={3}
                />
              </label>

              {formError && <div className="client-chat-form-error">{formError}</div>}

              <button type="submit">Iniciar conversa</button>
            </form>
          ) : (
            <>
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

                <button type="submit" disabled={isSending || !inputText.trim()}>
                  Enviar
                </button>
              </form>

              <button
                type="button"
                className="client-chat-reset"
                onClick={handleResetVisitor}
                disabled={isSending}
              >
                Trocar perfil de teste
              </button>
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

function buildBackendChatUrl(webhookUrl) {
  if (webhookUrl) return webhookUrl;

  const directBackendUrl = import.meta.env.VITE_CHAT_WIDGET_BACKEND_URL;
  if (directBackendUrl) return directBackendUrl;

  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return `${String(apiUrl).replace(/\/$/, "")}/chat-widget`;
  }

  // Mantido apenas como fallback temporário para não quebrar ambientes antigos.
  // O ideal agora é chamar o backend, não o n8n direto.
  return import.meta.env.VITE_N8N_TEST_CHAT_WEBHOOK_URL || "";
}

function extractReply(data) {
  const reply =
    data?.reply ||
    data?.response ||
    data?.message ||
    data?.text ||
    data?.output ||
    data?.resposta ||
    data?.responseText ||
    data?.n8n?.reply ||
    data?.n8n?.response ||
    data?.n8n?.message ||
    "Recebi sua mensagem, mas o backend não retornou um campo de resposta reconhecido.";

  return reply;
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

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
