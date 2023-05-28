<script lang="ts">
  import { degToRad } from 'three/src/math/MathUtils'
  import { GLTF, useGltfAnimations } from '@threlte/extras'
  import { T } from '@threlte/core'

  const { gltf, actions } = useGltfAnimations()
  const model = '/azusa.glb'
  
  $: console.log(actions)


  let idle, walk, jump, kneel, reload, shoot, ulti
  $: if ($gltf) {

    idle = $actions['Normal_Idle']
    walk = $actions['Move_Ing']
    jump = $actions['Move_Jump']
    kneel = $actions['Kneel_Idle']
    reload = $actions['Normal_Reload']
    shoot = $actions['Normal_Attack_Ing']
    ulti = $actions['Exs']

    // for s.hoshino
    // idle = $actions['Normal_Idle02']
    // walk = $actions['Move_Ing02']
    // jump = $actions['Move_Jump02']
    // reload = $actions['Normal_Reload02']
    // shoot = $actions['Normal_Attack02_Ing']
  }

  let keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    ' ': false,
    'c': false,
    'r': false,
    'lmb': false,
    'x': false,
  }

  onkeydown = e => {
    // console.log(e.key)
    if (e.key in keys) {
      if (!keys[e.key]) {
        keys[e.key] = true
      }
    }
  }

  onkeyup = e => {
    if (e.key in keys) {
      keys[e.key] = false
    }
  }

  onmousedown = e => {
    keys.lmb = true
  }

  onmouseup = e => {
    keys.lmb = false
  }

  $: isMove = keys.w || keys.a || keys.s || keys.d
  $: isJump = keys[' ']
  $: isKneel = keys.c
  $: isReload = keys.r
  $: isShoot = keys.lmb
  $: isUlti = keys.x

  let curr

  $: if (walk) {
    if (isMove) {
      curr = walk
      curr.enabled = true
      idle.crossFadeTo(curr, 0.15, true)
      curr.play()
    } else {
      curr = idle
      curr.enabled = true
      walk.crossFadeTo(curr, 0.15, true)
      curr.play()
    }

    if (isShoot) {
      shoot.enabled = true
      curr.crossFadeTo(shoot, 0.15, true)
      shoot.play()
    } else {
      curr.enabled = true
      shoot.crossFadeTo(curr, 0.15, true)
      curr.play()
    }

    if (isKneel) {
      kneel.play()
    } else {
      kneel.stop()
    }

    if (isReload) {
      reload.repetitions = 1
      reload.play().reset()
    }

    if (isJump) {
      jump.repetitions = 1
      jump.play().reset()
    }

    if (isUlti) {
      ulti.repetitions = 1
      ulti.play().reset()
    }
  }

  const lerp = (a, b, t) => {
    const da = (b - a) % (Math.PI * 2)
    return a + (2 * da % (Math.PI * 2) - da) * t
  }

  let x = 0, y = 0, z = 0, r = 0, cr = 0
  const update = () => {
    requestAnimationFrame(update)
    if ($gltf) {
      const char = $gltf.scene.children[0]

      if (keys.s) z += 0.01, r = Math.PI*0
      if (keys.a) x -= 0.01, r = Math.PI*0.5
      if (keys.w) z -= 0.01, r = Math.PI*1
      if (keys.d) x += 0.01, r = Math.PI*1.5
      if (keys.s && keys.a)  r = Math.PI*0.25
      if (keys.w && keys.a)  r = Math.PI*0.75
      if (keys.w && keys.d)  r = Math.PI*1.25
      if (keys.s && keys.d)  r = Math.PI*1.75

      cr = lerp(cr, r, 0.1)

      char.position.set(x, y, z)
      char.rotation.set(degToRad(90), 0, cr)
    }
  }
  update()

</script>

<GLTF 
  bind:gltf={ $gltf }
  url={ model }
/>

<T.HemisphereLight args={[0xffeecc, 0x080820, 4]}/>

<T.PerspectiveCamera
  makeDefault
  fov={50}
  position={ [0, 2, 3] }
  on:create={({ ref }) => {
    ref.lookAt(0, 0, 0)
  }}
/>