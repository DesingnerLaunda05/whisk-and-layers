import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Sun, Moon, Sparkles, RefreshCw } from 'lucide-react';

export interface Cake3DProps {
  tiers: number; // 1, 2, 3, 4
  shape: 'ROUND' | 'SQUARE' | 'HEART' | 'HEXAGON';
  frostingColor: string; // Hex color string (e.g. "#FAF5EF", "#F7D6D9")
  accentColor: string; // Hex color string for piping / drip
  toppings: string[]; // e.g. ['macarons', 'berries', 'gold_leaf', 'candle', 'flowers']
  inscription?: string;
  height?: number | string;
  autoRotateDefault?: boolean;
}

export const Cake3DViewer: React.FC<Cake3DProps> = ({
  tiers = 2,
  shape = 'ROUND',
  frostingColor = '#FAF5EF',
  accentColor = '#D4AF37',
  toppings = ['macarons', 'berries'],
  inscription = '',
  height = 420,
  autoRotateDefault = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(autoRotateDefault);
  const [lightingMode, setLightingMode] = useState<'STUDIO' | 'CANDLE' | 'SUNSET'>('STUDIO');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const canvasHeight = typeof height === 'number' ? height : 420;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false });
    } catch (err) {
      console.warn('WebGL is not supported or failed to initialize:', err);
      setWebGlSupported(false);
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfcfbf9);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 1000);
    camera.position.set(0, 3.8, 8.5);
    camera.lookAt(0, 1.4, 0);
    cameraRef.current = camera;

    // 3. Renderer configuration
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.DirectionalLight(0xebe2d5, 0.6);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    // 5. Cake Stand / Pedestal Base
    const standGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(2.8, 2.7, 0.18, 48);
    const goldPlateMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.65,
      roughness: 0.25,
    });
    const plateMesh = new THREE.Mesh(plateGeo, goldPlateMat);
    plateMesh.position.y = -0.09;
    plateMesh.receiveShadow = true;
    plateMesh.castShadow = true;
    standGroup.add(plateMesh);

    const stemGeo = new THREE.CylinderGeometry(0.55, 0.8, 0.7, 32);
    const stemMesh = new THREE.Mesh(stemGeo, goldPlateMat);
    stemMesh.position.y = -0.53;
    stemMesh.receiveShadow = true;
    stemMesh.castShadow = true;
    standGroup.add(stemMesh);

    const footGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.15, 40);
    const footMesh = new THREE.Mesh(footGeo, goldPlateMat);
    footMesh.position.y = -0.95;
    footMesh.receiveShadow = true;
    standGroup.add(footMesh);

    scene.add(standGroup);

    // 6. Root Cake Group for rotating tiers
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;

    // 7. Mouse Orbit Interaction
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cakeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cakeGroupRef.current.rotation.y += deltaX * 0.01;
      // Slight pitch tilt constraint
      const nextRotX = cakeGroupRef.current.rotation.x + deltaY * 0.005;
      if (nextRotX > -0.3 && nextRotX < 0.4) {
        cakeGroupRef.current.rotation.x = nextRotX;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !cakeGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      cakeGroupRef.current.rotation.y += deltaX * 0.01;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newH = container.clientHeight || (typeof height === 'number' ? height : 420);
      cameraRef.current.aspect = newWidth / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newH);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Render loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && !isDraggingRef.current && cakeGroupRef.current) {
        cakeGroupRef.current.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update lighting mode
  useEffect(() => {
    if (!ambientLightRef.current || !dirLightRef.current || !sceneRef.current) return;
    if (lightingMode === 'STUDIO') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 0.85;
      dirLightRef.current.color.setHex(0xfffaed);
      dirLightRef.current.intensity = 1.2;
      sceneRef.current.background = new THREE.Color(0xfcfbf9);
    } else if (lightingMode === 'CANDLE') {
      ambientLightRef.current.color.setHex(0xffb787);
      ambientLightRef.current.intensity = 0.55;
      dirLightRef.current.color.setHex(0xffa153);
      dirLightRef.current.intensity = 1.4;
      sceneRef.current.background = new THREE.Color(0x23140e);
    } else if (lightingMode === 'SUNSET') {
      ambientLightRef.current.color.setHex(0xffc5b2);
      ambientLightRef.current.intensity = 0.7;
      dirLightRef.current.color.setHex(0xff7a59);
      dirLightRef.current.intensity = 1.3;
      sceneRef.current.background = new THREE.Color(0xf6ede4);
    }
  }, [lightingMode]);

  // Rebuild 3D Cake Mesh whenever props change
  useEffect(() => {
    if (!cakeGroupRef.current || !webGlSupported) return;
    try {
      const group = cakeGroupRef.current;

    // Clear old cake meshes
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if ((child as any).geometry) (child as any).geometry.dispose();
      if ((child as any).material) {
        if (Array.isArray((child as any).material)) {
          (child as any).material.forEach((m: any) => m.dispose());
        } else {
          (child as any).material.dispose();
        }
      }
    }

    // Material setup
    const frostColor = new THREE.Color(frostingColor);
    const accentCol = new THREE.Color(accentColor);

    const frostingMat = new THREE.MeshStandardMaterial({
      color: frostColor,
      roughness: 0.45,
      metalness: 0.05,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentCol,
      roughness: 0.35,
      metalness: 0.25,
    });

    const goldFlakeMat = new THREE.MeshStandardMaterial({
      color: 0xe6b800,
      metalness: 0.9,
      roughness: 0.15,
    });

    // Tier dimensional configurations [radius/halfWidth, height]
    const tierConfigs = [
      { size: 2.15, height: 1.15 },
      { size: 1.6, height: 1.05 },
      { size: 1.15, height: 0.95 },
      { size: 0.75, height: 0.85 },
    ];

    const actualTiers = Math.min(Math.max(tiers, 1), 4);
    let currentY = 0;

    // Helper: Build shape geometry
    const createTierGeometry = (radius: number, tierHeight: number) => {
      if (shape === 'SQUARE') {
        return new THREE.BoxGeometry(radius * 1.8, tierHeight, radius * 1.8, 16, 8, 16);
      }
      if (shape === 'HEXAGON') {
        return new THREE.CylinderGeometry(radius, radius, tierHeight, 6);
      }
      if (shape === 'HEART') {
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        const s = radius * 0.45;
        heartShape.moveTo(x + 2.5 * s, y + 2.5 * s);
        heartShape.bezierCurveTo(x + 2.5 * s, y + 2.5 * s, x + 2.0 * s, y, x, y);
        heartShape.bezierCurveTo(x - 3.0 * s, y, x - 3.0 * s, y + 3.5 * s, x - 3.0 * s, y + 3.5 * s);
        heartShape.bezierCurveTo(x - 3.0 * s, y + 5.5 * s, x - 1.0 * s, y + 7.7 * s, x + 2.5 * s, y + 9.5 * s);
        heartShape.bezierCurveTo(x + 6.0 * s, y + 7.7 * s, x + 8.0 * s, y + 5.5 * s, x + 8.0 * s, y + 3.5 * s);
        heartShape.bezierCurveTo(x + 8.0 * s, y + 3.5 * s, x + 8.0 * s, y, x + 5.0 * s, y);
        heartShape.bezierCurveTo(x + 3.5 * s, y, x + 2.5 * s, y + 2.5 * s, x + 2.5 * s, y + 2.5 * s);

        const extrudeSettings = { depth: tierHeight, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
        const geo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        geo.center();
        geo.rotateX(-Math.PI / 2);
        return geo;
      }
      // Default: ROUND
      return new THREE.CylinderGeometry(radius, radius, tierHeight, 48);
    };

    // Render each tier
    for (let i = 0; i < actualTiers; i++) {
      const { size, height: tH } = tierConfigs[i];
      const tierCenterY = currentY + tH / 2;

      // Tier main mesh
      const tierGeo = createTierGeometry(size, tH);
      const tierMesh = new THREE.Mesh(tierGeo, frostingMat);
      tierMesh.position.y = tierCenterY;
      tierMesh.castShadow = true;
      tierMesh.receiveShadow = true;
      group.add(tierMesh);

      // Decorative bottom piping border ring for each tier
      const borderR = size * 1.02;
      const borderGeo = new THREE.TorusGeometry(borderR, 0.055, 12, 48);
      borderGeo.rotateX(Math.PI / 2);
      const borderMesh = new THREE.Mesh(borderGeo, accentMat);
      borderMesh.position.y = currentY + 0.04;
      borderMesh.castShadow = true;
      group.add(borderMesh);

      // Top decorative ruffled piping ring
      const topBorderGeo = new THREE.TorusGeometry(borderR * 0.98, 0.045, 12, 48);
      topBorderGeo.rotateX(Math.PI / 2);
      const topBorderMesh = new THREE.Mesh(topBorderGeo, accentMat);
      topBorderMesh.position.y = currentY + tH - 0.02;
      group.add(topBorderMesh);

      // Golden flake flecks on tier side
      if (toppings.includes('gold_leaf')) {
        for (let g = 0; g < 6; g++) {
          const flakeGeo = new THREE.DodecahedronGeometry(0.04, 0);
          const flakeMesh = new THREE.Mesh(flakeGeo, goldFlakeMat);
          const angle = (g / 6) * Math.PI * 2 + (i * 0.8);
          flakeMesh.position.set(
            Math.cos(angle) * (size + 0.02),
            tierCenterY + (Math.sin(g) * 0.25),
            Math.sin(angle) * (size + 0.02)
          );
          group.add(flakeMesh);
        }
      }

      currentY += tH;
    }

    // Top Crown Garnishes
    const topTierSize = tierConfigs[actualTiers - 1].size;
    const topY = currentY;

    // A. Macarons
    if (toppings.includes('macarons')) {
      const macaronColors = [0xf7c5cc, 0xd0e8d0, 0xfce1a4, 0xd8c8f0];
      const count = 4;
      for (let m = 0; m < count; m++) {
        const mAngle = (m / count) * Math.PI * 2 + 0.4;
        const mR = topTierSize * 0.55;
        const macaronGroup = new THREE.Group();
        const mColor = macaronColors[m % macaronColors.length];
        const mMat = new THREE.MeshStandardMaterial({ color: mColor, roughness: 0.4 });

        // Two shells + filling
        const shellGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.07, 24);
        const shell1 = new THREE.Mesh(shellGeo, mMat);
        const shell2 = new THREE.Mesh(shellGeo, mMat);
        shell2.position.y = 0.11;
        const fillGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 20);
        const fillMesh = new THREE.Mesh(fillGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        fillMesh.position.y = 0.055;

        macaronGroup.add(shell1);
        macaronGroup.add(shell2);
        macaronGroup.add(fillMesh);

        macaronGroup.rotation.z = 0.35 * (m % 2 === 0 ? 1 : -1);
        macaronGroup.position.set(Math.cos(mAngle) * mR, topY + 0.08, Math.sin(mAngle) * mR);
        macaronGroup.castShadow = true;
        group.add(macaronGroup);
      }
    }

    // B. Fresh Berries
    if (toppings.includes('berries')) {
      const berryMat = new THREE.MeshStandardMaterial({ color: 0xa8142a, roughness: 0.25 });
      const blueBerryMat = new THREE.MeshStandardMaterial({ color: 0x222a45, roughness: 0.3 });
      const berryCount = 5;
      for (let b = 0; b < berryCount; b++) {
        const bAngle = (b / berryCount) * Math.PI * 2 + 1.2;
        const bR = topTierSize * 0.45;
        const isStrawBerry = b % 2 === 0;
        const berryGeo = isStrawBerry
          ? new THREE.ConeGeometry(0.14, 0.24, 16)
          : new THREE.SphereGeometry(0.1, 14, 14);
        const berryMesh = new THREE.Mesh(berryGeo, isStrawBerry ? berryMat : blueBerryMat);
        if (isStrawBerry) {
          berryMesh.rotation.x = Math.PI;
          berryMesh.position.set(Math.cos(bAngle) * bR, topY + 0.14, Math.sin(bAngle) * bR);
        } else {
          berryMesh.position.set(Math.cos(bAngle) * bR, topY + 0.1, Math.sin(bAngle) * bR);
        }
        berryMesh.castShadow = true;
        group.add(berryMesh);
      }
    }

    // C. Celebration Candle
    if (toppings.includes('candle')) {
      const candleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 18);
      const candleMat = new THREE.MeshStandardMaterial({ color: 0xfff6dc, roughness: 0.3 });
      const candleMesh = new THREE.Mesh(candleGeo, candleMat);
      candleMesh.position.set(0, topY + 0.35, 0);
      group.add(candleMesh);

      // Flame
      const flameGeo = new THREE.ConeGeometry(0.05, 0.16, 12);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa012 });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(0, topY + 0.78, 0);
      group.add(flameMesh);

      // Pointlight for flame
      const flameLight = new THREE.PointLight(0xffa500, 0.8, 2.5);
      flameLight.position.set(0, topY + 0.8, 0);
      group.add(flameLight);
    }

    // D. Botanical Petals / Flowers
    if (toppings.includes('flowers')) {
      const petalMat = new THREE.MeshStandardMaterial({ color: 0xf9bbd0, roughness: 0.5 });
      for (let p = 0; p < 8; p++) {
        const petalGeo = new THREE.SphereGeometry(0.08, 8, 8);
        petalGeo.scale(1.2, 0.2, 1.0);
        const petalMesh = new THREE.Mesh(petalGeo, petalMat);
        const pAngle = (p / 8) * Math.PI * 2;
        petalMesh.position.set(Math.cos(pAngle) * (topTierSize * 0.75), topY + 0.02, Math.sin(pAngle) * (topTierSize * 0.75));
        petalMesh.rotation.y = pAngle;
        group.add(petalMesh);
      }
    }

    // E. Plaque / Inscription Board at cake base
    if (inscription && inscription.trim().length > 0) {
      const plaqueGeo = new THREE.BoxGeometry(2.2, 0.06, 0.65);
      const plaqueMat = new THREE.MeshStandardMaterial({ color: 0xfffaea, roughness: 0.3 });
      const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaqueMesh.position.set(0, 0.04, 2.2);
      plaqueMesh.rotation.x = -0.35;
      group.add(plaqueMesh);
    }
    } catch (meshErr) {
      console.warn('Error constructing 3D cake meshes:', meshErr);
    }
  }, [tiers, shape, frostingColor, accentColor, toppings, inscription, webGlSupported]);

  // Camera Zoom helpers
  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(0.88);
  };

  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(1.12);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !cakeGroupRef.current) return;
    cameraRef.current.position.set(0, 3.8, 8.5);
    cameraRef.current.lookAt(0, 1.4, 0);
    cakeGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : typeof height === 'number' ? `${height}px` : height,
        borderRadius: isFullscreen ? '0px' : '18px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid var(--border-medium)',
        backgroundColor: lightingMode === 'CANDLE' ? '#1c100a' : '#FAF8F5',
        boxShadow: isFullscreen ? 'none' : 'var(--shadow-md)',
        transition: 'height 0.3s ease, border-radius 0.3s ease',
        zIndex: isFullscreen ? 9999 : 1,
        ...(isFullscreen
          ? {
              position: 'fixed' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }
          : {}),
      }}
    >
      {/* 3D Canvas Mount or 2D Fallback */}
      {webGlSupported ? (
        <div
          ref={mountRef}
          style={{
            width: '100%',
            height: '100%',
            cursor: 'grab',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative',
          }}
        >
          {/* 2D Stacked Tier Representation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', position: 'relative' }}>
            {/* Candle */}
            {toppings.includes('candle') && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '-2px' }}>
                <span style={{ fontSize: '1.2rem' }}>🔥</span>
                <div style={{ width: '6px', height: '18px', backgroundColor: '#FFF5DC', borderRadius: '2px', border: '1px solid #D4AF37' }} />
              </div>
            )}

            {/* Top Garnishes badges */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
              {toppings.includes('macarons') && <span>🍪</span>}
              {toppings.includes('berries') && <span>🍓</span>}
              {toppings.includes('gold_leaf') && <span>✨</span>}
              {toppings.includes('flowers') && <span>🌸</span>}
            </div>

            {/* Tiers descending */}
            {Array.from({ length: Math.min(Math.max(tiers, 1), 4) }).reverse().map((_, idx, arr) => {
              const tierNum = arr.length - idx;
              const widths = [130, 180, 230, 280];
              const w = widths[tierNum - 1] || 160;
              const radius = shape === 'ROUND' ? '20px' : shape === 'HEART' ? '28px 28px 10px 10px' : '6px';
              return (
                <div
                  key={tierNum}
                  style={{
                    width: `${w}px`,
                    height: '52px',
                    backgroundColor: frostingColor,
                    border: `3px solid ${accentColor}`,
                    borderRadius: radius,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#333' }}>
                    Tier {tierNum} ({shape.toLowerCase()})
                  </span>
                </div>
              );
            })}

            {/* Stand Base */}
            <div
              style={{
                width: '300px',
                height: '14px',
                backgroundColor: '#D4AF37',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                marginTop: '2px',
              }}
            />
          </div>
        </div>
      )}

      {/* Floating 3D Badge Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          padding: '0.35rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          pointerEvents: 'none',
        }}
      >
        <Sparkles size={14} color="var(--primary)" />
        <span>3D Bespoke Cake Preview (Drag 360° to Rotate)</span>
      </div>

      {/* Inscription preview badge on canvas */}
      {inscription && inscription.trim().length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            maxWidth: '300px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            padding: '0.4rem 0.8rem',
            borderRadius: '10px',
            border: '1px solid #E6D2BD',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            fontWeight: 700,
            fontFamily: 'serif',
            fontStyle: 'italic',
            pointerEvents: 'none',
          }}
        >
          "{inscription}"
        </div>
      )}

      {/* Floating Toolbar Controls */}
      <div
        style={{
          position: 'absolute',
          top: '14px',
          right: '16px',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 10,
        }}
      >
        {/* Auto-rotate toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pause 360° Rotation' : 'Resume 360° Rotation'}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: autoRotate ? 'var(--primary)' : 'rgba(255, 255, 255, 0.9)',
            color: autoRotate ? '#FFF' : 'var(--text-main)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <RotateCw size={14} className={autoRotate ? 'spin-icon' : ''} />
        </button>

        {/* Lighting Ambiance cycle */}
        <button
          type="button"
          onClick={() => {
            if (lightingMode === 'STUDIO') setLightingMode('CANDLE');
            else if (lightingMode === 'CANDLE') setLightingMode('SUNSET');
            else setLightingMode('STUDIO');
          }}
          title={`Lighting: ${lightingMode}`}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: lightingMode === 'CANDLE' ? '#ff9800' : 'var(--text-main)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          {lightingMode === 'STUDIO' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <ZoomIn size={14} />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <ZoomOut size={14} />
        </button>

        {/* Reset Camera */}
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset View"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <RefreshCw size={14} />
        </button>

        {/* Fullscreen Expand */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Viewer'}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: isFullscreen ? '#222' : 'rgba(255, 255, 255, 0.9)',
            color: isFullscreen ? '#FFF' : 'var(--text-main)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  );
};

export default Cake3DViewer;
