import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePecas } from '../../hooks/usePecas'
import './PecasPage.css'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function PecasPage() {
  const { pecas, loading, error, carregar, desativar, reativar } = usePecas()
  const [acao, setAcao] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    carregar()
  }, [carregar])

  // Ativas primeiro, inativas depois — sort estável preserva a ordem da API dentro de cada grupo
  const pecasOrdenadas = useMemo(
    () => [...pecas].sort((a, b) => Number(b.ativo) - Number(a.ativo)),
    [pecas],
  )

  function irParaEdicao(id) {
    navigate(`/pecas/${id}/editar`)
  }

  async function handleToggle(event, peca) {
    event.stopPropagation()
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

  function badgeClass(ativo) {
    return `pecas__badge ${ativo ? 'pecas__badge--ativa' : 'pecas__badge--inativa'}`
  }

  function toggleClass(ativo) {
    return `pecas__btn-toggle ${ativo ? 'pecas__btn-toggle--desativar' : 'pecas__btn-toggle--reativar'}`
  }

  function toggleLabel(peca) {
    if (acao === peca.id) return '…'
    return peca.ativo ? 'Desativar' : 'Reativar'
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
        <>
          {/* Tabela — visível em tablet/desktop */}
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
                {pecasOrdenadas.map((peca) => (
                  <tr
                    key={peca.id}
                    className="pecas__linha"
                    onClick={() => irParaEdicao(peca.id)}
                  >
                    <td className="pecas__col-foto">
                      {peca.imagemUrl ? (
                        <img src={peca.imagemUrl} alt={peca.nome} className="pecas__thumb" />
                      ) : (
                        <div className="pecas__thumb-vazio" />
                      )}
                    </td>
                    <td className="pecas__col-nome">{peca.nome}</td>
                    <td className="pecas__col-num">{peca.quantidade}</td>
                    <td className="pecas__col-num">{brl.format(peca.valorLocacao)}</td>
                    <td className="pecas__col-num">{brl.format(peca.valorReposicao)}</td>
                    <td>
                      <span className={badgeClass(peca.ativo)}>
                        {peca.ativo ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="pecas__col-acoes">
                      <Link
                        to={`/pecas/${peca.id}/editar`}
                        className="pecas__link-editar"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        className={toggleClass(peca.ativo)}
                        onClick={(e) => handleToggle(e, peca)}
                        disabled={acao === peca.id}
                      >
                        {toggleLabel(peca)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards — visível apenas em mobile */}
          <div className="pecas__cards">
            {pecasOrdenadas.map((peca) => (
              <div
                key={peca.id}
                className="pecas__card"
                onClick={() => irParaEdicao(peca.id)}
              >
                <div className="pecas__card-topo">
                  {peca.imagemUrl ? (
                    <img src={peca.imagemUrl} alt={peca.nome} className="pecas__card-foto" />
                  ) : (
                    <div className="pecas__card-foto pecas__card-foto--vazia" />
                  )}
                  <div className="pecas__card-info">
                    <span className="pecas__card-nome">{peca.nome}</span>
                    <span className={badgeClass(peca.ativo)}>
                      {peca.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                </div>

                <div className="pecas__card-valores">
                  <div className="pecas__card-valor">
                    <span className="pecas__card-valor-label">Qtd.</span>
                    <span className="pecas__card-valor-num">{peca.quantidade}</span>
                  </div>
                  <div className="pecas__card-valor">
                    <span className="pecas__card-valor-label">Locação</span>
                    <span className="pecas__card-valor-num">{brl.format(peca.valorLocacao)}</span>
                  </div>
                  <div className="pecas__card-valor">
                    <span className="pecas__card-valor-label">Repos.</span>
                    <span className="pecas__card-valor-num">{brl.format(peca.valorReposicao)}</span>
                  </div>
                </div>

                <div className="pecas__card-acoes">
                  <Link
                    to={`/pecas/${peca.id}/editar`}
                    className="pecas__link-editar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className={toggleClass(peca.ativo)}
                    onClick={(e) => handleToggle(e, peca)}
                    disabled={acao === peca.id}
                  >
                    {toggleLabel(peca)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
