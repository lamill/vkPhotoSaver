<template>
  <div>
    <div class="h3 text-center">{{owner}}</div>
    <div class="aList">
      <Album
      v-for="album in albums"
      :key="album.id"
      :info="album"
      /> 
    </div>
  </div>
</template>

<script>
import Album from './Album'
export default {
  components: {
    Album
  },
  props: ['albums', 'owner']
}
</script>

<style scoped>
aList {
  overflow: auto;
  flex-grow: 1;
}
</style>