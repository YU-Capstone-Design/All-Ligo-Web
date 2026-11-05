import { test } from 'node:test'
import assert from 'node:assert/strict'
import { schedulesOverlap } from '../src/utils/promotionSchedule.js'

const booking = (publishTime, dayOfWeek = 'MONDAY') => ({ publishTime, dayOfWeek })
const first = booking('2026-11-09T10:00:00')
const later = booking('2026-11-16T10:00:00')
const now = new Date('2026-11-05T09:00:00')
const overlaps = (a, endA, b, endB) => schedulesOverlap(a, endA, b, endB, now)

test('weekly reservations collide even with different initial dates and no deadline', () => {
  assert.equal(overlaps(first, null, later, null), true)
})

test('non-overlapping periods do not collide', () => {
  assert.equal(overlaps(first, '2026-11-15T23:59:00', later, null), false)
})

test('deadline includes the exact occurrence but excludes earlier times', () => {
  assert.equal(overlaps(first, '2026-11-16T10:00:00', later, null), true)
  assert.equal(overlaps(first, '2026-11-16T09:59:00', later, null), false)
})

test('different weekdays or minutes do not collide', () => {
  assert.equal(overlaps(first, null, booking('2026-11-10T10:00:00', 'TUESDAY'), null), false)
  assert.equal(overlaps(first, null, booking('2026-11-09T10:01:00'), null), false)
})

test('expired reservations do not block new ones', () => {
  assert.equal(overlaps(booking('2026-10-26T10:00:00'), '2026-11-02T23:59:00', first, null), false)
})

test('invalid schedule data prevents a false successful validation', () => {
  assert.throws(() => overlaps(booking('invalid'), null, first, null))
  assert.throws(() => overlaps(first, 'invalid', later, null))
})
