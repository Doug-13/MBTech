export const TODAY = new Date().toISOString().slice(0, 10);

export const WEEK_PT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function fmtDate(value) {
  if (!value) return "—";

  const parts = String(value).slice(0, 10).split("-");

  if (parts.length !== 3) return String(value);

  const [, month, day] = parts;

  return `${day}/${month}`;
}

export function fmtDateFull(value) {
  if (!value) return "—";

  const parts = String(value).slice(0, 10).split("-");

  if (parts.length !== 3) return String(value);

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

export function getWeekDays(baseDate = TODAY) {
  const date = new Date(`${baseDate}T12:00:00`);
  const dayOfWeek = date.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);

    return day.toISOString().slice(0, 10);
  });
}

export function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function getErrorMessage(error) {
  if (error?.message) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

export function isPublicPolicyPath(pathname) {
  const cleanPath =
    String(pathname || "/").replace(/\/+$/, "") || "/";

  return [
    "/politicas",
    "/politicas/bibliotech",
    "/politicas/churchapp",
    "/politicas/excluir-conta-churchapp",
    "/politicas/seguranca-infantil-churchapp",
  ].includes(cleanPath);
}