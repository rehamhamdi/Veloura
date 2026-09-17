import { useMemo, useState } from 'react'
import { MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import Dropdown from '../../../components/ui/Dropdown'
import type { AdminCategory } from '../../../types/adminCategories'
import { useI18n } from '../../../i18n/I18nProvider'

const categories: AdminCategory[] = [
  { id: 1, name: 'Cleansers', description: 'A gentle first step for every ritual.', productCount: 28, status: 'Active', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=85' },
  { id: 2, name: 'Serums', description: 'Targeted care for a dewy complexion.', productCount: 34, status: 'Active', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=85' },
  { id: 3, name: 'Moisturizers', description: 'Comforting hydration, morning to night.', productCount: 24, status: 'Active', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=500&q=85' },
  { id: 4, name: 'Sun care', description: 'Daily protection for healthy-looking skin.', productCount: 16, status: 'Active', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=500&q=85' },
  { id: 5, name: 'Face oils', description: 'Nourishing finishing touches for your ritual.', productCount: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=500&q=85' },
  { id: 6, name: 'Gift sets', description: 'Thoughtful edits for someone special.', productCount: 8, status: 'Draft', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=85' },
]

function AdminCategories() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All status')
  const { t } = useI18n()
  const statusOptions = ['All status', 'Active', 'Draft'].map((item) => ({ label: item, value: item }))
  const filteredCategories = useMemo(() => categories.filter((category) => {
    const matchesSearch = `${category.name} ${category.description}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = status === 'All status' || category.status === status
    return matchesSearch && matchesStatus
  }), [search, status])

  return <AdminShell activeItem="Categories"><main className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mx-auto max-w-[1440px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">{t('admin.workspace')} / {t('admin.categories')}</p><h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">{t('admin.categories')}</h2><p className="mt-2 text-sm text-[#806967]">{t('admin.manageCategories')}</p></div><button className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[11px] bg-[#6d4946] px-4 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.14)] transition hover:bg-[#583a38] sm:self-auto"><Plus size={16} />{t('admin.addCategory')}</button></div>
    <section className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Total categories</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">24</p></div><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Active categories</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">22</p></div><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Products organized</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">186</p></div></section>
    <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6"><div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><p className="m-0 text-sm font-bold text-[#493331]">Category collection</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">Organize products into calm, discoverable edits.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[240px]"><Search size={16} strokeWidth={1.7} /><input className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]" placeholder="Search categories..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search categories" /></label><Dropdown className="sm:w-[135px]" value={status} options={statusOptions} onChange={setStatus} ariaLabel="Filter categories by status" icon={SlidersHorizontal} /></div></div>
      {filteredCategories.length === 0 ? <div className="flex min-h-[260px] flex-col items-center justify-center text-center"><p className="m-0 font-['Playfair_Display'] text-xl text-[#493331]">No categories found</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">Try another search or filter.</p></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredCategories.map((category) => <article key={category.id} className="group overflow-hidden rounded-[14px] border border-[#eee3dc] bg-[#fffaf5] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(91,55,53,.08)]"><div className="relative h-[155px] overflow-hidden bg-[#ead9cf]"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={category.image} alt={category.name} /><div className="absolute inset-0 bg-[#3b2a29]/10" /><button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#fffdf9]/90 text-[#806967] shadow-sm" aria-label={`More actions for ${category.name}`}><MoreHorizontal size={16} /></button></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="m-0 font-['Playfair_Display'] text-xl text-[#493331]">{category.name}</h3><p className="mb-0 mt-1 text-[11px] leading-5 text-[#a38b83]">{category.description}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${category.status === 'Active' ? 'bg-[#e4efe7] text-[#63846f]' : 'bg-[#f6ead1] text-[#9a713c]'}`}>{category.status}</span></div><div className="mt-5 flex items-center justify-between border-t border-[#f0e5de] pt-3"><p className="m-0 text-[10px] text-[#a38b83]">Products in category</p><p className="m-0 text-sm font-bold text-[#6d4946]">{category.productCount}</p></div></div></article>)}</div>}
    </section>
  </div></main></AdminShell>
}

export default AdminCategories