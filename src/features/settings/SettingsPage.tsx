import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormField,
  Input,
  Select,
  useToast,
} from '@/components/ui'
import { useTheme, type Theme } from '@/context/theme-context'
import { resetDb } from '@/data/store'

const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { show } = useToast()
  const queryClient = useQueryClient()
  const [businessName, setBusinessName] = useState('Reserv')
  const [openingHour, setOpeningHour] = useState('08:00')
  const [closingHour, setClosingHour] = useState('20:00')
  const [resetting, setResetting] = useState(false)

  function saveProfile(event: React.FormEvent) {
    event.preventDefault()
    show({
      tone: 'success',
      title: 'Settings saved',
      description: 'Your business profile has been updated.',
    })
  }

  async function resetDemoData() {
    setResetting(true)
    resetDb()
    await queryClient.invalidateQueries()
    setResetting(false)
    show({
      tone: 'info',
      title: 'Demo data reset',
      description: 'All bookings and invoices were restored to defaults.',
    })
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Business configuration and preferences."
      />

      <div className="flex max-w-2xl flex-col gap-4">
        <Card>
          <CardHeader title="Appearance" />
          <CardBody>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Theme
            </p>
            <div className="inline-flex gap-1 rounded-md border border-border p-0.5">
              {THEMES.map((t) => (
                <Button
                  key={t.value}
                  size="sm"
                  icon={t.icon}
                  variant={theme === t.value ? 'primary' : 'ghost'}
                  onClick={() => setTheme(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Business profile" />
          <CardBody>
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              <FormField label="Business name">
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Opening time">
                  <Select
                    value={openingHour}
                    onChange={(e) => setOpeningHour(e.target.value)}
                  >
                    {Array.from({ length: 13 }, (_, i) => 6 + i).map((h) => {
                      const value = `${String(h).padStart(2, '0')}:00`
                      return (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    })}
                  </Select>
                </FormField>
                <FormField label="Closing time">
                  <Select
                    value={closingHour}
                    onChange={(e) => setClosingHour(e.target.value)}
                  >
                    {Array.from({ length: 13 }, (_, i) => 12 + i).map((h) => {
                      const value = `${String(h).padStart(2, '0')}:00`
                      return (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      )
                    })}
                  </Select>
                </FormField>
              </div>
              <div>
                <Button type="submit" variant="primary" icon="save">
                  Save changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Demo data" />
          <CardBody className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-muted-foreground">
              Restore all sample bookings, customers, and invoices to their
              original state.
            </p>
            <Button
              variant="danger"
              icon="restart_alt"
              loading={resetting}
              onClick={() => void resetDemoData()}
            >
              Reset demo data
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
