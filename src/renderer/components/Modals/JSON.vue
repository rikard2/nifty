<template>
    <div style="height: 100%;width: 100%;overflow-y: scroll;padding: 10px;">
        <pre style="width: 100%; height: 100%;font-family: Menlo;font-size: 12px;">{{ JSON.stringify(value, null, '    ') }}</pre>
    </div>
</template>

<script>
export default {
    name: 'JSON',
    props: ['value'],
    components: {
    },
    beforeMount() {
        console.log('Lookup BEFORE mount?');
    },
    methods: {
    }
}
</script>

<style scoped>
</style>