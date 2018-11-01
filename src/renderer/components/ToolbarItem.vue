<template>
    <div>
        <div class="icon">
            <img id="logo" @click="click" :class="{ disabled: this.disabled || false }" :width="this.size || 24" :height="this.size || 24" ref="logo" :src="require(`@/assets/icons/` + this.icon + `.svg`)" alt="electron-vue">
        </div>
        <div class="sep"></div>
    </div>
</template>

<script>
export default {
    name: 'toolbarItem',
    props: ['icon', 'size', 'top', 'disabled', 'command'],
    components: {
    },
    mounted() {
        if (this.$refs.logo && this.top) {
            this.$refs.logo.style['padding-top'] = this.top + 'px';
        }
        if (this.size == 24) {
            //this.$refs.logo.style['margin-top'] = '4px';
        }
    },
    methods: {
        click: function() {
            this.$root.nifty.send(this.command);
        }
    }
}
</script>

<style scoped>
    .disabled {
        filter: grayscale(100%);
        opacity: 0.3;
    }
    .icon {
        float: left;
        height: 30px;
        width: 22px;
        height: 24px;
        border-radius: 3px;
        padding-right: 1px;
        text-align: center;
    }
    div.sep {
        float: left;
        width: 1px;
        height: 24px;
        background: #efefef;
        margin-left: 3px;
        margin-right: 3px;
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
