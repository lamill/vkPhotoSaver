<template>
  <div class="m-0 mt-2 mainBox">
     <IdGetter
     :info="info"
     v-on:get-id="getAlbums"
     />
    <div v-if="show" class="h3 text-center my-1">{{owner}}</div>
    <input v-model="filter" v-if="show" type="text" placeholder="Поиск альбома">
    <div v-if="show" class="list mt-1">
      <Album
      v-for="album in filetered"
      :key="album.id"
      :info="album"
      /> 
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import IdGetter from './DownloadMenu/IdGetter'
import Album from './DownloadMenu/Album'
export default {
  name: 'DownloadMenu',
  components: {
    IdGetter,
    Album
  },
  data: () => {
    return {
      info: {
        idType: 'users',
        id: ''
      },
      albums: null,
      show: false,
      owner: null,
      filter: ''
    }
  },
  computed: {
    filetered () {
      let vm = this
      if (this.albums !== null) {
        return this.albums.filter(album => {
          return album.name.toLowerCase().indexOf(vm.filter.toLowerCase()) !== -1
        })
      } else {
        return []
      }
    }
  },
  methods: {
    getAlbums () {
      ipcRenderer.send('DownloadMenu', 'getAlbums', this.info)
    }
  },
  mounted () {
    ipcRenderer.on('DownloadMenu', (event, resp) => {
      if (resp.error === null) {
        this.show = true
        this.albums = resp.albums
        this.owner = resp.name
      } else {
        this.show = false
      }
    })
  }
}
</script>

<style >
.list {
  flex-grow: 1;
  overflow: auto;
}
.mainBox {
  height: 98%;
  display: flex;
  flex-flow: column;
}
</style>