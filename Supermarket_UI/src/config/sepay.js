// Placeholder payee only. The real account is supplied by the backend
// (/sales/sepay-config, itself fed from SEPAY_* env vars) — never hardcode a
// live bank account here: this file ships in the public frontend bundle.
export const DEFAULT_SEPAY_CONFIG = Object.freeze({
  bankId: 'MB',
  accountNo: '0000000000',
  accountName: 'DEMO ACCOUNT',
})

export function normalizeSePayConfig(config) {
  return {
    bankId: nonEmpty(config?.bankId) || DEFAULT_SEPAY_CONFIG.bankId,
    accountNo: nonEmpty(config?.accountNo) || DEFAULT_SEPAY_CONFIG.accountNo,
    accountName: nonEmpty(config?.accountName) || DEFAULT_SEPAY_CONFIG.accountName,
  }
}

export function buildVietQrUrl(config, { amount, addInfo }) {
  const normalized = normalizeSePayConfig(config)
  const params = new URLSearchParams({
    amount: String(amount ?? ''),
    addInfo: String(addInfo ?? ''),
    accountName: normalized.accountName,
  })

  return `https://img.vietqr.io/image/${normalized.bankId}-${normalized.accountNo}-compact.jpg?${params.toString()}`
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
