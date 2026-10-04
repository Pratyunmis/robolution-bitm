'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const Hero3DCadModel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let animationFrameId: number

    // ─── Scene & Camera ───
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 0, 7.0)

    // ─── WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // ─── Lights (Dark-toned Purple matching DarkVeil background) ───
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    scene.add(ambientLight)

    const purplePoint = new THREE.PointLight(0x5227ff, 2.0, 25)
    purplePoint.position.set(3, 3, 6)
    scene.add(purplePoint)

    const magentaPoint = new THREE.PointLight(0x431fa3, 1.4, 20)
    magentaPoint.position.set(-4, -2, 5)
    scene.add(magentaPoint)

    // ─── Master Robot Group ───
    const hologramGroup = new THREE.Group()
    scene.add(hologramGroup)

    // ─── Materials: Darker Toned Purple CAD Wireframe & Subtle Translucent Hull ───
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x6d3aff,
      transparent: true,
      opacity: 0.40,
      blending: THREE.AdditiveBlending,
    })

    const accentWireMaterial = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })

    const ghostVolumeMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a0933,
      transparent: true,
      opacity: 0.10,
      wireframe: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    // ─── Build Articulated 3D Combat Bot CAD Geometry ───
    const robotAssembly = new THREE.Group()
    hologramGroup.add(robotAssembly)

    const addCadPart = (
      geo: THREE.BufferGeometry,
      pos: [number, number, number] = [0, 0, 0],
      rot: [number, number, number] = [0, 0, 0],
      scale: [number, number, number] = [1, 1, 1],
      isAccent = false,
    ) => {
      const partGroup = new THREE.Group()

      // Wireframe Lines
      const wireframeGeo = new THREE.WireframeGeometry(geo)
      const lines = new THREE.LineSegments(
        wireframeGeo,
        isAccent ? accentWireMaterial : wireframeMaterial,
      )
      partGroup.add(lines)

      // Ghost Translucent Hull
      const ghost = new THREE.Mesh(geo, ghostVolumeMaterial)
      partGroup.add(ghost)

      partGroup.position.set(...pos)
      partGroup.rotation.set(...rot)
      partGroup.scale.set(...scale)
      robotAssembly.add(partGroup)
    }

    // 1. Main Chassis / Armored Torso
    addCadPart(new THREE.BoxGeometry(2.4, 1.8, 1.4, 6, 6, 4), [0, 0.2, 0])
    addCadPart(new THREE.CylinderGeometry(0.8, 1.1, 1.2, 8, 3), [0, -0.4, 0])

    // 2. Core Energy Reactor in Chest (Accent color)
    addCadPart(new THREE.IcosahedronGeometry(0.55, 2), [0, 0.3, 0.5], [0, 0, 0], [1, 1, 1], true)
    addCadPart(new THREE.TorusGeometry(0.7, 0.04, 8, 24), [0, 0.3, 0.5], [Math.PI / 2, 0, 0], [1, 1, 1], true)

    // 3. Angular Mech Head & Sensor Visor
    addCadPart(new THREE.BoxGeometry(1.1, 0.9, 1.1, 4, 3, 3), [0, 1.5, 0.1])
    addCadPart(new THREE.CylinderGeometry(0.3, 0.45, 0.4, 6), [0, 1.1, 0])
    // Visor bar (Accent color)
    addCadPart(new THREE.BoxGeometry(0.9, 0.22, 0.3, 3, 1, 1), [0, 1.5, 0.65], [0, 0, 0], [1, 1, 1], true)
    // Radar Antennas
    addCadPart(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4), [-0.45, 2.0, 0], [0, 0, 0.3])
    addCadPart(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4), [0.45, 2.0, 0], [0, 0, -0.3])

    // 4. Heavy Shoulder Pauldrons
    addCadPart(new THREE.BoxGeometry(0.9, 0.8, 1.1, 3, 3, 3), [-1.6, 0.8, 0], [0, 0, -0.2])
    addCadPart(new THREE.BoxGeometry(0.9, 0.8, 1.1, 3, 3, 3), [1.6, 0.8, 0], [0, 0, 0.2])

    // 5. Dual Robotic Manipulator Arms & Hydraulic Pistons
    // Left Arm
    addCadPart(new THREE.CylinderGeometry(0.24, 0.2, 1.2, 8, 3), [-1.7, 0.0, 0.2], [0.3, 0, -0.15])
    addCadPart(new THREE.SphereGeometry(0.3, 8, 8), [-1.8, -0.6, 0.4])
    addCadPart(new THREE.BoxGeometry(0.5, 1.0, 0.5, 2, 3, 2), [-1.8, -1.1, 0.6], [-0.4, 0, 0])
    // Left Gripper Claws
    addCadPart(new THREE.BoxGeometry(0.12, 0.45, 0.15, 1, 2, 1), [-2.0, -1.7, 0.8], [0.3, 0, -0.2])
    addCadPart(new THREE.BoxGeometry(0.12, 0.45, 0.15, 1, 2, 1), [-1.6, -1.7, 0.8], [0.3, 0, 0.2])

    // Right Arm
    addCadPart(new THREE.CylinderGeometry(0.24, 0.2, 1.2, 8, 3), [1.7, 0.0, 0.2], [0.3, 0, 0.15])
    addCadPart(new THREE.SphereGeometry(0.3, 8, 8), [1.8, -0.6, 0.4])
    addCadPart(new THREE.BoxGeometry(0.5, 1.0, 0.5, 2, 3, 2), [1.8, -1.1, 0.6], [-0.4, 0, 0])
    // Right Gripper Claws
    addCadPart(new THREE.BoxGeometry(0.12, 0.45, 0.15, 1, 2, 1), [2.0, -1.7, 0.8], [0.3, 0, 0.2])
    addCadPart(new THREE.BoxGeometry(0.12, 0.45, 0.15, 1, 2, 1), [1.6, -1.7, 0.8], [0.3, 0, -0.2])

    // 6. Heavy Drivetrain / Tread Base & Suspension Pods
    addCadPart(new THREE.BoxGeometry(3.0, 0.6, 2.2, 6, 2, 4), [0, -1.4, 0])
    // Wheels / Rollers
    addCadPart(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12, 2), [-1.3, -1.5, 0.8], [0, 0, Math.PI / 2])
    addCadPart(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12, 2), [-1.3, -1.5, -0.8], [0, 0, Math.PI / 2])
    addCadPart(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12, 2), [1.3, -1.5, 0.8], [0, 0, Math.PI / 2])
    addCadPart(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 12, 2), [1.3, -1.5, -0.8], [0, 0, Math.PI / 2])

    // Scaled & centered
    robotAssembly.scale.setScalar(0.72)
    robotAssembly.position.y = 0.05

    // ─── Interactive Mouse / Touch Drag Orbit & Cursor Tracking ───
    let isDragging = false
    let prevX = 0
    let prevY = 0
    let rotX = 0
    let rotY = 0
    let targetRotX = 0
    let targetRotY = 0

    let cachedRect = container.getBoundingClientRect()
    const updateCachedRect = () => {
      if (container) cachedRect = container.getBoundingClientRect()
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      updateCachedRect()
      prevX = 'touches' in e ? e.touches[0].clientX : e.clientX
      prevY = 'touches' in e ? e.touches[0].clientY : e.clientY
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isVisible) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      if (isDragging) {
        const deltaX = clientX - prevX
        const deltaY = clientY - prevY
        targetRotY += deltaX * 0.009
        targetRotX += deltaY * 0.007
        prevX = clientX
        prevY = clientY
      } else {
        const width = cachedRect.width || window.innerWidth
        const height = cachedRect.height || window.innerHeight
        const nx = ((clientX - cachedRect.left) / width) * 2 - 1
        const ny = -(((clientY - cachedRect.top) / height) * 2 - 1)
        targetRotY = nx * 0.45
        targetRotX = -ny * 0.25
        purplePoint.position.x = nx * 6
        purplePoint.position.y = ny * 4 + 2
      }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', onPointerDown, { passive: true })
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('mouseup', onPointerUp, { passive: true })
    dom.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp, { passive: true })

    const handleResize = () => {
      if (!container) return
      updateCachedRect()
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // ─── Animation Loop (Continuous Spin + Damping) ───
    const clock = new THREE.Clock()
    let isVisible = true
    let isPageVisible = !document.hidden
    let isRunning = false

    const animate = () => {
      if (!isVisible || !isPageVisible) {
        isRunning = false
        return
      }
      animationFrameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth inertia rotation interpolation
      rotY += (targetRotY - rotY) * 0.06
      rotX += (targetRotX - rotX) * 0.06

      // Continuous Slow Idle Spin combined with user interaction
      const autoSpin = elapsed * 0.28
      hologramGroup.rotation.y = autoSpin + rotY
      hologramGroup.rotation.x = rotX + Math.sin(elapsed * 1.4) * 0.04

      // Gentle floating hover elevation
      hologramGroup.position.y = Math.sin(elapsed * 1.6) * 0.1

      // Subtle low-intensity light pulsing
      purplePoint.intensity = 1.8 + Math.sin(elapsed * 2.5) * 0.4
      magentaPoint.intensity = 1.2 + Math.cos(elapsed * 2.0) * 0.3

      renderer.render(scene, camera)
    }

    const startLoop = () => {
      if (!isRunning && isVisible && isPageVisible) {
        isRunning = true
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    const stopLoop = () => {
      if (isRunning) {
        cancelAnimationFrame(animationFrameId)
        isRunning = false
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          startLoop()
        } else {
          stopLoop()
        }
      },
      { threshold: 0.05 },
    )
    observer.observe(container)

    const handleVisibility = () => {
      isPageVisible = !document.hidden
      if (isPageVisible) {
        startLoop()
      } else {
        stopLoop()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    startLoop()

    return () => {
      stopLoop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
      dom.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      dom.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      wireframeMaterial.dispose()
      accentWireMaterial.dispose()
      ghostVolumeMaterial.dispose()
      scene.clear()
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center select-none overflow-visible pointer-events-auto">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />
    </div>
  )
}

export default Hero3DCadModel
