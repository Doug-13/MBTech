export default function LoadingPage({ text = "Carregando dados..." }) {
  return (
    <div className="page">
      <div className="card p24 loading-page-card">
        <span className="spinner" />
        <div className="tx-meta loading-page-text">{text}</div>
      </div>
    </div>
  );
}