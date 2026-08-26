import { NextResponse } from 'next/server'

export async function GET() {
  const headers = [
    'name',
    'sku',
    'category',
    'quantityTotal',
    'minimumStock',
    'location',
    'description',
  ]

  const sampleRows = [
    [
      'Arduino Uno R3',
      'MC-001',
      'Microcontrollers',
      '15',
      '3',
      'Shelf A1 - Bin 1',
      'ATmega328P development board with 14 digital I/O pins and 6 analog inputs',
    ],
    [
      'HC-SR04 Ultrasonic Sensor',
      'SN-001',
      'Sensors',
      '30',
      '5',
      'Shelf A3 - Bin 2',
      '2cm to 400cm non-contact distance measurement module with trigger & echo pins',
    ],
    [
      'L298N Motor Driver',
      'MD-001',
      'Motor drivers',
      '20',
      '4',
      'Shelf A2 - Bin 1',
      'Dual H-Bridge motor driver module for controlling up to two DC motors or one stepper motor',
    ],
    [
      '11.1V 3S 2200mAh LiPo Pack',
      'BAT-001',
      'Batteries',
      '10',
      '2',
      'Fireproof Safe C1',
      'High-discharge 35C rechargeable lithium polymer battery pack with XT60 connector',
    ],
  ]

  const csvContent = [
    headers.join(','),
    ...sampleRows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')),
  ].join('\r\n')

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="robolution-inventory-template.csv"',
    },
  })
}
