'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SnowfallCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const geometry = new THREE.BufferGeometry();
    const count = 550;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 6 - 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      speeds[i] = 0.003 + Math.random() * 0.01;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      color: new THREE.Color('#b6f6ff'),
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animationFrame = 0;
    const onResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i += 1) {
        positions[i * 3 + 1] -= speeds[i];
        if (positions[i * 3 + 1] < -3) positions[i * 3 + 1] = 3;
      }
      positionsAttr.needsUpdate = true;
      points.rotation.y += 0.0008;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };

    mountRef.current.appendChild(renderer.domElement);
    animate();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
