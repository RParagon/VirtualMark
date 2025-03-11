import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet';

const PrivacyPolicyPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Política de Privacidade | VirtualMark</title>
        <meta name="description" content="Política de Privacidade da VirtualMark. Saiba como coletamos, usamos e protegemos seus dados pessoais." />
      </Helmet>

      <div className="bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <div className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -right-24 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Política de Privacidade
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Entenda como coletamos, usamos e protegemos suas informações
            </motion.p>
          </div>
        </div>

        {/* Content Section */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-800/50 rounded-xl border border-gray-700 mb-24"
        >
          {/* Last updated */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <p className="text-gray-400">Última atualização: {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </motion.div>

          {/* Introduction */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Introdução</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                A VirtualMark ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
              </p>
              <p>
                Ao acessar ou utilizar nossos serviços, você concorda com a coleta e uso de informações de acordo com esta política. Recomendamos que você leia este documento cuidadosamente para entender nossas práticas em relação aos seus dados pessoais.
              </p>
            </div>
          </motion.div>

          {/* Information Collection */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Informações que Coletamos</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>Podemos coletar os seguintes tipos de informações:</p>
              <ul>
                <li>
                  <strong>Informações Pessoais:</strong> Nome, endereço de e-mail, número de telefone, empresa, cargo e outras informações que você fornece voluntariamente ao preencher formulários em nosso site ou ao entrar em contato conosco.
                </li>
                <li>
                  <strong>Informações de Uso:</strong> Dados sobre como você interage com nosso site, incluindo páginas visitadas, tempo gasto no site, links clicados e preferências de navegação.
                </li>
                <li>
                  <strong>Informações do Dispositivo:</strong> Dados técnicos como seu endereço IP, tipo de navegador, provedor de serviços de internet, sistema operacional e outras tecnologias em dispositivos que você usa para acessar nosso site.
                </li>
                <li>
                  <strong>Cookies e Tecnologias Similares:</strong> Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar o tráfego e personalizar o conteúdo.
                </li>
              </ul>
            </div>
          </motion.div>

          {/* How We Use Information */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Como Utilizamos Suas Informações</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>Utilizamos as informações coletadas para:</p>
              <ul>
                <li>Fornecer, manter e melhorar nossos serviços;</li>
                <li>Processar e responder às suas solicitações, perguntas e comentários;</li>
                <li>Enviar informações sobre nossos serviços, atualizações e materiais promocionais;</li>
                <li>Personalizar sua experiência e entregar conteúdo relevante para seus interesses;</li>
                <li>Analisar tendências de uso e melhorar a funcionalidade do nosso site;</li>
                <li>Detectar, prevenir e resolver problemas técnicos e de segurança;</li>
                <li>Cumprir obrigações legais e regulatórias.</li>
              </ul>
            </div>
          </motion.div>

          {/* Information Sharing */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Compartilhamento de Informações</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>Podemos compartilhar suas informações pessoais nas seguintes circunstâncias:</p>
              <ul>
                <li>
                  <strong>Prestadores de Serviços:</strong> Compartilhamos informações com empresas terceirizadas que nos auxiliam na operação do site e na prestação de serviços.
                </li>
                <li>
                  <strong>Conformidade Legal:</strong> Podemos divulgar informações quando acreditamos, de boa fé, que a divulgação é necessária para cumprir uma obrigação legal, proteger nossos direitos, sua segurança ou a de outros.
                </li>
                <li>
                  <strong>Transferências Comerciais:</strong> Em caso de fusão, aquisição ou venda de ativos, suas informações pessoais podem ser transferidas como parte desses acordos.
                </li>
                <li>
                  <strong>Com Seu Consentimento:</strong> Podemos compartilhar suas informações com terceiros quando você nos autorizar expressamente a fazê-lo.
                </li>
              </ul>
              <p>
                Não vendemos, alugamos ou comercializamos suas informações pessoais para terceiros sem o seu consentimento explícito.
              </p>
            </div>
          </motion.div>

          {/* Data Security */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Segurança de Dados</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                Implementamos medidas de segurança técnicas, administrativas e físicas para proteger suas informações pessoais contra acesso não autorizado, uso indevido ou divulgação. No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
              </p>
              <p>
                Revisamos regularmente nossas práticas de segurança e atualizamos nossas medidas conforme necessário para manter a proteção adequada dos seus dados.
              </p>
            </div>
          </motion.div>

          {/* Cookies Policy */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Política de Cookies</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                Nosso site utiliza cookies e tecnologias similares para melhorar sua experiência de navegação. Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a reconhecê-lo e lembrar suas preferências.
              </p>
              <p>Utilizamos os seguintes tipos de cookies:</p>
              <ul>
                <li>
                  <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site.
                </li>
                <li>
                  <strong>Cookies de Preferências:</strong> Permitem que o site lembre suas escolhas e forneça recursos aprimorados.
                </li>
                <li>
                  <strong>Cookies Analíticos:</strong> Ajudam-nos a entender como os visitantes interagem com o site, permitindo melhorias contínuas.
                </li>
                <li>
                  <strong>Cookies de Marketing:</strong> Utilizados para rastrear visitantes em sites e exibir anúncios relevantes.
                </li>
              </ul>
              <p>
                Você pode controlar e gerenciar cookies através das configurações do seu navegador. No entanto, desabilitar certos cookies pode afetar a funcionalidade do site.
              </p>
            </div>
          </motion.div>

          {/* Your Rights */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Seus Direitos</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>Dependendo da sua localização, você pode ter os seguintes direitos em relação aos seus dados pessoais:</p>
              <ul>
                <li>Acessar e receber uma cópia das suas informações pessoais;</li>
                <li>Retificar informações imprecisas ou incompletas;</li>
                <li>Solicitar a exclusão de seus dados pessoais;</li>
                <li>Restringir ou opor-se ao processamento de suas informações;</li>
                <li>Solicitar a portabilidade de seus dados;</li>
                <li>Retirar seu consentimento a qualquer momento;</li>
                <li>Apresentar uma reclamação a uma autoridade de proteção de dados.</li>
              </ul>
              <p>
                Para exercer qualquer um desses direitos, entre em contato conosco através dos canais indicados no final desta política.
              </p>
            </div>
          </motion.div>

          {/* Children's Privacy */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Privacidade de Crianças</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                Nossos serviços não são direcionados a pessoas menores de 18 anos. Não coletamos intencionalmente informações pessoais de crianças. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco para que possamos tomar as medidas apropriadas.
              </p>
            </div>
          </motion.div>

          {/* International Transfers */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Transferências Internacionais</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                Suas informações podem ser transferidas e processadas em servidores localizados fora do seu país de residência, onde as leis de proteção de dados podem ser diferentes. Ao utilizar nossos serviços, você concorda com essa transferência de informações.
              </p>
              <p>
                Tomamos medidas para garantir que suas informações recebam um nível adequado de proteção, independentemente de onde sejam processadas.
              </p>
            </div>
          </motion.div>

          {/* Changes to Privacy Policy */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Alterações nesta Política</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações materiais publicando a nova política em nosso site. Recomendamos que você revise esta política periodicamente para se manter informado sobre como estamos protegendo suas informações.
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Entre em Contato</h2>
            <div className="prose prose-lg prose-invert max-w-none relative">
              <p>
                Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre nossas práticas de tratamento de dados, entre em contato conosco:
              </p>
              <ul>
                <li>E-mail: contato@virtualmark.com.br</li>
                <li>Telefone: (11) 91334-5769</li>
                <li>Endereço: São Paulo, SP</li>
              </ul>
              <p>
                Responderemos à sua solicitação o mais rápido possível, geralmente dentro de 30 dias.
              </p>
            </div>
          </motion.div>

          {/* Back to top button */}
          <motion.div variants={itemVariants} className="text-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Voltar ao topo
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;