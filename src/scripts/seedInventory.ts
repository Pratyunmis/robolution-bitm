import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const seedCategories = [
  { name: 'Microcontrollers', description: 'Development boards, MCUs, and programmable logic controllers' },
  { name: 'Single-board computers', description: 'Embedded Linux computing boards, Raspberry Pi, and compute modules' },
  { name: 'Sensors', description: 'Distance, IMU, optical, environmental, and proximity sensing devices' },
  { name: 'Motor drivers', description: 'H-bridges, stepper drivers, and high-power motor control shields' },
  { name: 'Motors', description: 'DC gear motors, BLDC motors, stepper motors, and servo actuators' },
  { name: 'Batteries', description: 'LiPo packs, 18650 Li-ion cells, lead acid batteries, and battery holders' },
  { name: 'Power modules', description: 'Buck/boost converters, voltage regulators, and power distribution boards' },
  { name: 'Communication modules', description: 'NRF24L01, LoRa, Bluetooth, WiFi, and telemetry radios' },
  { name: 'ICs', description: 'Logic gates, op-amps, shift registers, and integrated circuits' },
  { name: 'Wires and connectors', description: 'Jumper wires, ribbon cables, XT60, JST, and terminal blocks' },
  { name: 'Mechanical hardware', description: 'Chassis kits, standoffs, acrylic brackets, pulleys, and belt drives' },
  { name: 'Tools', description: 'Soldering irons, multimeters, wire strippers, and lab equipment' },
  { name: 'Consumables', description: 'Breadboards, resistor kits, capacitor kits, solder wire, and heat shrink' },
]

const seedItems = [
  {
    name: 'Arduino Uno R3',
    sku: 'MC-001',
    categoryName: 'Microcontrollers',
    quantity: 15,
    minimumStock: 3,
    location: 'Shelf A1 - Bin 1',
  },
  {
    name: 'Arduino Nano V3',
    sku: 'MC-002',
    categoryName: 'Microcontrollers',
    quantity: 20,
    minimumStock: 5,
    location: 'Shelf A1 - Bin 2',
  },
  {
    name: 'ESP32 DevKit V1',
    sku: 'MC-003',
    categoryName: 'Microcontrollers',
    quantity: 25,
    minimumStock: 5,
    location: 'Shelf A1 - Bin 3',
  },
  {
    name: 'Raspberry Pi 4 (4GB)',
    sku: 'SBC-001',
    categoryName: 'Single-board computers',
    quantity: 8,
    minimumStock: 2,
    location: 'Secure Locker B1',
  },
  {
    name: 'Raspberry Pi Pico',
    sku: 'SBC-002',
    categoryName: 'Single-board computers',
    quantity: 30,
    minimumStock: 5,
    location: 'Shelf A1 - Bin 4',
  },
  {
    name: 'L298N Dual H-Bridge Driver',
    sku: 'MD-001',
    categoryName: 'Motor drivers',
    quantity: 20,
    minimumStock: 4,
    location: 'Shelf A2 - Bin 1',
  },
  {
    name: 'TB6612FNG Dual Driver',
    sku: 'MD-002',
    categoryName: 'Motor drivers',
    quantity: 15,
    minimumStock: 3,
    location: 'Shelf A2 - Bin 2',
  },
  {
    name: 'MPU6050 6-DoF IMU Sensor',
    sku: 'SN-002',
    categoryName: 'Sensors',
    quantity: 25,
    minimumStock: 5,
    location: 'Shelf A3 - Bin 1',
  },
  {
    name: 'HC-SR04 Ultrasonic Sensor',
    sku: 'SN-001',
    categoryName: 'Sensors',
    quantity: 30,
    minimumStock: 6,
    location: 'Shelf A3 - Bin 2',
  },
  {
    name: 'IR Obstacle Sensor Module',
    sku: 'SN-003',
    categoryName: 'Sensors',
    quantity: 40,
    minimumStock: 8,
    location: 'Shelf A3 - Bin 3',
  },
  {
    name: 'LM2596 Buck Converter Module',
    sku: 'PWR-001',
    categoryName: 'Power modules',
    quantity: 25,
    minimumStock: 5,
    location: 'Shelf B1 - Bin 1',
  },
  {
    name: '11.1V 3S 2200mAh LiPo Pack',
    sku: 'BAT-001',
    categoryName: 'Batteries',
    quantity: 10,
    minimumStock: 2,
    location: 'Fireproof Safe C1',
  },
  {
    name: 'Male-to-Male Jumper Wires (40pk)',
    sku: 'CON-001',
    categoryName: 'Wires and connectors',
    quantity: 50,
    minimumStock: 10,
    location: 'Shelf C2 - Drawer 1',
  },
  {
    name: '830-Point Solderless Breadboard',
    sku: 'CON-002',
    categoryName: 'Consumables',
    quantity: 35,
    minimumStock: 5,
    location: 'Shelf C2 - Drawer 2',
  },
  {
    name: '1/4W Metal Film Resistor Kit',
    sku: 'CS-001',
    categoryName: 'Consumables',
    quantity: 12,
    minimumStock: 2,
    location: 'Shelf C3 - Box 1',
  },
  {
    name: 'Electrolytic Capacitor Assortment Kit',
    sku: 'CS-002',
    categoryName: 'Consumables',
    quantity: 10,
    minimumStock: 2,
    location: 'Shelf C3 - Box 2',
  },
]

