import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePecas } from '../../hooks/usePecas'
import './PecasPage.css'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function PecasPage() {
  const { pecas, loading, error, carregar, desativar, reativar } = usePecas()
  const [acao, setAcao] = useState(null)

  useEffect(() => {
    carregar()
  }, [carregar])

  async function handleToggle(peca) {
    setAcao(peca.id)
    try {
      if (peca.ativo) {
        await desativar(peca.id)
      } else {
        await reativar(peca.id)
      }
    } finally {
      setAcao(null)
    }
  }

  return (
    <div className="pecas">
      <div className="pecas__header">
        <h1 className="pecas__titulo">Peças</h1>
        <Link to="/pecas/nova" className="pecas__btn-novo">
          + Nova Peça
        </Link>
      </div>

      {loading && <div className="pecas__spinner">Carregando…</div>}

      {error && <div className="pecas__erro">{error}</div>}

      {!loading && !error && pecas.length === 0 && (
        <div className="pecas__vazio">
          <p>Nenhuma peça cadastrada ainda.</p>
          <Link to="/pecas/nova">Cadastrar primeira peça</Link>
        </div>
      )}

      {!loading && pecas.length > 0 && (
        <div className="pecas__tabela-wrap">
          <table className="pecas__tabela">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Qtd.</th>
                <th>Locação</th>
                <th>Reposição</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pecas.map((peca) => (
                <tr key={peca.id}>
                  <td className="pecas__col-foto">
                    {peca.imagemUrl ? (
                      <img
                        src={peca.imagemUrl}
                        alt={peca.nome}
                        className="pecas__thumb"
                      />
                    ) : (
                      <div className="pecas__thumb-vazio" />
                    )}
                  </td>
                  <td className="pecas__col-nome">{peca.nome}</td>
                  <td className="pecas__col-num">{peca.quantidade}</td>
                  <td className="pecas__col-num">{brl.format(peca.valorLocacao)}</td>
                  <td className="pecas__col-num">{brl.format(peca.valorReposicao)}</td>
                  <td>
                    <span className={`pecas__badge ${peca.ativo ? 'pecas__badge--ativa' : 'pecas__badge--inativa'}`}>
                      {peca.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="pecas__col-acoes">
                    <Link to={`/pecas/${peca.id}/editar`} className="pecas__link-editar">
                      Editar
                    </Link>
                    <button
                      type="button"
                      className={`pecas__btn-toggle ${peca.ativo ? 'pecas__btn-toggle--desativar' : 'pecas__btn-toggle--reativar'}`}
                      onClick={() => handleToggle(peca)}
                      disabled={acao === peca.id}
                    >
                      {acao === peca.id ? '…' : peca.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
