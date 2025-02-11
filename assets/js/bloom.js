
AFRAME.registerComponent('bloom', {
  schema: {
    color: { default: 'white' },
    type: { default: 'box' },
    offset: {default: ['0 0 0']},
    scale: {default: ['1 1 1']},
    rotate: {default: ['0 0 0']}
  },

  init: function () {
    this.pointLight = new THREE.PointLight(this.data.color, 1, this.el.object3D.scale.x*50, 0);
    this.hemisphereLight = new THREE.HemisphereLight('x0ffffff', 'transparent', 1);
    this.bloomCount = Math.floor(1 / 0.05);
    // this.const opacity = 1 - Math.pow(i * 0.05, 0.1);
    this.createSceneElements();
  },

  createSceneElements: function () {
    var thisModel = this.el;
    let dataSchema = this.data;
    let geometry;

    if (dataSchema.type === 'box') {
      geometry = new THREE.BoxGeometry(...this.el.object3D.scale.toArray());
    } else if (dataSchema.type === 'sphere') {
      const radius = this.el.getAttribute('geometry').radius;
      if (!radius) {
        console.warn('Please set radius for sphere');
        return;
      }
      geometry = new THREE.SphereGeometry(radius, 360, 360);
    } else if (dataSchema.type === 'model') {
      this.pointLight = new THREE.PointLight(this.data.color, 0.5, this.el.object3D.scale.x*50, 0);
      this.hemisphereLight = new THREE.HemisphereLight(this.data.color, 'transparent', 0.5);
      // this.ambientLight = new THREE.AmbientLight('X0ffffff', 0.1);

      const clonedModelGeometry = this.el.getAttribute('src');
      const degreesToRadians = degrees => degrees * (Math.PI / 180);
      const baseScale = new THREE.Vector3(
        parseFloat(dataSchema.scale[0].split(' ')[0]),
        parseFloat(dataSchema.scale[0].split(' ')[1]),
        parseFloat(dataSchema.scale[0].split(' ')[2])
      );
      const baseoffset = new THREE.Vector3(
        parseFloat(dataSchema.offset[0].split(' ')[0]),
        parseFloat(dataSchema.offset[0].split(' ')[1]),
        parseFloat(dataSchema.offset[0].split(' ')[2])
      );
      const baseRotation = new THREE.Euler(
        degreesToRadians(dataSchema.rotate[0].split(' ')[0]),
        degreesToRadians(dataSchema.rotate[0].split(' ')[1]),
        degreesToRadians(dataSchema.rotate[0].split(' ')[2])
      );

      // console.log(dataSchema.offset[0].split(' '));

      const emptyMaterial = new THREE.MeshBasicMaterial({
        color: dataSchema.color,
        opacity: 0.01,
        transparent: true
      });
      emptyMaterial.side = THREE.DoubleSide;
      emptyMaterial.depthWrite = false;

      for (let i = 0; i < this.bloomCount*1.2; i++) {
        const bloomScale = 1 + i * 0.05;
        // console.log(bloomScale);

        const clonedModelEntity = document.createElement('a-gltf-model');
        clonedModelEntity.setAttribute('src', clonedModelGeometry);

        if (i === (this.bloomCount - 1)) {
          clonedModelEntity.addEventListener('loaded', () => {
            clonedModelEntity.object3D.add(this.pointLight, this.hemisphereLight);
          });
        }

        function onModelLoaded() {
          clonedModelEntity.object3D.scale.copy(baseScale).multiplyScalar(bloomScale);
          if(baseoffset.x > 0 || baseoffset.y > 0 || baseoffset.z > 0){
            
          console.log(baseoffset);
            clonedModelEntity.object3D.offset.copy(baseoffset);
          }

          clonedModelEntity.object3D.traverse((child) => {
            if (child.isMesh) {
              child.material = emptyMaterial;
            }
          });
        }

        clonedModelEntity.addEventListener('model-loaded', onModelLoaded);

        this.el.appendChild(clonedModelEntity);
      }

    } else {
      console.warn('Unknown type:', dataSchema.type);
      return;
    }

    if(dataSchema.type !== 'model'){
      this.el.object3D.add(this.pointLight, this.hemisphereLight);
      
      for (let i = 0; i < this.bloomCount; i++) {
        const bloomScale = 1 + i * 0.025;

        const material = new THREE.MeshBasicMaterial({
          color: dataSchema.color,
          transparent: true,
          opacity: 0.025
        });

        material.metalness = 0;
        material.roughness = 0;
        material.depthWrite = false;

        if(i === 0){
          material.opacity = 1;
        }

        const bloom = new THREE.Mesh(geometry.clone(), material);
        bloom.scale.copy(this.el.object3D.scale).multiplyScalar(bloomScale);

        this.el.object3D.add(bloom);
      }
    }
  }
});