'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Moon,
  Layers,
} from 'lucide-react';

interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  pos: [number, number, number];
  description: string;
}

const hotspots: Hotspot[] = [
  {
    id: 'hp-1',
    title: '18m Cantilevered Sky Pool',
    subtitle: 'Structural acrylic floor overlooking Gulf waters',
    pos: [3.2, 2.2, 0],
    description: 'Direct infinity edge with underwater acoustic sound system and integrated thermal heating.',
  },
  {
    id: 'hp-2',
    title: 'Bulthaup Master Show Kitchen',
    subtitle: 'Calacatta Paonazzo marble slab monolithic island',
    pos: [-1.5, 0.6, 1.8],
    description: 'Gaggenau 400 series appliances integrated into dark fumed oak cabinetry with hidden back catering pantry.',
  },
  {
    id: 'hp-3',
    title: 'Private Biometric Elevator Core',
    subtitle: 'Direct high-speed link from subterranean garage',
    pos: [0, 1.5, -1.8],
    description: 'Encrypted keycard and iris recognition for private floor ingress.',
  },
  {
    id: 'hp-4',
    title: 'Subterranean 8-Car Hydraulic Gallery',
    subtitle: 'Climate and humidity stabilized supercar vault',
    pos: [0, -1.2, 0],
    description: 'Museum-grade directional spotlighting with exhaust extraction and private vehicle turntable.',
  },
];

