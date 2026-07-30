import { useState } from 'react'
import { Button, FormField, Modal, Select, useToast } from '@/components/ui'
import { useMarkInvoicePaid } from '@/data/hooks'
import {
  PAYMENT_METHODS,
  type InvoiceWithRelations,
  type PaymentMethod,
} from '@/data/types'
import { formatMoney } from '@/lib/format'

const METHOD_LABEL: Record<PaymentMethod, string> = {
  card: 'Card',
  cash: 'Cash',
  transfer: 'Bank transfer',
}

export interface RecordPaymentModalProps {
  open: boolean
  onClose: () => void
  invoice: InvoiceWithRelations
}

export function RecordPaymentModal({
  open,
  onClose,
  invoice,
}: RecordPaymentModalProps) {
  const { show } = useToast()
  const markPaid = useMarkInvoicePaid()
  const [method, setMethod] = useState<PaymentMethod>('card')

  async function handleConfirm() {
    try {
      await markPaid.mutateAsync({ id: invoice.id, method })
      show({
        tone: 'success',
        title: 'Payment recorded',
        description: `${invoice.number} · ${formatMoney(invoice.amount)}`,
      })
      onClose()
    } catch (error) {
      show({
        tone: 'error',
        title: 'Could not record payment',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record payment"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon="payments"
            loading={markPaid.isPending}
            onClick={() => void handleConfirm()}
          >
            Confirm payment
          </Button>
        </>
      }
    >
      <div className="mb-4 flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3">
        <div>
          <p className="text-[13px] font-semibold text-foreground">
            {invoice.number}
          </p>
          <p className="text-xs text-muted-foreground">
            {invoice.customer.name} · {invoice.service.name}
          </p>
        </div>
        <p className="text-lg font-semibold text-foreground">
          {formatMoney(invoice.amount)}
        </p>
      </div>

      <FormField label="Payment method">
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {METHOD_LABEL[m]}
            </option>
          ))}
        </Select>
      </FormField>
    </Modal>
  )
}
