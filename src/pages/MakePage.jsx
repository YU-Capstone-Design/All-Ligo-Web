import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MakeHeader from '../components/make/MakeHeader'
import FileUpload from '../components/make/FileUpload'
import Keyword from '../components/make/Keyword'
import TypeSelect from '../components/make/TypeSelect'
import Upload from '../components/make/Upload'
import {
  createPromotion,
  getPromotionPresignedUrl,
  uploadFileToS3,
} from '../apis/PromotionApi'

const dayOfWeekMap = {
  월: 'MONDAY',
  화: 'TUESDAY',
  수: 'WEDNESDAY',
  목: 'THURSDAY',
  금: 'FRIDAY',
  토: 'SATURDAY',
  일: 'SUNDAY',
}

const dayIndexMap = {
  일: 0,
  월: 1,
  화: 2,
  수: 3,
  목: 4,
  금: 5,
  토: 6,
}

const contentTypeMap = {
  blog: 'BLOG',
  shorts: 'VIDEO',
}

const formatDateTime = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`
}

const getNextPublishDate = ({ selectedDay, uploadTime }) => {
  const now = new Date()
  const publishDate = new Date(now)
  const targetDayIndex = dayIndexMap[selectedDay]
  const currentDayIndex = publishDate.getDay()
  let dayDiff = (targetDayIndex - currentDayIndex + 7) % 7

  publishDate.setDate(publishDate.getDate() + dayDiff)
  publishDate.setHours(uploadTime.hour, uploadTime.minute, 0, 0)

  const minimumPublishDate = new Date(now.getTime() + 60 * 60 * 1000)

  if (publishDate <= minimumPublishDate) {
    dayDiff += 7
    publishDate.setDate(now.getDate() + dayDiff)
  }

  return publishDate
}

const getDeadlineDate = (selectedEndDate) => {
  const deadlineDate = new Date(selectedEndDate)

  deadlineDate.setHours(23, 59, 0, 0)

  return deadlineDate
}

const MakePage = () => {
  const [step, setStep] = useState('fileUpload')
  const [images, setImages] = useState([])
  const [title, setTitle] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [includeWeather, setIncludeWeather] = useState(false)
  const [hashTags, setHashTags] = useState([])
  const [prompt, setPrompt] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const navigate = useNavigate()

  const handleCreatePromotion = async ({ schedules, selectedEndDate }) => {
    const uploadedImageUrls = await Promise.all(
      images.map(async ({ file }) => {
        const contentType = file.type || 'image/jpeg'
        const presignedResponse = await getPromotionPresignedUrl({
          fileName: file.name,
          contentType,
        })
        const presignedUrl = presignedResponse.presignedUrl
        const fileUrl = presignedResponse.fileUrl

        await uploadFileToS3({
          presignedUrl,
          file,
          contentType,
        })

        return fileUrl
      }),
    )

    const promotionForm = {
      contentType: contentTypeMap[selectedType],
      promotionTitle: title.trim(),
      prompt: prompt.trim(),
      weatherEnabled: includeWeather,
      mode: selectedMood,
      ...(selectedEndDate && {
        deadline: formatDateTime(getDeadlineDate(selectedEndDate)),
      }),
      imageUrls: uploadedImageUrls,
      tags: hashTags,
      schedules: schedules.map((schedule) => ({
        dayOfWeek: dayOfWeekMap[schedule.day],
        publishTime: formatDateTime(
          getNextPublishDate({
            selectedDay: schedule.day,
            uploadTime: {
              hour: schedule.hour,
              minute: schedule.minute,
            },
          }),
        ),
      })),
    }

    await createPromotion(promotionForm)
    navigate('/makecomplete')
  }

  const handleBack = () => {
    if (step === 'upload') {
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
          <FileUpload
            images={images}
            setImages={setImages}
            onNext={() => setStep('keyword')}
          />
        )}

        {step === 'keyword' && (
          <Keyword
            title={title}
            onTitleChange={(e) => setTitle(e.target.value)}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            includeWeather={includeWeather}
            setIncludeWeather={setIncludeWeather}
            hashTags={hashTags}
            setHashTags={setHashTags}
            prompt={prompt}
            setPrompt={setPrompt}
            onNext={() => setStep('typeSelect')}
          />
        )}

        {step === 'typeSelect' && (
          <TypeSelect
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            onNext={() => setStep('upload')}
          />
        )}

        {step === 'upload' && (
          <Upload onCreate={handleCreatePromotion} />
        )}
      </div>
    </div>
  )
}

export default MakePage
