<template>
  <section>
    <transition name="fade">
      <slot/>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {

    }
  }
</script>

<style>
</style>