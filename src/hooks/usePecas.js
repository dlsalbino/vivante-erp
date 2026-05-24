import { useState, useCallback } from 'react'
import * as pecasService from '../services/pecasService'

export function usePecas() {
  const [pecas, setPecas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await pecasService.listarPecas()
      setPecas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const criar = useCallback(async (formData) => {
    const nova = await pecasService.criarPeca(formData)
    setPecas((prev) => [nova, ...prev])
    return nova
  }, [])

  const atualizar = useCallback(async (id, formData) => {
    const atualizada = await pecasService.atualizarPeca(id, formData)
    setPecas((prev) => prev.map((p) => (p.id === id ? atualizada : p)))
    return atualizada
  }, [])

  const desativar = useCallback(async (id) => {
    await pecasService.desativarPeca(id)
    setPecas((prev) => prev.map((p) => (p.id === id ? { ...p, ativo: false } : p)))
  }, [])

  const reativar = useCallback(async (id) => {
    await pecasService.reativarPeca(id)
    setPecas((prev) => prev.map((p) => (p.id === id ? { ...p, ativo: true } : p)))
  }, [])

  return { pecas, loading, error, carregar, criar, atualizar, desativar, reativar }
}
