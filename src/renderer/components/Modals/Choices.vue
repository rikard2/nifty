<template>
    <div style="height: 100%;width: 100%;overflow-y: scroll;">
        <input type="text" ref="focustextbox" style="position: absolute;left: -10000px"></input>
        <div v-for="(m, i) in value" class="choice" :class="{ selected: i == selectedIndex }">
            {{ m.label }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Choices',
    props: ['value'],
    event: 'change',
    data: function() {
        return {
            selectedIndex: 0
        }
    },
    components: {
    },
    beforeMount() {
    },
    mounted() {
        var dis = this;
        this.$refs.focustextbox.addEventListener('keydown', function(e) {
            if (e.key == 'ArrowUp') {
                dis.$data.selectedIndex -= 1;
            } else if(e.key == 'ArrowDown') {
                dis.$data.selectedIndex++;
            }
            if (dis.$data.selectedIndex < 0) dis.$data.selectedIndex = dis.value.length - 1;
            if (dis.$data.selectedIndex >= dis.value.length) dis.$data.selectedIndex = 0;

            if (e.key == 'Enter') {
                dis.$emit('onchoice', dis.value[dis.$data.selectedIndex].value);
            }
        });
        this.$refs.focustextbox.focus();
    },
    methods: {
    }
}
</script>

<style scoped>
div.choice {
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
}
div.choice:last-child {
    border-bottom: none;
}
div.choice.selected {
    background: #efefef;
}
</style>