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
