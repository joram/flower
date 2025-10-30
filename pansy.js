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

// Color configuration
const colors = {
    upperPetals: new THREE.Color(0x9370DB), // Purple
    lateralPetals: new THREE.Color(0x9370DB), // Purple
    lowerPetal: new THREE.Color(0x9370DB), // Purple
    facePattern: new THREE.Color(0x4B0082), // Dark purple/black
    center: new THREE.Color(0xFFD700) // Gold/yellow center
};

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

// Create pansy flower with 5 petals
function createPansy() {
    const flowerGroup = new THREE.Group();
    
    // Upper petal shape (rounded, wider at top)
    function createUpperPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.2, -0.1, 0.4, -0.3);
        shape.quadraticCurveTo(0.5, -0.5, 0.5, -0.7);
        shape.quadraticCurveTo(0.3, -0.8, 0, -0.9);
        shape.quadraticCurveTo(-0.3, -0.8, -0.5, -0.7);
        shape.quadraticCurveTo(-0.5, -0.5, -0.4, -0.3);
        shape.quadraticCurveTo(-0.2, -0.1, 0, 0);
        return shape;
    }
    
    // Lower petal shape (larger, more rounded)
    function createLowerPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.3, 0.1, 0.6, 0.3);
        shape.quadraticCurveTo(0.7, 0.6, 0.7, 0.9);
        shape.quadraticCurveTo(0.4, 1.0, 0, 1.1);
        shape.quadraticCurveTo(-0.4, 1.0, -0.7, 0.9);
        shape.quadraticCurveTo(-0.7, 0.6, -0.6, 0.3);
        shape.quadraticCurveTo(-0.3, 0.1, 0, 0);
        return shape;
    }
    
    // Lateral petal shape (oval, pointing outward)
    function createLateralPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.4, 0.1, 0.6, 0.4);
        shape.quadraticCurveTo(0.5, 0.7, 0.3, 0.8);
        shape.quadraticCurveTo(0, 0.7, -0.3, 0.8);
        shape.quadraticCurveTo(-0.5, 0.7, -0.6, 0.4);
        shape.quadraticCurveTo(-0.4, 0.1, 0, 0);
        return shape;
    }
    
    const petalSettings = {
        depth: 0.05,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02
    };
    
    // Upper two petals (overlapping)
    const upperPetalShape = createUpperPetalShape();
    const upperPetalGeometry = new THREE.ExtrudeGeometry(upperPetalShape, petalSettings);
    
    // Left upper petal
    const upperLeft = new THREE.Mesh(
        upperPetalGeometry,
        new THREE.MeshPhongMaterial({ 
            color: colors.upperPetals,
            shininess: 50,
            transparent: true,
            opacity: 0.95
        })
    );
    upperLeft.rotation.z = Math.PI / 4;
    upperLeft.position.set(-0.3, 0.2, 0);
    upperLeft.rotation.y = Math.PI / 2;
    flowerGroup.add(upperLeft);
    
    // Right upper petal
    const upperRight = new THREE.Mesh(
        upperPetalGeometry.clone(),
        new THREE.MeshPhongMaterial({ 
            color: colors.upperPetals,
            shininess: 50,
            transparent: true,
            opacity: 0.95
        })
    );
    upperRight.rotation.z = -Math.PI / 4;
    upperRight.position.set(0.3, 0.2, 0);
    upperRight.rotation.y = Math.PI / 2;
    flowerGroup.add(upperRight);
    
    // Lateral petals (left and right)
    const lateralPetalShape = createLateralPetalShape();
    const lateralPetalGeometry = new THREE.ExtrudeGeometry(lateralPetalShape, petalSettings);
    
    // Left lateral petal
    const lateralLeft = new THREE.Mesh(
        lateralPetalGeometry,
        new THREE.MeshPhongMaterial({ 
            color: colors.lateralPetals,
            shininess: 50,
            transparent: true,
            opacity: 0.95
        })
    );
    lateralLeft.rotation.z = Math.PI / 2;
    lateralLeft.position.set(-0.6, -0.1, 0);
    lateralLeft.rotation.y = Math.PI / 2;
    flowerGroup.add(lateralLeft);
    
    // Right lateral petal
    const lateralRight = new THREE.Mesh(
        lateralPetalGeometry.clone(),
        new THREE.MeshPhongMaterial({ 
            color: colors.lateralPetals,
            shininess: 50,
            transparent: true,
            opacity: 0.95
        })
    );
    lateralRight.rotation.z = -Math.PI / 2;
    lateralRight.position.set(0.6, -0.1, 0);
    lateralRight.rotation.y = Math.PI / 2;
    flowerGroup.add(lateralRight);
    
    // Lower petal (largest, with face pattern)
    const lowerPetalShape = createLowerPetalShape();
    const lowerPetalGeometry = new THREE.ExtrudeGeometry(lowerPetalShape, petalSettings);
    
    // Create face pattern using a shader or gradient material
    const lowerPetalMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.lowerPetal,
        shininess: 50,
        transparent: true,
        opacity: 0.95
    });
    
    const lowerPetal = new THREE.Mesh(lowerPetalGeometry, lowerPetalMaterial);
    lowerPetal.rotation.z = Math.PI;
    lowerPetal.position.set(0, -0.4, 0);
    lowerPetal.rotation.y = Math.PI / 2;
    flowerGroup.add(lowerPetal);
    
    // Add face pattern using a smaller dark circle/ellipse overlay
    const facePatternGeometry = new THREE.CircleGeometry(0.25, 16);
    const facePatternMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.facePattern,
        transparent: true,
        opacity: 0.7
    });
    const facePattern = new THREE.Mesh(facePatternGeometry, facePatternMaterial);
    facePattern.position.set(0, -0.35, 0.06);
    facePattern.rotation.y = Math.PI / 2;
    flowerGroup.add(facePattern);
    
    // Add radiating lines for face pattern (simple lines)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.35, 0.07),
            new THREE.Vector3(Math.cos(angle) * 0.4, -0.35 + Math.sin(angle) * 0.2, 0.07)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colors.facePattern,
            transparent: true,
            opacity: 0.5
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        flowerGroup.add(line);
    }
    
    // Center of flower (stamens and pistil)
    const centerGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.center,
        shininess: 100
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.05;
    flowerGroup.add(center);
    
    // Add small stamens around center
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const stamenGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8);
        const stamenMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
        const stamen = new THREE.Mesh(stamenGeometry, stamenMaterial);
        stamen.position.set(Math.cos(angle) * 0.08, 0.08, Math.sin(angle) * 0.08);
        stamen.rotation.z = Math.PI / 4;
        flowerGroup.add(stamen);
    }
    
    flowerGroup.position.y = 2.5;
    return flowerGroup;
}

