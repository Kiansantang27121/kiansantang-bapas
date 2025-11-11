import { useState, useEffect } from 'react'
import axios from 'axios'
import ServiceSelection from './components/ServiceSelection'
import RegistrationForm from './components/RegistrationForm'
import SuccessScreen from './components/SuccessScreen'
import { API_URL } from './config'

function App() {
  const [step, setStep] = useState('service') // 'service', 'form', 'success'
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState({})
  const [selectedService, setSelectedService] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchServices()
    fetchSettings()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services`)
      setServices(response.data)
    } catch (err) {
      console.error('Error fetching services:', err)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`)
      setSettings(response.data)
    } catch (err) {
      console.error('Error fetching settings:', err)
    }
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setStep('form')
  }

  const handleFormSuccess = (queueData) => {
    setResult(queueData)
    setStep('success')
  }

  const handleBackToService = () => {
    setSelectedService(null)
    setStep('service')
  }

  const handleNewRegistration = () => {
    setSelectedService(null)
    setResult(null)
    setStep('service')
  }

  return (
    <>
      {step === 'service' && (
        <ServiceSelection
          services={services}
          settings={settings}
          onSelectService={handleServiceSelect}
        />
      )}

      {step === 'form' && (
        <RegistrationForm
          service={selectedService}
          settings={settings}
          onSuccess={handleFormSuccess}
          onBack={handleBackToService}
        />
      )}

      {step === 'success' && (
        <SuccessScreen
          result={result}
          onNewRegistration={handleNewRegistration}
        />
      )}
    </>
  )
}

export default App
