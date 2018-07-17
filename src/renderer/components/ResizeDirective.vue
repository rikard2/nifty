<script>
var nifty = require('../nifty');

export default {
    props: ['direction'],
    bind: function(el, binding) {
        binding.handle = document.createElement('div');
    },
    unbind: function(el, binding) {
        document.onmousemove = null;
        binding.handle.onmousedown = null;
        binding.handle.onmouseup = null;
    },
    inserted: function (el, binding) {
        var direction = binding.value.direction;

        el.style.position = 'relative';
        binding.handle.style.position = 'absolute';

        if (direction == 'horizontal') {
            binding.handle.style.top = '0px';
            binding.handle.style.right = '0px';
            binding.handle.style.width = '3px';
            binding.handle.style.height = '100%';
            binding.handle.style.background = '#e0e0e0';
            binding.handle.style.cursor = 'col-resize';
        } else {
            binding.handle.style.top = '0px';
            binding.handle.style.left = '0px';
            binding.handle.style.width = '100%';
            binding.handle.style.height = '3px';
            binding.handle.style.background = '#e0e0e0';
            binding.handle.style.cursor = 'row-resize';
        };

        binding.previous_style = {
            'z-index': binding.handle.style['z-index'],
            'background': binding.handle.style.background
        };
        var showOverlay = function() {

            binding.handle.style.background = 'lightblue';
            document.getElementById('overlay').style.display = 'block';
        };
        var hideOverlay = function() {
            binding.handle.style.background = binding.previous_style.background;
            document.getElementById('overlay').style.display = 'none';
        };

        binding.mouseup = function(e) {
            document.onmousemove = null;
            hideOverlay();
        };
        binding.mousemove = function(e) {
            e.preventDefault();
            if (e.buttons == 1) {
                if (direction == 'horizontal') {
                    var change = e.clientX - binding.inital_basis;
                    var newWidth = binding.inital_basis + change;
                    el.style['flex-basis'] = newWidth + 'px';
                    nifty.commands.send('resize');
                } else if (direction == 'vertical') {
                    var change = binding.initalY - e.clientY;
                    var newHeight = binding.inital_basis + change;
                    el.style['flex-basis'] = newHeight + 'px';
                    nifty.commands.send('resize');
                }
            } else {
                document.onmousemove = null;
                hideOverlay();
            }
        };

        binding.mousedown = function(e) {
            if (e.buttons == 1) {
                showOverlay();
                binding.startClientX = e.clientX;
                binding.startClientY = e.clientY;
                binding.inital_basis = parseInt((el.style['flex-basis'] || '').replace('px', ''));
                binding.initalY = el.offsetTop;
                if (!binding.inital_basis || binding.inital_basis < 10) throw('Invalid flex-basis (needs to be in px on the style tag.)');

                document.onmousemove = binding.mousemove;
            }
        };
        binding.handle.onmousedown = binding.mousedown;
        binding.handle.onmouseup = binding.mouseup;

        el.appendChild(binding.handle);
    }
};
</script>