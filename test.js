import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js";

document.addEventListener("DOMContentLoaded", function () {
    const container = document.createElement("div");
    container.classList.add("threejs-container");
    document.body.prepend(container); 

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimize for mobile
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Background Color
    scene.background = new THREE.Color(0x0f172a);

    // Create Floating Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = window.innerWidth < 768 ? 200 : 500; // Fewer particles on mobile
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        opacity: 0.7,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Camera Position
    camera.position.z = 5;

    // Mouse Interaction (Mobile Touch Support)
    const mouse = { x: 0, y: 0 };
    
    window.addEventListener("mousemove", (event) => {
        mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener("touchmove", (event) => {
        const touch = event.touches[0];
        mouse.x = (touch.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = -(touch.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animate
    function animate() {
        requestAnimationFrame(animate);
        
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.001;

        camera.position.x += (mouse.x * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    // Resize Handling
    window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    animate();
});
