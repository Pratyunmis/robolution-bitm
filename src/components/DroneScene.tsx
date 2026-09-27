'use client'

import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface DroneModelProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
}

function DroneModel({ scrollProgress, mouseX, mouseY }: DroneModelProps) {
  const gltf = useGLTF('/drone.glb')
  const groupRef = useRef<THREE.Group>(null)
  const currentState = useRef({
    rotX: 0,
    rotY: 0,
    posY: 3,
    posZ: 0,
    tilt: 0,
  })

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // ── Target values driven by scroll ──────────────────────────────
    // Drone starts above center, flies DOWN as user scrolls
    const targetPosY  = 2 - scrollProgress * 30     // drops from +2 to -28 (massive drop)
    const targetPosZ  = scrollProgress * 3           // comes slightly forward
    const targetRotY  = scrollProgress * Math.PI * 3 // 1.5 full spins on scroll
    const targetTilt  = scrollProgress * 0.5         // tilts forward (banking dive)

    // Mouse parallax on top
    const mouseRotY = mouseX * 0.4
    const mouseRotX = mouseY * 0.25

    // ── Smooth lerp ──────────────────────────────────────────────────
    const lerpFactor = 0.06
    currentState.current.posY  += (targetPosY  - currentState.current.posY)  * lerpFactor
    currentState.current.posZ  += (targetPosZ  - currentState.current.posZ)  * lerpFactor
    currentState.current.rotY  += (targetRotY  - currentState.current.rotY)  * lerpFactor
    currentState.current.tilt  += (targetTilt  - currentState.current.tilt)  * lerpFactor

    // ── Apply to group ────────────────────────────────────────────────
    groupRef.current.position.y = currentState.current.posY + Math.sin(t * 0.7) * 0.3
    groupRef.current.position.z = currentState.current.posZ
    groupRef.current.position.x = Math.sin(t * 0.4) * 0.5  // subtle side drift

    groupRef.current.rotation.y = currentState.current.rotY + mouseRotY
    groupRef.current.rotation.x = currentState.current.tilt  + mouseRotX + Math.sin(t * 0.5) * 0.04
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.03  // subtle roll
  })

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      <primitive object={gltf.scene} scale={40} />
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={3} color="#ffffff" castShadow />
      <directionalLight position={[-10, -5, -10]} intensity={0.8} color="#6699ff" />
      <pointLight position={[0, 10, 5]} intensity={2} color="#ffffff" decay={2} />
      <pointLight position={[5, -5, 5]} intensity={1} color="#4488ff" decay={2} />
      <spotLight
        position={[0, 30, 10]}
        angle={0.4}
        penumbra={0.6}
        intensity={4}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  )
}

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const current = useRef({ z: 12, y: 1 })

  useFrame(() => {
    // Camera pulls back a little as drone dives so you follow the journey
    const targetZ = 12 + scrollProgress * 8
    const targetY = 1  - scrollProgress * 6

    current.current.z += (targetZ - current.current.z) * 0.04
    current.current.y += (targetY - current.current.y) * 0.04

    camera.position.z = current.current.z
    camera.position.y = current.current.y
    camera.lookAt(0, current.current.y - 1, 0)
  })

  return null
}

interface DroneSceneProps {
  scrollProgress?: number
  mouseX?: number
  mouseY?: number
  className?: string
}

export default function DroneScene({
  scrollProgress = 0,
  mouseX = 0,
  mouseY = 0,
  className = '',
}: DroneSceneProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 1, 12], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Lights />
        <CameraController scrollProgress={scrollProgress} />
        <Suspense fallback={null}>
          <DroneModel
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload('/drone.glb')
