import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MakeHeader from '../components/make/MakeHeader'
import FileUpload from '../components/make/FileUpload'
import Keyword from '../components/make/Keyword'

const MakePage = () => {
  const [step, setStep] = useState('fileUpload')
  const navigate = useNavigate()

  const handleBack = () => {
    if (step === 'keyword') {
      setStep('fileUpload')
      return
    }

    navigate(-1)
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <MakeHeader onBack={handleBack} />

      <div className="flex-1 min-h-0">
        {step === 'fileUpload' && (
          <FileUpload onNext={() => setStep('keyword')} />
        )}

        {step === 'keyword' && <Keyword />}
      </div>
    </div>
  )
}

export default MakePage