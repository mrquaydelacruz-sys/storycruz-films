'use client'
import { useEffect, useRef } from 'react'
import { Curtains, Plane } from 'curtainsjs'

interface WaterImageProps {
  src: string;
  alt: string;
}

export default function WaterImage({ src, alt }: WaterImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 1. Initialize Curtains
    const curtains = new Curtains({ container: containerRef.current })

    // 2. The Shader (This is the "Magic" math for water)
    const vs = `
      precision mediump float;
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      varying vec3 vTextCoord;
      void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextCoord = vec3(aTextureCoord, 1.0);
      }
    `

    const fs = `
      precision mediump float;
      varying vec3 vTextCoord;
      uniform sampler2D uSampler0;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uHover;

      void main() {
        vec2 textureCoord = vTextCoord.xy;
        
        // Liquid Distortion Logic
        float distortion = sin(textureCoord.y * 10.0 + uTime * 0.05) * (uHover * 0.01);
        textureCoord.x += distortion;
        
        gl_FragColor = texture2D(uSampler0, textureCoord);
      }
    `

    const params = {
      vertexShader: vs,
      fragmentShader: fs,
      uniforms: {
        uTime: { name: "uTime", type: "1f", value: 0 },
        uHover: { name: "uHover", type: "1f", value: 0 },
      },
    }

    // 3. Create the Plane
    const planeElement = containerRef.current.querySelector('.plane') as HTMLElement
    const plane = new Plane(curtains, planeElement, params)

    plane.onRender(() => {
      plane.uniforms.uTime.value++
    }).onMouseEnter(() => {
      // Smoothly ramp up the "liquid" effect
      plane.uniforms.uHover.value = 0.5
    }).onMouseLeave(() => {
      // Smoothly stop the effect
      plane.uniforms.uHover.value = 0
    })

    return () => curtains.dispose()
  }, [src])

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-sm">
      <div className="plane w-full h-full">
        <img src={src} alt={alt} data-sampler="uSampler0" className="hidden" />
      </div>
    </div>
  )
}