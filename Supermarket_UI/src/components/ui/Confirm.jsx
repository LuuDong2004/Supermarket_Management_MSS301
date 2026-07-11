import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AlertTriangle, HelpCircle } from 'lucide-react'
import { Modal } from './Modal.jsx'
import { Button } from './primitives.jsx'

const ConfirmContext = createContext(null)

/**
 * App-wide confirmation dialog.
 *
 *   const confirm = useConfirm()
 *   if (!(await confirm({ title: 'Xóa nhân viên?', danger: true }))) return
 *
 * Resolves true when the user confirms, false otherwise.
 */
export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      resolver.current = resolve
      setDialog({
        title: opts.title || 'Xác nhận thao tác',
        message: opts.message || 'Bạn có chắc chắn muốn thực hiện thao tác này?',
        confirmLabel: opts.confirmLabel || 'Xác nhận',
        cancelLabel: opts.cancelLabel || 'Hủy',
        danger: !!opts.danger,
      })
    })
  }, [])

  const close = (result) => {
    setDialog(null)
    resolver.current?.(result)
    resolver.current = null
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!dialog}
        onClose={() => close(false)}
        size="sm"
        title={dialog?.title}
        footer={
          dialog && (
            <>
              <Button variant="secondary" onClick={() => close(false)}>{dialog.cancelLabel}</Button>
              <Button variant={dialog.danger ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
                {dialog.confirmLabel}
              </Button>
            </>
          )
        }
      >
        {dialog && (
          <div className="flex items-start gap-3">
            <span
              className={
                dialog.danger
                  ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600'
                  : 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600'
              }
            >
              {dialog.danger ? <AlertTriangle size={19} /> : <HelpCircle size={19} />}
            </span>
            <p className="pt-2 text-sm leading-relaxed text-slate-600">{dialog.message}</p>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  )
}
