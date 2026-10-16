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
          className="vm-tema fixed bottom-0 left-0 z-50 w-full p-3 sm:bottom-4 sm:left-4 sm:w-auto sm:p-0"
          data-tema="auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="max-h-[80vh] overflow-y-auto rounded-[20px] border border-vm-borda bg-vm-sup font-manrope text-vm-texto shadow-2xl shadow-black/20 sm:max-w-[440px]">
            <div className="relative p-5">
              {/* Close button for settings mode */}
              {showDetails && (
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute right-4 top-4 text-vm-suave transition-colors hover:text-vm-texto"
                  aria-label="Fechar configurações"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              )}

              {/* Header */}
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-vm-verms p-2">
                  <ShieldCheckIcon className="h-5 w-5 text-vm-vermt" />
                </div>
                <h2 className="text-base font-bold text-vm-texto">
                  {showDetails ? 'Configurações de Cookies' : 'Sua Privacidade'}
                </h2>
              </div>

              {/* Content */}
              {!showDetails ? (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-vm-suave">
                    Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego. 
                    Você pode escolher quais cookies deseja permitir ou aceitar todos para uma experiência otimizada.
                  </p>
                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={rejectNonEssentialCookies}
                      className="rounded-full border border-vm-borda px-4 py-2 text-sm font-semibold text-vm-texto transition-colors hover:bg-vm-sup2"
                    >
                      Apenas Essenciais
                    </button>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="flex items-center gap-2 rounded-full border border-vm-borda px-4 py-2 text-sm font-semibold text-vm-texto transition-colors hover:bg-vm-sup2"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Personalizar
                    </button>
                    <button
                      onClick={acceptAllCookies}
                      className="rounded-full bg-vm-verm px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                    >
                      Aceitar Todos
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-5 text-sm leading-relaxed text-vm-suave">
                    Personalize suas preferências de cookies. Cookies essenciais são necessários para o funcionamento do site 
                    e não podem ser desativados.
                  </p>

                  {/* Cookie preference toggles */}
                  <div className="mb-5 space-y-4">
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

                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={rejectNonEssentialCookies}
                      className="rounded-full border border-vm-borda px-4 py-2 text-sm font-semibold text-vm-texto transition-colors hover:bg-vm-sup2"
                    >
                      Rejeitar Todos
                    </button>
                    <button
                      onClick={acceptSelectedCookies}
                      className="rounded-full bg-vm-verm px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
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
        <h3 className="text-sm font-semibold text-vm-texto">{title}</h3>
        <p className="mt-1 text-xs text-vm-suave">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className={`${enabled ? 'bg-vm-verm' : 'bg-vm-borda'}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-vm-verm focus-visible:ring-opacity-75`}
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