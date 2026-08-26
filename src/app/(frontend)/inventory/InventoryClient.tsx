'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import DarkVeil from '@/components/DarkVeil'
import CountUp from '@/components/CountUp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Cpu,
  Layers,
  Zap,
  AlertTriangle,
  Search,
  X,
  MapPin,
  Barcode,
  ArrowRight,
  Boxes,
  CheckCircle2,
  AlertCircle,
  PackageX,
  SlidersHorizontal,
  History,
  Download,
  FileSpreadsheet,
} from 'lucide-react'

export interface TransformedCategory {
  id: string
  name: string
  description?: string
  imageUrl?: string
}

export interface TransformedInventoryItem {
  id: string
  name: string
  sku?: string
  category: {
    id: string
    name: string
  }
  imageUrl?: string
  location?: string
  quantityTotal: number
  quantityAvailable: number
  quantityIssued: number
  minimumStock: number
  status: 'active' | 'out-of-stock' | 'discontinued'
  updatedAt: string
}

export interface InventoryStats {
  totalItems: number
  totalUnits: number
  totalAvailable: number
  totalIssued: number
  lowStockCount: number
  outOfStockCount: number
}

interface InventoryClientProps {
  initialItems: TransformedInventoryItem[]
  categories: TransformedCategory[]
  stats: InventoryStats
}

const statusOptions = [
  { label: 'All Items', value: 'all' },
  { label: 'In Stock', value: 'in-stock' },
  { label: 'Low Stock', value: 'low-stock' },
  { label: 'Out of Stock', value: 'out-of-stock' },
] as const

type StatusFilter = (typeof statusOptions)[number]['value']

