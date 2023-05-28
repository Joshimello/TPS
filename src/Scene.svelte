<script>
  import { GLTF, useGltfAnimations, useTexture } from '@threlte/extras'
  import { T, useFrame, useThrelte } from '@threlte/core'
  import { Raycaster } from 'three/src/core/Raycaster'
  import { degToRad } from 'three/src/math/MathUtils'
  import { Vector3 } from 'three/src/math/Vector3'
  import { Vector2 } from 'three/src/math/Vector2'

  const { gltf, actions } = useGltfAnimations()
  const { camera } = useThrelte()
  const texFloor = useTexture('floor.jpg')

  $: animWalk = $actions['Move_Ing']
  $: animIdle = $actions['Normal_Idle']
  $: animShoot = $actions['Normal_Attack_Ing']
  $: animReload = $actions['Normal_Reload']

  let keys = {
    'w': false,
    's': false,
    'a': false,
    'd': false,
    'r': false,
    'L': false
  }

  onkeydown = e => {
    if (e.repeat) return
    if (keys[e.key] == false){
      keys[e.key] = true
    }
  }

  onkeyup = e => {
    if (keys[e.key] == true){
      keys[e.key] = false
    }
  }

  onmousedown = e => keys.L = true
  onmouseup = e => keys.L = false

  // const pointer = new Vector2()
  // const raycaster = new Raycaster()

  // onmousemove = e => {
  //   pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  //   pointer.y = (e.clinetY / window.innerHight) * 2 - 1

  //   raycaster.setFromCamera(pointer, camera)
  // }


  let animNow = undefined

  $: isWalk = (keys.w || keys.a || keys.s || keys.d) && !keys.L
  $: if (animWalk) {
    if (animNow != animWalk && isWalk) {
      animNow = animWalk
      animNow.enabled = true
      animIdle.crossFadeTo(animNow, 0.15, true)
      animNow.play()
    } else {
      animNow = animIdle
      animNow.enabled = true
      animWalk.crossFadeTo(animNow, 0.15, true)
      animNow.play()
    }
  }

  $: isShoot = keys.L
  $: if (animShoot) {
    if (isShoot) {
      animShoot.enabled = true
      animNow.crossFadeTo(animShoot, 0.15, true)
      animShoot.play()
    } else {
      animNow.enabled = true
      animShoot.crossFadeTo(animNow, 0.15, true)
      animNow.play()
    }
  }

  $: isReload = keys.r
  $: if (animShoot) {
    if (isReload){
      animReload.repetitions = 1
      animReload.play().reset()
    }
  }

  const lerp = (a, b, t) => {
    const da = (b - a) % (Math.PI * 2)
    return a + (2 * da % (Math.PI * 2) - da) * t
  }

  let r = 0, rr = 0
  useFrame(({ camera }, delta) => {
    if ($gltf) {
      const char = $gltf.scene.children[0]
      camera.current.lookAt(char.position)

      let x = 0, z = 0
      if (keys.s) z =  0.01, r = Math.PI*0.0
      if (keys.a) x = -0.01, r = Math.PI*0.5
      if (keys.w) z = -0.01, r = Math.PI*1.0
      if (keys.d) x =  0.01, r = Math.PI*1.5
      if (keys.s && keys.a) x = -0.007, z =  0.007, r = Math.PI*0.25
      if (keys.w && keys.a) x = -0.007, z = -0.007, r = Math.PI*0.75
      if (keys.w && keys.d) x =  0.007, z = -0.007, r = Math.PI*1.25
      if (keys.s && keys.d) x =  0.007, z =  0.007, r = Math.PI*1.75
      if (keys.L) x = 0, z = 0

      rr = lerp(rr, r, 0.1)

      char.rotation.set(degToRad(90), 0, rr)
      char.position.add(new Vector3(x, 0, z))
    }
  })

</script>

<GLTF bind:gltf={$gltf} url={$$props.model}/>
<T.HemisphereLight args={[0xffeecc, 0x080820, 2]}/>
<T.Mesh position={[0, -0.1, 0]}>
  <T.BoxGeometry args={[5, 0.1, 5]}/>
  {#await texFloor then tex}
  <T.MeshStandardMaterial map={tex}/>
  {/await}
</T.Mesh>

<T.PerspectiveCamera makeDefault fov={50} position={[0, 2, 4]}/>