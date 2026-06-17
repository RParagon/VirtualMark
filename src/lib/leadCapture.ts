import { supabase } from './supabase'

type Row = Record<string, unknown>

/**
 * Insere um lead tentando, em ordem, uma lista de payloads cada vez mais
 * enxutos. Serve para não perder o lead quando uma coluna de atribuição
 * (ex.: ts_visitor_id, vertical) ainda não existe no banco — a migração SQL
 * pode não ter rodado no Supabase no momento do deploy.
 *
 * Passe o payload completo primeiro e versões reduzidas como fallback.
 * Retorna true se algum insert teve sucesso.
 */
export async function insertLeadWithFallback(table: string, candidates: Row[]): Promise<boolean> {
  let lastError: unknown = null
  for (const row of candidates) {
    const { error } = await supabase.from(table).insert([row])
    if (!error) return true
    lastError = error
  }
  if (lastError) console.error(`insertLeadWithFallback(${table}) falhou:`, lastError)
  return false
}