export async function seedInventory() {
  console.log('🌱 Starting Robolution Inventory Seeding...')
  const payload = await getPayload({ config })

  // 1. Seed Categories
  console.log('\n📁 Seeding 13 Inventory Categories...')
  const categoryMap = new Map<string, number>()

  for (const cat of seedCategories) {
    const existing = await payload.find({
      collection: 'inventory-categories',
      where: {
        name: {
          equals: cat.name,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap.set(cat.name, existing.docs[0].id)
      console.log(`  ✓ Category already exists: "${cat.name}" (ID: ${existing.docs[0].id})`)
    } else {
      const created = await payload.create({
        collection: 'inventory-categories',
        data: {
          name: cat.name,
          description: cat.description,
        },
      })
      categoryMap.set(cat.name, created.id)
      console.log(`  + Created Category: "${cat.name}" (ID: ${created.id})`)
    }
  }

  // 2. Seed Items and create matching initial restock transactions
  console.log('\n📦 Seeding 16 Core Robotics Items...')
  let createdCount = 0

  for (const item of seedItems) {
    const catId = categoryMap.get(item.categoryName)
    if (!catId) {
      console.warn(`  ⚠️ Category not found for item ${item.name}: ${item.categoryName}`)
      continue
    }

    // Check if item already exists by SKU or Name
    const existing = await payload.find({
      collection: 'inventory-items',
      where: {
        or: [
          { sku: { equals: item.sku } },
          { name: { equals: item.name } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ Item already exists: "${item.name}" (SKU: ${item.sku})`)
    } else {
      const newItem = await payload.create({
        collection: 'inventory-items',
        data: {
          name: item.name,
          sku: item.sku,
          category: catId,
          location: item.location,
          minimumStock: item.minimumStock,
          status: item.quantity > 0 ? 'active' : 'out-of-stock',
        },
      })

      // Create matching Restock transaction
      if (item.quantity > 0) {
        await payload.create({
          collection: 'inventory-transactions',
          data: {
            item: newItem.id,
            type: 'restock',
            quantity: item.quantity,
            reason: 'Robolution lab initial inventory seed',
          },
        })
      }

      createdCount++
      console.log(`  + Seeded Item: "${item.name}" (SKU: ${item.sku}, Qty: ${item.quantity})`)
    }
  }

  console.log(`\n🎉 Robolution Inventory Seeding Complete! (${createdCount} new items created)`)
}

// Run directly if invoked from command line
if (process.argv[1] && process.argv[1].endsWith('seedInventory.ts')) {
  seedInventory()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err)
      process.exit(1)
    })
}
