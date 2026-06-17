import { useMemo, useState } from 'react'

/**
 * Simulador de cenários da imobiliária — porta o quiz/simulador-vm.html para
 * um componente React reutilizável. Usado embutido no fim do quiz
 * (/quiz-imoveis) e na página dedicada /simulador-imoveis.
 *
 * Todos os estilos vivem sob `.vmsim` para não vazar/colidir com o restante
 * da aplicação (Tailwind + estilos inline das demais páginas).
 */

const fmt = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR')
const pct = (v: number, t: number) => (t === 0 ? '0%' : ((v / t) * 100).toFixed(1) + '%')

type Tag = 'alto' | 'medio' | 'baixo'

type Profile = {
  name: string
  tag: Tag
  range: string
  gestao: number
  gestaoVenda: number
  anuncios: number
}

function getProfile(val: number): Profile {
  if (val >= 800000)
    return { name: 'Alto padrão', tag: 'alto', range: 'Acima de R$ 800 mil', gestao: 800, gestaoVenda: 0.003, anuncios: 0.005 }
  if (val >= 300000)
    return { name: 'Médio padrão', tag: 'medio', range: 'R$ 300 mil a R$ 800 mil', gestao: 800, gestaoVenda: 0.003, anuncios: 0.01 }
  return { name: 'Baixo padrão', tag: 'baixo', range: 'Abaixo de R$ 300 mil', gestao: 800, gestaoVenda: 0.005, anuncios: 0.015 }
}

function calc(val: number, comPct: number) {
  const p = getProfile(val)
  const comissao = val * (comPct / 100)
  const anuncios = val * p.anuncios
  const gestaoFixa = p.gestao
  const gestaoVar = val * p.gestaoVenda
  const custoTotal = anuncios + gestaoFixa + gestaoVar
  const lucro = comissao - custoTotal
  return { ...p, comissao, anuncios, gestaoFixa, gestaoVar, custoTotal, lucro }
}

const SCENARIOS: { label: string; val: number; tag: Tag }[] = [
  { label: 'Alto padrão', val: 2500000, tag: 'alto' },
  { label: 'Médio padrão', val: 400000, tag: 'medio' },
  { label: 'Baixo padrão', val: 200000, tag: 'baixo' },
]

