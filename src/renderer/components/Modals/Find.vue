<template>
    <div style="height: 100%;width: 100%;overflow-y: scroll;padding: 5px;">
        <input @input="changeText($event.target.value)" type="text" ref="findtextbox" style="padding: 10px; font-size: 18px;width: 100%;border: 1px solid #e0e0e0; outline: none;"></input>
        <div v-if="results.length > 0" style="margin-top: 5px;border-top: 1px solid #e0e0e0;border-left: 1px solid #e0e0e0;border-right: 1px solid #e0e0e0;border-bottom: 1px solid #e0e0e0;">
            <div :class="{ active: index == selectedIndex }" v-for="(result, index) in results" class="result">
                {{ result.title }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Find',
    props: ['value'],
    event: 'change',
    data: function() {
        return {
            selectedIndex: 0,
            searchtext: '',
            index: []
        }
    },
    computed: {
        results: function() {
            var index = this.value.index;
            //index = [
            //    { filename: '/users/public/schema/deposit.sql' },
            //    { filename: '/users/hej.sql' }
            //];
            var search = function(searchText) {
                var searches = searchText.toLowerCase().split(/(\s+)/);
                var found = [];

                found = index.map(function(ix) {
                    var points = 0;
                    for (var i = 0; i < searches.length; i++) {
                        if (searches[i].trim().length == 0) continue;
                        var io_filename = (ix.filename.indexOf('/' + searches[i] + '.'));
                        var io_slash = (ix.filename.indexOf('/' + searches[i]));
                        var io_fuzzy = (ix.filename.indexOf(searches[i]));
                        if (io_filename >= 0) {
                            points = points + 3;
                        } else if (io_slash >= 0) {
                            points = points + 2;
                        } else if (io_fuzzy >= 0) {
                            points = points + 1;
                        }
                    }

                    if (points > 0) {
                        return {
                            'title': ix.filename,
                            'filename': ix.filename,
                            'points': points
                        };
                    }
                })
                .filter(function(f) { return f; });

                found.sort(function(a, b) {
                    if (a.points == b.points) {
                        return a.filename > b.filename ? 1 : -1
                    }

                    return (a.points > b.points) ? -1 : 1;
                });
                return found.slice(0, 7);
            };
            return search(this.$data.searchtext);
        }
    },
    components: {
    },
    beforeMount() {
    },
    mounted() {
        var dis = this;
        var index = [
            { 'filename': '/users/rikard/startup.sql' },
            { 'filename': '/users/rikard/quit.sql' },
            { 'filename': '/users/rikard/print.sql' }
        ];
        var search = function(searchText) {
            var found = [];

            var searches = searchText.toLowerCase().split(/(\s+)/);
            console.log(searches);
            found = index.map(function(ix) {
                var points = 0;
                for (var i = 0; i < searches.length; i++) {
                    if (ix.filename.indexOf(searches[i]) >= 0) {
                        points = points + 1;
                    }
                }

                if (points > 0) {
                    return {
                        'title': ix.filename
                    };
                }
            })
            .sort(function(a, b) {
                return a.points > b.points ? 1 : -1;
            });

            return found;
        };
        this.$refs.findtextbox.addEventListener('keydown', function(e) {
            if (e.key == 'ArrowUp') {
                dis.$data.selectedIndex -= 1;
            } else if(e.key == 'ArrowDown') {
                dis.$data.selectedIndex++;
            } else {
            }
            if (dis.$data.selectedIndex < 0) dis.$data.selectedIndex = dis.results.length - 1;
            if (dis.$data.selectedIndex >= dis.results.length) dis.$data.selectedIndex = 0;

            if (e.key == 'Enter') {
                var selected = dis.results[dis.$data.selectedIndex];

                dis.$emit('onchoice', selected);
            }
        });
        this.$refs.findtextbox.focus();
    },
    methods: {
        changeText: function(text) {
            this.$data.searchtext = text;
        }
    }
}
</script>

<style scoped>
div.result:first-child {
    border-top: none;
}
div.result {
    padding: 10px;
    border-top: 1px solid #e0e0e0;
}
div.active {
    background: #e5f5ff;
}
div.header {
    padding: 15px;
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
}
div.choice {
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
}
div.choice:last-child {
    border-bottom: none;
}
div.choice.selected {
    background: #b7f0ff;
}
</style>
