<template>
    <button :class="[
    'sky-button',
    'sky-button-' + size,
    'sky-button-'+type+'-' + color,
    ]"
    >
    <slot></slot>
    </button>
</template>

<script lang="ts" src="./button.ts"></script>

<style lang="scss" scoped src="./button.scss"></style>
