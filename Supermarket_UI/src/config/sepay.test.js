import assert from 'node:assert/strict'
import test from 'node:test'

import { DEFAULT_SEPAY_CONFIG, buildVietQrUrl } from './sepay.js'

test('default SePay config uses the registered MB account', () => {
  assert.deepEqual(DEFAULT_SEPAY_CONFIG, {
    bankId: 'MB',
    accountNo: '0369666456',
    accountName: 'NGUYEN DUY THANG',
  })
})

test('buildVietQrUrl targets the configured account and encodes transfer data', () => {
  const url = new URL(buildVietQrUrl(DEFAULT_SEPAY_CONFIG, {
    amount: 125000,
    addInfo: 'INV-1720282531000',
  }))

  assert.equal(url.origin, 'https://img.vietqr.io')
  assert.equal(url.pathname, '/image/MB-0369666456-compact.jpg')
  assert.equal(url.searchParams.get('amount'), '125000')
  assert.equal(url.searchParams.get('addInfo'), 'INV-1720282531000')
  assert.equal(url.searchParams.get('accountName'), 'NGUYEN DUY THANG')
})
