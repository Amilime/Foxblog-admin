<template>
    <div class="window" 
        :style="{width:windowWidth-300 +'px'}"
            v-if="show">
    <div class="title">
        <span class="iconfont icon-back"
            @click="close"></span>
    </div>
        <div class="body">
            <slot></slot>
        </div>
        
        <div class="footer"></div>
        <template v-if="buttons&&buttons.length>0||showCancel">
            <div class="footer">
                <el-button link
                           @click="close"
                           v-if="showCancel">
                            取消
                </el-button>
                <el-button v-for="btn in buttons" 
                            :type="btn.type"
                            @click="btn.click">
            {{ btn.text }}
        </el-button>
            </div>
          
        </template>
    </div>
</template>

<script setup> 
import { ref } from "vue";

const windowWidth = window.innerWidth -250;

const props = defineProps({
    show:{
        type:Boolean,
        default:false,
    },

    buttons:{
        type:Array,
    },
    showCancel:{
        type:Boolean,
        default:true,
    },
})

const emit = defineEmits(["close"]);
const close = ()=>{
    emit("close")
}
</script>
  <!--这left存疑如果可以让其居中好-->
  
<style lang="scss">

.window{
    position:absolute;
    top: 0px;
    left: 70px;
  
    width:600px;
    

    height: calc(100vh - 130px);
    background: rgba(255, 249, 249, 0.949);
    box-shadow: 2px 5px 400px #34144a94;
    border-radius: 30px;
    z-index: 5;
    
    .title{
        height: 40px;
        display: flex;
        align-items: center;
        padding: 20px;
        .icon-back{
            font-size: 30px;
            color: #b38282;
            cursor: pointer;
        }
        
    }
    .body{
        
        height: calc(100vh - 230px);
        padding: 10px;
        border-radius: 30px;
    }
    .footer{

        text-align:center;
        line-height: 50px;
        border-top: 1px solid #e9d4d4;
    }
}
</style>