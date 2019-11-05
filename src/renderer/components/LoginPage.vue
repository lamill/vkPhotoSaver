<template>
  <div class="d-flex justify-content-center h-100">
    <div class="my-auto text-center">
      <button class="btn btn-primary" @click="tryLogin">Авторизация Вконтакте</button>
      <div class="form-group form-check mt-2">
        <input type="checkbox" class="form-check-input" v-model="isSave" id="isSave">
        <label class="form-check-label" for="isSave">Запомнить меня</label>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data: () => {
    return {
      isSave: false
    }
  },
  methods: {
    tryLogin () {
      ipcRenderer.send('LoginPage', 'tryLogin')
    }
  },
  mounted () {
    ipcRenderer.on('LoginPage', (event, message, name) => {
      switch (message) {
        case 'success':
          console.log(name)
          this.$router.push('/mainpg')
          this.$store.dispatch('SET_NAME', name)
          break
        default:
          break
      }
    })
  }
}
</script>

<style>

</style>