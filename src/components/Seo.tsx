import { Helmet } from 'react-helmet'

const SITE_URL = 'https://virtualmark.com.br'
const DEFAULT_IMAGE = `${SITE_URL}/vm-logo.png`

interface SeoProps {
  title: string
  description: string
  /** Caminho da rota, ex.: '/services/traffic-management'. Vazio = home. */
  path?: string
  image?: string
  /** og:type — 'website' (padrão) ou 'article' para posts de blog. */
  type?: 'website' | 'article'
  /** JSON-LD adicional específico da página (ex.: BlogPosting). */
  jsonLd?: object | object[]
}

/**
 * SEO/GEO por página: title, meta description, canonical, Open Graph, Twitter
 * e JSON-LD opcional. Renderiza via react-helmet — o prerender (Puppeteer)
 * captura essas tags no HTML estático, tornando-as visíveis para buscadores e IA.
 */
const Seo = ({ title, description, path = '', image, type = 'website', jsonLd }: SeoProps) => {
  const url = `${SITE_URL}${path}`
  const ogImage = image || DEFAULT_IMAGE
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="VirtualMark" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export default Seo
