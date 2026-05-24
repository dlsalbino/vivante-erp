import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginService } from '../../services/authService'
import useAuthStore from '../../store/authStore'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      const data = await loginService(email, senha)
      loginStore(data.token, data.nome, data.perfil)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setErro(err.message || 'Erro ao conectar com o servidor')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login">
      <div className="login__card">
        <h1 className="login__logo">Vivante Festas</h1>
        <p className="login__subtitulo">Painel administrativo</p>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__campo">
            <label htmlFor="email" className="login__label">E-mail</label>
            <input
              id="email"
              type="email"
              className="login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              disabled={carregando}
            />
          </div>

          <div className="login__campo">
            <label htmlFor="senha" className="login__label">Senha</label>
            <input
              id="senha"
              type="password"
              className="login__input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={carregando}
            />
          </div>

          {erro && (
            <p className="login__erro" role="alert">{erro}</p>
          )}

          <button
            type="submit"
            className="login__btn"
            disabled={carregando || !email || !senha}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
