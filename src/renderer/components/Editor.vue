<template>
    <div class="sql-editor">
        <ace-editor :value="content" @input="change" @init="editorInit" lang="sql" theme="tomorrow" class="ace"></ace-editor>
    </div>
</template>

<script>
export default {
    name: 'editor',
    props: ['content'],
    events: ['change'],
    components: {
        aceEditor: require('./ace.js')
    },
    mounted() {
    },
    methods: {
        change: function(c) {
            this.$emit('change', c);
        },
        editorInit: function () {
            require('brace/mode/html')
            require('brace/mode/javascript')    //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            require('./LeGrid/Theme/le.js')
            require('brace/mode/sql')
        }
    }
}
</script>
<style>
</style>
<style>
    .sql-editor {
        position: relative;
        height: 100%;
        width: 100%;
    }
</style>