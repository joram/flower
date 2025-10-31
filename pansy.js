import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB, 1);
renderer.setPixelRatio(window.devicePixelRatio); // Better quality on high-DPI displays
renderer.shadowMap.enabled = false; // Shadows disabled for performance but ready if needed
document.getElementById('container').appendChild(renderer.domElement);

// Lighting - realistic pansy lighting with PBR support
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Main directional light (sun) - stronger for realism
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = false;
scene.add(directionalLight);

// Fill light for softer shadows
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-4, 6, -4);
scene.add(fillLight);

// Subtle rim light for depth
const rimLight = new THREE.PointLight(0xffffff, 0.5);
rimLight.position.set(-3, 4, -3);
scene.add(rimLight);

// Hemisphere light for natural sky lighting
const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x4A5D23, 0.3);
scene.add(hemisphereLight);

// Color configuration - more vibrant pansy colors
const colors = {
    upperPetals: new THREE.Color(0x9370DB), // Purple
    lateralPetals: new THREE.Color(0x9370DB), // Purple (can be different)
    lowerPetal: new THREE.Color(0x9370DB), // Purple
    facePattern: new THREE.Color(0x2F1B4D), // Very dark purple/black for contrast
    center: new THREE.Color(0xFFD700) // Gold/yellow center
};

// Create pot - more realistic terracotta
function createPot() {
    const potGroup = new THREE.Group();
    
    // Pot body (truncated cone with more segments)
    const potGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 32);
    const potMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        metalness: 0.1,
        roughness: 0.85,
        flatShading: false
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -1.5;
    potGroup.add(pot);
    
    // Pot rim (more detailed)
    const rimGeometry = new THREE.TorusGeometry(0.8, 0.06, 16, 32);
    const rimMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        metalness: 0.1,
        roughness: 0.8
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.position.y = -0.9;
    potGroup.add(rim);
    
    // Inner rim detail
    const innerRimGeometry = new THREE.TorusGeometry(0.75, 0.02, 8, 32);
    const innerRim = new THREE.Mesh(innerRimGeometry, rimMaterial);
    innerRim.position.y = -0.88;
    potGroup.add(innerRim);
    
    return potGroup;
}

// Create stem - more realistic
function createStem() {
    const stemGeometry = new THREE.CylinderGeometry(0.032, 0.028, 2, 16);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        metalness: 0.0,
        roughness: 0.9
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.5;
    return stem;
}