const STYLES = `
.vmsim {
  --vmsim-surface: #0D0D0D;
  --vmsim-surface-3: #1E1E1E;
  --vmsim-red: #E8243C;
  --vmsim-red-dark: #C41A30;
  --vmsim-red-rose: #FF2D55;
  --vmsim-red-glow: rgba(232,36,60,0.12);
  --vmsim-red-glow-strong: rgba(232,36,60,0.25);
  --vmsim-green: #00E676;
  --vmsim-green-dark: #00C853;
  --vmsim-text: #FFFFFF;
  --vmsim-text-muted: #9E9E9E;
  --vmsim-text-dim: #5A5A5A;
  --vmsim-border: rgba(255,255,255,0.06);
  --vmsim-border-light: rgba(255,255,255,0.1);
  --vmsim-radius: 16px;
  --vmsim-radius-sm: 10px;
  font-family: 'Montserrat', 'Hanken Grotesk', system-ui, sans-serif;
  color: var(--vmsim-text);
  line-height: 1.6;
}
.vmsim *, .vmsim *::before, .vmsim *::after { box-sizing: border-box; }
.vmsim .vmsim-header { text-align: center; margin-bottom: 2.25rem; }
.vmsim .vmsim-header h2 {
  font-size: clamp(1.4rem, 3.5vw, 2rem); font-weight: 800; letter-spacing: -0.03em;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #bbb 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.vmsim .vmsim-header p { font-size: 0.9rem; color: var(--vmsim-text-muted); max-width: 500px; margin: 0 auto; }
.vmsim .controls-card {
  background: var(--vmsim-surface); border: 1px solid var(--vmsim-border);
  border-radius: var(--vmsim-radius); padding: 2rem; margin-bottom: 2rem;
  position: relative; overflow: hidden;
}
.vmsim .controls-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--vmsim-red-dark), var(--vmsim-red), var(--vmsim-red-rose));
}
.vmsim .slider-group { margin-bottom: 1.75rem; }
.vmsim .slider-group:last-child { margin-bottom: 0; }
.vmsim .slider-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem; }
.vmsim .slider-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--vmsim-text-muted); }
.vmsim .slider-value { font-size: 1.5rem; font-weight: 800; color: var(--vmsim-text); font-variant-numeric: tabular-nums; }
.vmsim input[type=range] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 5px;
  border-radius: 3px; background: var(--vmsim-surface-3); outline: none; cursor: pointer; margin: 0;
}
.vmsim input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%;
  background: linear-gradient(135deg, var(--vmsim-red-dark), var(--vmsim-red-rose));
  border: 3px solid #000; box-shadow: 0 0 14px var(--vmsim-red-glow-strong), 0 2px 6px rgba(0,0,0,0.5);
  cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
}
.vmsim input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 0 22px var(--vmsim-red-glow-strong), 0 2px 8px rgba(0,0,0,0.6); }
.vmsim input[type=range]::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  background: linear-gradient(135deg, var(--vmsim-red-dark), var(--vmsim-red-rose));
  border: 3px solid #000; box-shadow: 0 0 14px var(--vmsim-red-glow-strong); cursor: pointer;
}
.vmsim .profile-tag {
  display: inline-flex; align-items: center; gap: 8px; font-size: 0.72rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em; padding: 7px 14px; border-radius: 8px;
  margin-bottom: 1.5rem; border: 1px solid;
}
.vmsim .profile-alto { background: var(--vmsim-red-glow); color: var(--vmsim-red-rose); border-color: rgba(232,36,60,0.25); }
.vmsim .profile-medio { background: rgba(255,152,0,0.08); color: #FFB74D; border-color: rgba(255,152,0,0.2); }
.vmsim .profile-baixo { background: rgba(66,165,245,0.08); color: #64B5F6; border-color: rgba(66,165,245,0.2); }
.vmsim .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 2rem; }
.vmsim .metric-card { background: var(--vmsim-surface); border: 1px solid var(--vmsim-border); border-radius: var(--vmsim-radius-sm); padding: 1.2rem; transition: border-color 0.2s; }
.vmsim .metric-card:hover { border-color: var(--vmsim-border-light); }
.vmsim .metric-card.highlight { border-color: rgba(0,230,118,0.15); background: linear-gradient(160deg, var(--vmsim-surface) 0%, rgba(0,230,118,0.03) 100%); }
.vmsim .metric-card.cost-hl { border-color: rgba(232,36,60,0.15); background: linear-gradient(160deg, var(--vmsim-surface) 0%, rgba(232,36,60,0.03) 100%); }
.vmsim .metric-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--vmsim-text-dim); margin-bottom: 8px; }
.vmsim .metric-value { font-size: 1.4rem; font-weight: 800; font-variant-numeric: tabular-nums; }
.vmsim .metric-value.pos { color: var(--vmsim-green); }
.vmsim .metric-value.neg { color: var(--vmsim-red-rose); }
.vmsim .breakdown-card { background: var(--vmsim-surface); border: 1px solid var(--vmsim-border); border-radius: var(--vmsim-radius); padding: 1.75rem 2rem; margin-bottom: 2.5rem; }
.vmsim .section-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--vmsim-text-dim); margin-bottom: 1.25rem; }
.vmsim .bd-row { display: flex; justify-content: space-between; align-items: center; padding: 0.7rem 0; border-bottom: 1px solid var(--vmsim-border); font-size: 0.88rem; }
.vmsim .bd-row:last-of-type { border-bottom: none; }
.vmsim .bd-row .lbl { color: var(--vmsim-text-muted); }
.vmsim .bd-row .cost { color: var(--vmsim-red-rose); font-weight: 600; }
.vmsim .bd-row.total { border-top: 2px solid var(--vmsim-red); border-bottom: none; padding-top: 1.2rem; margin-top: 0.5rem; font-weight: 700; font-size: 1rem; }
.vmsim .bd-row .profit { color: var(--vmsim-green); font-weight: 800; font-size: 1.1rem; }
.vmsim .bar-wrap { margin: 1.5rem 0 0.5rem; }
.vmsim .bar-track { background: var(--vmsim-surface-3); border-radius: 8px; height: 34px; overflow: hidden; }
.vmsim .bar-fill { height: 100%; border-radius: 8px; background: linear-gradient(90deg, var(--vmsim-green-dark), var(--vmsim-green)); transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; color: #000; min-width: 65px; }
.vmsim .bar-labels { display: flex; justify-content: space-between; font-size: 0.68rem; color: var(--vmsim-text-dim); margin-top: 8px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.vmsim .sc-title-row { font-size: 1.25rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em; }
.vmsim .sc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; }
.vmsim .sc-card { background: var(--vmsim-surface); border: 1px solid var(--vmsim-border); border-radius: var(--vmsim-radius-sm); padding: 1.4rem; position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
.vmsim .sc-card:hover { border-color: var(--vmsim-border-light); transform: translateY(-2px); }
.vmsim .sc-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.vmsim .sc-card.alto::before { background: linear-gradient(90deg, var(--vmsim-red-dark), var(--vmsim-red-rose)); }
.vmsim .sc-card.medio::before { background: linear-gradient(90deg, #E65100, #FFB74D); }
.vmsim .sc-card.baixo::before { background: linear-gradient(90deg, #1565C0, #64B5F6); }
.vmsim .sc-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.9rem; }
.vmsim .sc-name { font-weight: 700; font-size: 0.92rem; }
.vmsim .sc-name.alto { color: var(--vmsim-red-rose); }
.vmsim .sc-name.medio { color: #FFB74D; }
.vmsim .sc-name.baixo { color: #64B5F6; }
.vmsim .sc-val-label { font-size: 0.78rem; color: var(--vmsim-text-dim); font-weight: 600; }
.vmsim .sc-line { display: flex; justify-content: space-between; font-size: 0.8rem; padding: 3px 0; color: var(--vmsim-text-muted); }
.vmsim .sc-line span:last-child { color: var(--vmsim-text); font-weight: 600; }
.vmsim .sc-div { border: none; border-top: 1px solid var(--vmsim-border); margin: 0.7rem 0; }
.vmsim .sc-result { display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.4rem; }
.vmsim .sc-result-label { font-size: 0.78rem; font-weight: 700; color: var(--vmsim-text-muted); }
.vmsim .sc-result-value { font-size: 1.25rem; font-weight: 800; }
.vmsim .sc-margin { text-align: right; font-size: 0.68rem; margin-top: 4px; font-weight: 600; }
.vmsim .vmsim-note { font-size: 0.72rem; color: var(--vmsim-text-dim); text-align: center; margin-top: 2rem; }
@media (max-width: 640px) {
  .vmsim .controls-card { padding: 1.25rem; }
  .vmsim .metrics-grid { grid-template-columns: 1fr 1fr; }
  .vmsim .sc-grid { grid-template-columns: 1fr; }
  .vmsim .breakdown-card { padding: 1.25rem; }
  .vmsim .slider-value { font-size: 1.2rem; }
  .vmsim .vmsim-header h2 { font-size: 1.3rem; }
}
`

