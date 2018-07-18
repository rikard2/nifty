<template>
    <div style="width: 100%;text-align: left;padding: 5px;border-bottom: 1px solid #e0e0e0;">
        <slot></slot>
        <div style="clear:both"></div>
    </div>
</template>

<script>
import ToolbarItem from './ToolbarItem';

export default {
    name: 'toolbar',
    components: {
        toolbarItem: ToolbarItem
    },
    mounted() {
    },
    methods: {
    }
}
</script>
<style>
    img {
        vertical-align: middle;
    }
</style>