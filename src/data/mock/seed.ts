import type {
  Booking,
  BookingStatus,
  Customer,
  Resource,
  Service,
  Staff,
} from '../types'

export interface SeedData {
  customers: Customer[]
  staff: Staff[]
  resources: Resource[]
  services: Service[]
  bookings: Booking[]
}

const CUSTOMER_NAMES = [
  'Eleanor Vance',
  'John Doe',
  'Alice Johnson',
  'Marcus Chen',
  'Priya Patel',
  'Diego Morales',
  'Sofia Rossi',
  'Liam O’Brien',
  'Amara Okafor',
  'Noah Weber',
  'Yuki Tanaka',
  'Grace Kim',
]

const STAFF_SEED: Array<Omit<Staff, 'id'>> = [
  {
    name: 'Eduardo Santos',
    role: 'Senior Specialist',
    email: 'eduardo@reserv.app',
    phone: '(555) 010-2001',
    active: true,
  },
  {
    name: 'Maria Flores',
    role: 'Specialist',
    email: 'maria@reserv.app',
    phone: '(555) 010-2002',
    active: true,
  },
  {
    name: 'David Park',
    role: 'Specialist',
    email: 'david@reserv.app',
    phone: '(555) 010-2003',
    active: true,
  },
  {
    name: 'Hannah Berg',
    role: 'Associate',
    email: 'hannah@reserv.app',
    phone: '(555) 010-2004',
    active: true,
  },
  {
    name: 'Omar Haddad',
    role: 'Associate',
    email: 'omar@reserv.app',
    phone: '(555) 010-2005',
    active: false,
  },
]

const RESOURCE_SEED: Array<Omit<Resource, 'id'>> = [
  {
    name: 'Room A',
    kind: 'room',
    capacity: 2,
    status: 'available',
    location: 'Floor 1',
  },
  {
    name: 'Room B',
    kind: 'room',
    capacity: 2,
    status: 'occupied',
    location: 'Floor 1',
  },
  {
    name: 'Room C',
    kind: 'room',
    capacity: 4,
    status: 'available',
    location: 'Floor 2',
  },
  {
    name: 'Station 1',
    kind: 'station',
    capacity: 1,
    status: 'available',
    location: 'Floor 1',
  },
  {
    name: 'Station 2',
    kind: 'station',
    capacity: 1,
    status: 'maintenance',
    location: 'Floor 1',
  },
  {
    name: 'Suite 1',
    kind: 'unit',
    capacity: 6,
    status: 'available',
    location: 'Floor 3',
  },
]

const SERVICE_SEED: Array<Omit<Service, 'id'>> = [
  {
    name: 'Quick Consultation',
    durationMinutes: 30,
    price: 70,
    category: 'Consultation',
  },
  {
    name: 'Standard Session',
    durationMinutes: 60,
    price: 120,
    category: 'Session',
  },
  {
    name: 'Extended Session',
    durationMinutes: 90,
    price: 170,
    category: 'Session',
  },
  {
    name: 'Assessment',
    durationMinutes: 45,
    price: 95,
    category: 'Assessment',
  },
  {
    name: 'Follow-up',
    durationMinutes: 20,
    price: 50,
    category: 'Consultation',
  },
]

function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function at(base: Date, dayOffset: number, hour: number, minute: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, minute, 0, 0)
  return d
}

function pickStatus(dayOffset: number, index: number): BookingStatus {
  if (dayOffset < 0) {
    const past: BookingStatus[] = [
      'completed',
      'completed',
      'no_show',
      'cancelled',
    ]
    return past[index % past.length]!
  }
  if (dayOffset === 0) {
    const today: BookingStatus[] = [
      'completed',
      'arrived',
      'confirmed',
      'pending',
    ]
    return today[index % today.length]!
  }
  const future: BookingStatus[] = ['confirmed', 'confirmed', 'pending']
  return future[index % future.length]!
}

/** Build a fresh, internally-consistent dataset (no resource time overlaps). */
export function createSeedData(): SeedData {
  const customers: Customer[] = CUSTOMER_NAMES.map((name, i) => ({
    id: `c${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
    phone: `(555) 020-${String(1000 + i)}`,
    createdAt: at(startOfToday(), -30 - i, 9, 0).toISOString(),
  }))

  const staff: Staff[] = STAFF_SEED.map((s, i) => ({ ...s, id: `s${i + 1}` }))
  const resources: Resource[] = RESOURCE_SEED.map((r, i) => ({
    ...r,
    id: `r${i + 1}`,
  }))
  const services: Service[] = SERVICE_SEED.map((s, i) => ({
    ...s,
    id: `svc${i + 1}`,
  }))

  const base = startOfToday()
  const bookings: Booking[] = []
  let counter = 0
  const activeStaff = staff.filter((s) => s.active)

  for (const dayOffset of [-1, 0, 1, 2, 3]) {
    // Use the first four resources for scheduling to keep some free capacity.
    resources.slice(0, 4).forEach((resource, resourceIdx) => {
      let cursorMinutes = 9 * 60 // start at 09:00
      const bookingsPerResource = 2 + ((dayOffset + resourceIdx) % 2)
      for (let n = 0; n < bookingsPerResource; n++) {
        const service = services[counter % services.length]!
        const customer = customers[counter % customers.length]!
        const staffMember = activeStaff[counter % activeStaff.length]!
        const startHour = Math.floor(cursorMinutes / 60)
        const startMin = cursorMinutes % 60
        const start = at(base, dayOffset, startHour, startMin)
        const end = new Date(start.getTime() + service.durationMinutes * 60_000)
        const status = pickStatus(dayOffset, counter)

        const booking: Booking = {
          id: `b${counter + 1}`,
          customerId: customer.id,
          serviceId: service.id,
          staffId: staffMember.id,
          resourceIds: [resource.id],
          startAt: start.toISOString(),
          endAt: end.toISOString(),
          status,
          createdAt: at(base, dayOffset - 5, 12, 0).toISOString(),
        }
        if (status === 'arrived' || status === 'completed') {
          booking.checkInAt = start.toISOString()
        }
        if (status === 'completed') {
          booking.checkOutAt = end.toISOString()
        }
        bookings.push(booking)

        // Advance cursor past this booking + a 15-min buffer.
        cursorMinutes += service.durationMinutes + 15
        counter++
      }
    })
  }

  return { customers, staff, resources, services, bookings }
}
