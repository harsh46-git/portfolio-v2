// components/ProjectCard.tsx
"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";

interface ProjectCardProps {
  image: string;       // path to project screenshot
  className?: string;
}

/**
 * WebGL displacement hover effect on project card image.
 * Uses OGL (lightweight WebGL lib, ~12kb) with a custom GLSL shader.
 *
 * On hover: fluid ripple distortion reveals the image
 * On leave: reverses back to flat
 *
 * Usage:
 *   <ProjectCard image="/projects/monexi.png" className="..." />
 */
export default function ProjectCard({ image, className = "" }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const container = containerRef.current;
    if (!container) return;

    // ── Setup renderer ──────────────────────────────────────
    const renderer = new Renderer({
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    resize();
    container.appendChild(gl.canvas);

    gl.canvas.style.position = "absolute";
    gl.canvas.style.inset = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.pointerEvents = "none";

    // ── Textures ────────────────────────────────────────────
    const texture1 = new Texture(gl);
    const disp    = new Texture(gl, { wrapS: gl.REPEAT, wrapT: gl.REPEAT });

    const loadImg = (src: string, tex: Texture) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        tex.image = img;
        tex.needsUpdate = true;
      };
    };

    loadImg(image, texture1);
    loadImg("/displacement.png", disp);

    // ── Shader ──────────────────────────────────────────────
    const vertex = /* glsl */`
      attribute vec2 uv;
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    const fragment = /* glsl */`
      precision highp float;
      uniform float uTime;
      uniform float uProgress;   /* 0 = flat, 1 = fully distorted */
      uniform vec2  uMouse;      /* normalised mouse pos 0-1 */
      uniform sampler2D tImage;
      uniform sampler2D tDisp;
      varying vec2 vUv;

      void main() {
        /* Sample displacement map */
        vec4 dispSample = texture2D(tDisp, vUv + uTime * 0.04);
        vec2 dispVec    = vec2(dispSample.r, dispSample.g);

        /* Direction from pixel to mouse — spreads from cursor */
        vec2 toMouse  = vUv - uMouse;
        float dist    = length(toMouse);
        float ripple  = smoothstep(0.6, 0.0, dist); /* ripple radius */

        /* Distort UVs */
        float strength = uProgress * 0.08 * ripple;
        vec2 distortedUv = vUv + dispVec * strength;

        vec4 col = texture2D(tImage, distortedUv);

        /* Subtle darkening at rest, brightens on hover */
        float brightness = 0.75 + uProgress * 0.25;
        gl_FragColor = vec4(col.rgb * brightness, col.a);
      }
    `;

    const geometry = new Triangle(gl);
    const program  = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime:     { value: 0 },
        uProgress: { value: 0 },
        uMouse:    { value: [0.5, 0.5] },
        tImage:    { value: texture1 },
        tDisp:     { value: disp },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // ── Animation state ─────────────────────────────────────
    let progress = 0;
    let targetProgress = 0;
    let mouse = { x: 0.5, y: 0.5 };
    let rafId = 0;
    let time = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      time += 0.016;

      // Ease progress toward target
      progress += (targetProgress - progress) * 0.06;

      program.uniforms.uProgress.value = progress;
      program.uniforms.uTime.value     = time;
      program.uniforms.uMouse.value    = [mouse.x, 1 - mouse.y]; // flip Y

      renderer.render({ scene: mesh });
    };
    render();

    // ── Mouse events ─────────────────────────────────────────
    const onEnter = () => { targetProgress = 1; };
    const onLeave = () => { targetProgress = 0; };
    const onMove  = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top)  / rect.height;
    };

    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);
    container.addEventListener("mousemove",  onMove);

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("mousemove",  onMove);
      ro.disconnect();
      container.removeChild(gl.canvas);
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [image]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Base image — always visible, WebGL canvas sits on top */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          opacity: 0,
        }}
      />
    </div>
  );
}