/**
 * Prerender pós-build para o SPA da VirtualMark.
 *
 * Por que: o site é React 100% client-side. Crawlers de IA (GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended) em geral NÃO executam JavaScript e recebiam
 * uma página vazia (<div id="root"></div>). Este script sobe um servidor
 * estático sobre /dist, abre cada rota num navegador headless, espera o React
 * renderizar (incluindo as tags injetadas pelo react-helmet, como o JSON-LD da
 * /imobiliarias) e salva o HTML já renderizado em disco — um index.html por
 * rota. Assim o crawler passa a receber conteúdo real.
 *
 * Também descobre rotas dinâmicas (ex.: /blog/:id, /cases/:slug) seguindo os
 * links internos da própria aplicação, e gera o sitemap.xml a partir das rotas
 * efetivamente renderizadas.
 *
 * Uso: roda automaticamente no `postbuild` (após `vite build`).
 */

import http from 'node:http'
import { execSync } from 'node:child_process'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '..', 'dist')
const SITE_URL = 'https://virtualmark.com.br'
const PORT = 4280
const MAX_PAGES = 80

// Rotas-semente garantidas (mesmo que não estejam linkadas em algum ponto).
const SEED_ROUTES = [
  '/',
  '/imobiliarias',
  '/quiz-imoveis',
  '/ecommerce',
  '/quiz-ecommerce',
  '/contact',
  '/cases',
  '/blog',
  '/privacy-policy',
  '/services/traffic-management',
  '/services/performance-marketing',
  '/services/content-marketing',
  '/services/digital-consulting',
]

// Rotas que NÃO devem ser prerenderizadas / rastreadas.
const EXCLUDE = [/^\/admin/]

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

// ── Servidor estático com fallback SPA (igual ao redirect do Netlify) ─────────
function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0])
    let filePath = path.join(DIST, urlPath)

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' })
      createReadStream(filePath).pipe(res)
      return
    }
    // Fallback SPA → index.html (a app resolve a rota no client)
    filePath = path.join(DIST, 'index.html')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    createReadStream(filePath).pipe(res)
  })
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)))
}

function shouldVisit(route) {
  if (EXCLUDE.some((re) => re.test(route))) return false
  // ignora links para arquivos (ex.: .pdf, .png) — só rotas de página
  if (/\.[a-z0-9]{2,5}$/i.test(route)) return false
  return route.startsWith('/')
}

function outFileFor(route) {
  if (route === '/') return path.join(DIST, 'index.html')
  return path.join(DIST, route.replace(/^\/+/, ''), 'index.html')
}

// No CI (Netlify), o node_modules pode vir do cache sem que o postinstall do
// puppeteer tenha rodado — o Chrome não está em ~/.cache/puppeteer e o launch
// falha. Nesse caso, baixa o navegador e tenta de novo.
async function launchBrowser() {
  const opts = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
  try {
    return await puppeteer.launch(opts)
  } catch (err) {
    if (!/Could not find Chrome/i.test(String(err))) throw err
    console.log('Chrome do Puppeteer ausente — instalando (npx puppeteer browsers install chrome)...')
    execSync('npx puppeteer browsers install chrome', { stdio: 'inherit' })
    return await puppeteer.launch(opts)
  }
}

async function prerender() {
  const server = await startServer()
  const browser = await launchBrowser()

  // Rotas críticas: se renderizarem vazias, o build falha (canário contra
  // deploy em branco — ex.: env do Supabase ausente derruba o bundle inteiro).
  const CRITICAL = new Set(['/', '/imobiliarias', '/ecommerce'])
  const MIN_TEXT = 200

  const queue = [...SEED_ROUTES]
  const seen = new Set(queue)
  const rendered = []
  const emptyRoutes = []

  try {
    while (queue.length && rendered.length < MAX_PAGES) {
      const route = queue.shift()
      const page = await browser.newPage()
      try {
        await page.goto(`http://localhost:${PORT}${route}`, {
          waitUntil: 'networkidle0',
          timeout: 45000,
        })
        // Espera o React popular o #root com conteúdo real.
        await page
          .waitForFunction(
            () => {
              const root = document.getElementById('root')
              return root && root.children.length > 0 && document.body.innerText.trim().length > 40
            },
            { timeout: 20000 }
          )
          .catch(() => {})

        const textLen = await page.evaluate(() => document.body.innerText.trim().length)
        if (textLen < MIN_TEXT) emptyRoutes.push(route)

        // Descobre links internos para rastrear rotas dinâmicas (blog, cases).
        const hrefs = await page.$$eval('a[href]', (as) =>
          as.map((a) => a.getAttribute('href') || '')
        )
        for (const href of hrefs) {
          if (!href.startsWith('/') || href.startsWith('//')) continue
          const clean = href.split('#')[0].split('?')[0].replace(/\/$/, '') || '/'
          if (!seen.has(clean) && shouldVisit(clean)) {
            seen.add(clean)
            queue.push(clean)
          }
        }

        const html = await page.content()
        const outFile = outFileFor(route)
        await mkdir(path.dirname(outFile), { recursive: true })
        await writeFile(outFile, '<!DOCTYPE html>\n' + html, 'utf-8')
        rendered.push(route)
        console.log(`  ✓ prerendered ${route}`)
      } catch (err) {
        console.warn(`  ✗ falhou ${route}: ${err.message}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    server.close()
  }

  await writeSitemap(rendered)
  console.log(`\nPrerender concluído: ${rendered.length} rotas. sitemap.xml gerado.`)

  if (emptyRoutes.length) {
    console.warn(`\n⚠ Rotas renderizadas com pouco/nenhum texto: ${emptyRoutes.join(', ')}`)
  }
  const criticalEmpty = emptyRoutes.filter((r) => CRITICAL.has(r))
  if (criticalEmpty.length) {
    console.error(
      `\n✗ ERRO: rota(s) crítica(s) renderizaram vazias: ${criticalEmpty.join(', ')}.\n` +
        `  O bundle provavelmente quebrou no boot (ex.: variáveis VITE_SUPABASE_* ausentes).\n` +
        `  Configure as envs no ambiente de build (Netlify) e tente novamente.`
    )
    process.exit(1)
  }
}

async function writeSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10)
  const priorityFor = (r) =>
    r === '/' ? '1.0' : r === '/imobiliarias' || r === '/ecommerce' ? '0.9' : '0.7'
  const urls = [...new Set(routes)]
    .filter((r) => !EXCLUDE.some((re) => re.test(r)))
    .sort()
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_URL}${r === '/' ? '/' : r}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n` +
        `    <priority>${priorityFor(r)}</priority>\n  </url>`
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  await writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf-8')
}

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html não encontrado. Rode `vite build` antes do prerender.')
  process.exit(1)
}

prerender().catch((err) => {
  console.error('Erro no prerender:', err)
  process.exit(1)
})
