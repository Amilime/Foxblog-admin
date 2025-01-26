<template>
    <div class="category-bg">
        <el-button type ="danger"
                    @click="showEdit('add')"
                    v-if="userInfo.roleType==1">新增分类</el-button>
        <Table :columns="columns" 
               :showPagination="false"
               :dataSource="tableData"
               :fetch="loadDataList"
               :options="tableOptions"
               class="Table-bg">
            <template #cover = "{index,row}">
                <div class="cover">
                    <Cover :cover="row.cover"></Cover>
                </div>
            </template>
            <template #op="{index,row}"
            v-if="userInfo.roleType==1">
                <div class="op">
                    <a href="javascript:void(0)"
                    class="a-link"
                            @click="showEdit('update',row)">修改</a>
                <el-divider direction="vertical" ></el-divider> 
                <a href="javascript:void(0)"
                    class="a-link" 
                    @click="del(row)">删除</a>
                <el-divider direction="vertical" ></el-divider> 
                <a href="javascript:void(0)"
                    :class="[index==0?'not-allow':'a-link']"
                    @click="changeSort(index,'up')">上移</a> 
                <el-divider direction="vertical" ></el-divider> 
                <a href="javascript:void(0)"
                    :class="[index==tableData.list.length-1?'not-allow':'a-link']"
                    @click="changeSort(index,'down')">下移</a>  
                </div>
                
            </template>
        </Table>
        <Dialog :show="dialogConfig.show"
                :title="dialogConfig.title"
                :buttons="dialogConfig.buttons"
                
                @close="dialogConfig.show=false">
                <el-form :model ="formData"
                 :rules="rules"
                  ref="formDataRef"
                  label-width="50px">
            <el-form-item   label="名称"
                            prop="categoryName">
                <el-input placeholder="名称咪" 
                          v-model="formData.categoryName">
                </el-input >
            </el-form-item>
            <el-form-item   label="封面"
                            prop="cover">
                <coverUpload v-model="formData.cover"></coverUpload>     
            </el-form-item>
            <el-form-item label="简介"
                            prop="categoryDesc">
                <el-input  v-model="formData.categoryDesc"
                            type="textarea"
                            placeholder="ciallo~"
                            :autoSize="{minRows:4,maxRows:4}">       
                </el-input>
            </el-form-item>
        </el-form>
        </Dialog>
    </div>
    </template>
    
    <script setup>
import { getCurrentInstance,ref, reactive, nextTick } from "vue"

const { proxy } = getCurrentInstance();
  
const api= {
    "loadDataList":"/category/loadAllCategory4Blog",
    "saveCategory": "category/saveCategory4Blog",
    "delCategory": "category/delCategory4Blog",
    "changeSort": "category/changeCategorySort4Blog"
}   

const userInfo =ref(proxy.VueCookies.get("userInfo")||{});

    const columns=[{
        label:"封面",
        prop:"cover",
        width:80,
        scopedSlots:"cover",
    },{
        label:"名称(º﹃º)",
        prop:"categoryName",
        width:200,
    },{
        label:"简介(｀・ω・´) ",
        prop:"categoryDesc",
     
    },{
        label:"博客数量",
        prop:"blogCount",
        width:80,
    },{
        label:"操作",
        prop:"op",
        width:200,
        scopedSlots:"op",
    }]

    const tableData = reactive({})
    const tableOptions = {
        extHeight: 10,
    }

    const loadDataList = async() => {
        let result =await proxy.Request({
            url:api.loadDataList
        })
        if(!result){
            return
        }
        tableData.list =result.data;
    }
//新增修改
    const dialogConfig =reactive({
        show: false,
        title:"芝士标题",
        buttons:[{
            type:"danger",
            text:"确定",
            click:(e)=>{
               submitForm();
            }
        }]
    })

    const formData = ref({})
    const rules = {
        categoryName:[{required:true,message:"请输入名称"}]
    };
    const formDataRef = ref();
    const showEdit = (type, data)=> {
        dialogConfig.show = true;
        nextTick(()=>{
            formDataRef.value.resetFields();
        if(type=="add"){
            dialogConfig.title="新增分类";
            formData.value={};
        }else if(type == "update"){
            dialogConfig.title = "编辑分类";
            formData.value = JSON.parse(JSON.stringify(data))
        }
        })
    }

    const submitForm = () =>{
    formDataRef.value.validate(async(valid)=>{
        if(!valid){
            return;
        }

        let params = {};
        Object.assign(params,formData.value);
        let result = await proxy.Request({
            url:api.saveCategory,
            params,
        })
        if(!result){return;}
        dialogConfig.show = false;
        proxy.Message.success("保存成功");
        loadDataList();

    })
    }
    //删除
    const del = (data)=>{
        proxy.Confirm('真的要删除嘛?', async()=>{
            let result=await proxy.Request({
                url:api.delCategory,
                params:{
                    categoryId: data.categoryId,
                }
            })
            if(!result){
                return;
            }
            loadDataList();
        })
    }
    //排序
    const changeSort = async(index,type)=>{
        let categoryList = tableData.list;
        if(type=="down" &&index === categoryList.length -1 ||type==="up" &&index===0){
            return; 
        }
        let temp = categoryList[index];
        let number = type=="down"?1 : -1;

        categoryList.splice(index,1);
        categoryList.splice(index+number,0,temp);

        let result = await proxy.Request({
            url: api.changeSort,
            dataType:"json",
            params:categoryList,
        })

        if(!result){
            return;
        }
        proxy.Message.success("重新排序成功");
        loadDataList();
    }

    </script>
    
    <style lang="scss">
    .category-bg{
       //opacity: 0.8;    
        border-radius: 30px;
        .Table-bg{
            background: rgba(255, 255, 255, 0.441);
        }
    }
    

    </style>
    