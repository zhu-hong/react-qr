import { useMemo, type FC, memo, useRef, useEffect } from 'react'
import qrcodegen from './qrcodegen'

const genSvgQrPath = (modules: boolean[][], thinkness: number = 0): string => {
  const ops: string[] = []
  modules.forEach((row, y) => {
    let start: number | null = null
    row.forEach((cell, x) => {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + thinkness} ${y + thinkness}h${x - start}v1H${start + thinkness}z`
        )
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + thinkness},${y + thinkness} h1v1H${x + thinkness}z`)
        } else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + thinkness},${y + thinkness} h${x + 1 - start}v1H${start + thinkness
            }z`
          )
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

type QrProps = {
  svg?: boolean
  content?: string
  ecl?: qrcodegen.QrCode.Ecc
  size?: number
  thickness?: boolean
  bgColor?: string,
  fgColor?: string,
}

const SvgRender: FC<Omit<QrProps, 'svg'| 'content' | 'ecl'> & { modules: boolean[][] }> = memo((props) => {
  const {
    size = 250,
    thickness = true,
    bgColor = '#ffffff',
    fgColor = '#000000',
    modules,
  } = props

  const viewBoxSize = useMemo(() => {
    return modules.length + (thickness ? 2 : 0)
  }, [modules, thickness])

  const svgPath = useMemo(() => {
    return genSvgQrPath(modules, thickness ? 1 : 0)
  }, [modules, thickness])

  return <svg xmlns='http://www.w3.org/2000/svg' width={size} hanging={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} shapeRendering='crispEdges'>
    <path fill={bgColor} d={`M0,0 h${viewBoxSize}v${viewBoxSize}H0z`}></path>
    <path fill={fgColor} d={svgPath}></path>
  </svg>
})

const CanvasRender: FC<Omit<QrProps, 'svg'| 'content' | 'ecl'> & { modules: boolean[][] }> = memo((props) => {
  const {
    size = 250,
    thickness = true,
    bgColor = '#ffffff',
    fgColor = '#000000',
    modules,
  } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')

    if(ctx === undefined || ctx === null) return

    ctx.clearRect(0, 0, size, size)

    ctx.fillStyle = bgColor
    ctx.fillRect(0 , 0, size, size)

    const thicknessSize = thickness ? size / (modules.length + 2) : 0
    const cellSize = size / (modules.length + (thickness ? 2 : 0))
    ctx.fillStyle = fgColor
    modules.forEach((row, y) => {
      row.forEach((cell, x) => {
        if(x === 0 && y === 0) {
          ctx.beginPath()
        }
        if(cell) {
          ctx.moveTo(x * cellSize + thicknessSize, y * cellSize + thicknessSize)
          ctx.lineTo((x + 1) * cellSize + thicknessSize, y * cellSize + thicknessSize)
          ctx.lineTo((x + 1) * cellSize + thicknessSize, (y + 1) * cellSize + thicknessSize)
          ctx.lineTo(x * cellSize + thicknessSize, (y + 1) * cellSize + thicknessSize)
          ctx.fill()
        }
        if(x === modules.length - 1 && y === modules.length - 1) {
          ctx.closePath()
        }
      })
    })
  }, [modules, thickness, size, fgColor, bgColor])

  return <canvas width={size} height={size} ref={canvasRef}></canvas>
})

export const Qr: FC<QrProps> = memo((props) => {
  const {
    svg = true,
    content = '没有没有没有',
    ecl = qrcodegen.QrCode.Ecc.HIGH,
    ...rest
  } = props

  const modules = useMemo(() => {
    return qrcodegen.QrCode.encodeText(content, ecl).getModules()
  }, [content, ecl])

  return svg ? <SvgRender {...rest} modules={modules} /> : <CanvasRender {...rest} modules={modules} />
})

export const ecl = qrcodegen.QrCode.Ecc
