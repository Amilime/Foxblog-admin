<template>
    <div>
        <el-dialog :show-close="showClose"
                   :draggable="true"
                   :model-value="show" 
                   :close-on-click-modal="false"
                   :title="title"
                   class="cust-dialog"
                   :top="top"
                   :width="width" showCancel="showCancel">
        <div class="dialog-body">
             <slot></slot>
        </div>
        <template v-if="buttons&&buttons.length>0||showCancel">
            <div class="dialog-footer">
                <el-button link
                           @click="close">
                            取消
                </el-button>
                <el-button v-for="btn in buttons" 
                            :type="btn.type"
                            @click="btn.click">
            {{ btn.text }}
        </el-button>
            </div>
          
        </template>
        </el-dialog>  
    </div>
</template>

<script setup>

const props = defineProps({
    title:{
        type:String,
    },
    show:{
        type:Boolean,
        default: true,
    },
    showClose:{
        type:Boolean,
        default:false,
    },
    showCancel:{
        type:Boolean,
        default:true,
    },
    top:{
        type:String,
        default:"50px",
    },
    width:{
        type:String,
        default:"30%",
    },
    buttons:{
        type:Array,
    }
})

const emit = defineEmits();
const close = ()=>{
    emit("close")
}

</script>

<style lang="scss">
/*不知道为什么.cust-dialog最外层用不了*/
.cust-dialog{
    border-radius: 20px;
    background: rgba(253, 246, 246, 0.914);
    box-shadow: 2px 2px 100px #47a6e694;
    
    .el-dialog__body{
        
        padding:3px;
        //border-radius: 10px;
        //background: rgba($color: #ffffff7c, $alpha: 1.0);
    }
    .dialog-body{
        border-top: 1px solid #eec4c4;
        border-bottom:1px solid #ddd;
        padding: 10px;
        min-height: 80px;
    .el-form-item__label{
        font-size: 15px;
        padding: 0px 9px 0px 0px;
        
    }
    }
    .dialog-footer{
        text-align:right;
        padding: 5px 10px;
    }
}
</style>