// Create pansy leaves (heart-shaped/ovate)
function createPansyLeaves() {
    const leavesGroup = new THREE.Group();
    
    // Heart-shaped leaf
    function createHeartLeafShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(-0.3, -0.2, -0.4, -0.5);
        shape.quadraticCurveTo(-0.3, -0.8, 0, -1.0);
        shape.quadraticCurveTo(0.3, -0.8, 0.4, -0.5);
        shape.quadraticCurveTo(0.3, -0.2, 0, 0);
        return shape;
    }
    
    const leafShape = createHeartLeafShape();
    const leafGeometry = new THREE.ExtrudeGeometry(leafShape, {
        depth: 0.02,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01
    });
    const leafMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x32CD32,
        shininess: 20
    });
    
    // Left leaf
    const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leftLeaf.rotation.z = -Math.PI / 6;
    leftLeaf.position.set(-0.4, 1.0, 0);
    leftLeaf.rotation.y = Math.PI / 4;
    leavesGroup.add(leftLeaf);
    
    // Right leaf
    const rightLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    rightLeaf.rotation.z = Math.PI / 6;
    rightLeaf.position.set(0.4, 1.0, 0);
    rightLeaf.rotation.y = -Math.PI / 4;
    leavesGroup.add(rightLeaf);
    
    // Bottom leaf (optional third leaf)
    const bottomLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    bottomLeaf.rotation.z = Math.PI;
    bottomLeaf.position.set(0, 0.6, 0);
    bottomLeaf.rotation.y = 0;
    leavesGroup.add(bottomLeaf);
    
    return leavesGroup;
}

// Assemble the complete pansy
const pot = createPot();
const stem = createStem();
const pansy = createPansy();
const leaves = createPansyLeaves();

const flowerPlant = new THREE.Group();
flowerPlant.add(pot);
flowerPlant.add(stem);
flowerPlant.add(pansy);
flowerPlant.add(leaves);

scene.add(flowerPlant);

// Camera position
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the entire flower slowly (1 rotation per 120 seconds)
    flowerPlant.rotation.y += 0.005;
    
    // Gentle swaying motion
    flowerPlant.rotation.z = Math.sin(Date.now() * 0.001) * 0.05;
    
    // Subtle petal movement
    pansy.children.forEach((child, index) => {
        if (child.type === 'Mesh' && child.material.color !== colors.center) {
            const time = Date.now() * 0.001;
            child.rotation.x = Math.sin(time + index) * 0.02;
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

