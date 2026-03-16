import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '@/hooks/useAdmin'

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '-'
  }
}

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return phone
}

function escapeCSV(s: string) {
  if (s.includes(';') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function SortHeader({
  label,
  col,
  currentCol,
  dir,
  onClick,
}: {
  label: string
  col: string
  currentCol: string
  dir: SortDir
  onClick: () => void
}) {
  const active = currentCol === col
  return (
    <th className="text-left px-4 py-3 text-rose-deep font-medium whitespace-nowrap bg-white">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1 hover:text-rose-deep/80 transition-colors"
      >
        {label}
        <span className="text-rose-light text-xs">
          {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  )
}

function exportToCSV(
  headers: string[],
  rows: string[][],
  filename: string
) {
  const BOM = '\uFEFF'
  const headerRow = headers.map(escapeCSV).join(';')
  const dataRows = rows.map((r) => r.map(escapeCSV).join(';'))
  const csv = [headerRow, ...dataRows].join('\n')
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

type Tab = 'presenca' | 'presentes'
type SortDir = 'asc' | 'desc'

export function Admin() {
  const { rsvps, giftChoices, bookChoices, loading, error } = useAdmin()
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('presenca')
  const [sortPresenca, setSortPresenca] = useState<{ col: string; dir: SortDir }>({ col: 'data', dir: 'desc' })
  const [sortPresentes, setSortPresentes] = useState<{ col: string; dir: SortDir }>({ col: 'data', dir: 'desc' })
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  const sortedRsvps = [...rsvps].sort((a, b) => {
    const mult = sortPresenca.dir === 'asc' ? 1 : -1
    if (sortPresenca.col === 'nome') return mult * a.name.localeCompare(b.name)
    if (sortPresenca.col === 'telefone') return mult * a.phone.localeCompare(b.phone)
    return mult * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  })

  const allPresentes = [
    ...giftChoices.map((g) => ({ ...g, tipo: 'gift' as const })),
    ...bookChoices.map((b) => ({ ...b, tipo: 'book' as const, gift_emoji: '📖', gift_name: `${b.book_title} (Livro de Romance)` })),
  ]
  const sortedPresentes = [...allPresentes].sort((a, b) => {
    const mult = sortPresentes.dir === 'asc' ? 1 : -1
    if (sortPresentes.col === 'presente') return mult * (a.gift_name ?? '').localeCompare(b.gift_name ?? '')
    if (sortPresentes.col === 'nome') return mult * a.name.localeCompare(b.name)
    return mult * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  })

  useEffect(() => {
    if (!adminPassword) setUnlocked(true)
  }, [adminPassword])

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === adminPassword) setUnlocked(true)
  }

  const exportDate = () => {
    const d = new Date()
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`
  }

  const handleExportPresenca = () => {
    const headers = ['Nome', 'Telefone', 'Data', 'Hora']
    const rows = sortedRsvps.map((r) => [
      r.name,
      r.phone,
      formatDate(r.created_at),
      formatTime(r.created_at),
    ])
    exportToCSV(headers, rows, `presenca-${exportDate()}.csv`)
  }

  const handleExportPresentes = () => {
    const headers = ['Presente', 'Quem vai dar', 'Data', 'Hora']
    const rows = sortedPresentes.map((g) => [
      `${g.gift_emoji} ${g.gift_name}`,
      g.name,
      formatDate(g.created_at),
      formatTime(g.created_at),
    ])
    exportToCSV(headers, rows, `presentes-${exportDate()}.csv`)
  }

  if (adminPassword && !unlocked) {
    return (
      <div className="min-h-screen bg-rose-blush/30 flex items-center justify-center p-4">
        <form
          onSubmit={handleUnlock}
          className="bg-white p-8 rounded-soft shadow-card border border-rose-pale/60 max-w-sm w-full"
        >
          <h1 className="font-playfair text-rose-deep text-xl mb-4">Acesso Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-3 border border-rose-pale/60 rounded-elegant mb-4 font-cormorant"
          />
          <button
            type="submit"
            className="w-full py-3 bg-rose text-white rounded-elegant font-cormorant hover:bg-rose-deep"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-blush/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-playfair text-rose-deep text-2xl md:text-3xl font-medium">
            Painel Admin
          </h1>
          <Link
            to="/"
            className="font-cormorant text-rose-deep hover:text-rose-deep/80 text-sm"
          >
            ← Voltar ao convite
          </Link>
        </div>

        {loading ? (
          <p className="font-cormorant text-rose-light text-center py-12">Carregando...</p>
        ) : error ? (
          <p className="font-cormorant text-rose-deep text-center py-12">{error}</p>
        ) : (
          <div className="bg-white rounded-soft shadow-soft border border-rose-pale/50 overflow-hidden">
            {/* Tabbar */}
            <div className="flex border-b border-rose-pale/40">
              <button
                type="button"
                onClick={() => setActiveTab('presenca')}
                className={`flex-1 px-6 py-4 font-cormorant font-medium transition-colors ${
                  activeTab === 'presenca'
                    ? 'bg-rose-blush/50 text-rose-deep border-b-2 border-rose'
                    : 'text-rose-light hover:bg-rose-blush/20 hover:text-rose-deep'
                }`}
              >
                Presença ({rsvps.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presentes')}
                className={`flex-1 px-6 py-4 font-cormorant font-medium transition-colors ${
                  activeTab === 'presentes'
                    ? 'bg-rose-blush/50 text-rose-deep border-b-2 border-rose'
                    : 'text-rose-light hover:bg-rose-blush/20 hover:text-rose-deep'
                }`}
              >
                Presentes ({giftChoices.length + bookChoices.length})
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              {activeTab === 'presenca' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={handleExportPresenca}
                      disabled={rsvps.length === 0}
                      className="px-4 py-2 font-cormorant text-sm bg-rose text-white rounded-elegant hover:bg-rose-deep disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Exportar CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full min-w-[500px] font-cormorant text-sm border-collapse">
                      <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.08)]">
                        <tr>
                          <SortHeader
                            label="Nome"
                            col="nome"
                            currentCol={sortPresenca.col}
                            dir={sortPresenca.dir}
                            onClick={() =>
                              setSortPresenca((s) => ({
                                col: 'nome',
                                dir: s.col === 'nome' && s.dir === 'asc' ? 'desc' : 'asc',
                              }))
                            }
                          />
                          <SortHeader
                            label="Telefone"
                            col="telefone"
                            currentCol={sortPresenca.col}
                            dir={sortPresenca.dir}
                            onClick={() =>
                              setSortPresenca((s) => ({
                                col: 'telefone',
                                dir: s.col === 'telefone' && s.dir === 'asc' ? 'desc' : 'asc',
                              }))
                            }
                          />
                          <SortHeader
                            label="Data"
                            col="data"
                            currentCol={sortPresenca.col}
                            dir={sortPresenca.dir}
                            onClick={() =>
                              setSortPresenca((s) => ({
                                col: 'data',
                                dir: s.col === 'data' && s.dir === 'asc' ? 'desc' : 'asc',
                              }))
                            }
                          />
                          <th className="text-left px-4 py-3 text-rose-deep font-medium whitespace-nowrap bg-white">Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRsvps.map((r) => (
                          <tr key={r.id} className="border-t border-rose-pale/30 hover:bg-rose-blush/10">
                            <td className="px-4 py-3 text-rose-deep">{r.name}</td>
                            <td className="px-4 py-3 text-rose-light">
                              <a href={`tel:${r.phone}`} className="hover:text-rose-deep">
                                {formatPhone(r.phone)}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-rose-deep font-medium">{formatDate(r.created_at)}</td>
                            <td className="px-4 py-3 text-rose-light">{formatTime(r.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rsvps.length === 0 && (
                    <p className="font-cormorant text-rose-light text-center py-12">Nenhuma confirmação ainda.</p>
                  )}
                </>
              )}

              {activeTab === 'presentes' && (
                <>
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={handleExportPresentes}
                      disabled={giftChoices.length === 0 && bookChoices.length === 0}
                      className="px-4 py-2 font-cormorant text-sm bg-rose text-white rounded-elegant hover:bg-rose-deep disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Exportar CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full min-w-[500px] font-cormorant text-sm border-collapse">
                      <thead className="bg-white sticky top-0 z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.08)]">
                        <tr>
                          <SortHeader
                            label="Presente"
                            col="presente"
                            currentCol={sortPresentes.col}
                            dir={sortPresentes.dir}
                            onClick={() =>
                              setSortPresentes((s) => ({
                                col: 'presente',
                                dir: s.col === 'presente' && s.dir === 'asc' ? 'desc' : 'asc',
                              }))
                            }
                          />
                          <SortHeader
                            label="Quem vai dar"
                            col="nome"
                            currentCol={sortPresentes.col}
                            dir={sortPresentes.dir}
                            onClick={() =>
                              setSortPresentes((s) => ({
                                col: 'nome',
                                dir: s.col === 'nome' && s.dir === 'asc' ? 'desc' : 'asc',
                              }))
                            }
                          />
                          <SortHeader
                            label="Data"
                            col="data"
                            currentCol={sortPresentes.col}
                            dir={sortPresentes.dir}
                            onClick={() =>
                              setSortPresentes((s) => ({
                                col: 'data',
                                dir: s.col === 'data' && s.dir === 'asc' ? 'desc' : 'asc',
                              }))
                            }
                          />
                          <th className="text-left px-4 py-3 text-rose-deep font-medium whitespace-nowrap bg-white">Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPresentes.map((g) => (
                          <tr key={g.id} className="border-t border-rose-pale/30 hover:bg-rose-blush/10">
                            <td className="px-4 py-3 text-rose-deep">
                              <span className="mr-2" aria-hidden>{g.gift_emoji}</span>
                              {g.gift_name}
                            </td>
                            <td className="px-4 py-3 text-rose-light">{g.name}</td>
                            <td className="px-4 py-3 text-rose-deep font-medium">{formatDate(g.created_at)}</td>
                            <td className="px-4 py-3 text-rose-light">{formatTime(g.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {giftChoices.length === 0 && bookChoices.length === 0 && (
                    <p className="font-cormorant text-rose-light text-center py-12">Nenhuma escolha ainda.</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
