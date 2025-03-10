import { createContext, useContext, useState, ReactNode } from 'react'

type ServiceContextType = {
  currentService: string
  setCurrentService: (service: string) => void
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined)

export const useService = () => {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider')
  }
  return context
}

type ServiceProviderProps = {
  children: ReactNode
}

export const ServiceProvider = ({ children }: ServiceProviderProps) => {
  const [currentService, setCurrentService] = useState('')

  return (
    <ServiceContext.Provider
      value={{
        currentService,
        setCurrentService
      }}
    >
      {children}
    </ServiceContext.Provider>
  )
}