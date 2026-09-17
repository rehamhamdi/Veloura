import { useMemo, useState } from 'react'
import { ChevronDown, MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import type { AdminProduct } from '../../../types/adminProducts'

const products: AdminProduct[] = [
  { id: 1, name: 'Cloud Milk Cleanser', category: 'Cleansers', price: '$28.00', stock: 84, sold: 428, status: 'Active', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=320&q=85' },
  { id: 2, name: 'Dew Drop Serum', category: 'Serums', price: '$42.00', stock: 36, sold: 361, status: 'Low stock', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=320&q=85' },
  { id: 3, name: 'Petal Soft Cream', category: 'Moisturizers', price: '$34.00', stock: 62, sold: 284, status: 'Active', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=320&q=85' },
  { id: 4, name: 'Rosewater Essence', category: 'Essences', price: '$31.00', stock: 0, sold: 219, status: 'Out of stock', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=320&q=85' },
  { id: 5, name: 'Silk Veil SPF 30', category: 'Sun care', price: '$26.00', stock: 118, sold: 195, status: 'Active', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=320&q=85' },
  { id: 6, name: 'Night Bloom Oil', category: 'Face oils', price: '$46.00', stock: 19, sold: 167, status: 'Low stock', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9b9f8?auto=format&fit=crop&w=320&q=85' },
]

const statusStyles: Record<AdminProduct['status'], string> = {
  Active: 'bg-[#e4efe7] text-[#63846f]',
  'Low stock': 'bg-[#f6ead1] text-[#9a713c]',
  'Out of stock': 'bg-[#f2e3e1] text-[#a36c69]',
}

function AdminProducts() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [status, setStatus] = useState('All status')

  const categories = ['All categories', ...new Set(products.map((product) => product.category))]
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All categories' || product.category === category
    const matchesStatus = status === 'All status' || product.status === status
    return matchesSearch && matchesCategory && matchesStatus
  }), [category, search, status])

  return <AdminShell activeItem="Products"><main className="min-h-[calc(100vh-76px)] bg-[#f8f3ed] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mx-auto max-w-[1440px]">
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">Workspace / Products</p><h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">Products</h2><p className="mt-2 text-sm text-[#806967]">Curate the essentials that make up the Veloura ritual.</p></div><button className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[11px] bg-[#6d4946] px-4 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.14)] transition hover:bg-[#583a38] sm:self-auto"><Plus size={16} />Add product</button></div>
    <section className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Total products</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">186</p></div><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Active products</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">172</p></div><div className="rounded-[14px] border border-[#eaded5] bg-[#fffdf9] p-4"><p className="m-0 text-[11px] font-semibold text-[#a38b83]">Low stock alerts</p><p className="mb-0 mt-2 font-['Playfair_Display'] text-2xl text-[#493331]">14</p></div></section>
    <section className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)] sm:p-6"><div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><p className="m-0 text-sm font-bold text-[#493331]">Product catalog</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">Manage your skincare collection and inventory.</p></div><div className="flex flex-col gap-2 sm:flex-row"><label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 text-[#b09a92] sm:w-[220px]"><Search size={16} strokeWidth={1.7} /><input className="w-full bg-transparent text-xs text-[#493331] outline-none placeholder:text-[#b09a92]" placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" /></label><label className="relative flex h-10 items-center"><SlidersHorizontal className="pointer-events-none absolute left-3 text-[#a38b83]" size={14} /><select className="h-full appearance-none rounded-full border border-[#e7d9d0] bg-[#fffaf5] pl-9 pr-9 text-xs text-[#806967] outline-none" value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 text-[#a38b83]" size={14} /></label><label className="relative flex h-10 items-center"><select className="h-full appearance-none rounded-full border border-[#e7d9d0] bg-[#fffaf5] px-4 pr-9 text-xs text-[#806967] outline-none" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option>All status</option><option>Active</option><option>Low stock</option><option>Out of stock</option></select><ChevronDown className="pointer-events-none absolute right-3 text-[#a38b83]" size={14} /></label></div></div>
      {filteredProducts.length === 0 ? <div className="flex min-h-[260px] flex-col items-center justify-center text-center"><p className="m-0 font-['Playfair_Display'] text-xl text-[#493331]">No products found</p><p className="mb-0 mt-2 text-xs text-[#a38b83]">Try changing your search or filters.</p></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <article key={product.id} className="group overflow-hidden rounded-[14px] border border-[#eee3dc] bg-[#fffaf5] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(91,55,53,.08)]"><div className="relative h-[190px] overflow-hidden bg-[#ead9cf]"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} /><button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#fffdf9]/90 text-[#806967] shadow-sm" aria-label={`More actions for ${product.name}`}><MoreHorizontal size={16} /></button><span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[product.status]}`}>{product.status}</span></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="m-0 text-xs font-bold text-[#493331]">{product.name}</p><p className="m-0 mt-1 text-[10px] text-[#a38b83]">{product.category}</p></div><p className="m-0 text-sm font-bold text-[#6d4946]">{product.price}</p></div><div className="mt-5 flex items-end justify-between border-t border-[#f0e5de] pt-3"><div><p className="m-0 text-[10px] text-[#a38b83]">Inventory</p><p className={`m-0 mt-1 text-xs font-bold ${product.stock === 0 ? 'text-[#a36c69]' : product.stock < 40 ? 'text-[#9a713c]' : 'text-[#63846f]'}`}>{product.stock} units</p></div><p className="m-0 text-[10px] text-[#a38b83]">{product.sold} sold</p></div></div></article>)}</div>}
    </section>
  </div></main></AdminShell>
}

export default AdminProducts