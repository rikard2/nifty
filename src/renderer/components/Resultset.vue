<template>
    <div class="resultset">
        name: {{ value.name }}
    </div>
</template>

<script>
export default {
    name: 'resultset',
    props: ['value'],
    components: {
    },
    beforeMount() {
        console.log('BEFORE mount?');
    },
    methods: {
    }
}
</script>

<style scoped>
    .resultset {
        background: #efefef;
        border-right: 1px solid #e0e0e0;
        width: 100%;
        height: 100%;
        padding: 10px;
    }
</style>