'use client'
import { useEffect, useRef } from 'react'
// @ts-ignore
import { Curtains, Plane } from 'curtainsjs'

export default function BackgroundWater() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, velocity: 0 })

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return

    const curtains = new Curtains({ 
      container: containerRef.current,
      pixelRatio: Math.min(1.5, window.devicePixelRatio) 
    })

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.lastX = mouse.current.x
      mouse.current.lastY = mouse.current.y
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = 1 - (e.clientY / window.innerHeight) * 2
      
      const dx = mouse.current.x - mouse.current.lastX
      const dy = mouse.current.y - mouse.current.lastY
      mouse.current.velocity = Math.min(Math.sqrt(dx*dx + dy*dy) * 50, 2.0)
    }
    window.addEventListener('mousemove', handleMouseMove)

    const vs = `
      precision mediump float;
      attribute vec3 aVertexPosition;
      attribute vec2 aTextureCoord;
      uniform mat4 uMVMatrix;
      uniform mat4 uPMatrix;
      varying vec2 vTextureCoord;
      void main() {
        vTextureCoord = aTextureCoord;
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
      }
    `;

    const fs = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uVelocity;

      void main() {
        vec2 st = vTextureCoord;
        
        // 1. DIM GLOBAL SLOW-MO SWELLS
        // Reduced frequency and amplitude for a very dark, calm look
        float slowWave = sin(st.x * 1.5 + uTime * 0.004) * cos(st.y * 1.5 + uTime * 0.002);
        float totalGlobalWave = slowWave * 0.02; // Significantly reduced brightness

        // 2. SOFT MOUSE LIGHT (The "Saddle" Light)
        vec2 mouseDir = st - (uMouse * 0.5 + 0.5);
        float mouseDist = length(mouseDir);
        
        // Soft ripple instead of sharp waves
        float mouseStrength = uVelocity * 0.15;
        float mouseRipple = sin(mouseDist * 15.0 - uTime * 0.03) * exp(-mouseDist * 6.0) * mouseStrength;
        
        float finalDistortion = totalGlobalWave + mouseRipple;
        
        // 3. COLOR PALETTE (Deep, Dark Teal)
        vec3 midnightBlue = vec3(0.005, 0.015, 0.02); // Much darker base
        
        // 4. SUBTLE LIGHTING (Toned Down)
        // Soft Glow: Replaces the sharp specular highlight
        float softGlow = pow(max(0.0, finalDistortion * 8.0), 1.8);
        vec3 glowColor = vec3(0.05, 0.15, 0.2) * softGlow; 
        
        // Very dim glimmer for the texture
        float glimmer = pow(max(0.0, finalDistortion * 10.0), 4.0);
        vec3 glimmerColor = vec3(0.2, 0.3, 0.35) * glimmer;
        
        gl_FragColor = vec4(midnightBlue + glowColor + glimmerColor, 1.0);
      }
    `;

    const plane = new Plane(curtains, containerRef.current, {
      vertexShader: vs,
      fragmentShader: fs,
      uniforms: {
        uTime: { name: "uTime", type: "1f", value: 0 },
        uMouse: { name: "uMouse", type: "2f", value: [0, 0] },
        uVelocity: { name: "uVelocity", type: "1f", value: 0 },
      },
    })

    plane.onRender(() => {
      plane.uniforms.uTime.value++;
      plane.uniforms.uMouse.value = [
        plane.uniforms.uMouse.value[0] + (mouse.current.x - plane.uniforms.uMouse.value[0]) * 0.05,
        plane.uniforms.uMouse.value[1] + (mouse.current.y - plane.uniforms.uMouse.value[1]) * 0.05
      ];
      plane.uniforms.uVelocity.value += (mouse.current.velocity - plane.uniforms.uVelocity.value) * 0.03;
      mouse.current.velocity *= 0.98; 
    })

    return () => {
      curtains.dispose()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none bg-[#00080a]" 
      style={{ zIndex: -1 }} 
    />
  )
}