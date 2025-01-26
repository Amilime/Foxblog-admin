<template>
    <div class="cover">
        <img :src="proxy.globalInfo.imageUrl+cover"
        v-if="cover">
        <img v-else
             src="../assets/default_img.png" >       
    </div>
</template>

<script setup>
import { getCurrentInstance, reactive } from 'vue';

const props = defineProps({
    cover:{
        type: String

    }
})
const {proxy} = getCurrentInstance();



</script>

<style lang="scss">
.cover{
    background: #ddd;
    display: flex;
    align-items:center;
    width: 80px;
    height: 80px;
    justify-content: center;
    overflow: hidden;
    border-radius: 50px;
    img{
        width: 100%;
    }
}
</style>