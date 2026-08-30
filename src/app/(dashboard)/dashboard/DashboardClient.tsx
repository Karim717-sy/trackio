'use client'

import { useState, useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { DollarSign, TrendingUp, TrendingDown, Package, Activity, Percent, Truck } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { convertCurrency, formatCurrency } from '@/utils/currencies'
const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#f43f5e']

import CustomDropdown from './CustomDropdown'
import DateRangePicker from '@/components/DateRangePicker'

export default function DashboardClient({ performances, displayCurrency = 'XOF' }: { performances: any[], displayCurrency?: string }) {
  const [period, setPeriod] = useState('30d')
  const [countryFilter, setCountryFilter] = useState('All')
  const [customRange, setCustomRange] = useState<{from: Date | undefined, to: Date | undefined}>({ from: undefined, to: undefined })
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  // Extraire les pays
  const availableCountries = useMemo(() => {
    const countries = new Set<string>()
    performances.forEach(p => countries.add(p.product_markets.country))
    return Array.from(countries).sort()
  }, [performances])

  const customLabel = useMemo(() => {
    if (period !== 'custom') return "Personnalisé";
    if (customRange.from && customRange.to) {
      if (customRange.from.getTime() === customRange.to.getTime()) {
        return format(customRange.from, 'd MMM yyyy', { locale: fr });
      }
      return `${format(customRange.from, 'd MMM')} - ${format(customRange.to, 'd MMM yyyy', { locale: fr })}`;
    }
    if (customRange.from) {
      return format(customRange.from, 'd MMM yyyy', { locale: fr });
    }
    return "Personnalisé";
  }, [period, customRange]);

  // Devise d'affichage dynamique : si un pays est sélectionné, on affiche dans la devise de ce pays
  const dynamicDisplayCurrency = useMemo(() => {
    if (countryFilter === 'All') return displayCurrency;
    const perfForCountry = performances.find(p => p.product_markets.country === countryFilter);
    return perfForCountry?.product_markets?.currency || displayCurrency;
  }, [countryFilter, performances, displayCurrency]);

  // Filtrage
  const filteredPerformances = useMemo(() => {
    const now = new Date()
    let startDate = new Date(0)
    
    if (period === 'today') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    else if (period === 'yesterday') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
    else if (period === '7d') startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    else if (period === '30d') startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    else if (period === 'this_month') startDate = new Date(now.getFullYear(), now.getMonth(), 1)

    return performances.filter(p => {
      // Les dates dans la BDD sont 'YYYY-MM-DD', new Date() les parse à minuit UTC. 
      // Comparer toDateString pour correspondre exactement au jour.
      const d = new Date(p.date)
      if (period === 'last_month') {
        const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        if (d < startLastMonth || d > endLastMonth) return false
      } else if (period === 'today' || period === 'yesterday') {
        if (d.toISOString().split('T')[0] !== startDate.toISOString().split('T')[0]) return false
      } else if (period === 'custom') {
        if (customRange.from && customRange.to) {
          // Range selection
          const dTime = d.getTime();
          const fromTime = new Date(customRange.from.getFullYear(), customRange.from.getMonth(), customRange.from.getDate()).getTime();
          const toTime = new Date(customRange.to.getFullYear(), customRange.to.getMonth(), customRange.to.getDate()).getTime();
          if (dTime < fromTime || dTime > toTime) return false;
        } else if (customRange.from) {
          // Single day selection
          const dTime = d.getTime();
          const fromTime = new Date(customRange.from.getFullYear(), customRange.from.getMonth(), customRange.from.getDate()).getTime();
          if (dTime !== fromTime) return false;
        } else {
          return true; // No date selected yet
        }
      } else {
        if (d < startDate && period !== 'all') return false
      }
      return countryFilter === 'All' || p.product_markets.country === countryFilter
    }).map(p => {
      const mCur = p.product_markets.currency || 'XOF'
      const gRev = convertCurrency(p.quantity * p.unit_selling_price, mCur, dynamicDisplayCurrency)
      const shipCost = convertCurrency(p.shipping_cost, mCur, dynamicDisplayCurrency)
      const rWithoutShip = gRev - shipCost
      const cost = convertCurrency(p.quantity * p.unit_cost_price, mCur, dynamicDisplayCurrency)
      const adSpend = convertCurrency(p.ad_spend, mCur, dynamicDisplayCurrency)
      const profit = rWithoutShip - cost - adSpend

      return {
        ...p,
        converted: {
          gRev, shipCost, rWithoutShip, cost, adSpend, profit
        }
      }
    })
  }, [performances, period, countryFilter, dynamicDisplayCurrency, customRange])

  // KPIs
  const KPIs = useMemo(() => {
    let generalRevenue = 0
    let shippingCost = 0
    let revenueWithoutShipping = 0
    let quantity = 0
    let adSpend = 0
    let totalProductsCost = 0

    filteredPerformances.forEach(p => {
      generalRevenue += p.converted.gRev
      shippingCost += p.converted.shipCost
      revenueWithoutShipping += p.converted.rWithoutShip
      quantity += p.quantity
      adSpend += p.converted.adSpend
      totalProductsCost += p.converted.cost
    })

    const profit = revenueWithoutShipping - totalProductsCost - adSpend
    const margin = revenueWithoutShipping > 0 ? (profit / revenueWithoutShipping) * 100 : 0

    return { generalRevenue, shippingCost, revenueWithoutShipping, quantity, adSpend, profit, margin }
  }, [filteredPerformances])

  // Données Graphique Ligne (Évolution)
  const evolutionData = useMemo(() => {
    const dailyMap = new Map<string, any>()
    
    filteredPerformances.forEach(p => {
      const d = p.date
      if (!dailyMap.has(d)) {
        dailyMap.set(d, { date: d, "CA Général": 0, "Livraison": 0, "CA Hors Livr.": 0, "Bénéfice": 0, "Publicité": 0 })
      }
      const day = dailyMap.get(d)!
      
      day["CA Général"] += p.converted.gRev
      day["Livraison"] += p.converted.shipCost
      day["CA Hors Livr."] += p.converted.rWithoutShip
      day["Publicité"] += p.converted.adSpend
      day["Bénéfice"] += p.converted.profit
    })

    const sorted = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date))
    return sorted.map(item => ({
      ...item,
      displayDate: item.date.split('-').reverse().slice(0, 2).join('/')
    }))
  }, [filteredPerformances])

  // Données Graphique Circulaire (Bénéfice par Produit)
  const profitByProduct = useMemo(() => {
    const map = new Map<string, number>()
    
    filteredPerformances.forEach(p => {
      if (p.converted.profit > 0) {
        const name = p.product_markets.products.name
        map.set(name, (map.get(name) || 0) + p.converted.profit)
      }
    })

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredPerformances])

  // Données Graphique Circulaire (Bénéfice par Pays)
  const profitByCountry = useMemo(() => {
    const map = new Map<string, number>()
    
    filteredPerformances.forEach(p => {
      if (p.converted.profit > 0) {
        const country = p.product_markets.country
        map.set(country, (map.get(country) || 0) + p.converted.profit)
      }
    })

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredPerformances])

  // Top Produits par Marché
  const topProductsByMarket = useMemo(() => {
    const map = new Map<string, { product: string; country: string; profit: number; revenueWithoutShipping: number }>()
    
    filteredPerformances.forEach(p => {
      const key = p.product_market_id
      
      if (!map.has(key)) {
        map.set(key, { 
          product: p.product_markets.products.name, 
          country: p.product_markets.country, 
          profit: 0, 
          revenueWithoutShipping: 0 
        })
      }
      
      const item = map.get(key)!
      item.profit += p.converted.profit
      item.revenueWithoutShipping += p.converted.rWithoutShip
    })

    return Array.from(map.values())
      .sort((a, b) => b.profit - a.profit)
  }, [filteredPerformances])

  // Custom Label pour les Donuts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (!percent || percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 text-indigo-600">
          <Activity className="w-5 h-5" />
          <h2 className="font-semibold">Vue d'ensemble</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <DateRangePicker 
            value={customRange}
            onChange={setCustomRange}
            isOpenProp={isCalendarOpen}
            setIsOpenProp={setIsCalendarOpen}
            trigger={
              <CustomDropdown 
                value={period}
                onChange={(val) => {
                  setPeriod(val);
                  if (val === 'custom') {
                    setIsCalendarOpen(true);
                  }
                }}
                icon="📅"
                options={[
                  {label: "Aujourd'hui", value: "today"},
                  {label: "Hier", value: "yesterday"},
                  {label: "7 derniers jours", value: "7d"},
                  {label: "30 derniers jours", value: "30d"},
                  {label: "Ce mois-ci", value: "this_month"},
                  {label: "Mois précédent", value: "last_month"},
                  {label: customLabel, value: "custom"},
                  {label: "Depuis toujours", value: "all"}
                ]}
              />
            }
          />
          
          <CustomDropdown 
            value={countryFilter}
            onChange={setCountryFilter}
            icon="🌍"
            options={[
              {label: "Tous les pays", value: "All"},
              ...availableCountries.map(c => ({label: c, value: c}))
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-medium text-slate-500">CA Général</span>
            <DollarSign className="w-4 h-4 text-slate-400"/>
          </div>
          <span className="text-lg font-bold text-slate-900">{formatCurrency(KPIs.generalRevenue, dynamicDisplayCurrency)}</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-medium text-slate-500">Nombre de commandes livrées</span>
            <Package className="w-4 h-4 text-blue-500"/>
          </div>
          <span className="text-lg font-bold text-slate-900">{KPIs.quantity}</span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-medium text-slate-500">Bénéfice Net</span>
            <TrendingUp className={`w-4 h-4 ${KPIs.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}/>
          </div>
          <span className={`text-lg font-bold ${KPIs.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(KPIs.profit, dynamicDisplayCurrency)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-medium text-slate-500">Marge Moyenne</span>
            <Percent className="w-4 h-4 text-amber-500"/>
          </div>
          <span className="text-lg font-bold text-slate-900">{KPIs.margin.toFixed(1)}%</span>
        </div>

      </div>

      {/* EVOLUTION CHART */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Évolution des performances</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => value > 1000 ? (value/1000) + 'k' : value}/>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => formatCurrency(Number(value), dynamicDisplayCurrency)}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
              <Line type="monotone" dataKey="CA Général" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="Livraison" stroke="#9333ea" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Bénéfice" stroke="#16a34a" strokeWidth={3} dot={false} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="Publicité" stroke="#e11d48" strokeWidth={3} dot={false} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DONUTS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Bénéfice par Produit</h3>
            {profitByProduct.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={profitByProduct} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={false} label={renderCustomizedLabel}>
                      {profitByProduct.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value), dynamicDisplayCurrency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">Aucun bénéfice enregistré.</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {profitByProduct.map((p, i) => (
                <div key={p.name} className="flex items-center text-xs text-slate-600">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Bénéfice par Pays</h3>
            {profitByCountry.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={profitByCountry} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={false} label={renderCustomizedLabel}>
                      {profitByCountry.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value), dynamicDisplayCurrency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 text-sm text-center py-8">Aucun bénéfice enregistré.</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {profitByCountry.map((p, i) => (
                <div key={p.name} className="flex items-center text-xs text-slate-600">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP PRODUITS PAR MARCHE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Produits les plus rentables par marché</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                  <th className="py-3 px-4 font-semibold text-slate-700">Produit</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Pays</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-right">CA (Hors Livr.)</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-right">Bénéfice</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center">Marge %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProductsByMarket.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">Aucune donnée disponible.</td>
                  </tr>
                ) : (
                  topProductsByMarket.map((item, index) => {
                    const margin = item.revenueWithoutShipping > 0 ? (item.profit / item.revenueWithoutShipping) * 100 : 0;
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition text-sm">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.product}</td>
                        <td className="py-3 px-4 text-slate-700">{item.country}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{formatCurrency(item.revenueWithoutShipping, dynamicDisplayCurrency)}</td>
                        <td className={`py-3 px-4 text-right font-bold ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.profit > 0 ? '+' : ''}{formatCurrency(item.profit, dynamicDisplayCurrency)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${margin >= 20 ? 'bg-green-100 text-green-800' : margin >= 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                            {margin.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}
