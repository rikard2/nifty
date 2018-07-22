import Vue from 'vue'
export class Modal {
    model = null;
    component = null;

    constructor() {

    }

    static choices(model) {
        return Modal.show('Choices', model);
    }
    static show(component, model) {
        var promise = new Promise(function(fulfill, reject) {
            var overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.left = overlay.style.top = overlay.style.right = overlay.style.bottom = '0px';
            overlay.style.background = '#f0f0f0';
            overlay.style.opacity = '0.5';
            overlay.style['z-index'] = '500';

            var content = document.createElement('div');
            content.id = 'content';
            content.style.position = 'absolute';
            content.style.width = '800px';
            content.style.left = 'calc(50% - 400px)',
            content.style.top = '25px',
            content.style.margin = '0 auto';
            content.style['max-height'] = '400px';
            content.style.opacity = '1';
            content.style['margin-top'] = '50px';
            content.style['z-index'] = '9999';
            content.style.background = '#fff';
            content.style['box-shadow'] = '0px 0px 5px 1px rgba(0,0,0,0.64)';
            document.body.appendChild(content);
            document.body.appendChild(overlay);

            var compElement = document.createElement('div');
            content.appendChild(compElement);
            var ModalComponent = require('../components/Modals/' + component + '.vue').default;
            console.log('mc', ModalComponent);
            var components = {};
            components[component] = ModalComponent;
            var v = new Vue({
                name: component,
                data: function() {
                    return {
                        model: model
                    };
                },
                components: components,
                beforeMount: function() {
                    console.log('mount?', ModalComponent);
                },
                methods: {
                    onChoice: function(choice) {
                        document.body.removeChild(content);
                        document.body.removeChild(overlay);
                        v.$destroy();
                        document.removeEventListener('keydown', onKeyDown);
                        console.log('FULFILLING', choice);
                        fulfill(choice);
                    }
                },
                template: '<div style="width: 100%;height: 100%;"><' + component + ' v-on:onchoice="onChoice" v-model="this.model"></' + component + '></div>'
            });
            v.$mount(compElement);
            var onKeyDown = function(e) {
                if (e.key == 'Escape') {
                    document.body.removeChild(content);
                    document.body.removeChild(overlay);
                    v.$destroy();
                    document.removeEventListener('keydown', onKeyDown);
                    reject();
                }
            };
            document.addEventListener('keydown', onKeyDown);
        });

        return promise;
    }
}