import React, { useMemo, useRef, useState } from "react";
import "./ClientChatWidget.css";

/**
 * Widget flutuante para testar atendimento IA via n8n.
 *
 * Uso:
 *
 * <ClientChatWidget
 *   clientProfile={{
 *     clientId: company?.id,
 *     clientName: company?.name,
 *     tenantId: company?.id,
 *     segment: "eventos",
 *     assistantName: `Assistente ${company?.name}`,
 *     userName: user?.name,
 *     userPhone: user?.phone,
 *   }}
 * />
 *
 * Também pode usar:
 *
 * <ClientChatWidget
 *   webhookUrl="https://SEU-N8N/webhook-test/teste-chat"
 *   clientProfile={{ ... }}
 * />
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

  const [messages, setMessages] = useState(() => [
    {
      id: cryptoRandomId(),
      role: "bot",
      text: `Olá! Eu sou o ${
        clientProfile.assistantName || "assistente virtual"
      }. Como posso ajudar?`,
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
      tenantId:
        clientProfile.tenantId ||
        clientProfile.clientId ||
        "tenant-teste",
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

        // Dados do usuário/contato
        name: normalizedProfile.userName,
        nome: normalizedProfile.userName,
        phone: normalizedProfile.userPhone,
        number: normalizedProfile.userPhone,
        from: normalizedProfile.userPhone,
        contato: remoteJid,
        remoteJid,

        // Mensagem em vários formatos para facilitar o reaproveitamento do workflow atual
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

        // Payload fake no padrão parecido com Evolution
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
      };

      console.log("[ClientChatWidget] Enviando mensagem para n8n:", {
        finalWebhookUrl,
        message,
        clientId: normalizedProfile.clientId,
        clientName: normalizedProfile.clientName,
        phone: normalizedProfile.userPhone,
      });

      console.log("[ClientChatWidget] Payload completo:", payload);

      const response = await fetch(finalWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await safeReadJson(response);

      console.log("[ClientChatWidget] Status HTTP n8n:", response.status);

      console.log("[ClientChatWidget] Resposta bruta do n8n:", {
        ok: response.ok,
        status: response.status,
        data,
      });

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          `Erro ao chamar o n8n. Status HTTP: ${response.status}`;

        addBotMessage(errorMessage);

        console.error("[ClientChatWidget] Erro HTTP n8n:", {
          status: response.status,
          data,
        });

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
      console.error("[ClientChatWidget] Erro completo ao chamar n8n:", {
        error,
        message: error?.message,
        finalWebhookUrl,
      });

      addBotMessage(
        "Não consegui conectar ao n8n. Verifique se a URL do webhook está correta, se o n8n está ouvindo e se o CORS está liberado."
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