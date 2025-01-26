<template>
    <div class="category-bg">
        <el-button type ="danger"
                    @click="showEdit('add')">新增专题</el-button>
                    <el-row :gutter="10"
                            :style="{'margin-top':'15px'}">
                        <el-col :span="14">
    <el-card class="box-card">
                                <template #header>
                                    <div class="card-header">
                                        <span>专题</span>
                                    </div>
                                </template>
                <Table :columns="columns" 
               :showPagination="true"
               :dataSource="tableData"
               :fetch="loadDataList"
               :options="tableOptions"
               @rowClick="rowClick"
               ref="dataTableRef">
            <template #cover = "{index,row}">
                <div class="cover">
                    <Cover :cover="row.cover"></Cover>
                </div>
            </template>
            <template #op="{index,row}">
                <div class="op">
                    <a href="javascript:void(0)"
                    class="a-link"
                            @click="showEdit('update',row)"
                            v-if="userInfo.userId==row.userId">修改</a>
                            <span v-else>--</span>
                <el-divider direction="vertical" ></el-divider> 
                <a href="javascript:void(0)"
                    class="a-link" 
                    @click="del(row)"
                    v-if="userInfo.userId==row.userId">删除</a>
                    <span v-else>--</span>
                </div> 
            </template>
        </Table>
    </el-card>
        </el-col>
         <el-col :span="10">
         <el-card class="box-card">
                                <template #header>
                                    <div class="card-header">
                                        <span>专题文章</span>
                                    </div>
                                </template>
                                <div :style="{'margin-bottom':'5px'}">
                                    <el-alert title="拖动文章修改排序，灰色是草稿"
                                                type="info"
                                                show-icon
                                                :closable="false" />
                                </div>
                                <div class="special-blog-tree">
                                <el-tree class="tree-panel"
                                         ref="refTree"
                                         :data="blogList"
                                         defaultExpandAll
                                         node-key="blogId"
                                         :expand-on-click-node="flase"
                                         :props="treeProps"
                                         :highlight-current="true"
                                         draggable
                                         @node-drop="blogDrag">
                            <template #default="{ node, data}">
                                <span class="custom-node-style">
                                <span class="node-title">
                                    <span v-if="data.status==0" 
                                    style="color:rgb(128,137,174)">{{ data.title }}</span>
                                    <span v-else
                                    style="color:rgb(222,109,109)">{{ data.title }}</span>
                                </span> 
                                <span class="node-op">
                                    <template v-if="data.blogId ==='0'">
                                    <a class="a-link"
                                    href="javascript:void(0)"
                                    @click="editBlog('add',data)">新增文章</a>
                                    </template>
                                    <template v-else>
                                    <a class="a-link"
                                    href="javascript:void(0)"
                                    @click="showDetail(data)">预览</a>
                                    <el-divider direction="vertical"/>
                                    <a class="a-link"
                                    href="javascript:void(0)"
                                    @click="editBlog('edit',data)"
                                    v-if="userInfo.userId==data.userId">修改</a>
                                    <span v-else>--</span>
                                    <el-divider direction="vertical"/>
                                    <a class="a-link"
                                    href="javascript:void(0)"
                                    @click="delBlog(data)"
                                    v-if="userInfo.userId==data.userId">删除</a>
                                    <span v-else>--</span>
                                    <el-divider direction="vertical"/>
                                    <a class="a-link"
                                    href="javascript:void(0)"
                                    @click="editBlog('add',data)">新增下级文章</a>   
                                   
                                </template>
                                </span>   
                            </span>            
                            </template>
                                </el-tree>
                            </div>
                            </el-card>
                            <div class="treetree">
                            
                        </div>
                        </el-col>
        </el-row>       
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
        <BlogEdit ref="blogEditRef"
                  @callback="saveBlogCallback"></BlogEdit>
        <BlogDetail ref="blogDetailRef"></BlogDetail>
    </div>
    </template>
    
    <script setup>
import BlogDetail from "./BlogDetail.vue";
import BlogEdit from "./BlogEdit.vue";

import { getCurrentInstance,ref, reactive, nextTick } from "vue"