// Create pansy flower with 5 petals
function createPansy() {
    const flowerGroup = new THREE.Group();
    
    // Upper petal shape - based on real pansy proportions
    // Upper petals are typically smaller and more rounded than lower petal
    function createUpperPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        // More accurate upper petal shape - wider at top, narrower at base
        shape.quadraticCurveTo(0.1, -0.1, 0.25, -0.25);
        shape.quadraticCurveTo(0.35, -0.38, 0.42, -0.5);
        shape.quadraticCurveTo(0.48, -0.6, 0.52, -0.68);
        shape.quadraticCurveTo(0.54, -0.74, 0.52, -0.78);
        shape.quadraticCurveTo(0.48, -0.8, 0.4, -0.82);
        shape.quadraticCurveTo(0.28, -0.83, 0.15, -0.84);
        // Top center - slight indent
        shape.quadraticCurveTo(0.08, -0.85, 0, -0.85);
        // Other side - mirror
        shape.quadraticCurveTo(-0.08, -0.85, -0.15, -0.84);
        shape.quadraticCurveTo(-0.28, -0.83, -0.4, -0.82);
        shape.quadraticCurveTo(-0.48, -0.8, -0.52, -0.78);
        shape.quadraticCurveTo(-0.54, -0.74, -0.52, -0.68);
        shape.quadraticCurveTo(-0.48, -0.6, -0.42, -0.5);
        shape.quadraticCurveTo(-0.35, -0.38, -0.25, -0.25);
        shape.quadraticCurveTo(-0.1, -0.1, 0, 0);
        return shape;
    }
    
    // Lower petal shape - largest petal, more rounded with pronounced curves
    // Based on real pansy: lower petal is 1.5-2x larger than upper petals
    function createLowerPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        // Wider, more rounded bottom petal - realistic proportions
        shape.quadraticCurveTo(0.18, 0.1, 0.35, 0.25);
        shape.quadraticCurveTo(0.5, 0.42, 0.6, 0.6);
        shape.quadraticCurveTo(0.68, 0.75, 0.72, 0.88);
        shape.quadraticCurveTo(0.74, 1.0, 0.72, 1.12);
        shape.quadraticCurveTo(0.68, 1.22, 0.6, 1.28);
        shape.quadraticCurveTo(0.48, 1.32, 0.35, 1.34);
        shape.quadraticCurveTo(0.2, 1.35, 0, 1.35);
        // Other side
        shape.quadraticCurveTo(-0.2, 1.35, -0.35, 1.34);
        shape.quadraticCurveTo(-0.48, 1.32, -0.6, 1.28);
        shape.quadraticCurveTo(-0.68, 1.22, -0.72, 1.12);
        shape.quadraticCurveTo(-0.74, 1.0, -0.72, 0.88);
        shape.quadraticCurveTo(-0.68, 0.75, -0.6, 0.6);
        shape.quadraticCurveTo(-0.5, 0.42, -0.35, 0.25);
        shape.quadraticCurveTo(-0.18, 0.1, 0, 0);
        return shape;
    }
    
    // Lateral petal shape - oval, elongated, pointing outward
    // Lateral petals are typically narrower than lower but wider than upper
    function createLateralPetalShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        // More elongated oval shape for lateral petals
        shape.quadraticCurveTo(0.3, 0.04, 0.48, 0.25);
        shape.quadraticCurveTo(0.58, 0.42, 0.62, 0.6);
        shape.quadraticCurveTo(0.6, 0.72, 0.52, 0.78);
        shape.quadraticCurveTo(0.4, 0.82, 0.25, 0.8);
        shape.quadraticCurveTo(0.1, 0.75, -0.05, 0.8);
        shape.quadraticCurveTo(-0.25, 0.82, -0.4, 0.78);
        shape.quadraticCurveTo(-0.52, 0.72, -0.6, 0.6);
        shape.quadraticCurveTo(-0.62, 0.42, -0.58, 0.25);
        shape.quadraticCurveTo(-0.48, 0.04, -0.3, 0);
        shape.quadraticCurveTo(-0.1, 0, 0, 0);
        return shape;
    }
    
    const petalSettings = {
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.025,
        steps: 4,
        curveSegments: 48 // More segments for smoother curves
    };
    
    // Upper two petals (overlapping)
    const upperPetalShape = createUpperPetalShape();
    const upperPetalGeometry = new THREE.ExtrudeGeometry(upperPetalShape, petalSettings);
    
    // Create PBR material for petals (more realistic with subtle color variation)
    function createPetalMaterial(baseColor, variation = 0) {
        const color = new THREE.Color(baseColor);
        // Add subtle color variation for realism
        if (variation !== 0) {
            const hsl = { h: 0, s: 0, l: 0 };
            color.getHSL(hsl);
            hsl.h += variation * 0.05; // Slight hue shift
            hsl.s += variation * 0.1; // Slight saturation variation
            hsl.l += variation * 0.05; // Slight lightness variation
            color.setHSL(hsl.h, Math.max(0, Math.min(1, hsl.s)), Math.max(0, Math.min(1, hsl.l)));
        }
        return new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.05,
            roughness: 0.75,
            transparent: true,
            opacity: 0.94,
            side: THREE.DoubleSide
        });
    }
    
    // Upper petals should overlap slightly - more realistic arrangement
    // Left upper petal
    const upperLeft = new THREE.Mesh(
        upperPetalGeometry,
        createPetalMaterial(colors.upperPetals, -0.1)
    );
    upperLeft.rotation.z = Math.PI / 3.2; // Slightly more overlap
    upperLeft.position.set(-0.2, 0.28, 0.02); // Slightly forward for overlap
    upperLeft.rotation.y = Math.PI / 2;
    upperLeft.rotation.x = 0.15; // More tilt for natural look
    flowerGroup.add(upperLeft);
    
    // Right upper petal (overlapping with left)
    const upperRight = new THREE.Mesh(
        upperPetalGeometry.clone(),
        createPetalMaterial(colors.upperPetals, 0.1)
    );
    upperRight.rotation.z = -Math.PI / 3.2; // Slightly more overlap
    upperRight.position.set(0.2, 0.28, -0.02); // Slightly back for overlap
    upperRight.rotation.y = Math.PI / 2;
    upperRight.rotation.x = -0.15; // More tilt
    flowerGroup.add(upperRight);
    
    // Lateral petals (left and right)
    const lateralPetalShape = createLateralPetalShape();
    const lateralPetalGeometry = new THREE.ExtrudeGeometry(lateralPetalShape, petalSettings);
    
    // Lateral petals - should extend outward more naturally
    // Left lateral petal
    const lateralLeft = new THREE.Mesh(
        lateralPetalGeometry,
        createPetalMaterial(colors.lateralPetals, -0.15)
    );
    lateralLeft.rotation.z = Math.PI / 2.1; // More horizontal
    lateralLeft.position.set(-0.7, 0.05, 0); // Further out
    lateralLeft.rotation.y = Math.PI / 2;
    lateralLeft.rotation.x = 0.2; // Curve outward more
    flowerGroup.add(lateralLeft);
    
    // Right lateral petal
    const lateralRight = new THREE.Mesh(
        lateralPetalGeometry.clone(),
        createPetalMaterial(colors.lateralPetals, 0.15)
    );
    lateralRight.rotation.z = -Math.PI / 2.1; // More horizontal
    lateralRight.position.set(0.7, 0.05, 0); // Further out
    lateralRight.rotation.y = Math.PI / 2;
    lateralRight.rotation.x = -0.2; // Curve outward more
    flowerGroup.add(lateralRight);
    
    // Lower petal (largest, with face pattern)
    const lowerPetalShape = createLowerPetalShape();
    const lowerPetalGeometry = new THREE.ExtrudeGeometry(lowerPetalShape, petalSettings);
    
    // Lower petal - largest, most prominent with face pattern
    const lowerPetal = new THREE.Mesh(
        lowerPetalGeometry, 
        createPetalMaterial(colors.lowerPetal, 0.05)
    );
    lowerPetal.rotation.z = Math.PI;
    lowerPetal.position.set(0, -0.52, 0); // Slightly lower
    lowerPetal.rotation.y = Math.PI / 2;
    lowerPetal.rotation.x = 0.3; // More forward curve for realism
    flowerGroup.add(lowerPetal);
    
    // Add subtle petal veins radiating from center
    for (let i = 0; i < 7; i++) {
        const veinAngle = (i / 7) * Math.PI * 2;
        const veinLength = 0.65;
        const veinGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.52, 0.095),
            new THREE.Vector3(
                Math.cos(veinAngle) * veinLength, 
                -0.52 + Math.sin(veinAngle) * (veinLength * 0.6), 
                0.095
            )
        ]);
        const veinMaterial = new THREE.LineBasicMaterial({ 
            color: colors.lowerPetal,
            transparent: true,
            opacity: 0.12,
            linewidth: 1
        });
        const vein = new THREE.Line(veinGeometry, veinMaterial);
        flowerGroup.add(vein);
    }
    
    // Face pattern - more realistic pansy face
    // Dark center ellipse with gradient effect
    const facePatternShape = new THREE.Shape();
    facePatternShape.ellipse(0, 0, 0.38, 0.28, 0, Math.PI * 2, false);
    const facePatternExtrude = new THREE.ExtrudeGeometry(facePatternShape, {
        depth: 0.018,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.012,
        curveSegments: 32
    });
    const facePatternMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.facePattern,
        metalness: 0.15,
        roughness: 0.85,
        transparent: true,
        opacity: 0.92
    });
    const facePattern = new THREE.Mesh(facePatternExtrude, facePatternMaterial);
    facePattern.position.set(0, -0.47, 0.07);
    facePattern.rotation.y = Math.PI / 2;
    flowerGroup.add(facePattern);
    
    // Primary radiating lines (8 main veins)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -0.47, 0.095),
            new THREE.Vector3(Math.cos(angle) * 0.62, -0.47 + Math.sin(angle) * 0.38, 0.095)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colors.facePattern,
            transparent: true,
            opacity: 0.85,
            linewidth: 2
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        flowerGroup.add(line);
    }
    
    // Secondary radiating pattern (16 finer lines)
    for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(Math.cos(angle) * 0.18, -0.47 + Math.sin(angle) * 0.12, 0.075),
            new THREE.Vector3(Math.cos(angle) * 0.45, -0.47 + Math.sin(angle) * 0.28, 0.075)
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colors.facePattern,
            transparent: true,
            opacity: 0.5,
            linewidth: 1
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        flowerGroup.add(line);
    }
    
    // Center of flower (pistil) - more detailed
    const pistilGeometry = new THREE.ConeGeometry(0.08, 0.2, 16);
    const pistilMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.center,
        metalness: 0.3,
        roughness: 0.4
    });
    const pistil = new THREE.Mesh(pistilGeometry, pistilMaterial);
    pistil.position.y = 0.05;
    pistil.rotation.x = Math.PI;
    flowerGroup.add(pistil);
    
    // Base of pistil (wider)
    const pistilBaseGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pistilBase = new THREE.Mesh(pistilBaseGeometry, pistilMaterial);
    pistilBase.position.y = 0.05;
    flowerGroup.add(pistilBase);
    
    // Add realistic stamens around center (more detail)
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.09 + (i % 2) * 0.02; // Vary radius
        
        // Stamen filament
        const stamenGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8);
        const stamenMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFE55C,
            metalness: 0.1,
            roughness: 0.9
        });
        const stamen = new THREE.Mesh(stamenGeometry, stamenMaterial);
        stamen.position.set(Math.cos(angle) * radius, 0.12, Math.sin(angle) * radius);
        stamen.rotation.z = Math.PI / 6;
        flowerGroup.add(stamen);
        
        // Anther (pollen sac) at top of stamen
        const antherGeometry = new THREE.SphereGeometry(0.015, 8, 8);
        const antherMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFA500,
            metalness: 0.2,
            roughness: 0.7
        });
        const anther = new THREE.Mesh(antherGeometry, antherMaterial);
        anther.position.set(
            Math.cos(angle) * radius, 
            0.21, 
            Math.sin(angle) * radius
        );
        flowerGroup.add(anther);
    }
    
    flowerGroup.position.y = 2.5;
    return flowerGroup;
}

