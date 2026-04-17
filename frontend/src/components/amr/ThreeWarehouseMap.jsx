import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ROBOT_POSITIONS, SHELVES, FLEET } from "../../data/mockData";
import {
  Maximize2,
  Layers,
  Locate,
  MapPinned,
  Activity,
  BatteryCharging,
  ShieldCheck,
} from "lucide-react";

// Vanilla three.js map. Robots are raycastable; clicking opens the robot drawer.
export const ThreeWarehouseMap = ({ onRobotClick }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  // Stats derived from fleet
  const stats = {
    total: FLEET.length,
    active: FLEET.filter((r) => r.status === "active").length,
    charging: FLEET.filter((r) => r.status === "charging").length,
    service: FLEET.filter((r) => r.status === "maintenance").length,
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#08090C");
    scene.fog = new THREE.Fog("#08090C", 30, 140);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(22, 22, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(15, 25, 10);
    scene.add(dir);
    const pl = new THREE.PointLight(0x0066ff, 0.6, 80);
    pl.position.set(0, 15, 0);
    scene.add(pl);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: "#08090C" })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    scene.add(floor);

    // Grid
    const grid = new THREE.GridHelper(90, 90, new THREE.Color("#0066FF"), new THREE.Color("#1A1D24"));
    grid.material.transparent = true;
    grid.material.opacity = 0.3;
    scene.add(grid);

    const gridMajor = new THREE.GridHelper(90, 15, new THREE.Color("#0066FF"), new THREE.Color("#0066FF"));
    gridMajor.material.transparent = true;
    gridMajor.material.opacity = 0.16;
    gridMajor.position.y = 0.001;
    scene.add(gridMajor);

    // Perimeter
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
      opacity: 0.28,
    });
    [[-26, 20], [-22, 20], [-18, 20], [22, 20], [26, 20]].forEach(([x, z]) => {
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
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), shelfEdgeMat);
      edges.position.copy(m.position);
      scene.add(edges);
    });

    // Robots (raycastable via group.userData)
    const robotGroups = [];
    ROBOT_POSITIONS.forEach((r) => {
      const group = new THREE.Group();
      group.position.set(r.pos[0], 0, r.pos[2]);
      group.userData = { id: r.id, color: r.color };

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.4, 1.75, 48),
        new THREE.MeshBasicMaterial({
          color: r.color,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      group.add(ring);

      const chassisGeo = new THREE.BoxGeometry(1.8, 0.8, 1.3);
      const chassis = new THREE.Mesh(
        chassisGeo,
        new THREE.MeshStandardMaterial({
          color: "#15161A",
          emissive: new THREE.Color(r.color),
          emissiveIntensity: 0.35,
          metalness: 0.6,
          roughness: 0.35,
        })
      );
      chassis.position.y = 0.4;
      chassis.userData = { id: r.id };
      group.add(chassis);

      const chEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(chassisGeo),
        new THREE.LineBasicMaterial({ color: r.color })
      );
      chEdges.position.y = 0.4;
      group.add(chEdges);

      const lidar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.35, 24),
        new THREE.MeshStandardMaterial({
          color: "#0A0A0B",
          emissive: new THREE.Color(r.color),
          emissiveIntensity: 1.0,
        })
      );
      lidar.position.y = 1.0;
      lidar.userData = { id: r.id };
      group.add(lidar);

      scene.add(group);
      robotGroups.push(group);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minDistance = 12;
    controls.maxDistance = 75;
    controls.target.set(0, 0, 0);

    // Raycasting — click detection on robots
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0, downY = 0;
    const onPointerDown = (e) => {
      downX = e.clientX; downY = e.clientY;
    };
    const onClick = (e) => {
      // Ignore if pointer moved (drag/rotate), not a true click
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 4) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(robotGroups, true);
      if (intersects.length) {
        let obj = intersects[0].object;
        while (obj && !obj.userData?.id) obj = obj.parent;
        if (obj?.userData?.id && onRobotClick) {
          onRobotClick(obj.userData.id);
        }
      }
    };
    // Hover → cursor pointer
    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(robotGroups, true);
      renderer.domElement.style.cursor = hit.length ? "pointer" : "grab";
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.style.cursor = "grab";

    // Animation
    let rafId;
    let frame = 0;
    const tick = () => {
      controls.update();
      frame++;
      robotGroups.forEach((g, i) => {
        const ring = g.children[0];
        if (ring && ring.material) {
          const t = (frame + i * 20) * 0.02;
          ring.material.opacity = 0.35 + Math.sin(t) * 0.12;
        }
      });
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

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
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
          else obj.material.dispose?.();
        }
      });
    };
  }, [onRobotClick]);

  return (
    <div
      data-testid="warehouse-map"
      className="rounded-2xl border border-white/5 bg-[#0E0F13]/80 backdrop-blur-md overflow-hidden flex flex-col"
    >
      {/* Inline professional header bar */}
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <MapPinned className="h-4 w-4 text-[#00C2FF] shrink-0" strokeWidth={1.8} />
          <h3 className="text-base font-extrabold text-white whitespace-nowrap">Warehouse Map</h3>
          <span className="text-slate-700">·</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 truncate">
            Zone Alpha-West
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <StatPill
            dot="#94A3B8"
            label={`${stats.total} robots`}
            testid="stat-total"
          />
          <StatPill
            dot="#00C2FF"
            icon={<Activity className="h-3 w-3" strokeWidth={2} />}
            label={`${stats.active} active`}
            testid="stat-active"
          />
          <StatPill
            dot="#F59E0B"
            icon={<BatteryCharging className="h-3 w-3" strokeWidth={2} />}
            label={`${stats.charging} charging`}
            testid="stat-charging"
          />
          <StatPill
            dot="#10B981"
            icon={<ShieldCheck className="h-3 w-3" strokeWidth={2} />}
            label="Nominal"
            testid="stat-health"
          />
          <span className="mx-1 h-5 w-px bg-white/10 hidden md:inline-block" />
          <MapBtn testid="map-layers"><Layers className="h-3.5 w-3.5" /></MapBtn>
          <MapBtn testid="map-locate"><Locate className="h-3.5 w-3.5" /></MapBtn>
          <MapBtn testid="map-fullscreen"><Maximize2 className="h-3.5 w-3.5" /></MapBtn>
        </div>
      </div>

      {/* 3D canvas */}
      <div className="relative">
        <div ref={mountRef} className="w-full h-[380px] md:h-[420px]" />

        {/* Subtle footer legend + hint, inside the canvas bottom edge */}
        <div className="absolute left-3 bottom-3 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/10 bg-black/55 backdrop-blur-md">
          <Legend color="#00C2FF" label="Active" />
          <Legend color="#F59E0B" label="Charging" />
          <Legend color="#64748B" label="Idle" />
          <Legend color="#EF4444" label="Fault" />
        </div>
        <div className="absolute right-3 bottom-3 z-10 px-2.5 py-1.5 rounded-lg border border-white/10 bg-black/55 backdrop-blur-md font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          Click a robot for details
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ dot, label, icon, testid }) => (
  <span
    data-testid={testid}
    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/10 bg-white/[0.02] font-mono text-[10px] uppercase tracking-wider text-slate-300"
  >
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ background: dot, boxShadow: `0 0 6px ${dot}` }}
    />
    {icon}
    <span>{label}</span>
  </span>
);

const MapBtn = ({ children, testid }) => (
  <button
    data-testid={testid}
    className="h-7 w-7 rounded-md border border-white/10 bg-white/[0.02] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#0066FF]/50 transition-all"
  >
    {children}
  </button>
);

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
      {label}
    </span>
  </div>
);

export default ThreeWarehouseMap;
