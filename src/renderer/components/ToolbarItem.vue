<template>
    <div class="icon">
        <img id="logo" ref="logo" :src="require(`@/assets/icons/` + this.icon + `.png`)" alt="electron-vue">
    </div>
</template>

<script>
export default {
    name: 'toolbarItem',
    props: ['icon', 'size'],
    components: {
    },
    mounted() {
        if (this.size == 24) {
            this.$refs.logo.style['margin-top'] = '4px';
        }
    },
    methods: {
    }
}
</script>

<style scoped>
    .icon {
        float: left;
        height: 30px;
        width: 32px;
        border-radius: 3px;
        margin-right: 5px;
        padding-right: 5px;
        border-right: 1px solid #efefef;
        text-align: center;
    }
    .icon:hover {
        background: #efefef;
        cursor: pointer;
    }
    img {
    }
    img:hover {

    }
</style>