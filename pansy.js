import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB, 1);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting - more realistic pansy lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Main directional light (sun)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(4, 8, 4);
directionalLight.castShadow = false;
scene.add(directionalLight);

// Fill light for softer shadows
const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
fillLight.position.set(-3, 5, -3);
scene.add(fillLight);

// Subtle rim light
const rimLight = new THREE.PointLight(0xffffff, 0.4);
rimLight.position.set(-2, 3, -2);
scene.add(rimLight);

// Color configuration - more vibrant pansy colors
const colors = {
    upperPetals: new THREE.Color(0x9370DB), // Purple
    lateralPetals: new THREE.Color(0x9370DB), // Purple (can be different)
    lowerPetal: new THREE.Color(0x9370DB), // Purple
    facePattern: new THREE.Color(0x2F1B4D), // Very dark purple/black for contrast
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
    
    // Upper petal shape (rounded, wider at top - more realistic pansy shape)
    function createUpperPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        // Top curves
        shape.quadraticCurveTo(0.15, -0.15, 0.35, -0.35);
        shape.quadraticCurveTo(0.5, -0.5, 0.55, -0.65);
        shape.quadraticCurveTo(0.5, -0.75, 0.4, -0.8);
        // Top center
        shape.quadraticCurveTo(0.2, -0.85, 0, -0.85);
        // Other side
        shape.quadraticCurveTo(-0.2, -0.85, -0.4, -0.8);
        shape.quadraticCurveTo(-0.5, -0.75, -0.55, -0.65);
        shape.quadraticCurveTo(-0.5, -0.5, -0.35, -0.35);
        shape.quadraticCurveTo(-0.15, -0.15, 0, 0);
        return shape;
    }
    
    // Lower petal shape (largest, more rounded, wider)
    function createLowerPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        // Wider, more rounded bottom petal
        shape.quadraticCurveTo(0.25, 0.15, 0.5, 0.35);
        shape.quadraticCurveTo(0.7, 0.6, 0.75, 0.85);
        shape.quadraticCurveTo(0.7, 1.05, 0.5, 1.15);
        shape.quadraticCurveTo(0.25, 1.2, 0, 1.2);
        // Other side
        shape.quadraticCurveTo(-0.25, 1.2, -0.5, 1.15);
        shape.quadraticCurveTo(-0.7, 1.05, -0.75, 0.85);
        shape.quadraticCurveTo(-0.7, 0.6, -0.5, 0.35);
        shape.quadraticCurveTo(-0.25, 0.15, 0, 0);
        return shape;
    }
    
    // Lateral petal shape (oval, pointing outward)
    function createLateralPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        // More elongated oval shape
        shape.quadraticCurveTo(0.35, 0.05, 0.55, 0.3);
        shape.quadraticCurveTo(0.6, 0.55, 0.5, 0.75);
        shape.quadraticCurveTo(0.35, 0.85, 0.15, 0.8);
        shape.quadraticCurveTo(0, 0.7, -0.15, 0.8);
        shape.quadraticCurveTo(-0.35, 0.85, -0.5, 0.75);
        shape.quadraticCurveTo(-0.6, 0.55, -0.55, 0.3);
        shape.quadraticCurveTo(-0.35, 0.05, 0, 0);
        return shape;
    }
    
    const petalSettings = {
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        steps: 2
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
    upperLeft.rotation.z = Math.PI / 3.5;
    upperLeft.position.set(-0.25, 0.25, 0);
    upperLeft.rotation.y = Math.PI / 2;
    flowerGroup.add(upperLeft);
    
    // Right upper petal (slightly overlapping)
    const upperRight = new THREE.Mesh(
        upperPetalGeometry.clone(),
        new THREE.MeshPhongMaterial({ 
            color: colors.upperPetals,
            shininess: 50,
            transparent: true,
            opacity: 0.95
        })
    );
    upperRight.rotation.z = -Math.PI / 3.5;
    upperRight.position.set(0.25, 0.25, 0);
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
    lateralLeft.rotation.z = Math.PI / 2.2;
    lateralLeft.position.set(-0.65, 0, 0);
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
    lateralRight.rotation.z = -Math.PI / 2.2;
    lateralRight.position.set(0.65, 0, 0);
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
    lowerPetal.position.set(0, -0.5, 0);
    lowerPetal.rotation.y = Math.PI / 2;
    flowerGroup.add(lowerPetal);
    
    // Add face pattern using a dark ellipse overlay (more visible)
    const facePatternGeometry = new THREE.EllipseCurve(0, 0, 0.3, 0.2, 0, Math.PI * 2, false, 0);
    const facePatternShape = new THREE.Shape();
    facePatternShape.ellipse(0, 0, 0.3, 0.2, 0, Math.PI * 2, false);
    const facePatternExtrude = new THREE.ExtrudeGeometry(facePatternShape, {
        depth: 0.01,
        bevelEnabled: false
    });
    const facePatternMaterial = new THREE.MeshPhongMaterial({ 
        color: colors.facePattern,
        transparent: true,
        opacity: 0.85
    });
    const facePattern = new THREE.Mesh(facePatternExtrude, facePatternMaterial);
    facePattern.position.set(0, -0.45, 0.06);
    facePattern.rotation.y = Math.PI / 2;
    flowerGroup.add(facePattern);
    
    // Add radiating lines for face pattern (more visible)
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.45, 0.08),
            new THREE.Vector3(Math.cos(angle) * 0.5, -0.45 + Math.sin(angle) * 0.3, 0.08)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colors.facePattern,
            transparent: true,
            opacity: 0.7,
            linewidth: 2
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

