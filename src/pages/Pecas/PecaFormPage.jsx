import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { buscarPeca } from '../../services/pecasService'
import { usePecas } from '../../hooks/usePecas'
import './PecaFormPage.css'

export default function PecaFormPage() {
  const { id } = useParams()
  const isEdicao = Boolean(id)
  const navigate = useNavigate()
  const { criar, atualizar } = usePecas()

  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [valorLocacao, setValorLocacao] = useState('')
  const [valorReposicao, setValorReposicao] = useState('')
  const [imagemExistente, setImagemExistente] = useState(null)
  const [imagemNova, setImagemNova] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [carregando, setCarregando] = useState(isEdicao)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!isEdicao) return
    buscarPeca(id)
      .then((peca) => {
        setNome(peca.nome)
        setQuantidade(String(peca.quantidade))
        setValorLocacao(String(peca.valorLocacao))
        setValorReposicao(String(peca.valorReposicao))
        setImagemExistente(peca.imagemUrl || null)
        setPreviewUrl(peca.imagemUrl || null)
      })
      .catch(() => setErro('Não foi possível carregar a peça.'))
      .finally(() => setCarregando(false))
  }, [id, isEdicao])

  function handleArquivo(e) {
    const file = e.target.files[0]
    if (!file) return
    setImagemNova(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)

    if (!nome.trim()) { setErro('Informe o nome da peça.'); return }
    if (!quantidade || Number(quantidade) < 1) { setErro('Quantidade deve ser maior que zero.'); return }
    if (!valorLocacao || Number(valorLocacao) < 0) { setErro('Informe o valor de locação.'); return }
    if (!valorReposicao || Number(valorReposicao) < 0) { setErro('Informe o valor de reposição.'); return }

    const formData = new FormData()
    formData.append('nome', nome.trim())
    formData.append('quantidade', quantidade)
    formData.append('valorLocacao', valorLocacao)
    formData.append('valorReposicao', valorReposicao)
    if (imagemNova) formData.append('imagem', imagemNova)

    setSalvando(true)
    try {
      if (isEdicao) {
        await atualizar(Number(id), formData)
      } else {
        await criar(formData)
      }
      navigate('/pecas')
    } catch (err) {
      setErro(err.message)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) return <div className="peca-form__loading">Carregando…</div>

  return (
    <div className="peca-form">
      <div className="peca-form__header">
        <h1 className="peca-form__titulo">{isEdicao ? 'Editar Peça' : 'Nova Peça'}</h1>
      </div>

      <div className="peca-form__card">
        <form className="peca-form__form" onSubmit={handleSubmit} noValidate>
          {erro && <div className="peca-form__erro">{erro}</div>}

          <div className="peca-form__linha">
            <div className="peca-form__campo peca-form__campo--largo">
              <label className="peca-form__label" htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                className="peca-form__input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Arranjo de flores secas"
                disabled={salvando}
              />
            </div>

            <div className="peca-form__campo">
              <label className="peca-form__label" htmlFor="quantidade">Quantidade</label>
              <input
                id="quantidade"
                type="number"
                min="1"
                className="peca-form__input"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="0"
                disabled={salvando}
              />
            </div>
          </div>

          <div className="peca-form__linha">
            <div className="peca-form__campo">
              <label className="peca-form__label" htmlFor="valorLocacao">Valor de locação (R$)</label>
              <input
                id="valorLocacao"
                type="number"
                min="0"
                step="0.01"
                className="peca-form__input"
                value={valorLocacao}
                onChange={(e) => setValorLocacao(e.target.value)}
                placeholder="0,00"
                disabled={salvando}
              />
            </div>

            <div className="peca-form__campo">
              <label className="peca-form__label" htmlFor="valorReposicao">Valor de reposição (R$)</label>
              <input
                id="valorReposicao"
                type="number"
                min="0"
                step="0.01"
                className="peca-form__input"
                value={valorReposicao}
                onChange={(e) => setValorReposicao(e.target.value)}
                placeholder="0,00"
                disabled={salvando}
              />
            </div>
          </div>

          <div className="peca-form__campo">
            <label className="peca-form__label">Imagem</label>
            <div className="peca-form__imagem-area">
              {previewUrl ? (
                <div className="peca-form__preview-wrap">
                  <img src={previewUrl} alt="Preview" className="peca-form__preview" />
                  <button
                    type="button"
                    className="peca-form__preview-trocar"
                    onClick={() => fileRef.current?.click()}
                  >
                    Trocar imagem
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="peca-form__upload-btn"
                  onClick={() => fileRef.current?.click()}
                  disabled={salvando}
                >
                  Selecionar imagem
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="peca-form__input-file"
                onChange={handleArquivo}
              />
            </div>
          </div>

          <div className="peca-form__acoes">
            <button
              type="button"
              className="peca-form__btn-cancelar"
              onClick={() => navigate('/pecas')}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" className="peca-form__btn-salvar" disabled={salvando}>
              {salvando ? 'Salvando…' : isEdicao ? 'Salvar alterações' : 'Cadastrar peça'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
