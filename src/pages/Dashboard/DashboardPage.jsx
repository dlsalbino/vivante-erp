import useAuthStore from '../../store/authStore'
import './DashboardPage.css'

export default function DashboardPage() {
  const nome = useAuthStore((state) => state.nome)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__titulo">Dashboard</h1>
        <div className="dashboard__usuario">
          <span>{nome}</span>
          <button type="button" className="dashboard__logout" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      <main className="dashboard__conteudo">
        <p className="dashboard__placeholder">
          Painel em construção. As métricas e relatórios serão adicionados em breve.
        </p>
      </main>
    </div>
  )
}
