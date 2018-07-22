var ace = require('brace');
var nifty = require('../nifty');

module.exports = {
    render: function (h) {
        var height = this.height ? this.px(this.height) : '100%'
        var width = this.width ? this.px(this.width) : '100%'
        return h('div',{
            attrs: { style: "position: absolute; /* Added */ top: 0; right: 0; bottom: 0; left: 0;",
            }
        })
    },
    props:{
        value: {
            type:String,
            required:true
        },
        lang:String,
        theme:String,
        height:true,
        width:true,
        options:Object
    },
    data: function () {
        return {
            editor:null,
            contentBackup: ""
        }
    },
    methods: {
        px:function (n) {
            if( /^\d*$/.test(n) ){
                return n+"px";
            }
            return n;
        }
    },
    watch:{
        content:function (val) {
            if(this.contentBackup !== val){
                this.editor.setValue(val,1);
                this.contentBackup = val;
            }
        },
        theme:function (newTheme) {
            this.editor.setTheme('ace/theme/'+newTheme);
        },
        lang:function (newLang) {
            this.editor.getSession().setMode('ace/mode/'+newLang);
        },
        options:function(newOption){
            this.editor.setOptions(newOption);
        },
        height:function(){
            this.$nextTick(function(){
                this.editor.resize()
            })
        },
        width:function(){
            this.$nextTick(function(){
                this.editor.resize()
            })
        }
    },
    beforeDestroy: function() {
        this.editor.destroy();
        this.editor.container.remove();
    },
    mounted: function () {
        var vm = this;
        var lang = this.lang||'text';
        var theme = this.theme||'chrome';

        require('brace/ext/emmet');

        var editor = vm.editor = ace.edit(this.$el);
        this.$emit('init',editor);

        this.$root.nifty.on('resize', function() {
            editor.resize();
        });

        editor.$blockScrolling = Infinity;
        //editor.setOption("enableEmmet", true);
        editor.getSession().setMode('ace/mode/'+lang);
        editor.setShowPrintMargin(false);
        editor.setTheme('ace/theme/'+theme);
        editor.setOption("showInvisibles", false);
        editor.container.style.lineHeight = 1.5
        editor.renderer.updateFontSize()

        editor.setOption("fontFamily", "Menlo");
        editor.setOption("fontSize", "14px");

        editor.setValue(this.value,1);
        this.contentBackup = this.value;

        var fs = require('fs')
        fs.readFile('/Users/rikard/hej.sql', 'utf8', function (err,data) {

          if (err) {
            return console.log(err);
          }
          //editor.setValue(data, 1);
        });
        require("brace/ext/language_tools");
        var langTools = ace.acequire("ace/ext/language_tools");

        langTools.setCompleters([]);
        editor.setOptions({
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: true
            //, enableSnippets: true
        });
        // uses http://rhymebrain.com/api.html
        var rhymeCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                if (prefix.length === 0) { callback(null, []); return }
                callback(null, [
                    {name: 'Boooom', value: 'Boooom', score: 1, meta: "rhyme"}
                ]);
            }
        };
        langTools.addCompleter(rhymeCompleter);

        editor.on('change',function () {
            var content = editor.getValue();
            vm.$emit('input', content);
            vm.$root.nifty.activeEditor = editor;
            vm.contentBackup = content;
        });

        if(vm.options)
            editor.setOptions(vm.options);

            editor.on('copy', function(str) {
            });
    }
}