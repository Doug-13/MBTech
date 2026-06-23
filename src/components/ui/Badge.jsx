export default function Badge({ status, children, className = "" }) {
  const normalizedStatus = String(status || "").toLowerCase();

  const styleMap = {
    ativo: "badge-green",
    active: "badge-green",
    confirmado: "badge-green",
    confirmed: "badge-green",
    conectado: "badge-green",
    connected: "badge-green",

    pendente: "badge-amber",
    pending: "badge-amber",
    inativo: "badge-amber",
    inactive: "badge-amber",
    negociando: "badge-amber",

    cancelado: "badge-red",
    canceled: "badge-red",
    cancelled: "badge-red",
    erro: "badge-red",
    error: "badge-red",
    revisao_humana: "badge-red",

    aberto: "badge-blue",
    open: "badge-blue",
    novo_lead: "badge-blue",
  };

  const labelMap = {
    ativo: "Ativo",
    active: "Ativo",
    confirmado: "Confirmado",
    confirmed: "Confirmado",
    conectado: "Conectado",
    connected: "Conectado",

    pendente: "Pendente",
    pending: "Pendente",
    inativo: "Inativo",
    inactive: "Inativo",
    negociando: "Negociando",

    cancelado: "Cancelado",
    canceled: "Cancelado",
    cancelled: "Cancelado",
    erro: "Erro",
    error: "Erro",
    revisao_humana: "Revisão humana",

    aberto: "Aberto",
    open: "Aberto",
    novo_lead: "Novo lead",
  };

  return (
    <span
      className={`badge ${styleMap[normalizedStatus] || "badge-amber"} ${className}`}
    >
      {children || labelMap[normalizedStatus] || status || "—"}
    </span>
  );
}