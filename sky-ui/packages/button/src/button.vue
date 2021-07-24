<template>
    <button :class="[
    'sky_button--' + type
    ]">
    </button>
</template>

<script>
export default {
    name: 'sky-button',
    props: {
        type: {
            type: String,
            default: 'default',
        }
    }
}
</script>
