export interface Gift {
  id: string
  emoji: string
  name: string
  description?: string | null
  reserved: boolean
  reserved_by: string | null
  reserved_phone?: string | null
  reserved_at: string | null
  created_at: string
}
