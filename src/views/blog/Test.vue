<template>
    <div>
    <EditorHtml v-model="markdownContent"></EditorHtml>
 {{ markdownContent }}
 </div>
</template>

<script setup>
import { ref } from "vue"
const markdownContent =ref("# ttest");
// console.log(markdownContent.value,"mm")
// markdownContent.value ='# test2'
</script>

<style lang="scss">
</style>