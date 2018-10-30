<template>
    <div class="tree-view">
        {{ this.folders }}
    </div>
</template>

<script>
export default {
    name: 'tree-view',
    data() {
        return {
            folders: ['schema']
        };
    },
    components: {
    },
    methods: {
    }
}
</script>

<style scoped>
    .tree-view {
        font-size: 14px;
        text-align: left;
        padding: 5px;
        padding-left: 10px;
        width: 100%;
        height: 100%;
    }
</style>
