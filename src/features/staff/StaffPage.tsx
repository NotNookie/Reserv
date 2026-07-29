import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryState } from '@/components/QueryState'
import { Avatar, Badge, Card, CardBody, Icon } from '@/components/ui'
import { useStaff } from '@/data/hooks'

export function StaffPage() {
  const navigate = useNavigate()
  const staff = useStaff()

  return (
    <>
      <PageHeader title="Staff" description="Team directory and assignments." />
      <QueryState query={staff} loadingLabel="Loading staff…">
        {(list) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((member) => (
              <Card key={member.id}>
                <CardBody>
                  <button
                    type="button"
                    onClick={() => navigate(`/staff/${member.id}`)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <Avatar name={member.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                    {member.active ? (
                      <Badge tone="confirmed">Active</Badge>
                    ) : (
                      <Badge tone="neutral">Inactive</Badge>
                    )}
                  </button>
                  <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Icon name="mail" className="text-[16px]" />
                      {member.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Icon name="call" className="text-[16px]" />
                      {member.phone}
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </QueryState>
    </>
  )
}
