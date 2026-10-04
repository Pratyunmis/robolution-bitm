'use client'

import React from 'react'
import { FadeIn } from './FadeIn'

interface ServiceItem {
  number: string
  name: string
  description: string
}

const services: ServiceItem[] = [
  {
    number: '01',
    name: '3D Modeling & Kinematics',
    description:
      'Creation of detailed robotic mechanisms, custom chassis, and CAD models tailored to competition needs, ideal for ABU Robocon, battlebots, and autonomous rovers.',
  },
  {
    number: '02',
    name: 'Physics Simulation & FEA',
    description:
      'High-precision stress analysis and photorealistic kinematic simulations using MATLAB Simulink and ANSYS to validate structural integrity before physical fabrication.',
  },
  {
    number: '03',
    name: 'Motion Control & Dynamics',
    description:
      'Dynamic multi-axis motor control algorithms, holonomic drive kinematics, and high-speed trajectory planning for agile autonomous competition bots.',
  },
  {
    number: '04',
    name: 'Hardware Prototyping & CNC',
    description:
      'Precision CNC milling, 3D printing, carbon-fiber layup, and custom aluminum chassis machining in our state-of-the-art BIT Mesra robotics laboratory.',
  },
  {
    number: '05',
    name: 'Embedded Systems & Edge AI',
    description:
      'Designing custom power distribution PCBs, high-current BLDC motor drivers, real-time STM32 firmware, and NVIDIA Jetson deep-learning vision pipelines.',
  },
]

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative z-20 w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 select-none"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Heading */}
        <FadeIn delay={0} y={40} duration={0.8} className="w-full text-center">
          <h2
            className="font-black uppercase tracking-tight text-[#0C0C0C] text-center mb-16 sm:mb-20 md:mb-28 leading-none"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Services
          </h2>
        </FadeIn>

        {/* Vertical List */}
        <div className="flex flex-col w-full">
          {services.map((service, index) => (
            <FadeIn
              key={service.number}
              delay={index * 0.1}
              y={30}
              duration={0.7}
              className={`w-full py-8 sm:py-10 md:py-12 ${
                index !== services.length - 1 ? 'border-b border-[rgba(12,12,12,0.15)]' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12">
                {/* Left Number */}
                <div
                  className="font-black text-[#0C0C0C] leading-none shrink-0"
                  style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
                >
                  {service.number}
                </div>

                {/* Right Content */}
                <div className="flex flex-col justify-center max-w-2xl">
                  <h3
                    className="font-medium uppercase text-[#0C0C0C] mb-2 leading-tight"
                    style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="font-light text-[#0C0C0C] opacity-60 leading-relaxed"
                    style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
