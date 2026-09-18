import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock, Mail, LoaderCircle, RefreshCw, Search, Send, X } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import Dropdown from '../../../components/ui/Dropdown'
import { getAdminContacts } from '../../../services/adminContacts'
import type { AdminContactMessage } from '../../../types/adminContacts'
import { useI18n } from '../../../i18n/I18nProvider'

function formatDate(dateStr?: string, language: string = 'en') {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d)
  } catch {
    return dateStr
  }
}

function getInitials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function AdminContacts() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All messages')
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessage | null>(null)
  const { t, language } = useI18n()

  async function loadContacts() {
    setIsLoading(true)
    setError('')
    try {
      const data = await getAdminContacts()
      setMessages(data)
    } catch {
      setError(t('admin.loadContactsError'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadContacts()
  }, [])

  const filterOptions = [
    { label: t('admin.allMessages'), value: 'All messages' },
    { label: t('admin.unread'), value: 'Unread' },
    { label: t('admin.read'), value: 'Read' },
  ]

  const totalCount = messages.length
  const unreadCount = messages.filter((m) => !m.isRead).length
  const readCount = messages.filter((m) => m.isRead).length

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const query = search.toLowerCase()
      const matchesSearch =
        (message.name ?? '').toLowerCase().includes(query) ||
        (message.email ?? '').toLowerCase().includes(query) ||
        (message.message ?? '').toLowerCase().includes(query)

      const matchesFilter =
        filter === 'All messages' ||
        (filter === 'Unread' && !message.isRead) ||
        (filter === 'Read' && message.isRead)

      return matchesSearch && matchesFilter
    })
  }, [filter, messages, search])

  function openMessage(msg: AdminContactMessage) {
    setSelectedMessage(msg)
  }

  return (
    <AdminShell activeItem="Contacts">
      <main className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px]">
          {/* Top Header */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">
                {t('admin.workspace')} / {t('admin.contacts')}
              </p>
              <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">
                {t('admin.contacts')}
              </h2>
              <p className="mt-2 text-sm text-[#806967]">{t('admin.manageContacts')}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[11px] border border-[#e5d6cd] bg-[#fffdf9] px-4 text-xs font-bold text-[#6d4946] transition hover:bg-[#f3e4dc] sm:self-auto"
              onClick={() => void loadContacts()}
              disabled={isLoading}
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              {t('admin.refresh')}
            </button>
          </div>

          {/* Stats Cards */}
          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#806967]">{t('admin.totalMessages')}</p>
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#f3e4dc] text-[#a86f6b]">
                  <Mail size={16} />
                </span>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-2xl font-bold text-[#493331]">{totalCount}</p>
            </div>

            <div className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#806967]">{t('admin.unreadMessages')}</p>
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#fbeae5] text-[#b9685e]">
                  <Clock size={16} />
                </span>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-2xl font-bold text-[#b9685e]">{unreadCount}</p>
            </div>

            <div className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)]">
              <div className="flex items-center justify-between">
                <p className="m-0 text-xs font-semibold text-[#806967]">{t('admin.readMessages')}</p>
                <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#e7eee8] text-[#698674]">
                  <CheckCircle2 size={16} />
                </span>
              </div>
              <p className="mb-0 mt-3 font-['Playfair_Display'] text-2xl font-bold text-[#493331]">{readCount}</p>
            </div>
          </section>

          {/* Main Content Section */}
          <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="m-0 text-sm font-bold text-[#493331]">{t('admin.contactMessages')}</p>
                <p className="mb-0 mt-1 text-xs text-[#a38b83]">
                  {messages.length} {t('admin.contactMessages').toLowerCase()}
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[260px]">
                  <Search size={16} strokeWidth={1.7} />
                  <input
                    className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]"
                    placeholder={t('admin.searchMessages')}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label={t('admin.searchMessages')}
                  />
                </label>
                <Dropdown
                  className="sm:w-[160px]"
                  value={filter}
                  options={filterOptions}
                  onChange={setFilter}
                  ariaLabel="Filter messages"
                />
              </div>
            </div>

            {/* State Handlers */}
            {isLoading && (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 text-sm text-[#806967]">
                <LoaderCircle className="animate-spin text-[#a86f6b]" size={24} />
                <p className="mt-2 text-xs font-semibold text-[#806967]">{t('admin.loadingContacts')}</p>
              </div>
            )}

            {!isLoading && error && (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center">
                <p className="m-0 text-sm text-[#a36c69]">{error}</p>
                <button
                  type="button"
                  className="rounded-[10px] bg-[#6d4946] px-4 py-2 text-xs font-bold text-[#fffaf5] transition hover:bg-[#583a38]"
                  onClick={() => void loadContacts()}
                >
                  {t('admin.tryAgain')}
                </button>
              </div>
            )}

            {!isLoading && !error && filteredMessages.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#f3e4dc] text-[#a86f6b]">
                  <Mail size={22} />
                </div>
                <p className="m-0 font-['Playfair_Display'] text-xl text-[#493331]">
                  {search ? 'No matching messages' : t('admin.noContacts')}
                </p>
                <p className="mb-0 mt-2 max-w-[320px] text-xs leading-5 text-[#a38b83]">
                  {search ? 'Try adjusting your search terms or filters.' : 'Messages submitted via the contact form will appear here.'}
                </p>
              </div>
            )}

            {!isLoading && !error && filteredMessages.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#f0e5de] text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]">
                      <th className="pb-3 pl-3">{t('admin.sender')}</th>
                      <th className="pb-3">{t('admin.message')}</th>
                      <th className="pb-3">{t('admin.date')}</th>
                      <th className="pb-3">{t('admin.status')}</th>
                      <th className="pb-3 pr-3 text-right">{t('admin.action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((msg) => {
                      const isUnread = !msg.isRead
                      return (
                        <tr
                          key={msg.id}
                          className={`border-b border-[#f3eae4] transition hover:bg-[#faf4ee]/60 last:border-0 ${
                            isUnread ? 'bg-[#fffaf5]' : ''
                          }`}
                        >
                          <td className="py-4 pl-3">
                            <div className="flex items-center gap-3">
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f3e4dc] text-[11px] font-bold text-[#8e5d5a]">
                                {getInitials(msg.name)}
                              </span>
                              <div className="min-w-0">
                                <p className="m-0 truncate text-xs font-bold text-[#493331]">{msg.name || 'Anonymous'}</p>
                                <p className="m-0 mt-0.5 truncate text-[11px] text-[#a38b83]">{msg.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="max-w-[320px] py-4 pr-4">
                            <p className="m-0 line-clamp-2 text-xs leading-relaxed text-[#5b4240]">
                              {msg.message}
                            </p>
                          </td>
                          <td className="whitespace-nowrap py-4 text-[11px] text-[#9e8780]">
                            {formatDate(msg.createdAt, language)}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                isUnread
                                  ? 'bg-[#fbeae5] text-[#a85248]'
                                  : 'bg-[#eee8dc] text-[#866e4a]'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isUnread ? 'bg-[#c26257]' : 'bg-[#a38b69]'
                                }`}
                              />
                              {isUnread ? t('admin.unread') : t('admin.read')}
                            </span>
                          </td>
                          <td className="py-4 pr-3 text-right">
                            <button
                              type="button"
                              className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#a86f6b] transition hover:bg-[#f3e4dc] hover:text-[#6d4946]"
                              onClick={() => openMessage(msg)}
                            >
                              {t('admin.viewMessage')}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Message View Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-[#3b2a29]/35 p-0 backdrop-blur-xs sm:items-center sm:p-5"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedMessage(null)
          }}
        >
          <section
            className="w-full max-w-[580px] rounded-t-[20px] bg-[#fffdf9] p-6 shadow-[0_20px_60px_rgba(59,42,41,.2)] sm:rounded-[20px] sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-message-title"
          >
            <div className="flex items-start justify-between border-b border-[#f0e5de] pb-5">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-[#a86f6b]">
                  {t('admin.contactMessages')} #{selectedMessage.id}
                </p>
                <h3 id="contact-message-title" className="m-0 font-['Playfair_Display'] text-2xl text-[#493331]">
                  {selectedMessage.name}
                </h3>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full text-[#806967] transition hover:bg-[#f3e4dc]"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message"
              >
                <X size={18} />
              </button>
            </div>

            <div className="pt-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-[#fcf8f3] p-3.5 border border-[#f0e5de]">
                <div>
                  <p className="m-0 text-[11px] font-semibold text-[#a38b83]">Email</p>
                  <p className="m-0 text-xs font-bold text-[#493331]">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="m-0 text-[11px] font-semibold text-[#a38b83]">{t('admin.date')}</p>
                  <p className="m-0 text-xs font-semibold text-[#6d4946]">
                    {formatDate(selectedMessage.createdAt, language)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#a86f6b]">
                  {t('admin.message')}
                </p>
                <div className="max-h-[260px] overflow-y-auto rounded-[12px] border border-[#f0e5de] bg-[#fffaf5] p-4 text-sm leading-relaxed text-[#493331] whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#f0e5de] pt-5 sm:flex-row sm:justify-between sm:items-center">
                <button
                  type="button"
                  className="h-10 rounded-[11px] border border-[#e5d6cd] bg-[#fffdf9] px-5 text-xs font-bold text-[#6d4946] transition hover:bg-[#f3e4dc]"
                  onClick={() => setSelectedMessage(null)}
                >
                  {t('admin.cancel')}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Veloura - Response to your message`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[11px] bg-[#6d4946] px-5 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.14)] transition hover:bg-[#583a38]"
                >
                  <Send size={14} />
                  {t('admin.replyViaEmail')}
                </a>
              </div>
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  )
}

export default AdminContacts
