import { useMemo, useState } from 'react'
import { Check, Mail, MoreHorizontal, Search, X } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import Dropdown from '../../../components/ui/Dropdown'
import type { AdminCustomerMessage, CustomerMessageStatus } from '../../../types/adminCustomers'
import { useI18n } from '../../../i18n/I18nProvider'

const initialMessages: AdminCustomerMessage[] = [
  { id: 1, name: 'Amelia Rose', email: 'amelia.rose@example.com', subject: 'Question about my skincare routine', message: 'Hi Veloura team, I am currently using the Cloud Milk Cleanser and would love to know which serum would pair best with it for sensitive skin.', date: 'Today, 10:42 AM', status: 'New' },
  { id: 2, name: 'Sofia Bennett', email: 'sofia.bennett@example.com', subject: 'Order and delivery question', message: 'Hello, I wanted to check whether my recent order can be delivered before the weekend. Thank you for your help.', date: 'Today, 09:18 AM', status: 'New' },
  { id: 3, name: 'Olivia James', email: 'olivia.james@example.com', subject: 'A little love for Veloura', message: 'Just wanted to say how much I enjoy the Petal Soft Cream. It has become a beautiful part of my evening ritual.', date: 'Yesterday, 04:38 PM', status: 'Replied' },
  { id: 4, name: 'Emma Williams', email: 'emma.williams@example.com', subject: 'Wholesale enquiry', message: 'I would love to learn more about carrying Veloura products in our small boutique. Could you share your wholesale information?', date: 'Yesterday, 01:05 PM', status: 'Read' },
]

const statusStyles: Record<CustomerMessageStatus, string> = {
  New: 'bg-[#f3e4dc] text-[#8e5d5a]',
  Read: 'bg-[#eee8dc] text-[#9a7b52]',
  Replied: 'bg-[#e4efe7] text-[#63846f]',
}

function AdminCustomers() {
  const [messages, setMessages] = useState(initialMessages)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All messages')
  const [selectedMessage, setSelectedMessage] = useState<AdminCustomerMessage | null>(null)
  const { t } = useI18n()
  const filterOptions = ['All messages', 'New', 'Read', 'Replied'].map((item) => ({ label: item, value: item }))

  const filteredMessages = useMemo(() => messages.filter((message) => {
    const query = search.toLowerCase()
    const matchesSearch = `${message.name} ${message.email} ${message.subject}`.toLowerCase().includes(query)
    const matchesFilter = filter === 'All messages' || message.status === filter
    return matchesSearch && matchesFilter
  }), [filter, messages, search])

  function openMessage(message: AdminCustomerMessage) {
    setSelectedMessage(message)
    if (message.status === 'New') {
      setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status: 'Read' } : item))
    }
  }

  function markAsReplied() {
    if (!selectedMessage) return
    const updated = { ...selectedMessage, status: 'Replied' as const }
    setMessages((current) => current.map((item) => item.id === updated.id ? updated : item))
    setSelectedMessage(updated)
  }

  return <AdminShell activeItem="Customers"><main className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mx-auto max-w-[1440px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">{t('admin.workspace')} / {t('admin.customers')}</p><h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">{t('admin.customers')}</h2><p className="mt-2 text-sm text-[#806967]">{t('admin.manageCustomers')}</p></div><div className="flex items-center gap-2 rounded-full bg-[#f3e4dc] px-3 py-2 text-[11px] font-bold text-[#8e5d5a]"><Mail size={14} />{t('admin.contactMessages')}</div></div>
    <section className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Total messages</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">{messages.length}</p></div><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">New messages</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">{messages.filter((message) => message.status === 'New').length}</p></div><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Replied</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">{messages.filter((message) => message.status === 'Replied').length}</p></div></section>
    <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6"><div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><p className="m-0 text-sm font-bold text-[#493331]">Contact messages</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">Messages submitted through the Contact Us form.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[250px]"><Search size={16} strokeWidth={1.7} /><input className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]" placeholder="Search messages..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search customer messages" /></label><Dropdown className="sm:w-[150px]" value={filter} options={filterOptions} onChange={setFilter} ariaLabel="Filter messages" /></div></div>
      {filteredMessages.length === 0 ? <div className="flex min-h-[260px] flex-col items-center justify-center text-center"><Mail className="mb-3 text-[#c29b91]" size={25} /><p className="m-0 font-['Playfair_Display'] text-xl text-[#493331]">No messages found</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">Try another search or filter.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[700px] border-collapse text-left"><thead><tr className="border-b border-[#f0e5de] text-[10px] font-bold uppercase tracking-[.1em] text-[#b09a92]"><th className="pb-3 pl-2">Customer</th><th className="pb-3">Subject</th><th className="pb-3">Date</th><th className="pb-3">Status</th><th className="pb-3 pr-2 text-right">Action</th></tr></thead><tbody>{filteredMessages.map((message) => <tr key={message.id} className={`border-b border-[#f3eae4] last:border-0 ${message.status === 'New' ? 'bg-[#fffaf5]' : ''}`}><td className="py-4 pl-2"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#f3e4dc] text-[10px] font-bold text-[#8e5d5a]">{message.name.split(' ').map((name) => name[0]).join('')}</span><div><p className="m-0 text-xs font-bold text-[#493331]">{message.name}</p><p className="m-0 mt-1 text-[10px] text-[#a38b83]">{message.email}</p></div></div></td><td className="py-4 text-xs font-semibold text-[#493331]">{message.subject}</td><td className="py-4 text-[11px] text-[#9e8780]">{message.date}</td><td className="py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[message.status]}`}>{message.status}</span></td><td className="py-4 pr-2 text-right"><button className="text-[11px] font-bold text-[#a86f6b] hover:text-[#6d4946]" onClick={() => openMessage(message)}>View message</button></td></tr>)}</tbody></table></div>}
    </section>
  </div></main>{selectedMessage && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#3b2a29]/35 p-0 sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedMessage(null) }}><section className="w-full max-w-[560px] rounded-t-[20px] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(59,42,41,.2)] sm:rounded-[20px] sm:p-7" role="dialog" aria-modal="true" aria-labelledby="message-title"><div className="flex items-start justify-between border-b border-[#f0e5de] pb-5"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#a86f6b]">Customer message</p><h3 id="message-title" className="m-0 font-['Playfair_Display'] text-2xl text-[#493331]">{selectedMessage.subject}</h3></div><button className="grid h-9 w-9 place-items-center rounded-full text-[#806967] hover:bg-[#f3e4dc]" onClick={() => setSelectedMessage(null)} aria-label="Close message"><X size={18} /></button></div><div className="pt-5"><p className="m-0 text-sm font-bold text-[#493331]">{selectedMessage.name}</p><p className="m-0 mt-1 text-xs text-[#a38b83]">{selectedMessage.email} · {selectedMessage.date}</p><p className="mt-6 text-sm leading-7 text-[#806967]">{selectedMessage.message}</p><div className="mt-6 flex flex-col gap-3 border-t border-[#f0e5de] pt-5 sm:flex-row sm:justify-between"><span className={`self-start rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[selectedMessage.status]}`}>{selectedMessage.status}</span><button className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] bg-[#6d4946] px-4 text-xs font-bold text-[#fffaf5] disabled:opacity-50" onClick={markAsReplied} disabled={selectedMessage.status === 'Replied'}><Check size={14} />Mark as replied</button></div></div></section></div>}</AdminShell>
}

export default AdminCustomers