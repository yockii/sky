<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <sky-button>aaaa</sky-button>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import SkyButton from '../packages/button'

export default {
  name: 'App',
  components: {
    HelloWorld,
    SkyButton
  }
}
</script>
