<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  <sky-button @click="handleClick" color="red" size="lg" type="link">aaaa</sky-button>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import {SkyButton} from '../packages'

export default {
  name: 'App',
  components: {
    HelloWorld,
    SkyButton
  },
  methods: {
    handleClick () {
      console.log(1222);
    }
  }
}
</script>
