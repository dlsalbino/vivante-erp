import useAuthStore from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL

function authHeader() {
  const token = useAuthStore.getState().token
  return { Authorization: `Bearer ${token}` }
}

export async function listarPecas() {
  const res = await fetch(`${API_URL}/api/admin/pecas`, { headers: authHeader() })
  if (!res.ok) throw new Error('Erro ao carregar peças')
  return res.json()
}

export async function buscarPeca(id) {
  const res = await fetch(`${API_URL}/api/admin/pecas/${id}`, { headers: authHeader() })
  if (!res.ok) throw new Error('Peça não encontrada')
  return res.json()
}

export async function criarPeca(formData) {
  const res = await fetch(`${API_URL}/api/admin/pecas`, {
    method: 'POST',
    headers: authHeader(),
    body: formData,
  })
  if (!res.ok) throw new Error('Erro ao criar peça')
  return res.json()
}

export async function atualizarPeca(id, formData) {
  const res = await fetch(`${API_URL}/api/admin/pecas/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: formData,
  })
  if (!res.ok) throw new Error('Erro ao atualizar peça')
  return res.json()
}

export async function desativarPeca(id) {
  const res = await fetch(`${API_URL}/api/admin/pecas/${id}/desativar`, {
    method: 'POST',
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('Erro ao desativar peça')
}

export async function reativarPeca(id) {
  const res = await fetch(`${API_URL}/api/admin/pecas/${id}/reativar`, {
    method: 'POST',
    headers: authHeader(),
  })
  if (!res.ok) throw new Error('Erro ao reativar peça')
}
