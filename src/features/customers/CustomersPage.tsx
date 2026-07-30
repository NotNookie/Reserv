import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import {
  Avatar,
  Card,
  EmptyState,
  Input,
  Table,
  TableContainer,
  Td,
  Th,
  Tr,
} from '@/components/ui'
import { useCustomers } from '@/data/hooks'
import type { Customer } from '@/data/types'
import { formatDate } from '@/lib/format'
import { rowActivation } from '@/lib/interactions'

function filterCustomers(list: Customer[], query: string): Customer[] {
  const q = query.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q),
  )
}

export function CustomersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const customers = useCustomers()

  const filtered = useMemo(
    () => filterCustomers(customers.data ?? [], search),
    [customers.data, search],
  )

  return (
    <>
      <PageHeader
        title="Customers"
        description="Customer directory and booking history."
      />

      <Card className="mb-4 p-3">
        <Input
          className="max-w-72"
          placeholder="Search name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <Card>
        <QueryState query={customers} loadingLabel="Loading customers…">
          {() =>
            filtered.length === 0 ? (
              <EmptyState
                icon="person_search"
                title="No customers match"
                description="Try a different search term."
              />
            ) : (
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Customer</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Member since</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <Tr
                        key={c.id}
                        className="cursor-pointer"
                        {...rowActivation(() => navigate(`/customers/${c.id}`))}
                      >
                        <Td>
                          <div className="flex items-center gap-2">
                            <Avatar name={c.name} size="sm" />
                            <span className="font-medium text-foreground">
                              {c.name}
                            </span>
                          </div>
                        </Td>
                        <Td className="text-muted-foreground">{c.email}</Td>
                        <Td className="font-mono text-xs text-muted-foreground">
                          {c.phone}
                        </Td>
                        <Td className="whitespace-nowrap text-muted-foreground">
                          {formatDate(c.createdAt)}
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            )
          }
        </QueryState>
      </Card>
    </>
  )
}
