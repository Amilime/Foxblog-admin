<template>
<div>
    <Window :show="windowConfig.show"
            :buttons="windowConfig.buttons"
            :showCancel="false"
            @close="windowConfig.show = false">
            
        <div class="my-title">{{ blog.title }}</div>
        <div v-html="blog.content" class="blog-detail"></div>
    </Window>
</div>
</template>

<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";
import { getCurrentInstance,ref,reactive,nextTick } from 'vue';
const {proxy} =getCurrentInstance();

const api = {
    getBlogDetail: "/blog/getBlogById",
}

const windowConfig = reactive({
        show: false,
        buttons:[{
            type:"danger",
            text:"确定",
        click:(e)=>{
            windowConfig.show = false;
        } 
           }]
    })

const blog =ref({});
const showDetail =async (blogId) => {
    windowConfig.show = true;

    let result = await proxy.Request({
        url:api.getBlogDetail,
        params:{
            blogId:blogId
        }
    })
    if(!result){
        return;
    }
    blog.value = result.data;
    nextTick(()=>{
        //高亮
        let blocks =document.querySelectorAll("pre code");
        blocks.forEach((block) =>{
            hljs.highlightBlock(block);
        });
    });
}
defineExpose({ showDetail})
</script>

<style lang="scss">
.my-title{
    font-size: 30px;
}
.blog-detail{
    blockquote{
        padding: 0 1em;
        color:#8ea5bf;
        border-left: 0.25em solid #dfe2e5;
        
    }
    overflow: auto;
    height: 450px;
}

.hljs{
    font-size: 18px;
    background: #ffffff;
    width: 80%;
    border-radius: 10px;
}
.routeros{
    background: #ffffff;
    font-size: 18px;
    width: 80%;
    border-radius: 10px;
}
</style>