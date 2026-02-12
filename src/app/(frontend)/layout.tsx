import { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { ClientLayout } from '@/components/ClientLayout'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ReactLenis } from '@/components/LenisReact'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.robolutionbitm.in'),
  title: {
    default: 'Robolution - Official Robotics Club of BIT Mesra',
    template: '%s Robolution - Official Robotics Club of BIT Mesra',
  },
  description:
    'Robolution is the official robotics and innovation club of BIT Mesra, also known as Team Pratyumnis. We build robots, compete nationally, and push hands-on engineering through workshops, projects, and tech events.',
  keywords: [
    'Robolution',
    'BIT Mesra',
    'Team Pratyumnis',
    'Robotics Club',
    'Engineering Club',
    'Robotics Society',
    'Student Robotics',
    'BIT Mesra Robotics',
    'Tech Club',
    'Robolution BIT Mesra',
    'BIT Mesra Robotics Club',
    'Pratyumnis',
    'Ranchi Robotics',
    'Jharkhand Robotics',
    'College Robotics India',
  ],
  authors: [{ name: 'Robolution | BIT Mesra | Team Pratyumnis' }],
  creator: 'Robolution | BIT Mesra | Team Pratyumnis',
  publisher: 'Robolution - Team Pratyumnis',
  alternates: {
    canonical: 'https://www.robolutionbitm.in',
  },
  openGraph: {
    title: 'Robolution - Official Robotics Club of BIT Mesra',
    description:
      'Robolution is the official robotics and innovation club of BIT Mesra, also known as Team Pratyumnis. We build robots, compete nationally, and push hands-on engineering through workshops, projects, and tech events.',
    siteName: 'Robolution - BIT Mesra',
    url: 'https://www.robolutionbitm.in',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Robolution - Official Robotics Club of BIT Mesra | Team Pratyumnis',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@robolutionbitm',
    title: 'Robolution - Official Robotics Club of BIT Mesra',
    description:
      'Official robotics club of BIT Mesra. Building robots. Competing hard. Learning engineering the real way.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Robolution',
    alternateName: ['Team Pratyumnis', 'Robolution BIT Mesra', 'BIT Mesra Robotics Club'],
    url: 'https://www.robolutionbitm.in',
    logo: 'https://www.robolutionbitm.in/logo.png',
    image: 'https://www.robolutionbitm.in/og-image.png',
    description:
      'Robolution is the official robotics and innovation club of BIT Mesra, also known as Team Pratyumnis. We build robots, compete nationally, and push hands-on engineering through workshops, projects, and tech events.',
    foundingDate: '2015',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ranchi',
      addressRegion: 'Jharkhand',
      addressCountry: 'IN',
      postalCode: '835215',
      streetAddress: 'BIT Mesra, Ranchi',
    },
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'Birla Institute of Technology, Mesra',
      alternateName: 'BIT Mesra',
      url: 'https://www.bitmesra.ac.in',
    },
    sameAs: [
      'https://www.instagram.com/robolution.bitm/',
      'https://www.linkedin.com/company/robolution-bit-mesra/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiry',
      url: 'https://www.robolutionbitm.in/contact',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Robolution | BIT Mesra | Team Pratyumnis',
    alternateName: 'Robolution',
    url: 'https://www.robolutionbitm.in',
    description:
      'Official website of Robolution - the robotics and innovation club of BIT Mesra (Team Pratyumnis)',
    publisher: {
      '@type': 'Organization',
      name: 'Robolution',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.robolutionbitm.in/logo.png',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.robolutionbitm.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans isolate`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <main>
            <ClientLayout>
              <LazyMotion features={domAnimation}>
                <ReactLenis root>{children}</ReactLenis>
              </LazyMotion>
            </ClientLayout>
          </main>
        </ThemeProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3LKNP3KLNW" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', 'G-3LKNP3KLNW');
            `}
        </Script>
        <SpeedInsights />
      </body>
    </html>
  )
}