const { proxy } = getCurrentInstance();
  
const api= {
    "loadDataList":"/category/loadCategory4Special",
    "saveCategory":"/category/saveCategory4Special",
    "delCategory":"/category/delCategory4Special",
    "getSpecialInfo":"blog/getSpecialInfo",
    "delBlog":"/blog/recoveryBlog",
    "updateSpecialBlogSort":"blog/updateSpecialBlogSort",
}   

const userInfo =ref (proxy.VueCookies.get("userInfo")||{});

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
        label:"简介(・ω・) ",
        prop:"categoryDesc",
     
    },{
        label:"博客数量",
        prop:"blogCount",
        width:80,
    },{
        label:"操作",
        prop:"op",
        width:130,
        scopedSlots:"op",
    }]

    const tableData = reactive({})
    const tableOptions = {
        extHeight: 160,
    }
    const dataTableRef =ref(null);
    const currentCategoryId =ref(null);

    const loadDataList = async() => {
        let result =await proxy.Request({
            url:api.loadDataList
        })
        if(!result){
            return
        }
        Object.assign(tableData,result.data)
       if(currentCategoryId.value ==null && result.data.list.length>0){
        currentCategoryId.value= result.data.list[0].categoryId;
       loadBlogList();
        }
       nextTick(()=>{
        dataTableRef.value.setCurrentRow("categoryId",currentCategoryId.value);
       })
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
          formData.value = {};
        }else if(type == "update"){
            dialogConfig.title = "编辑分类";
            formData.value = JSON.parse(JSON.stringify(data));
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
            currentCategoryId.value = null;
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

    //专题树

    //获取专题文章

    const rowClick = (row)=>{
        currentCategoryId.value =row.categoryId;
        loadBlogList();
    }

    const blogList = ref([]);
    const loadBlogList =async ()=>{
        let result = await proxy.Request({
            url:api.getSpecialInfo,
            params:{
                categoryId:currentCategoryId.value,
                showType:"1"
            }
        })

        blogList.value = result.data;
    }

    //属性展示
    const treeProps ={
        children:"children",
        label:"title",
        value:"blogId",
    };

    //新增修改专题博客
    const blogEditRef = ref(null);
    const editBlog = (type,data) =>{
        blogEditRef.value.init(type,data);
    }

    //保存专题博客回调
    const saveBlogCallback = ()=>{
        loadBlogList();
    }

    //删除博客
   const delBlog = (data)=>{
        proxy.Confirm('真的要删除嘛?', async()=>{
            let result=await proxy.Request({
                url:api.delBlog,
                params:{
                    blogId: data.blogId,
                }
            })
            if(!result){
                return;
            }
            loadBlogList();
        })
    }
     //拖拽排序
   
     const blogDrag =async(draggingNode,dropNode,dropType, ev)=>{
        console.log(draggingNode,dropNode,dropType);
        let parentNode =null;
        if(dropType =="inner"){
            parentNode = dropNode;
        } else{
            parentNode = dropNode.parent;
        }
        const blogId=draggingNode.data.blogId;
        const pBlogId = parentNode.data.blogId;

        const blogIds = [];
        parentNode.childNodes.forEach((element)=>{
            blogIds.push(element.data.blogId);
        });
        let params={
            blogId,
            pBlogId,
            blogIds: blogIds.join(","),
        };
        let result = await proxy.Request({
            url: api.updateSpecialBlogSort,
            params,
        });
        if(!result){
            return;
        }
        getBlogList();
     };

     //详情
     const blogDetailRef = ref(null);
     const showDetail =(data)=>{
        blogDetailRef.value.showDetail(data);
     }
    </script>
    
    <style lang="scss">
    .category-bg{
       //opacity: 0.8;    
        border-radius: 10px;
        .Table-bg{
            background: rgba(255, 255, 255, 0.441);
        }
    }
    .box-card{
        border-radius: 30px;
    }
    .el-tree-node__content{
      
        flex:1;    }
    .tree-panel{
        height: calc(100vh - 338px);
        overflow: auto;
        
   .custom-node-style{
    flex:1;
    display: flex;
    justify-content: space-between;
   
   }
}
    </style>
    