export const ArchitecturalViewer3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLevel, setActiveLevel] = useState<'all' | 'upper' | 'ground' | 'lower'>('all');
  const [lightingPreset, setLightingPreset] = useState<'golden' | 'daylight' | 'night'>('golden');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(hotspots[0]);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const upperFloorGroup = useRef<THREE.Group | null>(null);
  const groundFloorGroup = useRef<THREE.Group | null>(null);
  const lowerFloorGroup = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 8, 14);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(0xffecd2, 0x141822, 1.2);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xf2cf9b, 2.4);
    dirLight.position.set(15, 20, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    const fillLight = new THREE.PointLight(0xc4a476, 1.5, 30);
    fillLight.position.set(-10, 8, -10);
    scene.add(fillLight);

    // 5. Build Architectural Model Elements
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Materials
    const travertineMat = new THREE.MeshStandardMaterial({
      color: 0xe0d6c3,
      roughness: 0.65,
      metalness: 0.05,
    });
    const darkMarbleMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      roughness: 0.3,
      metalness: 0.2,
    });
    const bronzeFrameMat = new THREE.MeshStandardMaterial({
      color: 0xb08f63,
      roughness: 0.35,
      metalness: 0.8,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd6e5f3,
      transparent: true,
      opacity: 0.38,
      roughness: 0.05,
      transmission: 0.9,
      ior: 1.5,
    });
    const poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x14778e,
      roughness: 0.1,
      metalness: 0.4,
    });
    const woodDeckMat = new THREE.MeshStandardMaterial({
      color: 0x7a5b3a,
      roughness: 0.7,
      metalness: 0.02,
    });

    // Lower Floor / Subterranean Level
    const lowerGroup = new THREE.Group();
    lowerFloorGroup.current = lowerGroup;
    rootGroup.add(lowerGroup);

    const baseGeo = new THREE.BoxGeometry(16, 0.8, 14);
    const baseMesh = new THREE.Mesh(baseGeo, travertineMat);
    baseMesh.position.y = -0.4;
    baseMesh.receiveShadow = true;
    lowerGroup.add(baseMesh);

    const subGeo = new THREE.BoxGeometry(12, 1.6, 10);
    const subMesh = new THREE.Mesh(subGeo, darkMarbleMat);
    subMesh.position.y = -1.2;
    lowerGroup.add(subMesh);

    // Ground Floor Living Pavilion
    const groundGroup = new THREE.Group();
    groundFloorGroup.current = groundGroup;
    rootGroup.add(groundGroup);

    const groundSlabGeo = new THREE.BoxGeometry(14, 0.3, 12);
    const groundSlab = new THREE.Mesh(groundSlabGeo, travertineMat);
    groundSlab.position.y = 0.15;
    groundSlab.receiveShadow = true;
    groundGroup.add(groundSlab);

    const poolGeo = new THREE.BoxGeometry(6, 0.2, 4);
    const poolMesh = new THREE.Mesh(poolGeo, poolWaterMat);
    poolMesh.position.set(4.5, 0.2, 2.5);
    groundGroup.add(poolMesh);

    const deckGeo = new THREE.BoxGeometry(7, 0.25, 5);
    const deckMesh = new THREE.Mesh(deckGeo, woodDeckMat);
    deckMesh.position.set(4.5, 0.1, 2.5);
    groundGroup.add(deckMesh);

    const livingGlassGeo = new THREE.BoxGeometry(8, 2.2, 7);
    const livingGlass = new THREE.Mesh(livingGlassGeo, glassMat);
    livingGlass.position.set(-1.5, 1.4, 0);
    groundGroup.add(livingGlass);

    const shearWallGeo = new THREE.BoxGeometry(0.8, 2.2, 6);
    const shearWall = new THREE.Mesh(shearWallGeo, darkMarbleMat);
    shearWall.position.set(0.5, 1.4, 0);
    shearWall.castShadow = true;
    shearWall.receiveShadow = true;
    groundGroup.add(shearWall);

    const colGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 16);
    const colPositions: [number, number, number][] = [
      [-5.2, 1.4, 3.2],
      [-5.2, 1.4, -3.2],
      [2.2, 1.4, 3.2],
      [2.2, 1.4, -3.2],
    ];
    colPositions.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(colGeo, bronzeFrameMat);
      col.position.set(x, y, z);
      col.castShadow = true;
      groundGroup.add(col);
    });

    // Upper Floor / Cantilevered Master Suite
    const upperGroup = new THREE.Group();
    upperFloorGroup.current = upperGroup;
    rootGroup.add(upperGroup);

    const upperSlabGeo = new THREE.BoxGeometry(11, 0.3, 7);
    const upperSlab = new THREE.Mesh(upperSlabGeo, travertineMat);
    upperSlab.position.set(0.5, 2.65, 0.5);
    upperSlab.castShadow = true;
    upperSlab.receiveShadow = true;
    upperGroup.add(upperSlab);

    const masterGlassGeo = new THREE.BoxGeometry(7, 1.8, 5);
    const masterGlass = new THREE.Mesh(masterGlassGeo, glassMat);
    masterGlass.position.set(1.5, 3.7, 0.5);
    upperGroup.add(masterGlass);

    const roofSlabGeo = new THREE.BoxGeometry(13, 0.25, 9);
    const roofSlab = new THREE.Mesh(roofSlabGeo, darkMarbleMat);
    roofSlab.position.set(0.5, 4.7, 0.5);
    roofSlab.castShadow = true;
    upperGroup.add(roofSlab);

    const trimGeo = new THREE.BoxGeometry(13.2, 0.1, 9.2);
    const trimMesh = new THREE.Mesh(trimGeo, bronzeFrameMat);
    trimMesh.position.set(0.5, 4.85, 0.5);
    upperGroup.add(trimMesh);

    // Ground Plane & Grid
    const gridHelper = new THREE.GridHelper(40, 40, 0x313543, 0x171920);
    gridHelper.position.y = -0.8;
    scene.add(gridHelper);

    // 6. Mouse and Touch Drag Orbit Controls
    let isInteracting = false;
    let prevPos = { x: 0, y: 0 };
    let initialPinchDist = 0;
    let rotationAngle = 0.4;
    let elevationAngle = 0.4;
    let distance = 22;

    const updateCameraFromOrbit = () => {
      const clampedElevation = Math.max(0.1, Math.min(Math.PI / 2.2, elevationAngle));
      camera.position.x = distance * Math.sin(rotationAngle) * Math.cos(clampedElevation);
      camera.position.y = distance * Math.sin(clampedElevation) + 1;
      camera.position.z = distance * Math.cos(rotationAngle) * Math.cos(clampedElevation);
      camera.lookAt(0, 1.5, 0);
    };
    updateCameraFromOrbit();

    // Mouse Events
    const onMouseDown = (e: MouseEvent) => {
      isInteracting = true;
      prevPos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isInteracting) return;
      const deltaX = e.clientX - prevPos.x;
      const deltaY = e.clientY - prevPos.y;
      prevPos = { x: e.clientX, y: e.clientY };

      rotationAngle -= deltaX * 0.008;
      elevationAngle += deltaY * 0.008;
      updateCameraFromOrbit();
    };

    const onMouseUp = () => {
      isInteracting = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      distance = Math.max(10, Math.min(35, distance + e.deltaY * 0.02));
      updateCameraFromOrbit();
    };

    // Touch Events for Mobile / Tablet Screen Interaction
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isInteracting = true;
        prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        // Pinch zoom start
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isInteracting) {
        const deltaX = e.touches[0].clientX - prevPos.x;
        const deltaY = e.touches[0].clientY - prevPos.y;
        prevPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        rotationAngle -= deltaX * 0.009;
        elevationAngle += deltaY * 0.009;
        updateCameraFromOrbit();
      } else if (e.touches.length === 2 && initialPinchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.sqrt(dx * dx + dy * dy);
        const diff = initialPinchDist - currentDist;
        initialPinchDist = currentDist;

        distance = Math.max(10, Math.min(35, distance + diff * 0.05));
        updateCameraFromOrbit();
      }
    };

    const onTouchEnd = () => {
      isInteracting = false;
      initialPinchDist = 0;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isInteracting) {
        rotationAngle += 0.002;
        updateCameraFromOrbit();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);

      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);

      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Handle Level Isolation Toggle
  useEffect(() => {
    if (!upperFloorGroup.current || !groundFloorGroup.current || !lowerFloorGroup.current) return;

    if (activeLevel === 'all') {
      upperFloorGroup.current.visible = true;
      groundFloorGroup.current.visible = true;
      lowerFloorGroup.current.visible = true;
      upperFloorGroup.current.position.y = 0;
      lowerFloorGroup.current.position.y = 0;
    } else if (activeLevel === 'upper') {
      upperFloorGroup.current.visible = true;
      groundFloorGroup.current.visible = false;
      lowerFloorGroup.current.visible = false;
      upperFloorGroup.current.position.y = -1.5;
    } else if (activeLevel === 'ground') {
      upperFloorGroup.current.visible = false;
      groundFloorGroup.current.visible = true;
      lowerFloorGroup.current.visible = false;
      groundFloorGroup.current.position.y = 0;
    } else if (activeLevel === 'lower') {
      upperFloorGroup.current.visible = false;
      groundFloorGroup.current.visible = false;
      lowerFloorGroup.current.visible = true;
      lowerFloorGroup.current.position.y = 1.0;
    }
  }, [activeLevel]);

  // Handle Lighting Preset Update
  useEffect(() => {
    if (!dirLightRef.current || !hemiLightRef.current || !sceneRef.current) return;

    if (lightingPreset === 'golden') {
      dirLightRef.current.color.setHex(0xf2cf9b);
      dirLightRef.current.intensity = 2.4;
      hemiLightRef.current.color.setHex(0xffecd2);
      hemiLightRef.current.groundColor.setHex(0x1a1e28);
      sceneRef.current.background = new THREE.Color(0x0c0e14);
    } else if (lightingPreset === 'daylight') {
      dirLightRef.current.color.setHex(0xffffff);
      dirLightRef.current.intensity = 2.8;
      hemiLightRef.current.color.setHex(0xe8f0fe);
      hemiLightRef.current.groundColor.setHex(0x222634);
      sceneRef.current.background = new THREE.Color(0x10131b);
    } else if (lightingPreset === 'night') {
      dirLightRef.current.color.setHex(0x406085);
      dirLightRef.current.intensity = 0.8;
      hemiLightRef.current.color.setHex(0x2a3852);
      hemiLightRef.current.groundColor.setHex(0x08090d);
      sceneRef.current.background = new THREE.Color(0x050608);
    }
  }, [lightingPreset]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-alamera-border bg-alamera-card shadow-luxe min-h-[450px]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing touch-none" />

      {/* Floating Header Overlay (Responsive) */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center space-x-2 sm:space-x-3 rounded-md border border-alamera-border bg-alamera-darkest/90 px-2.5 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md max-w-[calc(100vw-80px)] sm:max-w-md">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded border border-champagne-500/40 bg-alamera-card text-champagne-400 flex-shrink-0">
          <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <h3 className="font-serif text-xs sm:text-sm font-semibold text-champagne-100 truncate">
              The Lumina Pavilion
            </h3>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[8px] sm:text-[9px] font-semibold text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              WebGL 3D
            </span>
          </div>
          <p className="font-sans text-[10px] text-alamera-muted truncate hidden sm:block">
            Touch/drag to orbit • Pinch to zoom • Select level below
          </p>
        </div>
      </div>

      {/* Top Right Toolbars (Lighting & Auto-Rotate) */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex items-center space-x-1.5 sm:space-x-2">
        <div className="flex items-center rounded-md border border-alamera-border bg-alamera-darkest/90 p-0.5 sm:p-1 backdrop-blur-md">
          <button
            onClick={() => setLightingPreset('golden')}
            className={`flex items-center space-x-1 rounded px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono transition touch-target ${
              lightingPreset === 'golden'
                ? 'bg-champagne-500 text-alamera-darkest font-semibold'
                : 'text-alamera-muted hover:text-champagne-300'
            }`}
            title="Golden Hour Sunset"
          >
            <Sun className="h-3 w-3" />
            <span className="hidden md:inline">2700K</span>
          </button>
          <button
            onClick={() => setLightingPreset('daylight')}
            className={`flex items-center space-x-1 rounded px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono transition touch-target ${
              lightingPreset === 'daylight'
                ? 'bg-champagne-500 text-alamera-darkest font-semibold'
                : 'text-alamera-muted hover:text-champagne-300'
            }`}
            title="Daylight"
          >
            <Sun className="h-3 w-3" />
            <span className="hidden md:inline">Day</span>
          </button>
          <button
            onClick={() => setLightingPreset('night')}
            className={`flex items-center space-x-1 rounded px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-mono transition touch-target ${
              lightingPreset === 'night'
                ? 'bg-champagne-500 text-alamera-darkest font-semibold'
                : 'text-alamera-muted hover:text-champagne-300'
            }`}
            title="Nocturne"
          >
            <Moon className="h-3 w-3" />
            <span className="hidden md:inline">Night</span>
          </button>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex h-8 sm:h-8 items-center space-x-1 rounded-md border px-2 sm:px-3 text-xs font-mono backdrop-blur-md transition touch-target ${
            autoRotate
              ? 'border-champagne-500/50 bg-champagne-500/15 text-champagne-300'
              : 'border-alamera-border bg-alamera-darkest/90 text-alamera-muted hover:text-alamera-silver'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden md:inline">{autoRotate ? 'Orbiting' : 'Paused'}</span>
        </button>
      </div>

      {/* Bottom Center Level Isolation Controls (Responsive Scrollable Pills) */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center space-x-1 rounded-full border border-alamera-border bg-alamera-darkest/95 p-1 shadow-luxe backdrop-blur-md max-w-[calc(100vw-16px)] overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveLevel('all')}
          className={`rounded-full px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-medium tracking-wide transition flex-shrink-0 touch-target ${
            activeLevel === 'all'
              ? 'bg-champagne-500 text-alamera-darkest font-semibold'
              : 'text-alamera-muted hover:text-champagne-200'
          }`}
        >
          Full Pavilion
        </button>
        <button
          onClick={() => setActiveLevel('upper')}
          className={`rounded-full px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-medium tracking-wide transition flex-shrink-0 touch-target ${
            activeLevel === 'upper'
              ? 'bg-champagne-500 text-alamera-darkest font-semibold'
              : 'text-alamera-muted hover:text-champagne-200'
          }`}
        >
          Sky Terrace
        </button>
        <button
          onClick={() => setActiveLevel('ground')}
          className={`rounded-full px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-medium tracking-wide transition flex-shrink-0 touch-target ${
            activeLevel === 'ground'
              ? 'bg-champagne-500 text-alamera-darkest font-semibold'
              : 'text-alamera-muted hover:text-champagne-200'
          }`}
        >
          Salon & Pool
        </button>
        <button
          onClick={() => setActiveLevel('lower')}
          className={`rounded-full px-2.5 sm:px-3.5 py-1 text-[11px] sm:text-xs font-medium tracking-wide transition flex-shrink-0 touch-target ${
            activeLevel === 'lower'
              ? 'bg-champagne-500 text-alamera-darkest font-semibold'
              : 'text-alamera-muted hover:text-champagne-200'
          }`}
        >
          Car Vault
        </button>
      </div>

      {/* Hotspot Focus Card (Compact on mobile) */}
      {selectedHotspot && (
        <div className="hidden sm:block absolute bottom-16 sm:bottom-20 left-2 sm:left-4 z-10 max-w-xs sm:max-w-sm rounded-md border border-champagne-500/40 bg-alamera-darkest/95 p-3 sm:p-3.5 shadow-luxe backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-alamera-border pb-1.5">
            <span className="font-mono text-[9px] sm:text-[10px] font-semibold text-champagne-400 uppercase tracking-widest">
              Spatial Hotspot Focus
            </span>
            <span className="rounded bg-champagne-500/10 px-1 font-mono text-[9px] text-champagne-300">
              Verified
            </span>
          </div>
          <h4 className="mt-1.5 font-serif text-xs sm:text-sm font-semibold text-champagne-100">
            {selectedHotspot.title}
          </h4>
          <p className="font-sans text-[11px] font-medium text-champagne-400/90">
            {selectedHotspot.subtitle}
          </p>
          <p className="mt-1 font-sans text-[11px] text-alamera-muted leading-relaxed line-clamp-2">
            {selectedHotspot.description}
          </p>
          <div className="mt-2.5 flex items-center space-x-1.5">
            {hotspots.map((hp) => (
              <button
                key={hp.id}
                onClick={() => setSelectedHotspot(hp)}
                className={`h-1.5 rounded-full transition-all touch-target ${
                  selectedHotspot.id === hp.id
                    ? 'w-5 bg-champagne-400'
                    : 'w-1.5 bg-alamera-border hover:bg-champagne-600'
                }`}
                title={hp.title}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