export default function InventoryClient({ initialItems, categories, stats }: InventoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Filter items based on search query, category, and status
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category.id !== selectedCategory) {
        return false
      }

      // Status filter
      if (statusFilter === 'in-stock' && item.quantityAvailable <= 0) {
        return false
      }
      if (statusFilter === 'low-stock') {
        const isLow = item.quantityAvailable > 0 && item.quantityAvailable <= item.minimumStock
        if (!isLow) return false
      }
      if (statusFilter === 'out-of-stock' && item.quantityAvailable > 0) {
        return false
      }

      // Search query (matches name, SKU, category name, location)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesSku = item.sku ? item.sku.toLowerCase().includes(query) : false
        const matchesCategory = item.category.name.toLowerCase().includes(query)
        const matchesLocation = item.location ? item.location.toLowerCase().includes(query) : false

        if (!matchesName && !matchesSku && !matchesCategory && !matchesLocation) {
          return false
        }
      }

      return true
    })
  }, [initialItems, selectedCategory, statusFilter, searchQuery])

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden pt-24 pb-32">
      {/* Fixed Animated WebGL Shader Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Hero / Header Section */}
        <section className="text-center py-12 md:py-16">
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-160 h-80 bg-white/5 blur-[120px] rounded-full -z-10" />

          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.25em] mb-6 text-white/60 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md bg-white/5"
          >
            <Boxes className="w-4 h-4 text-white/80" />
            <span>Robolution Hardware Lab • Inventory</span>
          </m.div>

          <div className="overflow-hidden mb-4">
            <m.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ ease: 'easeOut', duration: 0.4 }}
              className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 pb-2"
            >
              LAB INVENTORY
            </m.h1>
          </div>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed mb-6"
          >
            Explore club components, check real-time stock in the lab, and request checkouts for your robotics projects.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/inventory/transactions">
              <Button
                variant="outline"
                className="rounded-full bg-white/5 border-white/15 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 text-xs sm:text-sm px-5 py-2.5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <History className="w-4 h-4" />
                <span>View Transaction Log</span>
              </Button>
            </Link>

            <a href="/api/inventory/export?type=items" download>
              <Button
                variant="outline"
                className="rounded-full bg-white/5 border-white/15 text-emerald-300 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-400/40 text-xs sm:text-sm px-5 py-2.5 backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Catalog (CSV)</span>
              </Button>
            </a>
          </m.div>
        </section>

        {/* High-Level Stats Dashboard */}
        <section className="mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Total Unique Items */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative group bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-white/50 font-medium">Unique Items</span>
                <div className="p-2 rounded-xl bg-white/10 text-white group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1">
                <CountUp from={0} to={stats.totalItems} duration={0.6} />
              </div>
              <p className="text-xs text-white/40">Catalogued robotics parts</p>
            </m.div>

            {/* Total Units in Lab */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-emerald-400/80 font-medium">Available Units</span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-emerald-400 mb-1">
                <CountUp from={0} to={stats.totalAvailable} duration={0.6} />
              </div>
              <p className="text-xs text-white/40">Ready to issue in lab</p>
            </m.div>

            {/* Checked Out Units */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative group bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-sky-400/80 font-medium">Checked Out</span>
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-sky-400 mb-1">
                <CountUp from={0} to={stats.totalIssued} duration={0.6} />
              </div>
              <p className="text-xs text-white/40">In active project use</p>
            </m.div>

            {/* Low Stock Alerts */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-amber-400/80 font-medium">Low Stock</span>
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-amber-400 mb-1">
                <CountUp from={0} to={stats.lowStockCount + stats.outOfStockCount} duration={0.6} />
              </div>
              <p className="text-xs text-white/40">
                {stats.outOfStockCount > 0 ? `${stats.outOfStockCount} empty, ${stats.lowStockCount} low` : 'Requires restock soon'}
              </p>
            </m.div>
          </div>
        </section>

        {/* Filter & Search Toolbar */}
        <section className="mb-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                type="text"
                placeholder="Search components by name, SKU (e.g. MC-001), or shelf location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 py-6 bg-black/40 border-white/10 text-white placeholder:text-white/40 rounded-2xl focus:border-white/40 focus:ring-white/20 text-sm md:text-base w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Segmented Control */}
            <div className="flex flex-wrap gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                    statusFilter === opt.value
                      ? 'text-black bg-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Chips Bar */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs uppercase tracking-wider text-white/40 font-semibold pl-1 pr-2 flex items-center gap-1.5 shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Categories:
              </span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium shrink-0 transition-all border ${
                  selectedCategory === 'all'
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                All Categories ({initialItems.length})
              </button>
              {categories.map((cat) => {
                const count = initialItems.filter((i) => i.category.id === cat.id).length
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium shrink-0 transition-all border ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat.name} <span className="opacity-60 text-xs">({count})</span>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* Catalog Items Grid */}
        <section>
          {filteredItems.length === 0 ? (
            /* Empty State */
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 px-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md max-w-xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5 text-white/60">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Components Found</h3>
              <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
                No items match your current filter criteria. Try clearing your search query or changing category.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setStatusFilter('all')
                }}
                className="rounded-full bg-white text-black hover:bg-gray-100 px-6 py-2.5 font-semibold text-sm"
              >
                Reset All Filters
              </Button>
            </m.div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredItems.map((item, idx) => {
                  const availabilityPct =
                    item.quantityTotal > 0 ? Math.round((item.quantityAvailable / item.quantityTotal) * 100) : 0
                  const isOutOfStock = item.quantityAvailable === 0
                  const isLowStock = !isOutOfStock && item.quantityAvailable <= item.minimumStock

                  return (
                    <m.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.03, duration: 0.3 }}
                      className="group relative flex flex-col justify-between bg-black/40 border border-white/10 hover:border-white/30 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 overflow-hidden"
                    >
                      {/* Gradient Shine Accent on Hover */}
                      <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />

                      <div>
                        {/* Header: Category & Status Badge */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-xs uppercase tracking-wider text-white/50 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-medium">
                            {item.category.name}
                          </span>

                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Available
                            </span>
                          )}
                        </div>

                        {/* Optional Card Image Thumbnail */}
                        {item.imageUrl && (
                          <div className="w-full h-36 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative mb-4">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Title & SKU */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors line-clamp-1">
                          {item.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mb-6">
                          {item.sku && (
                            <span className="inline-flex items-center gap-1 font-mono bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5 text-white/70">
                              <Barcode className="w-3.5 h-3.5" />
                              {item.sku}
                            </span>
                          )}
                          {item.location && (
                            <span className="inline-flex items-center gap-1 text-white/60">
                              <MapPin className="w-3.5 h-3.5 text-white/40" />
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Visual Meter & Numbers */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-white/60">In Lab Availability</span>
                            <span
                              className={
                                isOutOfStock
                                  ? 'text-rose-400 font-bold'
                                  : isLowStock
                                    ? 'text-amber-400 font-bold'
                                    : 'text-white font-bold'
                              }
                            >
                              {item.quantityAvailable} / {item.quantityTotal} units
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOutOfStock
                                  ? 'bg-rose-500'
                                  : isLowStock
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-400'
                              }`}
                              style={{ width: `${Math.max(availabilityPct, 0)}%` }}
                            />
                          </div>
                        </div>

                        {/* Detail Link CTA */}
                        <Link href={`/inventory/${item.id}`} className="block">
                          <Button
                            variant="outline"
                            className="w-full rounded-2xl bg-white/5 border-white/15 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold text-xs md:text-sm py-5 flex items-center justify-center gap-2 group-hover:border-white/40"
                          >
                            <span>View Details & History</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </m.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
