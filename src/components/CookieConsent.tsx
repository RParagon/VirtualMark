import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent } from '../contexts/CookieContext';
import { Switch } from '@headlessui/react';
import { XMarkIcon, Cog6ToothIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const CookieConsent: React.FC = () => {
  const {
    cookieConsent,
    preferences,
    updatePreferences,
    acceptAllCookies,
    acceptSelectedCookies,
    rejectNonEssentialCookies,
    showCookieDialog,
  } = useCookieConsent();

  const [showDetails, setShowDetails] = useState(false);

  // If user has already made a decision, don't show the banner
  if (cookieConsent !== null && !showCookieDialog) {
    return null;
  }

  return (
    <AnimatePresence>
      {showCookieDialog && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl shadow-primary-600/10 border border-gray-800 overflow-hidden">
            <div className="relative p-6">
              {/* Close button for settings mode */}
              {showDetails && (
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary-600/20 p-2 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-primary-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {showDetails ? 'Configurações de Cookies' : 'Sua Privacidade'}
                </h2>
              </div>

              {/* Content */}
              {!showDetails ? (
                <>
                  <p className="text-gray-300 mb-6">
                    Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                    Você pode escolher quais cookies deseja permitir ou aceitar todos para uma experiência otimizada.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={rejectNonEssentialCookies}
                      className="button-secondary bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2"
                    >
                      Apenas Essenciais
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="flex items-center gap-2 button-secondary bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Personalizar
                    </button>
                    <button
                      onClick={acceptAllCookies}
                      className="button-primary text-sm px-4 py-2"
                    >
                      Aceitar Todos
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300 mb-6">
                    Personalize suas preferências de cookies. Cookies essenciais são necessários para o funcionamento do site 
                    e não podem ser desativados.
                  </p>

                  {/* Cookie preference toggles */}
                  <div className="space-y-4 mb-6">
                    <CookieOption
                      title="Cookies Essenciais"
                      description="Necessários para o funcionamento básico do site. O site não pode funcionar corretamente sem estes cookies."
                      enabled={preferences.necessary}
                      onChange={() => {}}
                      disabled={true}
                    />

                    <CookieOption
                      title="Cookies Funcionais"
                      description="Permitem funcionalidades aprimoradas e personalização, como vídeos e chat ao vivo."
                      enabled={preferences.functional}
                      onChange={(enabled) => updatePreferences({ functional: enabled })}
                    />

                    <CookieOption
                      title="Cookies Analíticos"
                      description="Nos ajudam a entender como os visitantes interagem com o site, permitindo melhorias contínuas."
                      enabled={preferences.analytics}
                      onChange={(enabled) => updatePreferences({ analytics: enabled })}
                    />

                    <CookieOption
                      title="Cookies de Marketing"
                      description="Usados para rastrear visitantes em sites. A intenção é exibir anúncios relevantes e envolventes."
                      enabled={preferences.marketing}
                      onChange={(enabled) => updatePreferences({ marketing: enabled })}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={rejectNonEssentialCookies}
                      className="button-secondary bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2"
                    >
                      Rejeitar Todos
                    </button>
                    <button
                      onClick={acceptSelectedCookies}
                      className="button-primary text-sm px-4 py-2"
                    >
                      Salvar Preferências
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CookieOptionProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

const CookieOption: React.FC<CookieOptionProps> = ({
  title,
  description,
  enabled,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 pr-4">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className={`${enabled ? 'bg-primary-600' : 'bg-gray-700'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">{enabled ? 'Enabled' : 'Disabled'}</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  );
};

export default CookieConsent;