import axios from 'axios'
import api from './api'
import { schedulesOverlap, SCHEDULE_CONFLICT_MESSAGE } from '../utils/promotionSchedule'

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

export const validatePromotionSchedules = async ({ schedules, deadline, promotionId }) => {
  const now = new Date()
  for (let index = 0; index < schedules.length; index += 1) {
    if (schedules.slice(0, index).some((other) =>
      schedulesOverlap(schedules[index], deadline, other, deadline, now))) {
      throw new Error('같은 요일과 시간이 중복되어 있어요. 예약 시간을 확인해주세요.')
    }
  }

  const promotions = await getMyPromotions()
  if (!Array.isArray(promotions)) {
    throw new Error('기존 예약을 확인하지 못했어요. 잠시 후 다시 시도해주세요.')
  }
  const others = promotions.filter((item) =>
    promotionId == null || String(item.promotionId) !== String(promotionId))
  const details = await Promise.all(others.map((item) => {
    if (item.promotionId == null) {
      throw new Error('기존 예약을 확인하지 못했어요. 잠시 후 다시 시도해주세요.')
    }
    return getPromotionDetail(item.promotionId)
  }))

  for (const detail of details) {
    if (!Array.isArray(detail?.schedules)) {
      throw new Error('기존 예약을 확인하지 못했어요. 잠시 후 다시 시도해주세요.')
    }
    if (schedules.some((schedule) => detail.schedules.some((other) =>
      schedulesOverlap(schedule, deadline, other, detail.deadline, now)))) {
      throw new Error(SCHEDULE_CONFLICT_MESSAGE)
    }
  }
}

export const updatePromotion = async ({ promotionId, promotionForm }) => {
  const response = await api.put(
    `/api/v1/promotions/${promotionId}`,
    promotionForm,
  )

  return response.data
}

export const deletePromotion = async (promotionId) => {
  await api.delete(`/api/v1/promotions/${promotionId}`)
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
