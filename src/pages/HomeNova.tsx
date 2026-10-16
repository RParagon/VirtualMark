import Seo from '../components/Seo'
import { Abertura } from '../components/nova/Abertura'
import { Cases, Pista, Prova, Servicos } from '../components/nova/Secoes'
import { Chamada, Quiz } from '../components/nova/Final'
import { PaginaVM } from '../components/nova/Pagina'

/** Nova home (Figma "Virtual Mark — Nova home e cases"). Escuro é o padrão; o claro fica salvo por visitante. */
const HomeNova = () => (
  <PaginaVM home>
    <Seo
      title="VirtualMark | Tráfego pago, criativos e site que vendem"
      description="Tráfego pago no Google e no Meta, criativos e site em um só time. Cases com número: 23,5x de retorno numa loja de lingerie e 34 mil vendas para uma loja de games. Avaliação gratuita."
      path="/"
    />
    <Abertura />
    <Prova />
    <Servicos />
    <Pista />
    <Cases />
    <Quiz />
    <Chamada />
  </PaginaVM>
)

export default HomeNova