// Create pansy leaves (heart-shaped/ovate - more realistic)
function createPansyLeaves() {
    const leavesGroup = new THREE.Group();
    
    // Heart-shaped/ovate leaf with better proportions
    function createHeartLeafShape() {
        const shape = new THREE.Shape();
        // Start at stem connection
        shape.moveTo(0, 0);
        // Left side curves (heart shape)
        shape.quadraticCurveTo(-0.25, -0.15, -0.35, -0.4);
        shape.quadraticCurveTo(-0.3, -0.65, -0.15, -0.85);
        shape.quadraticCurveTo(0, -0.95, 0.15, -0.85);
        // Right side
        shape.quadraticCurveTo(0.3, -0.65, 0.35, -0.4);
        shape.quadraticCurveTo(0.25, -0.15, 0, 0);
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
        color: 0x228B22, // Darker green
        shininess: 15,
        side: THREE.DoubleSide
    });
    
    // Left leaf (oriented naturally)
    const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leftLeaf.rotation.z = -Math.PI / 5;
    leftLeaf.position.set(-0.45, 1.1, 0.1);
    leftLeaf.rotation.y = Math.PI / 3;
    leftLeaf.rotation.x = 0.2;
    leavesGroup.add(leftLeaf);
    
    // Right leaf
    const rightLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    rightLeaf.rotation.z = Math.PI / 5;
    rightLeaf.position.set(0.45, 1.1, -0.1);
    rightLeaf.rotation.y = -Math.PI / 3;
    rightLeaf.rotation.x = -0.2;
    leavesGroup.add(rightLeaf);
    
    // Bottom leaf (smaller, behind stem)
    const bottomLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    bottomLeaf.scale.set(0.8, 0.8, 1);
    bottomLeaf.rotation.z = Math.PI;
    bottomLeaf.position.set(0, 0.7, -0.15);
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

// Camera position - better angle to view the pansy
camera.position.set(2.5, 1.8, 4);
camera.lookAt(0, 1, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the entire flower slowly (1 rotation per 120 seconds)
    flowerPlant.rotation.y += 0.005;
    
    // Gentle swaying motion (more natural)
    const time = Date.now() * 0.001;
    flowerPlant.rotation.z = Math.sin(time * 0.5) * 0.04;
    flowerPlant.rotation.x = Math.cos(time * 0.3) * 0.02;
    
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

