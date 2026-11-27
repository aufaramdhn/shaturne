import { useEffect, useRef } from 'react'

const CELL = 44
const RADIUS = 210
const LENS_STRENGTH = 26
const LERP = 0.12

interface GridPoint {
  x: number
  y: number
  intensity: number
}

interface Palette {
  baseLine: string
  glowCyan: string
  glowViolet: string
  dot: string
}

function readPalette(): Palette {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'
  if (isLight) {
    return {
      baseLine: 'rgba(42, 46, 58, 0.085)',
      glowCyan: '12, 132, 158',
      glowViolet: '109, 40, 217',
      dot: '12, 132, 158',
    }
  }
  return {
    baseLine: 'rgba(148, 163, 184, 0.08)',
    glowCyan: '78, 224, 240',
    glowViolet: '167, 139, 250',
    dot: '78, 224, 240',
  }
}

export default function InteractiveGridBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let cols = 0
    let rows = 0
    let offsetX = 0
    let offsetY = 0
    let palette = readPalette()

    let targetX = -9999
    let targetY = -9999
    let curX = -9999
    let curY = -9999
    let targetAlpha = 0
    let curAlpha = 0

    let rafId = 0
    let inView = true
    let tabVisible = !document.hidden

    const syncSize = () => {
      const rect = wrapper.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(width / CELL) + 3
      rows = Math.ceil(height / CELL) + 3
      offsetX = ((width % CELL) - CELL) / 2
      offsetY = ((height % CELL) - CELL) / 2
    }

    const renderFrame = () => {
      rafId = 0
      if (!inView || !tabVisible || width <= 0 || height <= 0) return

      curX += (targetX - curX) * LERP
      curY += (targetY - curY) * LERP
      curAlpha += (targetAlpha - curAlpha) * 0.1

      ctx.clearRect(0, 0, width, height)

      // Subtle radial glow at cursor center
      if (curAlpha > 0.01) {
        const radial = ctx.createRadialGradient(curX, curY, 0, curX, curY, RADIUS)
        radial.addColorStop(0, `rgba(${palette.glowCyan}, ${0.14 * curAlpha})`)
        radial.addColorStop(0.55, `rgba(${palette.glowViolet}, ${0.06 * curAlpha})`)
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = radial
        ctx.fillRect(0, 0, width, height)
      }

      // Build distorted vertex grid (lens / zoom push outward from cursor)
      const grid: GridPoint[][] = new Array(rows)
      for (let r = 0; r < rows; r++) {
        const rowArr: GridPoint[] = new Array(cols)
        const gy = offsetY + r * CELL
        for (let c = 0; c < cols; c++) {
          const gx = offsetX + c * CELL
          let x = gx
          let y = gy
          let intensity = 0

          if (curAlpha > 0.01) {
            const dx = gx - curX
            const dy = gy - curY
            const dist = Math.hypot(dx, dy)
            if (dist > 0.001 && dist < RADIUS) {
              const norm = 1 - dist / RADIUS
              const push = norm * norm * LENS_STRENGTH * curAlpha
              x += (dx / dist) * push
              y += (dy / dist) * push
              intensity = norm * curAlpha
            }
          }

          rowArr[c] = { x, y, intensity }
        }
        grid[r] = rowArr
      }

      // Draw base grid lines in one batched path
      ctx.beginPath()
      ctx.strokeStyle = palette.baseLine
      ctx.lineWidth = 1

      for (let r = 0; r < rows; r++) {
        const row = grid[r]
        ctx.moveTo(row[0].x, row[0].y)
        for (let c = 1; c < cols; c++) {
          ctx.lineTo(row[c].x, row[c].y)
        }
      }
      for (let c = 0; c < cols; c++) {
        ctx.moveTo(grid[0][c].x, grid[0][c].y)
        for (let r = 1; r < rows; r++) {
          ctx.lineTo(grid[r][c].x, grid[r][c].y)
        }
      }
      ctx.stroke()

      // Highlight glowing segments & vertices near cursor
      if (curAlpha > 0.01) {
        ctx.lineWidth = 1.25
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = grid[r][c]
            if (c + 1 < cols) {
              const right = grid[r][c + 1]
              const seg = Math.max(p.intensity, right.intensity)
              if (seg > 0.02) {
                ctx.beginPath()
                ctx.strokeStyle = `rgba(${palette.glowCyan}, ${seg * 0.55})`
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(right.x, right.y)
                ctx.stroke()
              }
            }
            if (r + 1 < rows) {
              const down = grid[r + 1][c]
              const seg = Math.max(p.intensity, down.intensity)
              if (seg > 0.02) {
                ctx.beginPath()
                ctx.strokeStyle = `rgba(${palette.glowViolet}, ${seg * 0.48})`
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(down.x, down.y)
                ctx.stroke()
              }
            }
            if (p.intensity > 0.04) {
              ctx.beginPath()
              ctx.fillStyle = `rgba(${palette.dot}, ${p.intensity * 0.85})`
              ctx.arc(p.x, p.y, 1.3 + p.intensity * 1.6, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      const settled =
        Math.abs(targetX - curX) < 0.25 &&
        Math.abs(targetY - curY) < 0.25 &&
        Math.abs(targetAlpha - curAlpha) < 0.005

      if (!settled) {
        rafId = window.requestAnimationFrame(renderFrame)
      }
    }

    const scheduleFrame = () => {
      if (!rafId && inView && tabVisible) {
        rafId = window.requestAnimationFrame(renderFrame)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const rx = e.clientX - rect.left
      const ry = e.clientY - rect.top
      const inside = rx >= -40 && rx <= rect.width + 40 && ry >= -40 && ry <= rect.height + 40

      if (inside) {
        if (curAlpha < 0.02) {
          curX = rx
          curY = ry
        }
        targetX = rx
        targetY = ry
        targetAlpha = 1
      } else {
        targetAlpha = 0
      }
      scheduleFrame()
    }

    const onPointerLeave = () => {
      targetAlpha = 0
      scheduleFrame()
    }

    const onVisibilityChange = () => {
      tabVisible = !document.hidden
      if (tabVisible) scheduleFrame()
      else if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    syncSize()
    scheduleFrame()

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibilityChange)

    const resizeObs =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            syncSize()
            scheduleFrame()
          })
        : null
    resizeObs?.observe(wrapper)

    const interObs =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            entries => {
              inView = entries[0]?.isIntersecting ?? true
              if (inView) scheduleFrame()
              else if (rafId) {
                window.cancelAnimationFrame(rafId)
                rafId = 0
              }
            },
            { threshold: 0 },
          )
        : null
    interObs?.observe(wrapper)

    const themeObs = new MutationObserver(() => {
      palette = readPalette()
      scheduleFrame()
    })
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      resizeObs?.disconnect()
      interObs?.disconnect()
      themeObs.disconnect()
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 12%, black 80%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 12%, black 80%, transparent 100%)',
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
