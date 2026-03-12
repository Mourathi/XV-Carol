export interface Gift {
  id: string
  emoji: string
  name: string
  description?: string | null
  reserved?: boolean
  reserved_by?: string | null
  reserved_phone?: string | null
  reserved_at?: string | null
  created_at: string
}

export interface GiftChoice {
  id: string
  gift_id: string
  name: string
  phone?: string
  created_at: string
}

export interface GiftWithChoices extends Gift {
  gift_choices: GiftChoice[]
}
