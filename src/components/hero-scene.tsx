"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

// Scene 3D ringan: ikosahedron kawat + oktahedron + partikel, bereaksi pada kursor.
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 6;

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, 1),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.75 })
    );
    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true })
    );

    const N = 700;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 2.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xc4b5fd, size: 0.035, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(pGeo, pMat);
    group.add(core, inner, points);

    const resize = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientY / window.innerHeight - 0.5) * 0.6;
      target.y = (e.clientX / window.innerWidth - 0.5) * 0.9;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const clock = new THREE.Clock();
    const frame = () => {
      const t = clock.getElapsedTime();
      core.rotation.y = t * 0.25; core.rotation.x = t * 0.12;
      inner.rotation.y = -t * 0.5; inner.rotation.z = t * 0.3;
      points.rotation.y = t * 0.04;
      group.rotation.x += (target.x - group.rotation.x) * 0.05;
      group.rotation.y += (target.y - group.rotation.y) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    if (reduce) renderer.render(scene, camera); else frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      [core, inner].forEach((m) => { m.geometry.dispose(); (m.material as THREE.Material).dispose(); });
      pGeo.dispose(); pMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="h-full w-full" aria-hidden />;
}
