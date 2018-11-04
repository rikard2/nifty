<template>
    <div class="tabs-component">
        <ul v-for="(t, i) in tabs">
            <li @click="selectTab(t.key)" v-bind:class="{ active: selectedTabKey == t.key }">{{ t.name }}<div>⌘{{ i + 1 }}</div>
                <img :class="{ hidden: !($store.state.query[ $store.state.tab[t.key].queryKey ] || {}).executing }" id="logo" style="margin-left: 4px; margin-right: -2px; margin-top: -4px;" :width="12" :height="12" ref="logo" :src="require(`@/assets/8.gif`)" alt="electron-vue">
        </li>
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
    computed: {
        tabs: function() {
            var state = this.$store.state;
            return Object.keys(state.tab).map(function(key) {
                return {
                    key: key,
                    name: state.tab[key].name
                };
            });
        },
        selectedTabKey: function() {
            return this.$store.state.selectedTabKey;
        }
    },
    mounted: function() {
    },
    methods: {
        selectTab(key) {
            var state = this.$store.state;
            state.selectTab(key);
        }
    }
}
</script>

<style scoped>
.hidden {
    display: none;
}
.spinner {
  width: 10px;
  height: 10px;

  position: relative;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #333;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}

    .tabs-component {
        background: #f4f4f4;
        height: 28px;
    }
    .tabs-component ul {
        list-style: none;
        font-weight: normal;
        font-size: 14px;
    }
    .tabs-component ul li {
        float: left;
        cursor: pointer;
        padding-left: 10px;
        padding-right: 10px;
        height: 28px;
        padding-top: 5px;
        border-bottom: 1px solid #e0e0e0;
        border-right: 1px solid #e0e0e0;
    }
    .tabs-component ul li div {
        display: inline-block;
        position: relative;
        vertical-align: middle;
        margin-left: 7px;
        margin-top: -2px;
        font-size: 10px;
    }
    .tabs-component ul li div span {
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .tabs-component ul li.active {
        background: #fff;
        border-bottom: none;
    }
</style>
