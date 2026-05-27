import React, { useMemo, useRef, useState } from "react";
import "./ClientChatWidget.css";

type ClientProfile = {
  clientId?: string;
  clientName?: string;
  tenantId?: string;
  companyId?: string;
  companyName?: string;
  segment?: string;
  assistantName?: string;
  instanceName?: string;
  evolutionInstance?: string;
  displayPhoneNumber?: string;
  businessPhone?: string;
};

type VisitorProfile = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  createdAt: string;
};

type ClientChatWidgetProps = {
  backendUrl?: string;
  clientProfile?: ClientProfile;
  title?: string;
  subtitle?: string;
};

const DEFAULT_BACKEND_URL =
  "https://mbtech-back-back.yph90z.easypanel.host/api/chat-widget";

export default function ClientChatWidget({
  backendUrl,
  clientProfile = {},
  title = "Atendimento IA",
  subtitle = "Teste do assistente",
}: ClientChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);

  const [visitor, setVisitor] = useState<VisitorProfile>(() => ({
    name: "",
    phone: "",
    email: "",
    notes: "",
  }));

  const [visitorForm, setVisitorForm] = useState<VisitorProfile>(() => ({
    name: "",
    phone: "",
    email: "",
    notes: "",
  }));

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: cryptoRandomId(),
      role: "bot",
      text: "Olá! Para iniciar o atendimento, informe seu nome e telefone.",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const finalBackendUrl = useMemo(() => {
    if (backendUrl) return backendUrl;

    const directBackendUrl = import.meta.env.VITE_CHAT_WIDGET_BACKEND_URL;
    if (directBackendUrl) return directBackendUrl;

    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) return `${String(apiUrl).replace(/\/$/, "")}/chat-widget`;

    return DEFAULT_BACKEND_URL;
  }, [backendUrl]);

  const normalizedProfile = useMemo(() => {
    return {
      clientId:
        clientProfile.clientId ||
        clientProfile.companyId ||
        "a95ec1d1-f8a8-4f50-8956-46ae42388422",
      clientName:
        clientProfile.clientName ||
        clientProfile.companyName ||
        "Danona Gourmet",
      tenantId:
        clientProfile.tenantId ||
        clientProfile.companyId ||
        clientProfile.clientId ||
        "a95ec1d1-f8a8-4f50-8956-46ae42388422",
      segment: clientProfile.segment || "Agenda - Eventos",
      assistantName: clientProfile.assistantName || "Assistente IA",
      instanceName: clientProfile.instanceName || "agentechatbot",
      evolutionInstance:
        clientProfile.evolutionInstance ||
        clientProfile.instanceName ||
        "agentechatbot",
      displayPhoneNumber:
        onlyNumbers(clientProfile.displayPhoneNumber) ||
        onlyNumbers(clientProfile.businessPhone) ||
        "555192883720",
      channel: "web-widget-test",
    };
  }, [clientProfile]);

  function toggleChat() {
    setIsOpen((current) => {
      const next = !current;

      setTimeout(() => {
        if (!next) return;
        if (!isIdentified && nameRef.current) nameRef.current.focus();
        if (isIdentified && inputRef.current) inputRef.current.focus();
      }, 100);

      return next;
    });
  }

  function updateVisitorForm(field: keyof VisitorProfile, value: string) {
    setVisitorForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleIdentificationSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = visitorForm.name.trim();
    const phone = onlyNumbers(visitorForm.phone);
    const email = visitorForm.email.trim();
    const notes = visitorForm.notes.trim();

    if (!name) {
      setFormError("Informe seu nome para iniciar o atendimento.");
      return;
    }

    if (!phone || phone.length < 10) {
      setFormError("Informe um telefone válido com DDD.");
      return;
    }

    const identifiedVisitor = {
      name,
      phone: ensureBrazilPhone(phone),
      email,
      notes,
    };

    setVisitor(identifiedVisitor);
    setIsIdentified(true);
    setFormError("");

    setMessages([
      {
        id: cryptoRandomId(),
        role: "bot",
        text: `Olá, ${firstName(name)}! Atendimento iniciado. Como posso ajudar?`,
        createdAt: new Date().toISOString(),
      },
    ]);

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function resetIdentification() {
    setIsIdentified(false);
    setVisitor({ name: "", phone: "", email: "", notes: "" });
    setVisitorForm({ name: "", phone: "", email: "", notes: "" });
    setInputText("");
    setFormError("");
    setMessages([
      {
        id: cryptoRandomId(),
        role: "bot",
        text: "Olá! Para iniciar o atendimento, informe seu nome e telefone.",
        createdAt: new Date().toISOString(),
      },
    ]);
    setTimeout(() => nameRef.current?.focus(), 100);
  }

  function addBotMessage(text: string) {
    setMessages((current) => [
      ...current,
      {
        id: cryptoRandomId(),
        role: "bot",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = inputText.trim();
    if (!message || isSending) return;

    if (!isIdentified) {
      addBotMessage("Antes de continuar, informe seu nome e telefone.");
      return;
    }

    if (!finalBackendUrl) {
      addBotMessage(
        "Backend do chat não configurado. Defina VITE_CHAT_WIDGET_BACKEND_URL ou VITE_API_URL no .env do front."
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: cryptoRandomId(),
      role: "user",
      text: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setInputText("");
    setIsSending(true);

    try {
      const remoteJid = `${visitor.phone}@s.whatsapp.net`;
      const fakeMessageId = `widget-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const nowTimestamp = Math.floor(Date.now() / 1000);

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

        display_phone_number: normalizedProfile.displayPhoneNumber,
        displayPhoneNumber: normalizedProfile.displayPhoneNumber,
        businessPhone: normalizedProfile.displayPhoneNumber,
        business_phone: normalizedProfile.displayPhoneNumber,
        recipientPhone: normalizedProfile.displayPhoneNumber,
        recipient_phone: normalizedProfile.displayPhoneNumber,
        phoneNumber: normalizedProfile.displayPhoneNumber,
        phone_number: normalizedProfile.displayPhoneNumber,
        sender: normalizedProfile.displayPhoneNumber,
        remetente: normalizedProfile.displayPhoneNumber,

        name: visitor.name,
        nome: visitor.name,
        customerName: visitor.name,
        pushName: visitor.name,

        phone: visitor.phone,
        number: visitor.phone,
        from: visitor.phone,
        customerPhone: visitor.phone,
        contato: remoteJid,
        remoteJid,
        remoteJidAlt: remoteJid,

        email: visitor.email,
        testScenario: normalizedProfile.segment,
        testNotes: visitor.notes,

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

        visitor: {
          name: visitor.name,
          phone: visitor.phone,
          email: visitor.email,
          scenario: normalizedProfile.segment,
          notes: visitor.notes,
        },

        profile: {
          ...normalizedProfile,
          userName: visitor.name,
          userPhone: visitor.phone,
          userEmail: visitor.email,
          userNotes: visitor.notes,
        },

        event: "messages.upsert",

        data: {
          key: {
            remoteJid,
            remoteJidAlt: remoteJid,
            fromMe: false,
            id: fakeMessageId,
            addressingMode: "web-widget",
          },
          pushName: visitor.name,
          message: {
            conversation: message,
          },
          messageType: "conversation",
          messageTimestamp: nowTimestamp,
          date_time: nowIso,
          instanceId: normalizedProfile.clientId,
          server_url: "web-widget-test",
          source: "client-web-widget",

          display_phone_number: normalizedProfile.displayPhoneNumber,
          displayPhoneNumber: normalizedProfile.displayPhoneNumber,
          businessPhone: normalizedProfile.displayPhoneNumber,
          business_phone: normalizedProfile.displayPhoneNumber,
          recipientPhone: normalizedProfile.displayPhoneNumber,
          recipient_phone: normalizedProfile.displayPhoneNumber,
          phoneNumber: normalizedProfile.displayPhoneNumber,
          phone_number: normalizedProfile.displayPhoneNumber,
          sender: normalizedProfile.displayPhoneNumber,
          remetente: normalizedProfile.displayPhoneNumber,

          email: visitor.email,
          testScenario: normalizedProfile.segment,
          testNotes: visitor.notes,
          visitor: {
            name: visitor.name,
            phone: visitor.phone,
            email: visitor.email,
            scenario: normalizedProfile.segment,
            notes: visitor.notes,
          },
        },
      };

      console.log("[ClientChatWidget] Enviando mensagem para backend:", {
        finalBackendUrl,
        clientId: normalizedProfile.clientId,
        clientName: normalizedProfile.clientName,
        name: visitor.name,
        phone: visitor.phone,
        message,
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
        data?.responseText ||
        "Recebi sua mensagem, mas o backend não retornou um campo de resposta reconhecido.";

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
            <span>{isIdentified ? "Contato ativo:" : "Identificação necessária"}</span>
            <strong>
              {isIdentified ? `${firstName(visitor.name)} • ${formatPhone(visitor.phone)}` : normalizedProfile.segment}
            </strong>
          </div>

          {!isIdentified ? (
            <form className="client-chat-identification" onSubmit={handleIdentificationSubmit}>
              <div className="client-chat-identification-intro">
                <strong>Antes de começar</strong>
                <span>Informe seus dados para a IA manter o contexto do atendimento.</span>
              </div>

              {formError && <div className="client-chat-form-error">{formError}</div>}

              <label className="client-chat-field">
                <span>Nome *</span>
                <input
                  ref={nameRef}
                  value={visitorForm.name}
                  onChange={(event) => updateVisitorForm("name", event.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </label>

              <label className="client-chat-field">
                <span>Telefone com DDD *</span>
                <input
                  value={visitorForm.phone}
                  onChange={(event) => updateVisitorForm("phone", event.target.value)}
                  placeholder="(51) 99999-9999"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </label>

              <label className="client-chat-field">
                <span>E-mail</span>
                <input
                  value={visitorForm.email}
                  onChange={(event) => updateVisitorForm("email", event.target.value)}
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>

              <label className="client-chat-field">
                <span>O que você procura?</span>
                <textarea
                  value={visitorForm.notes}
                  onChange={(event) => updateVisitorForm("notes", event.target.value)}
                  placeholder="Ex.: orçamento para festa de 15 anos, casamento, evento corporativo..."
                  rows={3}
                />
              </label>

              <button type="submit" className="client-chat-start-button">
                Iniciar atendimento
              </button>
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

              <div className="client-chat-context-bar">
                <span>{visitor.name}</span>
                <button type="button" onClick={resetIdentification} disabled={isSending}>
                  Trocar contato
                </button>
              </div>

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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.8C4 4.80589 4.80589 4 5.8 4H18.2C19.1941 4 20 4.80589 20 5.8V14.2C20 15.1941 19.1941 16 18.2 16H9.5L5.8 19.2C5.14579 19.7655 4.125 19.3006 4.125 18.4358V16.0156C4.05347 16.0054 4 15.944 4 15.8717V5.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 9H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 12H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

async function safeReadJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function onlyNumbers(value: unknown) {
  return String(value || "").replace(/\D/g, "");
}

function ensureBrazilPhone(value: string) {
  const digits = onlyNumbers(value);
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

function formatPhone(value: string) {
  const digits = onlyNumbers(value);
  const local = digits.startsWith("55") ? digits.slice(2) : digits;

  if (local.length === 11) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  }

  if (local.length === 10) {
    return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  }

  return value;
}

function firstName(value: string) {
  return String(value || "").trim().split(/\s+/)[0] || "tudo bem";
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
