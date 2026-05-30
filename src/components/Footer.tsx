'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-black/80 border-t border-white/10 pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl flex items-center gap-2 font-bold mb-4 tracking-tight">
            <Image
              src="/logo.png"
              className="h-10 w-10"
              height={100}
              width={100}
              alt="Robolution Logo"
            />
            ROBOLUTION
          </h3>
          <p className="text-white/50 max-w-sm mb-6 leading-relaxed">
            The official robotics club of BIT Mesra. Fostering innovation, creativity, and technical
            excellence since 2001.
          </p>
          <div className="flex gap-4 mb-8">
            <SocialLink
              href="https://www.facebook.com/TeamRobolution"
              icon={<FaFacebook className="w-5 h-5" />}
            />
            <SocialLink
              href="https://www.instagram.com/robolution.bitm/"
              icon={<FaInstagram className="w-5 h-5" />}
            />
            <SocialLink
              href="https://www.linkedin.com/company/robolution-bit-mesra"
              icon={<FaLinkedin className="w-5 h-5" />}
            />
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-bold mb-6 text-lg">Contact Us</h4>
          <div className="space-y-4 text-white/60">
            <ContactItem icon={<Mail className="w-4 h-4" />} text="pratyumnis@bitmesra.ac.in" />
            <ContactItem icon={<Phone className="w-4 h-4" />} text="+91 7632910105" />
            <ContactItem
              icon={<MapPin className="w-4 h-4" />}
              text="BIT Mesra, Ranchi, Jharkhand"
            />
          </div>
        </div>

        <div className="col-span-1">
          <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-3 text-white/60">
            <FooterLink href="/" label="Home" />
            <FooterLink href="/about" label="About" />
            <FooterLink href="/work" label="Projects" />
            <FooterLink href="/contact" label="Sponsorship" />
          </ul>
        </div>
      </div>

      <Separator className="bg-white/10 my-8" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-sm">
        <p>© {new Date().getFullYear()} Robolution BIT Mesra. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <Link
    href={href}
    className="p-2 bg-white/5 rounded-full hover:bg-white/20 hover:text-white transition-all duration-300 border border-white/5 hover:border-white/20"
  >
    {icon}
  </Link>
)

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 group">
    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
      {icon}
    </div>
    <span className="group-hover:text-white transition-colors text-sm">{text}</span>
  </div>
)

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link href={href} className="hover:text-white transition-colors flex items-center gap-2 group">
      <span className="w-1 h-1 bg-white/20 rounded-full group-hover:bg-white transition-colors" />
      {label}
    </Link>
  </li>
)
