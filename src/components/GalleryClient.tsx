'use client'

import { m, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Camera, ZoomIn, Loader2 } from 'lucide-react'
import DarkVeil from '@/components/DarkVeil'

interface GalleryImage {
  id: string
  title: string
  image: {
    url: string
    alt?: string
    width?: number
    height?: number
  }
  category?: string
}

interface GalleryClientProps {
  images: GalleryImage[]
}

export const GalleryClient: React.FC<GalleryClientProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [imageDirection, setImageDirection] = useState<'left' | 'right' | null>(null)

  // Performance optimization: limit stagger to first 12 items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Reduced for faster load
        delayChildren: 0.1,
      },
    },
  }

  // Simplified item variants - removed scale for performance
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0, 0, 0.2, 1] as const, // easeOut cubic bezier
      },
    },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setIsImageLoading(true)
      setImageDirection('left')
      setSelectedImage((selectedImage - 1 + images.length) % images.length)
    }
  }

  const handleNext = () => {
    if (selectedImage !== null) {
      setIsImageLoading(true)
      setImageDirection('right')
      setSelectedImage((selectedImage + 1) % images.length)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-200 h-[40vh] max-h-100 bg-white/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-8"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="flex items-center justify-center gap-3 text-sm uppercase tracking-[0.4em] text-white/50 font-semibold mb-4">
              <Camera className="w-5 h-5" />
              <span>Gallery</span>
            </div>
            <div className="h-px w-32 mx-auto bg-linear-to-r from-transparent via-white/30 to-transparent" />
          </m.div>

          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
          >
            <span className="bg-linear-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              Our Journey
            </span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed"
          >
            A visual chronicle of innovation, collaboration, and technological excellence at
            Robolution
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-4 text-white/50"
          >
            <span className="text-sm uppercase tracking-wider">
              {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
            </span>
          </m.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {images.map((image, index) => (
              <m.div
                key={image.id}
                variants={index < 12 ? itemVariants : undefined} // Only animate first 12 items
                initial={index >= 12 ? { opacity: 1, y: 0 } : undefined}
                onClick={() => {
                  setSelectedImage(index)
                  setIsImageLoading(true)
                }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:z-10"
                style={{ willChange: 'transform' }}
              >
                {/* Image */}
                <Image
                  src={image.image.url}
                  alt={image.image.alt || image.title}
                  fill
                  quality={50}
                  loading="lazy"
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                {image.category && (
                  <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                      {image.category}
                    </span>
                  </div>
                )}

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full" />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePrevious()
              }}
              className="absolute left-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-6 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-4 transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image Container */}
            <m.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              {/* Loading Spinner */}
              <AnimatePresence>
                {isImageLoading && (
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-12 h-12 text-white animate-spin" />
                      <p className="text-white/70 text-sm font-medium">Loading image...</p>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              <m.div
                key={selectedImage}
                initial={{
                  opacity: 0,
                  x: imageDirection === 'left' ? -100 : imageDirection === 'right' ? 100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: imageDirection === 'left' ? 100 : imageDirection === 'right' ? -100 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative w-full h-full"
                onAnimationComplete={() => {
                  if (!isImageLoading) {
                    setImageDirection(null)
                  }
                }}
              >
                <Image
                  src={images[selectedImage].image.url}
                  alt={images[selectedImage].image.alt || images[selectedImage].title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 80vw, 70vw"
                  priority
                  onLoadingComplete={() => setIsImageLoading(false)}
                />
              </m.div>

              {/* Image Info - No caption, just counter */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-8">
                <p className="text-white/50 text-sm text-center">
                  {selectedImage + 1} / {images.length}
                </p>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