// Create pansy leaves (heart-shaped/ovate - more realistic)
function createPansyLeaves() {
    const leavesGroup = new THREE.Group();
    
    // Heart-shaped/ovate leaf with better proportions - more realistic pansy leaf
    function createHeartLeafShape() {
        const shape = new THREE.Shape();
        // Start at stem connection (narrower base)
        shape.moveTo(0, 0);
        // Left side curves (more pronounced heart shape)
        shape.quadraticCurveTo(-0.2, -0.12, -0.3, -0.35);
        shape.quadraticCurveTo(-0.28, -0.6, -0.15, -0.8);
        shape.quadraticCurveTo(0, -0.92, 0.15, -0.8);
        // Right side
        shape.quadraticCurveTo(0.28, -0.6, 0.3, -0.35);
        shape.quadraticCurveTo(0.2, -0.12, 0, 0);
        return shape;
    }
    
    const leafShape = createHeartLeafShape();
    const leafGeometry = new THREE.ExtrudeGeometry(leafShape, {
        depth: 0.025,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.01,
        curveSegments: 24
    });
    const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22, // Darker green
        metalness: 0.0,
        roughness: 0.85,
        side: THREE.DoubleSide
    });
    
    // Function to add leaf veins
    function addLeafVeins(leaf, position, rotation) {
        for (let i = 0; i < 3; i++) {
            const veinAngle = (i - 1) * 0.3;
            const veinGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(position.x, position.y, position.z + 0.03),
                new THREE.Vector3(
                    position.x + Math.cos(veinAngle) * 0.3, 
                    position.y - 0.4 + Math.sin(veinAngle) * 0.2, 
                    position.z + 0.03
                )
            ]);
            const veinMaterial = new THREE.LineBasicMaterial({ 
                color: 0x1a6b1a,
                transparent: true,
                opacity: 0.3,
                linewidth: 1
            });
            const vein = new THREE.Line(veinGeometry, veinMaterial);
            vein.rotation.z = rotation.z;
            vein.rotation.y = rotation.y;
            vein.rotation.x = rotation.x;
            leavesGroup.add(vein);
        }
    }
    
    // Pansy leaves grow in a basal rosette - more clustered at base, less staggered
    // Vary leaf sizes slightly for natural look
    const baseY = 0.8; // Base height for most leaves
    
    // Left leaf (oriented naturally, at base)
    const leftLeaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leftLeaf.scale.set(1.0, 1.0, 1);
    leftLeaf.rotation.z = -Math.PI / 3.5;
    leftLeaf.position.set(-0.32, baseY, 0.12); // Lower, closer to base
    leftLeaf.rotation.y = Math.PI / 5;
    leftLeaf.rotation.x = 0.1;
    leavesGroup.add(leftLeaf);
    addLeafVeins(leftLeaf, leftLeaf.position, leftLeaf.rotation);
    
    // Right leaf (opposite side, similar height)
    const rightLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    rightLeaf.scale.set(0.95, 0.95, 1); // Slightly smaller for variation
    rightLeaf.rotation.z = Math.PI / 3.5;
    rightLeaf.position.set(0.32, baseY, -0.12); // Same height as left leaf
    rightLeaf.rotation.y = -Math.PI / 5;
    rightLeaf.rotation.x = -0.1;
    leavesGroup.add(rightLeaf);
    addLeafVeins(rightLeaf, rightLeaf.position, rightLeaf.rotation);
    
    // Front leaf (facing camera, slightly lower)
    const frontLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    frontLeaf.scale.set(0.92, 0.92, 1);
    frontLeaf.rotation.z = Math.PI / 12;
    frontLeaf.position.set(0.2, baseY - 0.05, 0.18); // Slightly lower, in front
    frontLeaf.rotation.y = -Math.PI / 8;
    frontLeaf.rotation.x = 0.08;
    leavesGroup.add(frontLeaf);
    addLeafVeins(frontLeaf, frontLeaf.position, frontLeaf.rotation);
    
    // Back leaf (behind stem, slightly lower)
    const backLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    backLeaf.scale.set(0.88, 0.88, 1);
    backLeaf.rotation.z = -Math.PI / 12;
    backLeaf.position.set(-0.2, baseY - 0.08, -0.15); // Behind stem, slightly lower
    backLeaf.rotation.y = Math.PI / 8;
    backLeaf.rotation.x = -0.08;
    leavesGroup.add(backLeaf);
    addLeafVeins(backLeaf, backLeaf.position, backLeaf.rotation);
    
    // Optional: Add one more small leaf for fuller rosette
    const smallLeaf = new THREE.Mesh(leafGeometry.clone(), leafMaterial);
    smallLeaf.scale.set(0.75, 0.75, 1);
    smallLeaf.rotation.z = Math.PI / 6;
    smallLeaf.position.set(-0.25, baseY - 0.12, 0.08);
    smallLeaf.rotation.y = Math.PI / 6;
    smallLeaf.rotation.x = 0.05;
    leavesGroup.add(smallLeaf);
    addLeafVeins(smallLeaf, smallLeaf.position, smallLeaf.rotation);
    
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

