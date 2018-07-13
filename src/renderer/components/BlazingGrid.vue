<template>
    <div style="width: 100%; height: 100%;">
        <canvas ref="can" width="1360" height="480" style="width: 680px; height: 240px;border: 1px solid #e0e0e0;"></canvas>
    </div>
</template>

<script>
export default {
    name: 'blazingGrid',
    data: function() {
        return {
            ctx: null,
            colors: {
                column_bg: 'rgb(240, 240, 240)',
                border: 'rgb(230, 230, 230)'
            }
        };
    },
    mounted() {
        var x = 680 / 1360;
        var y = 480 / 240;
        var canvas = this.$refs.can;
        var ctx = canvas.getContext('2d');
        this.ctx = ctx;

        this.drawRect(0, 0, 1360, 40, 'column_bg');
        this.drawLine(0, 40, 1360, 40, 'border');
        this.drawText(10, 25, 'Germanz');


    },
    components: {
    },
    methods: {
        drawRect(x, y, w, h, color) {
            this.ctx.fillStyle = this.colors[color] || 'rgb(0, 0, 0)';
            this.ctx.fillRect(x, y, w, h);
        },
        drawText(x, y, text) {
            this.ctx.fillStyle = 'rgb(0, 0, 0)';
            this.ctx.font = "15pt Menlo";
            this.ctx.fillText(text, x, y);
        },
        drawLine(x, y, x2, y2, color) {
            this.ctx.fillStyle = this.colors[color] || 'rgb(0, 0, 0)';
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
}
</script>

<style scoped>
</style>