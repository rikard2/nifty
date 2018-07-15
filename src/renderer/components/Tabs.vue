<template>
    <div class="tabs-component">
        <ul v-for="tab in $store.state.tabs">
            <li @click="selectTab(tab)" v-bind:class="{ active: tab.active }">{{ tab.name }}</li>
        </ul>
    </div>
</template>

<script>
var nifty = require('../nifty');
import Vue from 'vue'

export default {
    name: 'tabs',
    components: {
    },
    mounted: function() {
        if (this.$store.state.tabs.length > 0) {
            var firstTab = this.$store.state.tabs[0];
            this.selectTab(firstTab);
        }
    },
    methods: {
        selectTab(tab) {
            Vue.set(this.$store.state, 'activeTab', tab);
            this.$store.state.tabs.forEach(x => { Vue.set(x, 'active', false) });
            Vue.set(tab, 'active', true);
        }
    }
}
</script>

<style scoped>
    .tabs-component {
        background: #f4f4f4;
        height: 35px;
    }
    .tabs-component ul {
        list-style: none;
        font-weight: normal;
    }
    .tabs-component ul li {
        float: left;
        cursor: pointer;
        padding-left: 10px;
        padding-right: 10px;
        height: 35px;
        padding-top: 7px;
        border-bottom: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
    }
    .tabs-component ul li.active {
        background: #fff;
        border-bottom: none;
    }
</style>