export const getYouTubeEmbedUrl = (value) => {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return ''
    const host = url.hostname.toLowerCase()
    let id
    if (host === 'youtu.be') {
      id = url.pathname.split('/')[1]
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      const parts = url.pathname.split('/')
      id = url.pathname === '/watch' ? url.searchParams.get('v')
        : ['shorts', 'embed'].includes(parts[1]) ? parts[2] : ''
    }
    return /^[\w-]{11}$/.test(id || '') ? `https://www.youtube.com/embed/${id}` : ''
  } catch {
    return ''
  }
}

export const getVideoPlayback = (preview) => {
  const uploaded = preview.status === 'PUBLISHED'
  return {
    youtubeEmbedUrl: uploaded ? getYouTubeEmbedUrl(preview.uploadVideoUrl) : '',
    videoUrl: uploaded ? '' : preview.s3VideoUrl || '',
  }
}
