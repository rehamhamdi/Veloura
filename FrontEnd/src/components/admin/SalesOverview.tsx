import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { getSalesOverview } from '../../services/adminDashboard'
import type { SalesOverviewPoint } from '../../types/adminDashboard'
import { useI18n } from '../../i18n/I18nProvider'

const PERIOD_OPTIONS = [
  { key: 'Today', param: 'Today', labelKey: 'admin.today' },
  { key: 'This Week', param: 'ThisWeek', labelKey: 'admin.thisWeek' },
  { key: 'This Month', param: 'ThisMonth', labelKey: 'admin.thisMonth' },
  { key: 'This Year', param: 'ThisYear', labelKey: 'admin.thisYear' },
]

function formatCurrency(val: number): string {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1).replace('.0', '')}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(1).replace('.0', '')}k`
  return `$${val}`
}

function generateSvgPath(points: SalesOverviewPoint[], width = 700, height = 230, topPadding = 20, bottomPadding = 20) {
  if (!points || points.length === 0) return { pathD: '', fillD: '', coords: [] }

  const values = points.map((p) => p.value)
  const rawMax = Math.max(...values, 0)
  const maxVal = rawMax === 0 ? 100 : rawMax * 1.15
  const usableHeight = height - topPadding - bottomPadding

  const coords = points.map((p, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width
    const y = height - bottomPadding - (p.value / maxVal) * usableHeight
    return { x, y, point: p }
  })

  if (coords.length === 1) {
    const single = coords[0]
    return {
      pathD: `M 0 ${single.y} L ${width} ${single.y}`,
      fillD: `M 0 ${single.y} L ${width} ${single.y} L ${width} ${height} L 0 ${height} Z`,
      coords,
    }
  }

  // Generate smooth cubic bezier curve
  let pathD = `M ${coords[0].x} ${coords[0].y}`
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1]
    const curr = coords[i]
    const cp1x = prev.x + (curr.x - prev.x) / 2
    const cp1y = prev.y
    const cp2x = prev.x + (curr.x - prev.x) / 2
    const cp2y = curr.y
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
  }

  const fillD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`

  return { pathD, fillD, coords }
}

function SalesOverview() {
  const { t } = useI18n()
  const [selectedPeriod, setSelectedPeriod] = useState('ThisWeek')
  const [points, setPoints] = useState<SalesOverviewPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setIsLoading(true)
      setError('')
      try {
        const result = await getSalesOverview(selectedPeriod)
        if (!cancelled) {
          setPoints(result.points ?? [])
        }
      } catch {
        if (!cancelled) setError('Failed to load sales data')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadData()
    return () => {
      cancelled = true
    }
  }, [selectedPeriod])

  const totalPeriodRevenue = useMemo(() => {
    return points.reduce((sum, p) => sum + (Number(p.value) || 0), 0)
  }, [points])

  const maxVal = useMemo(() => {
    const rawMax = Math.max(...points.map((p) => p.value), 0)
    return rawMax === 0 ? 100 : rawMax * 1.15
  }, [points])

  const yLabels = useMemo(() => {
    return [
      formatCurrency(Math.round(maxVal)),
      formatCurrency(Math.round(maxVal * 0.75)),
      formatCurrency(Math.round(maxVal * 0.5)),
      formatCurrency(Math.round(maxVal * 0.25)),
      '$0',
    ]
  }, [maxVal])

  const { pathD, fillD, coords } = useMemo(() => {
    return generateSvgPath(points)
  }, [points])

  // Select the highest point to put a default circle dot if none hovered
  const activeDotCoord = useMemo(() => {
    if (coords.length === 0) return null
    if (hoveredIndex !== null && coords[hoveredIndex]) return coords[hoveredIndex]
    // Default to highest point or last point
    let highest = coords[0]
    for (const c of coords) {
      if (c.point.value > highest.point.value) {
        highest = c
      }
    }
    return highest
  }, [coords, hoveredIndex])

  return (
    <article className="overflow-hidden rounded-[16px] border border-[#eaded5] bg-[#fffdf9] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#b9827e]" />
            <p className="m-0 text-sm font-bold text-[#493331]">{t('admin.sales')}</p>
          </div>
          <p className="mb-0 mt-2 text-xs text-[#a38b83]">
            {t('admin.salesPerformance') ?? 'Your sales performance over time'}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-[9px] border border-[#eaded5] bg-[#fffaf5] p-1">
          {PERIOD_OPTIONS.map((item) => {
            const isSelected = selectedPeriod === item.param
            return (
              <button
                key={item.param}
                className={`rounded-[7px] px-2 py-1.5 text-[10px] font-semibold transition sm:px-2.5 ${
                  isSelected ? 'bg-[#f3e4dc] text-[#8e5d5a]' : 'text-[#a38b83] hover:text-[#6d4946]'
                }`}
                onClick={() => setSelectedPeriod(item.param)}
              >
                {t(item.labelKey) ?? item.key}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-7 overflow-x-auto">
        <div className="relative h-[230px] min-w-[520px] pl-9">
          {/* Y-axis markers */}
          <div className="absolute inset-x-0 top-0 flex h-full flex-col justify-between text-[10px] text-[#af9a91]">
            {yLabels.map((lbl, idx) => (
              <span key={idx}>{lbl}</span>
            ))}
          </div>

          {/* Grid lines */}
          <div className="absolute inset-x-0 top-0 h-full pl-9">
            <div className="flex h-full flex-col justify-between">
              <i className="border-t border-dashed border-[#eaded5]" />
              <i className="border-t border-dashed border-[#eaded5]" />
              <i className="border-t border-dashed border-[#eaded5]" />
              <i className="border-t border-dashed border-[#eaded5]" />
              <i className="border-t border-[#eaded5]" />
            </div>

            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#fffdf9]/60">
                <LoaderCircle className="animate-spin text-[#8e5d5a]" size={24} />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-[#a36c69]">
                {error}
              </div>
            ) : (
              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 700 230"
                preserveAspectRatio="none"
                aria-label="Sales chart"
                role="img"
              >
                <defs>
                  <linearGradient id="sales-fill-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#c98f89" stopOpacity=".28" />
                    <stop offset="1" stopColor="#c98f89" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {fillD && <path d={fillD} fill="url(#sales-fill-gradient)" />}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#b9827e"
                    strokeLinecap="round"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                {coords.map((c, i) => (
                  <circle
                    key={i}
                    cx={c.x}
                    cy={c.y}
                    r={hoveredIndex === i ? 6 : 3.5}
                    fill={hoveredIndex === i ? '#6d4946' : '#fffaf5'}
                    stroke="#b9827e"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
                {activeDotCoord && hoveredIndex === null && (
                  <circle
                    cx={activeDotCoord.x}
                    cy={activeDotCoord.y}
                    r="5"
                    fill="#fffaf5"
                    stroke="#b9827e"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>
            )}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-[-25px] left-9 right-0 flex justify-between text-[10px] text-[#af9a91]">
            {points.map((p, idx) => (
              <span
                key={idx}
                className={`transition-colors ${hoveredIndex === idx ? 'font-bold text-[#6d4946]' : ''}`}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-[#f0e5de] pt-4">
        <p className="m-0 text-[11px] text-[#a38b83]">
          {t('admin.periodRevenue') ?? 'Total period revenue'}
        </p>
        <p className="m-0 text-sm font-bold text-[#493331]">
          ${totalPeriodRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </article>
  )
}

export default SalesOverview