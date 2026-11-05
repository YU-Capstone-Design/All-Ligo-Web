import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getVideoPlayback, getYouTubeEmbedUrl } from '../src/utils/videoPlayback.js'

const id = 'lG5I-54xo7s'
const embed = `https://www.youtube.com/embed/${id}`
test('supports Shorts, watch, share, and embed links', () => {
  for (const url of [`https://youtube.com/shorts/${id}`, `https://www.youtube.com/watch?v=${id}&t=1`, `https://youtu.be/${id}?si=abc`, embed]) {
    assert.equal(getYouTubeEmbedUrl(url), embed)
  }
})
test('rejects invalid and unrelated URLs', () => {
  for (const url of ['', 'invalid', `https://youtube.com.evil.com/shorts/${id}`, 'https://youtube.com/watch?v=bad']) {
    assert.equal(getYouTubeEmbedUrl(url), '')
  }
})
test('uses S3 before publication even when YouTube URL exists', () => {
  assert.deepEqual(getVideoPlayback({ status: 'GENERATED', s3VideoUrl: 'https://example.com/video.mp4', uploadVideoUrl: embed }), {
    videoUrl: 'https://example.com/video.mp4', youtubeEmbedUrl: '',
  })
})
test('uses YouTube after publication even when S3 URL exists', () => {
  assert.deepEqual(getVideoPlayback({ status: 'PUBLISHED', s3VideoUrl: 'https://example.com/video.mp4', uploadVideoUrl: `https://youtube.com/shorts/${id}` }), {
    videoUrl: '', youtubeEmbedUrl: embed,
  })
})
test('does not pass local paths or YouTube page URLs to the video element', () => {
  assert.equal(getVideoPlayback({ status: 'GENERATED', localVideoPath: 'static/videos/a.mp4', uploadVideoUrl: embed }).videoUrl, '')
  assert.deepEqual(getVideoPlayback({ status: 'PUBLISHED', uploadVideoUrl: 'invalid' }), { videoUrl: '', youtubeEmbedUrl: '' })
})
