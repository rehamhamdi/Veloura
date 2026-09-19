import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import AdminShell from '../../../components/admin/AdminShell'
import RecentOrders from '../../../components/admin/RecentOrders'
import SalesOverview from '../../../components/admin/SalesOverview'
import StatsGrid from '../../../components/admin/StatsGrid'
import TopProducts from '../../../components/admin/TopProducts'
import { useI18n } from '../../../i18n/I18nProvider'

function AdminDashboard() {
  const { t, language } = useI18n()

  const formattedDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <AdminShell activeItem="Dashboard">
      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#a86f6b]">
              {formattedDate}
            </p>
            <h2 className="font-['Playfair_Display'] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-tight text-[#3b2a29]">
              {t('admin.goodMorning')}
            </h2>
            <p className="mt-2 text-sm text-[#806967]">{t('admin.todaySubtitle')}</p>
          </div>
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-[11px] bg-[#6d4946] px-4 text-xs font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.14)] transition hover:bg-[#583a38] sm:self-auto"
          >
            <Sparkles size={15} />
            {t('admin.viewStore')}
          </Link>
        </div>

        <StatsGrid />

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)]">
          <SalesOverview />
          <TopProducts />
        </section>

        <RecentOrders />
      </main>
    </AdminShell>
  )
}

export default AdminDashboard