type Props = {
  /** Embutido no quiz: esconde o cabeçalho próprio do simulador. */
  embedded?: boolean
}

const SimuladorVM = ({ embedded = false }: Props) => {
  const [val, setVal] = useState(830000)
  const [com, setCom] = useState(6)

  const r = useMemo(() => calc(val, com), [val, com])
  const margin = r.comissao > 0 ? Math.max(5, Math.min(95, (r.lucro / r.comissao) * 100)) : 0
  const scenarios = useMemo(() => SCENARIOS.map((s) => ({ ...s, sc: calc(s.val, com) })), [com])

  return (
    <div className="vmsim">
      <style>{STYLES}</style>

      {!embedded && (
        <div className="vmsim-header">
          <h2>Simulador de cenários</h2>
          <p>Visualize na prática os custos e o lucro líquido da imobiliária em cada perfil de imóvel</p>
        </div>
      )}

      {/* Controles */}
      <div className="controls-card">
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Valor do imóvel</span>
            <span className="slider-value">{fmt(val)}</span>
          </div>
          <input type="range" min={50000} max={20000000} step={50000} value={val} onChange={(e) => setVal(+e.target.value)} />
        </div>
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Comissão da imobiliária</span>
            <span className="slider-value">{com}%</span>
          </div>
          <input type="range" min={1} max={10} step={0.5} value={com} onChange={(e) => setCom(+e.target.value)} />
        </div>
      </div>

      {/* Perfil */}
      <div>
        <span className={`profile-tag profile-${r.tag}`}>{r.name} — {r.range}</span>
      </div>

      {/* Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Comissão bruta</div>
          <div className="metric-value">{fmt(r.comissao)}</div>
        </div>
        <div className="metric-card cost-hl">
          <div className="metric-label">Custos totais</div>
          <div className="metric-value neg">{fmt(r.custoTotal)}</div>
        </div>
        <div className="metric-card highlight">
          <div className="metric-label">Lucro líquido</div>
          <div className="metric-value pos">{fmt(r.lucro)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Margem de lucro</div>
          <div className="metric-value">{pct(r.lucro, r.comissao)}</div>
        </div>
      </div>

      {/* Detalhamento */}
      <div className="breakdown-card">
        <div className="section-label">Detalhamento do cálculo</div>
        <div>
          <div className="bd-row">
            <span className="lbl">Comissão bruta ({com}% de {fmt(val)})</span>
            <span>{fmt(r.comissao)}</span>
          </div>
          <div className="bd-row">
            <span className="lbl">Verba de anúncios ({((r.anuncios / val) * 100).toFixed(1)}% do imóvel)</span>
            <span className="cost">– {fmt(r.anuncios)}</span>
          </div>
          <div className="bd-row">
            <span className="lbl">Taxa de gestão fixa</span>
            <span className="cost">– {fmt(r.gestaoFixa)}</span>
          </div>
          <div className="bd-row">
            <span className="lbl">Taxa variável na venda ({(r.gestaoVenda * 100).toFixed(1)}%)</span>
            <span className="cost">– {fmt(r.gestaoVar)}</span>
          </div>
          <div className="bd-row total">
            <span>Lucro final da imobiliária</span>
            <span className="profit">{fmt(r.lucro)}</span>
          </div>
        </div>
        <div className="bar-wrap">
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${Math.round(margin)}%` }}>{pct(r.lucro, r.comissao)} lucro</div>
          </div>
          <div className="bar-labels"><span>Custos</span><span>Lucro líquido</span></div>
        </div>
      </div>

      {/* Cenários comparativos */}
      <div className="sc-title-row">Cenários comparativos</div>
      <div className="sc-grid">
        {scenarios.map((s) => {
          const lc = s.sc.lucro >= 0 ? 'var(--vmsim-green)' : 'var(--vmsim-red-rose)'
          return (
            <div key={s.label} className={`sc-card ${s.tag}`}>
              <div className="sc-head">
                <span className={`sc-name ${s.tag}`}>{s.label}</span>
                <span className="sc-val-label">{fmt(s.val)}</span>
              </div>
              <div className="sc-line"><span>Comissão bruta</span><span>{fmt(s.sc.comissao)}</span></div>
              <div className="sc-line"><span>Verba de anúncios</span><span>– {fmt(s.sc.anuncios)}</span></div>
              <div className="sc-line"><span>Taxa de gestão</span><span>– {fmt(s.sc.gestaoFixa + s.sc.gestaoVar)}</span></div>
              <hr className="sc-div" />
              <div className="sc-result">
                <span className="sc-result-label">Lucro líquido</span>
                <span className="sc-result-value" style={{ color: lc }}>{fmt(s.sc.lucro)}</span>
              </div>
              <div className="sc-margin" style={{ color: lc }}>Margem: {pct(s.sc.lucro, s.sc.comissao)}</div>
            </div>
          )
        })}
      </div>

      <div className="vmsim-note">
        * A verba de anúncios é investida na divulgação do imóvel e não compõe o lucro da imobiliária.
      </div>
    </div>
  )
}

export default SimuladorVM
