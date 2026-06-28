"use client"

import { useEffect, useRef, useState } from "react"

export function InteractiveNetworkBackground({
  className = "",
  nodeColor,
  connectionColor,
  maxConnections = 150,
  nodeCount,
}) {
  const canvasRef = useRef(null)
  const nodesRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false })
  const animationRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate optimal node count based on screen size
  const calculateNodeCount = (width, height) => {
    if (nodeCount) return nodeCount

    const area = width * height
    const isMobile = width < 768
    const isTablet = width < 1024

    if (isMobile) {
      return Math.min(20, Math.floor(area / 15000))
    } else if (isTablet) {
      return Math.min(30, Math.floor(area / 12000))
    } else {
      return Math.min(50, Math.floor(area / 10000))
    }
  }

  // Create nodes with random properties
  const createNodes = (width, height) => {
    const nodes = []
    const count = calculateNodeCount(width, height)

    for (let i = 0; i < count; i++) {
      const speed = 0.05 + Math.random() * 0.15
      const angle = Math.random() * Math.PI * 2
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        originalVx: vx,
        originalVy: vy,
        radius: 1.5 + Math.random() * 1.0, // Smaller radius (1.5-2.5px)
        opacity: 0.9 + Math.random() * 0.1, // Higher opacity for clarity (0.9-1.0)
      })
    }

    nodesRef.current = nodes
  }

  // Calculate distance between two points
  const distance = (x1, y1, x2, y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  }

  // Find connections between nodes
  const findConnections = (nodes, mouse) => {
    const connections = []
    const maxDistance = maxConnections

    // Node to node connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = distance(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.8 // Higher base opacity (up to 0.8)
          connections.push({
            node1: nodes[i],
            node2: nodes[j],
            opacity,
          })
        }
      }
    }

    // Mouse to node connections
    if (mouse.isActive) {
      for (let i = 0; i < nodes.length; i++) {
        const dist = distance(mouse.x, mouse.y, nodes[i].x, nodes[i].y)

        if (dist < maxDistance * 1.2) {
          const opacity = (1 - dist / (maxDistance * 1.2)) * 0.9 // Higher opacity for mouse connections (up to 0.9)
          connections.push({
            node1: { x: mouse.x, y: mouse.y, vx: 0, vy: 0, radius: 4, opacity: 1.0, originalVx: 0, originalVy: 0 },
            node2: nodes[i],
            opacity,
          })
        }
      }
    }

    return connections
  }

  // Apply mouse influence to nodes
  const applyMouseInfluence = (nodes, mouse) => {
    if (!mouse.isActive) return

    const influenceRadius = 100
    const repelStrength = 0.5

    nodes.forEach((node) => {
      const dist = distance(node.x, node.y, mouse.x, mouse.y)

      if (dist < influenceRadius && dist > 0) {
        const force = (influenceRadius - dist) / influenceRadius
        const dx = (node.x - mouse.x) / dist
        const dy = (node.y - mouse.y) / dist

        // Apply gentle repulsion
        node.vx += dx * force * repelStrength
        node.vy += dy * force * repelStrength

        // Limit velocity
        const maxVel = 2
        const vel = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
        if (vel > maxVel) {
          node.vx = (node.vx / vel) * maxVel
          node.vy = (node.vy / vel) * maxVel
        }
      } else {
        // Gradually return to original velocity
        node.vx += (node.originalVx - node.vx) * 0.02
        node.vy += (node.originalVy - node.vy) * 0.02
      }
    })
  }

  // Main animation setup
  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size and handle resize
    const resizeCanvas = () => {
      const parent = canvas.parentElement || document.body
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      createNodes(canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse tracking
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    const handleMouseEnter = () => {
      mouseRef.current.isActive = true
    }

    // Attach listeners to canvas instead of document to only track mouse within the component
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("mouseenter", handleMouseEnter)

    // Animation loop
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      // Skip frame if delta time is too large (tab switching)
      if (deltaTime > 100) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const nodes = nodesRef.current
      const mouse = mouseRef.current

      // Apply mouse influence
      applyMouseInfluence(nodes, mouse)

      // Update node positions
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x <= node.radius || node.x >= canvas.width - node.radius) {
          node.vx *= -1
          node.originalVx *= -1
          node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x))
        }
        if (node.y <= node.radius || node.y >= canvas.height - node.radius) {
          node.vy *= -1
          node.originalVy *= -1
          node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y))
        }
      })

      // Find and draw connections
      const connections = findConnections(nodes, mouse)

      // Use violet/purple colors similar to the announcement page
      const baseNodeColor = nodeColor || "139, 92, 246" // violet-500 RGB
      const baseConnectionColor = connectionColor || "124, 58, 237" // violet-600 RGB

      // Draw connections first (behind nodes)
      connections.forEach((connection) => {
        const gradient = ctx.createLinearGradient(
          connection.node1.x,
          connection.node1.y,
          connection.node2.x,
          connection.node2.y,
        )

        gradient.addColorStop(0, `rgba(${baseConnectionColor}, ${connection.opacity})`)
        gradient.addColorStop(0.5, `rgba(${baseConnectionColor}, ${connection.opacity * 0.9})`)
        gradient.addColorStop(1, `rgba(${baseConnectionColor}, ${connection.opacity})`)

        ctx.beginPath()
        ctx.moveTo(connection.node1.x, connection.node1.y)
        ctx.lineTo(connection.node2.x, connection.node2.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5 // Thicker lines
        ctx.stroke()
      })

      // Draw nodes on top of connections
      nodes.forEach((node) => {
        // Reduce glow effect for clarity
        const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 2)

        glowGradient.addColorStop(0, `rgba(${baseNodeColor}, ${node.opacity * 0.4})`)
        glowGradient.addColorStop(0.7, `rgba(${baseNodeColor}, ${node.opacity * 0.2})`)
        glowGradient.addColorStop(1, `rgba(${baseNodeColor}, 0)`)

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()

        // Sharp, solid node core
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${baseNodeColor}, ${node.opacity})`
        ctx.fill()

        // Add a crisp white center highlight for definition
        ctx.beginPath()
        ctx.arc(node.x - node.radius * 0.2, node.y - node.radius * 0.2, node.radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.8})`
        ctx.fill()

        // Add a subtle dark outline for better definition
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${baseNodeColor}, ${node.opacity * 0.3})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw mouse node if active - make it sharper and clearer
      if (mouse.isActive) {
        const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 12)

        const mouseColor = "167, 139, 250" // violet-400

        mouseGradient.addColorStop(0, `rgba(${mouseColor}, 0.4)`)
        mouseGradient.addColorStop(0.7, `rgba(${mouseColor}, 0.2)`)
        mouseGradient.addColorStop(1, `rgba(${mouseColor}, 0)`)

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2)
        ctx.fillStyle = mouseGradient
        ctx.fill()

        // Sharp, solid mouse node core
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${mouseColor}, 0.95)`
        ctx.fill()

        // Add white highlight for definition
        ctx.beginPath()
        ctx.arc(mouse.x - 1, mouse.y - 1, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`
        ctx.fill()

        // Add subtle outline
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${mouseColor}, 0.4)`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseleave", handleMouseLeave)
        canvas.removeEventListener("mouseenter", handleMouseEnter)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mounted, nodeColor, connectionColor, maxConnections, nodeCount])

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto z-0 ${className}`}
      style={{
        background: "transparent",
      }}
      aria-hidden="true"
    />
  )
}
