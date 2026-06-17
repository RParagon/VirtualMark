// Tracking de eventos do Quiz Diagnóstico por ICP.
// Empurra eventos para window.dataLayer — o GTM (GTM-PPB59WGL, já instalado
// no index.html) encaminha para GA4 / Google Ads / Meta via triggers.

type QuizEvent =
  | { event: 'quiz_start' }
  | { event: 'quiz_name_submitted'; has_name: boolean }
  | { event: 'quiz_question_answered'; question_id: string | number; branch?: string }
  | { event: 'quiz_branch_entered'; branch: 'A' | 'B' | 'C' }
  | { event: 'quiz_insight_viewed'; branch: string; icp: string }
  | { event: 'quiz_open_answered'; skipped: boolean }
  | { event: 'quiz_lead_captured'; icp: string; adherence: number }
  | { event: 'quiz_result_viewed'; icp: string; adherence: number }
  | { event: 'quiz_cta_whatsapp'; icp: string }
  | { event: 'quiz_cta_simulador'; icp: string }

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

// `vertical` distingue o funil de origem nos relatórios do GTM/GA4
// ('imobiliaria' é o default histórico — o quiz imobiliário não envia o campo).
export function trackQuiz(payload: QuizEvent & { vertical?: 'imobiliaria' | 'ecommerce' }): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ...payload })
}

// Lê parâmetros UTM + referrer da URL atual — usado ao salvar o lead no Supabase.
export interface Attribution {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  referrer: string | null
  landing_page: string | null
  // Atribuição do Traffic Source Analytics (cookies definidos pelo t.js).
  // Permite cruzar cada lead com o visitante/sessão no painel do Traffic Source.
  ts_visitor_id: string | null
  ts_session_id: string | null
}

// Lê um cookie pelo nome (retorna null se não existir).
function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') {
    return {
      utm_source: null, utm_medium: null, utm_campaign: null,
      utm_term: null, utm_content: null, referrer: null, landing_page: null,
      ts_visitor_id: null, ts_session_id: null,
    }
  }
  const params = new URLSearchParams(window.location.search)
  const get = (k: string) => params.get(k) || null
  return {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_term: get('utm_term'),
    utm_content: get('utm_content'),
    referrer: document.referrer || null,
    landing_page: window.location.pathname + window.location.search,
    ts_visitor_id: readCookie('_ts_vid'),
    ts_session_id: readCookie('_ts_sid'),
  }
}
