'use client'

import React, { useState, useRef } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  UploadCloud,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Loader2,
  Table,
  Layers,
} from 'lucide-react'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface ParsedPreviewRow {
  name: string
  sku?: string
  category: string
  quantityTotal: string
  minimumStock: string
  location?: string
}

export default function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [csvText, setCsvText] = useState<string>('')
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCsvPreview = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length <= 1) {
      setPreviewRows([])
      return
    }

    const parseCsvLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }

    const rows: ParsedPreviewRow[] = []
    // Parse up to first 5 rows for preview
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      const cells = parseCsvLine(lines[i])
      if (cells.length > 0) {
        rows.push({
          name: cells[0] || '',
          sku: cells[1] || 'Auto',
          category: cells[2] || 'General',
          quantityTotal: cells[3] || '0',
          minimumStock: cells[4] || '0',
          location: cells[5] || 'N/A',
        })
      }
    }
    setPreviewRows(rows)
  }

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setErrorMsg('Please upload a valid .csv file.')
      return
    }

    setFile(selectedFile)
    setErrorMsg(null)
    setImportErrors([])
    setSuccessMsg(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCsvText(content)
      parseCsvPreview(content)
    }
    reader.readAsText(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleImportSubmit = async () => {
    if (!csvText) {
      setErrorMsg('Please select a CSV file first.')
      return
    }

    setIsUploading(true)
    setErrorMsg(null)
    setImportErrors([])

    try {
      const response = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: csvText,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed.')
      }

      setSuccessMsg(data.message || `Successfully imported ${data.importedCount} items!`)
      if (data.errors && data.errors.length > 0) {
        setImportErrors(data.errors)
      }

      if (onSuccess) {
        onSuccess()
      }

      // If fully successful with no row errors, auto-close after 2.5s
      if (!data.errors || data.errors.length === 0) {
        setTimeout(() => {
          resetModal()
          onClose()
        }, 2500)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to import CSV.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetModal = () => {
    setFile(null)
    setCsvText('')
    setPreviewRows([])
    setErrorMsg(null)
    setImportErrors([])
    setSuccessMsg(null)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            resetModal()
            onClose()
          }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-black/90 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              resetModal()
              onClose()
            }}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start justify-between pr-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Bulk Data Import</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Import Robotics Components</h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                Upload a spreadsheet (.csv) to batch import items, create categories, and log initial restock counts.
              </p>
            </div>
          </div>

          {/* Download Template Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 text-white">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Need the correct column format?</p>
                <p className="text-[11px] text-white/50">Download our pre-filled robotics sample spreadsheet</p>
              </div>
            </div>

            <a href="/api/inventory/template" download>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs bg-white/10 border-white/20 text-white hover:bg-white hover:text-black flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Template (.csv)</span>
              </Button>
            </a>
          </div>

          {/* Error / Success Notifications */}
          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-500/40 rounded-2xl p-4 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Row-specific error reports */}
          {importErrors.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Some rows encountered warnings:</span>
              </div>
              <ul className="text-[11px] text-amber-200/80 space-y-1 list-disc pl-5 max-h-32 overflow-y-auto">
                {importErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* File Drag and Drop Zone */}
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-white/5 hover:bg-white/10 space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white/70">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Click or drag &amp; drop your CSV here</p>
                <p className="text-xs text-white/40 mt-0.5">Supports comma-separated values (.csv) with headers</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Selected File Card */}
              <div className="flex items-center justify-between bg-white/5 border border-white/15 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-[250px]">{file.name}</p>
                    <p className="text-[10px] text-white/40 font-mono">
                      {(file.size / 1024).toFixed(1)} KB • {previewRows.length} sample row(s) detected
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setFile(null)
                    setCsvText('')
                    setPreviewRows([])
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-white/50 hover:text-white"
                >
                  Change File
                </Button>
              </div>

              {/* Data Preview Table */}
              {previewRows.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs uppercase font-bold tracking-wider text-white/50 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Data Preview (First {previewRows.length} Rows):
                  </p>
                  <div className="border border-white/10 rounded-2xl overflow-hidden overflow-x-auto text-xs bg-black/50">
                    <table className="w-full text-left">
                      <thead className="bg-white/10 text-white/60 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">SKU</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5 text-center">Initial Qty</th>
                          <th className="p-2.5">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {previewRows.map((r, i) => (
                          <tr key={i} className="hover:bg-white/5 text-white/80">
                            <td className="p-2.5 font-medium text-white">{r.name}</td>
                            <td className="p-2.5 font-mono text-[11px] text-white/50">{r.sku}</td>
                            <td className="p-2.5">{r.category}</td>
                            <td className="p-2.5 text-center font-bold text-emerald-400">{r.quantityTotal}</td>
                            <td className="p-2.5 text-white/50">{r.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                resetModal()
                onClose()
              }}
              className="rounded-xl text-xs text-white/60 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={handleImportSubmit}
              disabled={!file || isUploading}
              className="rounded-xl bg-white text-black hover:bg-gray-100 font-bold px-6 py-5 text-xs sm:text-sm cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-white/10"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing Batch...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Start CSV Import</span>
                </>
              )}
            </Button>
          </div>
        </m.div>
      </div>
    </AnimatePresence>
  )
}