// Camera position - side view to see the flower better
camera.position.set(0, 1.5, 6);
camera.lookAt(0, 1.5, 0);

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

// Color customization functions (exposed globally)
window.applyColors = function() {
    const upperColor = document.getElementById('upperColor').value;
    const lateralColor = document.getElementById('lateralColor').value;
    const lowerColor = document.getElementById('lowerColor').value;
    const faceColor = document.getElementById('faceColor').value;
    
    // Update color objects
    colors.upperPetals.setStyle(upperColor);
    colors.lateralPetals.setStyle(lateralColor);
    colors.lowerPetal.setStyle(lowerColor);
    colors.facePattern.setStyle(faceColor);
    
    // Update petal materials - need to check each child properly
    let petalIndex = 0;
    pansy.children.forEach((child) => {
        if (child.type === 'Mesh' && child.material) {
            // Upper petals (first two petals)
            if (petalIndex < 2) {
                child.material.color.setStyle(upperColor);
                petalIndex++;
            }
            // Lateral petals (next two)
            else if (petalIndex < 4) {
                child.material.color.setStyle(lateralColor);
                petalIndex++;
            }
            // Lower petal (index 4)
            else if (petalIndex === 4) {
                child.material.color.setStyle(lowerColor);
                petalIndex++;
            }
            // Face pattern ellipse
            else if (child.material.color.getHex() === colors.facePattern.getHex() || 
                     child.material.opacity === 0.9) {
                child.material.color.setStyle(faceColor);
            }
            // Face pattern lines (all lines)
            else if (child.type === 'Line') {
                child.material.color.setStyle(faceColor);
            }
        }
    });
    
    // Update text inputs
    document.getElementById('upperColorText').value = upperColor;
    document.getElementById('lateralColorText').value = lateralColor;
    document.getElementById('lowerColorText').value = lowerColor;
    document.getElementById('faceColorText').value = faceColor;
};

window.resetColors = function() {
    document.getElementById('upperColor').value = '#9370DB';
    document.getElementById('lateralColor').value = '#9370DB';
    document.getElementById('lowerColor').value = '#9370DB';
    document.getElementById('faceColor').value = '#2F1B4D';
    window.applyColors();
};

// Sync color picker with text input (wait for DOM)
function setupColorInputs() {
    ['upperColor', 'lateralColor', 'lowerColor', 'faceColor'].forEach(id => {
        const colorInput = document.getElementById(id);
        const textInput = document.getElementById(id + 'Text');
        
        if (colorInput && textInput) {
            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
            });
            
            textInput.addEventListener('input', function() {
                if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                    colorInput.value = this.value;
                }
            });
        }
    });
}

// Setup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupColorInputs);
} else {
    setupColorInputs();
}

