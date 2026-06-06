import api from './api'

export const getDashboardStatistics = async ({ startDate, endDate } = {}) => {
  const params = {}

  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate

  const response = await api.get('/api/v1/dashboard/statistics', { params })

  return response.data
}
