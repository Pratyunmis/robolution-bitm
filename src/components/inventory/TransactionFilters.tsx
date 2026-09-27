'use client'

import React from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { TransactionType } from '@/types/inventory'

export type TypeFilter = TransactionType | 'all'

export const typeFilterOptions: { label: string; value: TypeFilter }[] = [
  { label: 'All Events', value: 'all' },
  { label: 'Checkouts', value: 'issue' },
  { label: 'Returns', value: 'return' },
  { label: 'Restocks', value: 'restock' },
  { label: 'Damages', value: 'damage' },
  { label: 'Adjustments', value: 'adjust' },
]

interface TransactionFiltersProps {
  searchQuery: string
  selectedType: TypeFilter
  onSearchChange: (query: string) => void
  onTypeChange: (type: TypeFilter) => void
}

export function TransactionFilters({
  searchQuery,
  selectedType,
  onSearchChange,
  onTypeChange,
}: TransactionFiltersProps) {
  return (
    <div className="space-y-4 mb-8 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search by component name, SKU, member email, or notes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 pr-10 py-5 bg-black/40 border-white/10 text-white placeholder:text-white/40 rounded-2xl text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs uppercase tracking-wider text-white/40 font-semibold pl-1 pr-2 flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {typeFilterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border cursor-pointer ${
              selectedType === opt.value
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
