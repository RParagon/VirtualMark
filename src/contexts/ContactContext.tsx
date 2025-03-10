import React, { createContext, useContext, useState } from 'react'

interface ContactInfo {
  phoneNumber: string
  whatsappNumber: string
  address: {
    street: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  email: string
}

interface ContactContextType {
  contactInfo: ContactInfo
  updateContactInfo: (info: Partial<ContactInfo>) => void
}

const defaultContactInfo: ContactInfo = {
  phoneNumber: '(11) 91334-5769',
  whatsappNumber: '5511913345769',
  address: {
    street: 'Av. Paulista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100'
  },
  email: 'contato@virtualmark.com.br'
}

const ContactContext = createContext<ContactContextType | undefined>(undefined)

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)

  const updateContactInfo = (info: Partial<ContactInfo>) => {
    setContactInfo(prev => ({
      ...prev,
      ...info,
      address: {
        ...prev.address,
        ...(info.address || {})
      }
    }))
  }

  return (
    <ContactContext.Provider value={{ contactInfo, updateContactInfo }}>
      {children}
    </ContactContext.Provider>
  )
}

export const useContact = () => {
  const context = useContext(ContactContext)
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider')
  }
  return context
}