import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  Input,
  Select,
  StatCard,
  Table,
  TableContainer,
  Td,
  Th,
  Tr,
  useToast,
} from '@/components/ui'
import { useInvoices, useRefundInvoice } from '@/data/hooks'
import type { InvoiceFilters } from '@/data/services'
import { INVOICE_STATUS_META } from '@/data/status'
import {
  INVOICE_STATUSES,
  type InvoiceStatus,
  type InvoiceWithRelations,
} from '@/data/types'
import { formatDate, formatMoney } from '@/lib/format'
import { RecordPaymentModal } from './components/RecordPaymentModal'

function computeTotals(rows: InvoiceWithRelations[]) {
  return {
    outstanding: rows
      .filter((i) => i.status === 'unpaid')
      .reduce((sum, i) => sum + i.amount, 0),
    collected: rows
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0),
    unpaidCount: rows.filter((i) => i.status === 'unpaid').length,
  }
}

export function BillingPage() {
  const { show } = useToast()
  const [filters, setFilters] = useState<InvoiceFilters>({})
  const [paying, setPaying] = useState<InvoiceWithRelations | null>(null)
  const invoices = useInvoices(filters)
  const refund = useRefundInvoice()

  const totals = useMemo(
    () => computeTotals(invoices.data ?? []),
    [invoices.data],
  )

  function update<K extends keyof InvoiceFilters>(
    key: K,
    value: InvoiceFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }))
  }

  async function handleRefund(invoice: InvoiceWithRelations) {
    try {
      await refund.mutateAsync(invoice.id)
      show({ tone: 'success', title: `Refunded ${invoice.number}` })
    } catch (error) {
      show({
        tone: 'error',
        title: 'Could not refund',
        description: error instanceof Error ? error.message : undefined,
      })
    }
  }

  return (
    <>
      <PageHeader
        title="Billing"
        description="Invoices and payments across bookings."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Outstanding"
          value={formatMoney(totals.outstanding)}
          hint={`${totals.unpaidCount} unpaid invoices`}
          icon="account_balance_wallet"
        />
        <StatCard
          label="Collected"
          value={formatMoney(totals.collected)}
          icon="payments"
        />
        <StatCard
          label="Invoices"
          value={invoices.data?.length ?? 0}
          icon="receipt_long"
        />
      </div>

      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-64"
            placeholder="Search number or customer…"
            value={filters.search ?? ''}
            onChange={(e) => update('search', e.target.value)}
          />
          <Select
            className="max-w-44"
            value={filters.status ?? ''}
            onChange={(e) =>
              update('status', (e.target.value as InvoiceStatus) || undefined)
            }
          >
            <option value="">All statuses</option>
            {INVOICE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {INVOICE_STATUS_META[s].label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card>
        <QueryState
          query={invoices}
          isEmpty={(data) => data.length === 0}
          empty={
            <EmptyState
              icon="receipt_long"
              title="No invoices match"
              description="Try adjusting the filters."
            />
          }
          loadingLabel="Loading invoices…"
        >
          {(rows) => (
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <Th>Invoice</Th>
                    <Th>Customer</Th>
                    <Th>Service</Th>
                    <Th>Issued</Th>
                    <Th className="text-right">Amount</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((inv) => (
                    <Tr key={inv.id}>
                      <Td className="font-mono text-xs font-medium text-foreground">
                        {inv.number}
                      </Td>
                      <Td>
                        <Link
                          to={`/customers/${inv.customer.id}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {inv.customer.name}
                        </Link>
                      </Td>
                      <Td className="text-muted-foreground">
                        {inv.service.name}
                      </Td>
                      <Td className="whitespace-nowrap text-muted-foreground">
                        {formatDate(inv.issuedAt)}
                      </Td>
                      <Td className="text-right font-medium text-foreground">
                        {formatMoney(inv.amount)}
                      </Td>
                      <Td>
                        <Badge tone={INVOICE_STATUS_META[inv.status].tone}>
                          {INVOICE_STATUS_META[inv.status].label}
                        </Badge>
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/bookings/${inv.bookingId}`}
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
                            aria-label="View booking"
                            title="View booking"
                          >
                            <Icon name="open_in_new" className="text-[18px]" />
                          </Link>
                          {inv.status === 'unpaid' && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setPaying(inv)}
                            >
                              Record payment
                            </Button>
                          )}
                          {inv.status === 'paid' && (
                            <Button
                              size="sm"
                              variant="danger"
                              loading={refund.isPending}
                              onClick={() => void handleRefund(inv)}
                            >
                              Refund
                            </Button>
                          )}
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}
        </QueryState>
      </Card>

      {paying && (
        <RecordPaymentModal
          open
          invoice={paying}
          onClose={() => setPaying(null)}
        />
      )}
    </>
  )
}
