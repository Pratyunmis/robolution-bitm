import DarkVeil from '@/components/DarkVeil'
import { Mail, MapPin, Linkedin, Instagram, Facebook } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import ContactForm from './ContactForm'

export const revalidate = 1800 // Revalidate every hour

export default async function ContactPage() {
  const payload = await getPayload({ config })

  // Fetch the contact form from Payload
  let contactForm = null
  try {
    const forms = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Contact Form',
        },
      },
      limit: 1,
    })
    contactForm = forms.docs[0] || null
  } catch (error) {
    console.error('Error fetching contact form:', error)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'pratyumnis@bitmesra.ac.in',
      link: 'mailto:pratyumnis@bitmesra.ac.in',
      description: 'Send us an email anytime',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'BIT Mesra, Ranchi',
      link: 'https://maps.google.com/?q=BIT+Mesra',
      description: 'Jharkhand 835215, India',
    },
  ]

  const socialLinks = [
    {
      icon: Linkedin,
      name: 'LinkedIn',
      link: 'https://www.linkedin.com/company/robolution-bit-mesra',
      color: 'hover:bg-blue-500/20 hover:border-blue-500/50',
    },
    {
      icon: Facebook,
      name: 'Facebook',
      link: 'https://www.facebook.com/TeamRobolution',
      color: 'hover:bg-purple-500/20 hover:border-purple-500/50',
    },
    {
      icon: Instagram,
      name: 'Instagram',
      link: 'https://instagram.com/robolution.bitm',
      color: 'hover:bg-pink-500/20 hover:border-pink-500/50',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans overflow-x-hidden">
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DarkVeil />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-white/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/50 font-semibold border border-white/10 px-4 md:px-6 py-2 rounded-full backdrop-blur-sm">
              Get in Touch
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/40 px-4">
            Contact Us
          </h1>

          <p className="text-base md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Have a question or want to collaborate? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform shrink-0">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold mb-1">{info.title}</h3>
                    <p className="text-white/90 mb-1">{info.value}</p>
                    <p className="text-sm text-white/50">{info.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Form - Takes up more space */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-12 backdrop-blur-sm">
                <h2 className="text-2xl md:text-4xl font-bold mb-3">Send us a message</h2>
                <p className="text-sm md:text-base text-white/60 mb-8">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                {contactForm ? (
                  <ContactForm formId={contactForm.id} />
                ) : (
                  <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-white/60">
                      Contact form is not available at the moment. Please email us directly at{' '}
                      <a
                        href="mailto:pratyumnis@bitmesra.ac.in"
                        className="text-white hover:underline"
                      >
                        pratyumnis@bitmesra.ac.in
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Social Links */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                <h3 className="text-xl md:text-2xl font-bold mb-6">Connect with us</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 bg-white/5 border border-white/10 rounded-2xl transition-all duration-300 hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
                <p className="text-sm text-white/50 mt-6">
                  Follow us on social media for updates, events, and behind-the-scenes content.
                </p>
              </div>

              {/* Quick Response Info */}
              <div className="bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">Quick Response</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  We typically respond to all inquiries within 24-48 hours.
                </p>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Usually replies within a day</span>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-3">💡 Did you know?</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Robolution has been pioneering robotics innovation at BIT Mesra since 2001,
                  training over 1000+ students and winning 50+ competitions!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative z-10 px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center px-4">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">Find Us</h2>
            <p className="text-sm md:text-base text-white/60">
              Visit us at BIT Mesra Campus, Ranchi
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.16719796874!2d85.43732607557423!3d23.41230497890253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb53f0c27be7%3A0x66180c1cf3c5e704!2sBirla%20Institute%20of%20Technology%20-%20Mesra!5e1!3m2!1sen!2sin!4v1765693410843!5m2!1sen!2sin"
                className="absolute top-0 left-0 w-full h-full"
                style={{ border: '0' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Footer */}
            <div className="bg-white/5 border-t border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/60" />
                <span className="text-white/80 text-sm">BIT Mesra, Ranchi, Jharkhand 835215</span>
              </div>
              <a
                href="https://maps.google.com/?q=BIT+Mesra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white hover:text-white/80 font-semibold text-sm transition-all hover:scale-105 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
