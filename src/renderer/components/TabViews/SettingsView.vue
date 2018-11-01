<template>
    <div class="settings-view">
        <div class="settings-left">
          <ul>
            <li :class="{ active: selectedCategory == index }" @click="selectCategory(index)" v-for="(category, index) in this.settings">
              {{ index }}
            </li>
          </ul>
        </div>
        <div class="settings-content">
          <div v-for="(setting) in settings[selectedCategory]">
            <div><h2>{{ setting['title'] }}</h2></div>
            <div v-if="setting['type'] == 'list'">
              <div class="list">
                <ul>
                    <li>Tomte</li>
                    <li class="active">Tomte</li>
                    <li>Tomte</li>
                </ul>
                <button>Add</button>
                <button>Remove</button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'settingsview',
    computed: {
    },
    data: function() {
      return {
        settings: this.$store.state.settings,
        selectedCategory: this.selectedCategory
      }
    },
    mounted: function() {
      this.selectedCategory = 'general';
    },
    components: {
    },
    methods: {
      selectCategory: function(category) {
        this.selectedCategory = category;
      }
    }
}
</script>

<style scoped>
button {
  padding: 5px 10px;
  border: none;
  background: #e0e0e0;
  border-radius: 3px;
}
  ul {
  list-style: none;
  }

  .list {
    width: 200px;
    height: 100px;
  }
  li {
    cursor: pointer;
  padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
  }
  .list li {
    padding: 5px 10px;
  }
  .list ul {
    margin-top: 10px;
    border-radius: 3px;
    margin-bottom: 10px;
    border: 1px solid #e0e0e0;
    width: 250px;
    height: 300px;
  }
  li.active {
    background: #60a6e0;
    color: #fff;
    border-top: 1px solid #488bc1;
    border-bottom: 1px solid #488bc1;
  }
    .settings-view {
      font-family: system-ui;
      font-weight: normal;
      font-size: 13px;
        width: 100%;
        height: 100%;
        display: flex;
        flex: 1 auto;
        flex-flow: row;
    }
    .settings-left {
    border-right: 1px solid #e0e0e0;
    flex-grow: 0;
    flex-shrink: 0;
    width: 200px;
    }
    .settings-content {
      padding: 40px;
      text-align: left;
      background: #fff;
      flex: 1 auto;
      display: flex;
      flex-direction: column;
    }
</style>
