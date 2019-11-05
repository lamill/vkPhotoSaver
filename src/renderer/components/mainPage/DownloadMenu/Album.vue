<template>
  <div  class=" albumBox d-flex flex-row justify-content-start align-items-center">
    <input v-model="selected" type="checkbox" class=" mr-2">
    <div @click="test" :class="{isSelected: selected}" class="info pb-2 flex-grow-1">
      <p class="h5 mb-0">{{info.name}}</p>
      <p class="my-0 photoBox">Фотографий:{{info.size}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['info'],
  data: () => {
    return {
      selected: false
    }
  },
  methods: {
    test () {
      this.selected = !this.selected
    }
  }
}
</script>

<style>
.photoBox {
  font-size: 12px;
}
.albumBox {
  width: 99%;
}
.info {
  max-width: 90%;
}
.info:hover {
  background-color: aqua;
  cursor: pointer;
}
.isSelected {
  background-color: blue;
}
</style>