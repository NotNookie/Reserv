import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/ui'

export interface ComingSoonProps {
  title: string
  description: string
  icon: string
  phase: string
}

/** Temporary placeholder for pages that arrive in a later build phase. */
export function ComingSoon({
  title,
  description,
  icon,
  phase,
}: ComingSoonProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title={`${title} is coming soon`}
        description={`This module is scheduled for ${phase}.`}
      />
    </>
  )
}
