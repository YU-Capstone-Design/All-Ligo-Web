import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MakeHeader from '../components/make/MakeHeader'
import FileUpload from '../components/make/FileUpload'
import Keyword from '../components/make/Keyword'
import TypeSelect from '../components/make/TypeSelect'
import Title from '../components/make/Title'

const MakePage = () => {
  const [step, setStep] = useState('fileUpload')
  const navigate = useNavigate()

  const handleBack = () => {
    if (step === 'title') {
      setStep('typeSelect')
      return
    }

    if (step === 'typeSelect') {
      setStep('keyword')
      return
    }

    if (step === 'keyword') {
      setStep('fileUpload')
      return
    }

    navigate(-1)
  }

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden">
      <MakeHeader onBack={handleBack} />

      <div className="flex-1 min-h-0">
        {step === 'fileUpload' && (
          <FileUpload onNext={() => setStep('keyword')} />
        )}

        {step === 'keyword' && (
          <Keyword onNext={() => setStep('typeSelect')} />
        )}

        {step === 'typeSelect' && (
          <TypeSelect onNext={() => setStep('title')} />
        )}

        {step === 'title' && <Title />}
      </div>
    </div>
  )
}

export default MakePage