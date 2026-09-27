# Robolution Hardware Lab — Standard Operating Procedures (SOP)

**Document Version:** 1.0  
**Target Audience:** Club Executives, Inventory Managers, Domain Leads, and Members  
**Organization:** Robolution (Team Pratyumnis), Birla Institute of Technology, Mesra  

---

## 1. Overview & System Objectives

The Robolution Inventory Management System tracks all electronic components, development boards, sensors, tools, and mechanical hardware owned by the club. Its primary goals are:
- Ensuring hardware availability for competitions (ABU Robocon, RoboSaga, hackathons).
- Preventing loss, misplacement, or unaccounted damage of expensive club assets.
- Maintaining an immutable, real-time audit ledger of all component movements.

---

## 2. User Roles & Access Hierarchy

| Role | Permissions | Responsibilities |
|---|---|---|
| **Admin** | Full read, create, update, and manage access across all collections and database records. | Bulk CSV import/export, supplier procurement, creating new categories, resolving discrepancies. |
| **Member** | Browse catalog, view live stock meters, request checkouts, process returns, and report damage. | Ensuring checked-out components are returned in good condition after project completion. |
| **Intern** | Read-only access to browse catalog, specifications, and check component availability in the lab. | Learning lab hardware, checking parts availability before submitting project requests. |

---

## 3. Standard Operating Workflows

### 3.1 Checking Out Components (Issue)
1. **Navigate to Component**: Open `/inventory` and locate the item using search or category filters.
2. **Open Detail View**: Click on the component card to review available quantity in the lab.
3. **Submit Checkout Request**:
   - Click the **"Request Checkout"** button.
   - Enter the required quantity (cannot exceed available units).
   - Enter the recipient member's email address.
   - Specify the project name or purpose (e.g. *ABU Robocon Chassis Prototype*).
4. **Physical Retrieval**: Retrieve the physical item from the designated shelf location (e.g., `Shelf A1 - Bin 2`).

### 3.2 Returning Components (Return)
1. **Physical & Electrical Inspection**:
   - Verify header pins are not bent or shorted.
   - For microcontrollers (ESP32, Arduino): Verify bootloader response via USB.
   - For LiPo batteries: Check cell voltages using a multimeter (no cell below $3.3\text{V}$).
2. **Log Return in System**:
   - Open `/inventory/[id]` for the returned component.
   - Click **"Return Units"**.
   - Enter the return quantity and optional condition notes.
   - Confirm return. The system immediately updates available lab stock.
3. **Storage**: Return components back to their labeled bin and shelf drawer.

### 3.3 Reporting Damaged Hardware (Write-Off)
If a component burns out, suffers mechanical fracture, or fails diagnostics:
1. Do **NOT** return it to active lab inventory.
2. Open the item page `/inventory/[id]`.
3. Click **"Report Damage"**.
4. Enter the damaged quantity and a **mandatory description** of what caused the failure (e.g. *Overvoltage applied to 5V rail during motor test*).
5. The system automatically reduces `quantityTotal` and `quantityAvailable` while logging the incident in the audit ledger.

---

## 4. SKU Naming Taxonomy

To maintain organized storage bins and swift barcode/search lookup, all components must follow this standard SKU prefix format:

| Prefix | Category | Example Components |
|---|---|---|
| `MC-` | Microcontrollers | `MC-001` (Arduino Uno), `MC-003` (ESP32 DevKit) |
| `SBC-` | Single-board computers | `SBC-001` (Raspberry Pi 4), `SBC-002` (Raspberry Pi Pico) |
| `SN-` | Sensors | `SN-001` (HC-SR04), `SN-002` (MPU6050 IMU), `SN-003` (IR Sensor) |
| `MD-` | Motor Drivers | `MD-001` (L298N), `MD-002` (TB6612FNG) |
| `MOT-` | Motors & Actuators | `MOT-001` (NEMA 17 Stepper), `MOT-002` (MG996R Servo) |
| `BAT-` | Batteries | `BAT-001` (11.1V 3S LiPo), `BAT-002` (18650 Li-ion Cell) |
| `PWR-` | Power Modules | `PWR-001` (LM2596 Buck Converter) |
| `COM-` | Communication Modules | `COM-001` (NRF24L01+), `COM-002` (HC-05 Bluetooth) |
| `IC-` | Integrated Circuits | `IC-001` (NE555 Timer), `IC-002` (74HC595 Shift Register) |
| `CON-` | Wires & Connectors | `CON-001` (Jumper Wires 40pk), `CON-002` (Breadboard 830pt) |
| `MEC-` | Mechanical Hardware | `MEC-001` (M3 Standoff Kit), `MEC-002` (Omni Wheels) |
| `TL-` | Tools & Equipment | `TL-001` (Soldering Station 60W), `TL-002` (Digital Multimeter) |
| `CS-` | Consumables | `CS-001` (Resistor Kit), `CS-002` (Capacitor Kit) |

---

## 5. Bulk CSV Operations

### 5.1 Exporting Data
- Open `/inventory` and click **"Export Catalog (CSV)"** for component lists.
- Open `/inventory/transactions` and click **"Export Audit Log (CSV)"** for club auditing.

### 5.2 Bulk Importing New Shipments
1. Click **"Import Batch (CSV)"** on `/inventory`.
2. Download the pre-formatted template via **"Download Template (.csv)"**.
3. Fill in component rows (`name`, `sku`, `category`, `quantityTotal`, `minimumStock`, `location`, `description`).
4. Drag and drop the `.csv` file into the modal dropzone, preview parsed rows, and click **"Start CSV Import"**.
5. Categories are created automatically, and initial restocks are logged to the audit ledger.
