import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { appleImg } from '../utils';

const Hero = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    gsap.to('#hero_title_1', { opacity: 1, delay: 1.0 });
    gsap.to('#hero_title_2', { opacity: 1, delay: 1.5 });
    gsap.to('#hero_img', { opacity: 1, delay: 2.0 });
  }, []);

  useEffect(() => {
    let scene, camera, renderer, topWave, middleWave, bottomWave, animationFrameId;
    const particleCount = 1250; // Maintained particle count
    const interactionRadius = 2; // Maintained interaction radius
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const initParticles = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      mountRef.current.appendChild(renderer.domElement);

      const textureLoader = new THREE.TextureLoader();
      const particleTexture = textureLoader.load('assets/images/disc.png');

      const createWave = (yOffset, color) => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const originalPositions = new Float32Array(particleCount * 3);
        const speeds = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          const x = Math.random() * 10 - 5; // Spread across entire width
          const y = yOffset + (Math.random() - 0.5) * 1; // Tighter vertical spread
          const z = (Math.random() - 0.5) * 2;

          positions[i * 3] = x;
          positions[i * 3 + 1] = y;
          positions[i * 3 + 2] = z;

          originalPositions[i * 3] = x;
          originalPositions[i * 3 + 1] = y;
          originalPositions[i * 3 + 2] = z;

          speeds[i] = 0.02 + Math.random() * 0.03; // Maintained speed
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
        geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

        const material = new THREE.PointsMaterial({
          map: particleTexture,
          size: 0.08, // Increased size for more visible glow
          transparent: true,
          opacity: 0.9, // Increased opacity
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          color: color,
          vertexColors: false,
        });

        return new THREE.Points(geometry, material);
      };
      

      //colors
      topWave = createWave(2, 0xFF671F); 
      middleWave = createWave(0, 0x808080); 
      bottomWave = createWave(-2, 0x046A38); 

      scene.add(topWave);
      scene.add(middleWave);
      scene.add(bottomWave);

      const animate = () => {
        raycaster.setFromCamera(mouse, camera);

        [topWave, middleWave, bottomWave].forEach((wave) => {
          const positionsArray = wave.geometry.attributes.position.array;
          const originalPositionsArray = wave.geometry.attributes.originalPosition.array;
          const speedsArray = wave.geometry.attributes.speed.array;

          const intersects = raycaster.intersectObject(wave);

          for (let i = 0; i < particleCount; i++) {
            // River-like flow
            positionsArray[i * 3] += speedsArray[i];
            if (positionsArray[i * 3] > 5) {
              positionsArray[i * 3] = -5;
              originalPositionsArray[i * 3] = -5;
            }

            // Subtle vertical motion
            positionsArray[i * 3 + 1] = originalPositionsArray[i * 3 + 1] + Math.sin(Date.now() * 0.001 + positionsArray[i * 3]) * 0.05;

            // Enhanced dispersion effect
            const particlePosition = new THREE.Vector3(positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2]);
            
            for (const intersect of intersects) {
              const distance = particlePosition.distanceTo(intersect.point);
              if (distance < interactionRadius) {
                const direction = particlePosition.sub(intersect.point).normalize();
                const force = (1 - distance / interactionRadius) * 0.1; // Maintained force
                positionsArray[i * 3] += direction.x * force;
                positionsArray[i * 3 + 1] += direction.y * force;
                positionsArray[i * 3 + 2] += direction.z * force;
              }
            }

            // Gradual return to original position
            positionsArray[i * 3 + 1] += (originalPositionsArray[i * 3 + 1] - positionsArray[i * 3 + 1]) * 0.02;
            positionsArray[i * 3 + 2] += (originalPositionsArray[i * 3 + 2] - positionsArray[i * 3 + 2]) * 0.02;
          }

          wave.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const handleMouseMove = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      };
    };

    initParticles();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="hero" className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col relative z-10">
        <p id="hero_title_1" className="hero-title text-white z-20 mt-20">JurisAI</p>
        <p id="hero_title_2" className="hero-title text-white z-20">Your Legal Guide</p>
        <img
          id="hero_img"
          src={appleImg}
          alt="Placeholder"
          width="120"
          height="120"
          className="mt-8 mx-auto opacity-0"
        />
      </div>
      <div ref={mountRef} className="absolute top-0 left-0 w-full h-full z-0"></div>
    </section>
  );
};

export default Hero;