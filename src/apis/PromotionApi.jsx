import axios from 'axios'
import api from './api'

export const getPromotionPresignedUrl = async ({ fileName, contentType }) => {
  const response = await api.post('/api/v1/s3/presigned-url', {
    domain: 'PROMOTION',
    fileName,
    contentType,
  })

  return response.data
}

export const uploadFileToS3 = async ({ presignedUrl, file, contentType }) => {
  await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': contentType,
    },
    withCredentials: false,
  })
}

export const createPromotion = async (promotionForm) => {
  const response = await api.post('/api/v1/promotions', promotionForm)

  return response.data
}

export const getMyPromotions = async () => {
  const response = await api.get('/api/v1/promotions/me')

  return response.data
}

export const getPromotionScheduleQueue = async () => {
  const response = await api.get('/api/v1/promotions/schedules/queue')

  return response.data
}

export const getPromotionDetail = async (promotionId) => {
  const response = await api.get(`/api/v1/promotions/${promotionId}`)

  return response.data
}

export const updatePromotion = async ({ promotionId, promotionForm }) => {
  const response = await api.put(
    `/api/v1/promotions/${promotionId}`,
    promotionForm,
  )

  return response.data
}

export const cancelContent = async (contentId) => {
  const response = await api.patch(`/api/v1/contents/${contentId}/cancel`)

  return response.data
}

export const getContentPreview = async (contentId) => {
  const response = await api.get(`/api/v1/contents/${contentId}/preview`)

  return response.data
}

export const trackContent = async (contentId) => {
  const response = await api.get(`/api/v1/contents/track/${contentId}`)

  return response.data
}
