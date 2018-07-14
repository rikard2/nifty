<template>
    <div class="editor">
        <ace-editor v-model="editor_content" @init="editorInit" lang="sql" theme="tomorrow" class="ace"></ace-editor>
    </div>
</template>

<script>
export default {
    name: 'editor',
    components: {
        aceEditor: require('./ace.js')
    },
    data () {
        return {
            editor_content: 'lool'
        }
    },
    methods: {
        editorInit: function () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')
            require('brace/mode/javascript')    //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            require('./LeGrid/Theme/le.js')
            require('brace/snippets/javascript') //snippet
            require('brace/mode/sql')
        }
    }
}
</script>
<style>
</style>
<style scoped>
    .editor {
    }
</style>