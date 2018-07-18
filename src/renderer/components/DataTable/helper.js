export default {
    px: function(n) {
        return n + 'px';
    },
    apply: function(obj, properties) {
        for (var key in properties) {
            obj[key] = properties[key];
        }
    }
}