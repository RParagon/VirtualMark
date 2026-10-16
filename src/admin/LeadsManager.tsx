import { useState } from 'react'
import LeadsAdmin from './LeadsAdmin'
import QuizLeadsAdmin from './QuizLeadsAdmin'

type Source = 'contato' | 'quiz'

const LeadsManager = () => {
  const [source, setSource] = useState<Source>('contato')

  return (
    <div className="space-y-6">
      {/* Sub-abas: origem do lead */}
      <div className="inline-flex p-1 bg-gray-800/60 border border-gray-700 rounded-xl">
        <button
          onClick={() => setSource('contato')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            source === 'contato' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Formulário de contato
        </button>
        <button
          onClick={() => setSource('quiz')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            source === 'quiz' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Diagnóstico por ICP (Quiz)
        </button>
      </div>

      {source === 'contato' ? <LeadsAdmin /> : <QuizLeadsAdmin />}
    </div>
  )
}

export default LeadsManager
