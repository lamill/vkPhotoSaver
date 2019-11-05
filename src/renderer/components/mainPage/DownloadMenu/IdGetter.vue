<template>
  <div>
    <div class="form-group">
        <div class="row">
          <p class="col-2">id</p>
          <div class="col form-check">
            <input v-model="info.idType" type="radio" class="form-check-input" value="users" name="idChoice" id="Uradio">
            <label for="Uradio">Пользователя</label>
          </div> 
          <div class="col form-check">
            <input v-model="info.idType" type="radio" class="form-check-input" value="groups" name="idChoice" id="Gradio">
            <label for="Gradio">Группы</label>
          </div>
        </div>
        <input @keyup.enter="getId" v-model.lazy="info.id" type="text" class="form-control" id="idField" placeholder="id">
        <small class="form-text text-muted">Например: 123456 или imagineid</small>
      </div>
      <button class="btn btn-primary text-center" @click="getId">Получить список альбомов</button>
  </div>
</template>

<script>
export default {
  name: 'IdGetter',
  props: ['info'],
  methods: {
    getId () {
      this.$emit('get-id')
    }
  }
}
</script>
  
<style>

</style>