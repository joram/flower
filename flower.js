import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB, 1);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// Create pot
function createPot() {
    const potGroup = new THREE.Group();
    
    // Pot body (truncated cone)
    const potGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 32);
    const potMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513,
        shininess: 30
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -1.5;
    potGroup.add(pot);
    
    // Pot rim
    const rimGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 32);
    const rimMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = -0.9;
    potGroup.add(rim);
    
    return potGroup;
}

// Create stem
function createStem() {
    const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 16);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.5;
    return stem;
}

// Create flower petals
function createFlower() {
    const flowerGroup = new THREE.Group();
    const petalCount = 8;
    
    // Petal shape
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.3, 0.2, 0.5, 0.5);
    petalShape.quadraticCurveTo(0.2, 0.8, 0, 1);
    petalShape.quadraticCurveTo(-0.2, 0.8, -0.5, 0.5);
    petalShape.quadraticCurveTo(-0.3, 0.2, 0, 0);
    
    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02
    });
    
    // Create petals in a circle
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petal = new THREE.Mesh(
            petalGeometry,
            new THREE.MeshPhongMaterial({ 
                color: new THREE.Color().setHSL(0.15 + Math.random() * 0.1, 0.8, 0.6),
                shininess: 50
            })
        );
        petal.rotation.z = angle;
        petal.position.x = Math.cos(angle) * 0.2;
        petal.position.y = Math.sin(angle) * 0.2;
        petal.rotation.y = Math.PI / 2;
        flowerGroup.add(petal);
    }
    
    // Center of flower
    const centerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xFFD700,
        shininess: 100
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.05;
    flowerGroup.add(center);
    
    flowerGroup.position.y = 2.5;
    return flowerGroup;
}

// Create leaves
function createLeaves() {
    const leavesGroup = new THREE.Group();
    
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.3, 0.3, 0.5, 0.8);
    leafShape.quadraticCurveTo(0.2, 1.2, 0, 1.5);
    leafShape.quadraticCurveTo(-0.2, 1.2, -0.5, 0.8);
    leafShape.quadraticCurveTo(-0.3, 0.3, 0, 0);
    
    const leafGeometry = new THREE.ExtrudeGeometry(leafShape, {
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01
    });
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x32CD32 });
    
    // Left leaf
    const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leftLeaf.rotation.z = -Math.PI / 4;
    leftLeaf.position.set(-0.5, 1.2, 0);
    leftLeaf.rotation.y = Math.PI / 4;
    leavesGroup.add(leftLeaf);
    
    // Right leaf
    const rightLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    rightLeaf.rotation.z = Math.PI / 4;
    rightLeaf.position.set(0.5, 1.0, 0);
    rightLeaf.rotation.y = -Math.PI / 4;
    leavesGroup.add(rightLeaf);
    
    return leavesGroup;
}

// Assemble the complete flower
const pot = createPot();
const stem = createStem();
const flower = createFlower();
const leaves = createLeaves();

const flowerPlant = new THREE.Group();
flowerPlant.add(pot);
flowerPlant.add(stem);
flowerPlant.add(flower);
flowerPlant.add(leaves);

scene.add(flowerPlant);

// Camera position
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the entire flower slowly
    flowerPlant.rotation.y += 0.005;
    
    // Gentle swaying motion
    flowerPlant.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
    
    // Petal subtle movement
    flower.children.forEach((petal, index) => {
        if (petal.type === 'Mesh') {
            petal.rotation.y += 0.001 * (index % 2 === 0 ? 1 : -1);
        }
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

