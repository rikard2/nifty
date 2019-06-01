<template>
    <div style="height: 100%;width: 100%;overflow-y: scroll;">
        <input type="text" ref="focustextbox" style="position: absolute;left: -10000px"></input>
        <div class="header">Password</div>
        <div>
            <input v-on:keyup.enter="submit" type="text" ref="password" style="padding: 10px; font-size: 18px;width: 100%;border: 1px solid #e0e0e0; outline: none;"></input>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Password',
    props: ['value'],
    data: function() {
        return {
        }
    },
    components: {
    },
    beforeMount() {
    },
    mounted() {
        this.$refs.password.focus();
    },
    methods: {
        submit() {
            if (this.$refs.password.value.length > 0) {
                console.log('SUBMIT!!!');
                this.$emit('onchoice', this.$refs.password.value);
            }
        }
    }
}
</script>

<style scoped>
div.header {
    padding: 15px;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
}
div.choice {
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
}
div.choice:last-child {
    border-bottom: none;
}
div.choice.selected {
    background: #b7f0ff;
}
</style>
