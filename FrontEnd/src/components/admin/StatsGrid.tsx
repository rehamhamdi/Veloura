import { stats } from './adminData'
import { useI18n } from '../../i18n/I18nProvider'

function StatsGrid() {
  const { t } = useI18n()
  const labels: Record<string, string> = { 'Total sales': t('admin.totalSales'), 'Total orders': t('admin.totalOrders'), 'Total products': t('admin.totalProducts'), 'Total customers': t('admin.totalCustomers') }
  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, change, icon: Icon, tone }) => <article key={label} className="rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 shadow-[0_8px_25px_rgba(91,55,53,.035)]"><div className="flex items-start justify-between"><div><p className="m-0 text-xs font-semibold text-[#806967]">{labels[label]}</p><p className="mb-0 mt-3 font-['Playfair_Display'] text-[29px] leading-none text-[#493331]">{value}</p></div><span className={`grid h-10 w-10 place-items-center rounded-[12px] ${tone}`}><Icon size={18} strokeWidth={1.7} /></span></div><p className="mt-5 mb-0 text-[11px] text-[#a38b83]"><span className="font-bold text-[#71917b]">{change}</span><span className="ml-1">{t('admin.fromLastMonth')}</span></p></article>)}</section>
}

export default StatsGrid