import { NavLink, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './Layout.css'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/pecas', label: 'Peças', icon: '◈' },
]

export default function Layout() {
  const nome = useAuthStore((state) => state.nome)
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__logo">Vivante</div>
        <nav className="layout__nav">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `layout__nav-item${isActive ? ' layout__nav-item--ativo' : ''}`
              }
            >
              <span className="layout__nav-icon">{icon}</span>
              <span className="layout__nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="layout__corpo">
        <header className="layout__header">
          <div className="layout__header-usuario">
            <span className="layout__header-nome">{nome}</span>
            <button type="button" className="layout__header-logout" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        <main className="layout__conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
