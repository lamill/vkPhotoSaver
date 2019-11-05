<template>
  <div class="h-100 mainBox">
    <div class="d-flex flex-row border-bottom topName justify-content-end pr-2">
      <p class="mb-0 mr-2">{{name}}</p>
      <router-link to="/">
      Выход
      </router-link>
    </div>
    <div class="row m-0 h-100 content">
      <div class="col-5 col-sm-5 col-md-5 col-lg-4 col-xl-3 h-100 m-0 pr-1 border-right">
      <DownloadMenu/>
      </div>
      <div class="col h-100">
      </div>
    </div>
  </div>
  
</template>

<script>
import DownloadMenu from './mainPage/DownloadMenu'
export default {
  name: 'main-page',
  components: {
    DownloadMenu
  },
  computed: {
    name () {
      return this.$store.state.Name.name
    }
  },
  methods: {
    test () {
      this.$store.dispatch('SET_NAME', 'asdasdasd')
    }
  }
}
</script>

<style>
.mainBox {
  height: 98%;
  display: flex;
  flex-flow: column;
}
.content {
  flex-grow: 1;
}
.topName {
  background-color: #f5f2f2;
}
</style>