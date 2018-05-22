<template>
  <Qti :setting="setting"></Qti>
</template>

<script>
export default {
  name: 'AnoahIM',
  data () {
    return {
        setting: {
          domain: "e.dev.anoah.com",
          user_id: "32850",
          qid: "9002511525420300001",
          publish_id: "879002511526006800001f",
          course_resource_id: "9002511526006800001",
          resource_type: "qti_exam"
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
