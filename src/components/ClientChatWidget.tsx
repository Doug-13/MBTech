import React, { useMemo, useRef, useState } from "react";
import "./ClientChatWidget.css";

/**
 * Widget flutuante para testar atendimento IA via n8n.
 *
 * Uso:
 * <ClientChatWidget
 *   webhookUrl="https://SEU-N8N/webhook/teste-chat"
 *   clientProfile={{
 *     clientId: "cliente-001",
 *     clientName: "MB Agenda IA",
 *     tenantId: "tenant-mb",
 *     segment: "eventos",
 *     assistantName: "Assistente MB",
 *     userName: "Douglas",
 *     userPhone: "5599999999999"
 *   }}
 * />
 */
export default function ClientChatWidget({
  webhookUrl,
  clientProfile = {},
  title = "Atendimento IA",
  subtitle = "Teste do assistente",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      id: cryptoRandomId(),
      role: "bot",
      text: `Olá! Eu sou o ${clientProfile.assistantName || "assistente virtual"}. Como posso ajudar?`,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);

  const normalizedProfile = useMemo(() => {
    return {
      clientId: clientProfile.clientId || "cliente-teste",
      clientName: clientProfile.clientName || "Cliente Teste",
      tenantId: clientProfile.tenantId || "tenant-teste",
      segment: clientProfile.segment || "geral",
      assistantName: clientProfile.assistantName || "Assistente IA",
      userName: clientProfile.userName || "Visitante Teste",
      userPhone: onlyNumbers(clientProfile.userPhone) || "5599999999999",
      channel: "web-widget-test",
    };
  }, [clientProfile]);

  function toggleChat() {
    setIsOpen((current) => {
      const next = !current;

      setTimeout(() => {
        if (next && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const message = inputText.trim();

    if (!message || isSending) {
      return;
    }

    if (!webhookUrl) {
      addBotMessage("Webhook do n8n não configurado. Informe a URL em webhookUrl.");
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
      const payload = {
        channel: normalizedProfile.channel,
        source: "client-web-widget",
        clientId: normalizedProfile.clientId,
        clientName: normalizedProfile.clientName,
        tenantId: normalizedProfile.tenantId,
        segment: normalizedProfile.segment,
        name: normalizedProfile.userName,
        phone: normalizedProfile.userPhone,
        from: normalizedProfile.userPhone,
        remoteJid: `${normalizedProfile.userPhone}@web-widget.local`,
        message,
        text: message,
        messageType: "conversation",
        fromMe: false,
        timestamp: new Date().toISOString(),
        profile: normalizedProfile,
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await safeReadJson(response);

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
        <section className="client-chat-window" aria-label="Chat de teste com IA">
          <header className="client-chat-header">
            <div>
              <strong>{title}</strong>
              <span>{subtitle} • {normalizedProfile.clientName}</span>
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

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
