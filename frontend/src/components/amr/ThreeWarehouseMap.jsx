import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ROBOT_POSITIONS, SHELVES } from "../../data/mockData";
import { Maximize2, Layers, Locate } from "lucide-react";

// Vanilla three.js implementation to avoid JSX attribute injection from visual-edits plugin.
export const ThreeWarehouseMap = () => {
  const mountRef = useRef(null);
  const labelsRef = useRef(null);
  const [labels, setLabels] = React.useState([]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#08090C");
    scene.fog = new THREE.Fog("#08090C", 30, 140);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(22, 22, 30);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(15, 25, 10);
    scene.add(dir);
    const pl = new THREE.PointLight(0x0066ff, 0.6, 80);
    pl.position.set(0, 15, 0);
    scene.add(pl);

    // Solid floor
    const floorGeo = new THREE.PlaneGeometry(200, 200);
    const floorMat = new THREE.MeshStandardMaterial({ color: "#08090C" });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    // Grid
    const grid = new THREE.GridHelper(90, 90, new THREE.Color("#0066FF"), new THREE.Color("#1A1D24"));
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    scene.add(grid);

    // Major accent grid (every 6)
    const gridMajor = new THREE.GridHelper(90, 15, new THREE.Color("#0066FF"), new THREE.Color("#0066FF"));
    gridMajor.material.transparent = true;
    gridMajor.material.opacity = 0.18;
    gridMajor.position.y = 0.001;
    scene.add(gridMajor);

    // Perimeter low walls
    const wallMat = new THREE.MeshStandardMaterial({ color: "#1A1B22" });
    const addWall = (w, h, d, x, y, z) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      m.position.set(x, y, z);
      scene.add(m);
    };
    addWall(60, 0.6, 0.12, 0, 0.3, -24);
    addWall(60, 0.6, 0.12, 0, 0.3, 24);
    addWall(0.12, 0.6, 48, -30, 0.3, 0);
    addWall(0.12, 0.6, 48, 30, 0.3, 0);

    // Charging dock markers
    const dockMat = new THREE.MeshBasicMaterial({
      color: "#0066FF",
      transparent: true,
      opacity: 0.3,
    });
    const dockPositions = [
      [-26, 20], [-22, 20], [-18, 20], [22, 20], [26, 20],
    ];
    dockPositions.forEach(([x, z]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), dockMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.02, z);
      scene.add(m);
    });

    // Shelves
    const shelfMat = new THREE.MeshStandardMaterial({
      color: "#111216",
      metalness: 0.3,
      roughness: 0.85,
    });
    const shelfEdgeMat = new THREE.LineBasicMaterial({ color: "#2A2D36" });
    SHELVES.forEach(([x, z, w, d]) => {
      const geo = new THREE.BoxGeometry(w, 1, d);
      const m = new THREE.Mesh(geo, shelfMat);
      m.position.set(x, 0.5, z);
      scene.add(m);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        shelfEdgeMat
      );
      edges.position.copy(m.position);
      scene.add(edges);
    });

    // Robots
    const robotMeshes = [];
    ROBOT_POSITIONS.forEach((r) => {
      const group = new THREE.Group();
      group.position.set(r.pos[0], 0, r.pos[2]);

      // Glow ring
      const ringGeo = new THREE.RingGeometry(1.4, 1.75, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r.color,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      group.add(ring);

      // Chassis
      const chassisGeo = new THREE.BoxGeometry(1.8, 0.8, 1.3);
      const chassisMat = new THREE.MeshStandardMaterial({
        color: "#15161A",
        emissive: new THREE.Color(r.color),
        emissiveIntensity: 0.35,
        metalness: 0.6,
        roughness: 0.35,
      });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      chassis.position.y = 0.4;
      group.add(chassis);

      // Edges on chassis
      const chEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(chassisGeo),
        new THREE.LineBasicMaterial({ color: r.color })
      );
      chEdges.position.y = 0.4;
      group.add(chEdges);

      // LIDAR cylinder
      const lidar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.35, 24),
        new THREE.MeshStandardMaterial({
          color: "#0A0A0B",
          emissive: new THREE.Color(r.color),
          emissiveIntensity: 1.0,
        })
      );
      lidar.position.y = 1.0;
      group.add(lidar);

      scene.add(group);
      robotMeshes.push({ group, id: r.id, color: r.color });
    });

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minDistance = 12;
    controls.maxDistance = 75;
    controls.target.set(0, 0, 0);

    // HTML labels — project 3D positions to 2D
    const updateLabels = () => {
      const rect = mount.getBoundingClientRect();
      const next = robotMeshes.map((r) => {
        const vec = new THREE.Vector3();
        r.group.getWorldPosition(vec);
        vec.y += 2.2;
        vec.project(camera);
        const x = (vec.x * 0.5 + 0.5) * rect.width;
        const y = (-vec.y * 0.5 + 0.5) * rect.height;
        const visible = vec.z < 1;
        return { id: r.id, color: r.color, x, y, visible };
      });
      setLabels(next);
    };

    // Animation
    let rafId;
    let frame = 0;
    const tick = () => {
      controls.update();
      // Subtle hover animation on rings — actually robots are static; just pulse ring opacity
      frame++;
      robotMeshes.forEach((r, i) => {
        const ring = r.group.children[0];
        if (ring && ring.material) {
          const t = (frame + i * 20) * 0.02;
          ring.material.opacity = 0.35 + Math.sin(t) * 0.12;
        }
      });
      renderer.render(scene, camera);
      if (frame % 2 === 0) updateLabels();
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // Resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
          else obj.material.dispose?.();
        }
      });
    };
  }, []);

  return (
    <div
      data-testid="three-map"
      className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-[#08090C]"
    >
      {/* Top overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C2FF] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00C2FF]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-200">
            Live Fleet View
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Zone · Alpha-West
        </div>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <MapBtn testid="map-layers"><Layers className="h-4 w-4" /></MapBtn>
        <MapBtn testid="map-locate"><Locate className="h-4 w-4" /></MapBtn>
        <MapBtn testid="map-fullscreen"><Maximize2 className="h-4 w-4" /></MapBtn>
      </div>

      {/* Bottom legend */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md">
        <Legend color="#00C2FF" label="Active" />
        <Legend color="#F59E0B" label="Charging" />
        <Legend color="#64748B" label="Idle" />
        <Legend color="#EF4444" label="Fault" />
      </div>

      {/* 3D canvas mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Robot labels overlay */}
      <div ref={labelsRef} className="absolute inset-0 pointer-events-none z-[5]">
        {labels.map((l) =>
          l.visible ? (
            <div
              key={l.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md border border-white/15 bg-black/70 backdrop-blur-md font-mono text-[10px] tracking-wider whitespace-nowrap"
              style={{ left: l.x, top: l.y, color: l.color }}
            >
              {l.id}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

const MapBtn = ({ children, testid }) => (
  <button
    data-testid={testid}
    className="h-9 w-9 rounded-lg border border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white hover:border-[#0066FF]/50 transition-all"
  >
    {children}
  </button>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span
      className="h-2 w-2 rounded-full"
      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
    />
    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
      {label}
    </span>
  </div>
);

export default ThreeWarehouseMap;
