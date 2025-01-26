<template>
    <div>
     <!--新增修改弹窗-->
     <Window     :show="windowConfig.show"
                    :buttons="windowConfig.buttons"
                @close="closeWindow">
                <el-form :model ="blogFormData"
                 :rules="rules"
                  ref="blogFormRef">
            <el-form-item prop="title">
                <div class="title-input">
                    <el-input placeholder="标题(｡･ω･｡)" 
                          v-model="blogFormData.title">
                </el-input >
                </div>
            </el-form-item>
            <el-form-item prop="content">
                <div :style="{'width':'100%'}">
                    <EditorHtml :height="editorHtmlHeight"
                                v-model="blogFormData.content"
                                v-if="blogFormData.editorType==0"></EditorHtml>
                    <EditorMarkdown v-else
                                :height="editorMarkdownHeight"
                                v-model="blogFormData.markdownContent"
                                @htmlContent="setHtmlContent" ></EditorMarkdown>
                               
                </div>
               
            </el-form-item>
            </el-form>

        
    
    </Window>    
    </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, reactive , ref} from "vue"
import { onMounted } from 'vue';
const{ proxy } =getCurrentInstance();

const editorHtmlHeight =window.innerHeight-60-20-30-50-250;
const editorMarkdownHeight =window.innerHeight-60-20-30-50-170;
 
const api ={
    "saveBlog":"/blog/saveBlog4Special",
    "getUserInfo":"getUserInfo",
    "getBlogDetail":"/blog/getBlogById",
    "autoSave":"/blog/autoSaveBlog4Special",
}

const init=(type,data)=> {
    startTimer();
    windowConfig.show = true;
    nextTick(()=>{
        blogFormRef.value.resetFields();
        blogFormData.value={categoryId:data.categoryId,pBlogId:data.blogId};
        if(type==="add"){
        getUserInfo();
    }else{
        getBlogDetail(data.blogId);
    }
    })
}

defineExpose({init});

const getUserInfo =async ()=>{
    let result =await proxy.Request({
        url:api.getUserInfo,
    })
    if(!result){
        return;
    }
    blogFormData.value.editorType = result.data.editorType;
}

const getBlogDetail =async (blogId)=>{
    let result = await proxy.Request({
        url:api.getBlogDetail,
        params:{
            blogId:blogId
        }
    })
    if(!result){
        return
    }
    
    blogFormData.value = result.data;
    if(result.data.tag){
        blogFormData.value.tag = result.data.tag.split("|");
    }else{
        blogFormData.value.tag = [];
    }

}
let timmer =ref(null);

const startTimer=()=>{
    timmer.value = setInterval(()=>{
    autoSave();
},10000);
}


const cleanTimer = ()=>{
    if (timmer.value !==null) {
        clearInterval(timmer.value);
        timmer.value =null;
    }
}

//自动保存
const autoSave = async()=>{
    if(blogFormData.value.title==undefined || blogFormData.value.content=="" || timmer.value ==null
    ){
        return;
    }
    const params = {};
    Object.assign(params,blogFormData.value)
    let result = await proxy.Request({
        url:api.autoSave,
        showLoading: false,
        params:params
    })
    if(!result){
        return;
    }
    blogFormData.value.blogId = result.data;
}
//新增，修改
 const windowConfig = reactive({
        show: false,
        buttons:[{
            type:"danger",
            text:"确定",
        click:(e)=>{
            SubmitBlog();
        } 
           }]
    })
    


    //博客正文
    const blogFormRef = ref(null);
    const blogFormData = ref({ tag:[]});

    //markdown编辑器设置html内容
    const setHtmlContent =(htmlContent) =>{
        blogFormData.value.content =htmlContent
    }

    //展示配置弹窗
    const SubmitBlog =() =>{
        blogFormRef.value.validate(async(valid)=>{
        if(!valid){
            return;
        }
        let params = Object.assign({},blogFormData.value);
        let result = await proxy.Request({
            url:api.saveBlog,
            params
        })
        if(!result){
            return; 
        }
        proxy.Message.success("保存成功");
        closeWindow();
    });      
    }
    const emit = defineEmits();
    const closeWindow =()=>{
        windowConfig.show = false;
        emit("callback")
        if(timmer.value !==null){
            cleanTimer();
        }
    }
    const rules = {
        title:[{required:true,message:"请输入标题"}],
        content:[{required:true,message:"请输入正文 "}],
          categoryId: [{required:true,message:"选择博客分类"}],
          type: [{required:true,message:"选择博客类型"}],
          allowComment: [{required:true,message:"是否允许评论"}],
          reprintUrl: [{required:true,message:"请输入原文地址"}],
    }

   // onUnmounted(() => {
    //    cleanTimer();
    //})

    //标签删除
const closeTag = (index)=>{
    blogFormData.value.tag.splice(index,1);
}
//是否显示tag输入框
const showTagInput =ref(false)

const showTagInputHandler =()=>{
    showTagInput.value =true;
}
//输入tag
const tagInputValue = ref(null);

const tagInputResult =()=>{

    if(tagInputValue.value ==undefined){
        return;
    }
    
    showTagInput.value =false;
    if(blogFormData.value.tag.indexOf(tagInputValue.value)== -1){
        blogFormData.value.tag.push(tagInputValue.value);
    } 
    tagInputValue.value =undefined;

    console.log(blogFormData.tag);
}
const settingsFormRef = ref();

</script>

<style lang="scss">
.title-input{
    width: 50%;
    
    .el-input__wrapper{
        
       height: 50px;
        border-radius: 25px;
    }
    input{
        font-size: 17px;
    }
}
.tag-input-panel{
    display: flex;
    align-items: center;
    .tag-list{
        display: flex;
        .tag-item{
            margin-right: 5px;
        }
    }
    .info{
       
        color:#998383;
        font-size: 13px;
        margin-right:  10px;
    }
    .icon-add{
        color: #bb7979;
        margin-right:  10px;
        cursor: pointer;
    }
    .tag-input{
        width:100px;
    }
}
</style>