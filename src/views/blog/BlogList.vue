<template>
    <div>
        <div class="top-panel">
            <el-form :model ="searchFormData"
                  label-width="50px">
                  <el-row>
                    <el-col :span="4">
            <el-form-item   label="标题"
                            prop="titleFuzzy">
                <el-input placeholder="请输入名称" 
                          v-model="searchFormData.titleFuzzy">
                </el-input >
            </el-form-item>
                </el-col>
                <el-col :span="4">
            <el-form-item   label="状态"
                            prop="status">
                <el-select v-model="searchFormData.status"
                            clearable 
                            placeholder="请选择状态"
                            :style="{width: '100%'}">

                <el-option :value="0" label="草稿"></el-option>
                <el-option :value="1" label="已发布"></el-option> 
                        </el-select>
            </el-form-item>
                </el-col> 
                <el-col :span="4">
            <el-form-item   label="分类"
                            prop="categoryId">
                <el-select v-model="searchFormData.categoryId"
                            clearable 
                            placeholder="请选择分类" 
                            :style="{width: '100%'}">
                        <el-option :value="item.categoryId"
                                   :label="item.categoryName"
                                     v-for="item in categoryList">

                        </el-option>
                </el-select>
            </el-form-item>
                </el-col>
                <el-col :span="5" :style="{'padding-left':'10px'}">
                    <el-button type="danger"
                    @click="loadDataList()">搜索</el-button>
                    <el-button type="danger"
                            @click="showEdit('add')">新增博客</el-button>
                </el-col>
                
            </el-row>
        </el-form>
        </div>
        <Table :columns="columns" 
               :showPagination="true"
               :dataSource="tableData"
               :fetch="loadDataList"
               :options="tableOptions"
               class="Table-bg">
               <!--封面-->
            <template #cover = "{index,row}">
                <div class="cover">
                    <Cover :cover="row.cover"></Cover>
                </div>
            </template>
    <!--文章信息-->
            <template #blogInfo = "{index,row}">
                <div>标题：{{ row.title }}</div>
                <div>分类：{{ row.categoryName }}</div>
                <div>作者：{{ row.nickName }}</div>   
            </template>
    <!--类型-->
            <template #typeName = "{index,row}">
                <div>类型：<span v-if="row.type==0">原创</span>
                    <span v-if="row.type==1">转载</span></div>
                <div v-if="row.type==1">转载地址：{{row.reprintUrl}}</div>
            </template>
    <!--发布颜色-->
            <template #statusName = "{index,row}">
               <span v-if="row.status==0"
                    :style="{color:'#8089ae'}">{{ row.statusName }}</span>
               <span v-else
                    :style="{color:'#ff94a6'}">{{ row.statusName }}</span>
                </template>
    <!--时间-->
    <template #time = "{index,row}">
                <div>创建时间:{{ row.createTime }}</div>
                <div>更新时间:{{ row.lastUpdateTime }}</div>
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
                    @click="delBlog(row)"
                    v-if="userInfo.userId==row.userId">删除</a>
                    <span v-else>--</span>
                    <el-divider direction="vertical" ></el-divider> 
                <a href="javascript:void(0)"
                    class="a-link"
                    @click="showDetail(row.blogId)">预览</a> 
                <el-divider direction="vertical" ></el-divider>              
                </div>        
            </template>
        </Table>
       <BlogEdit ref="blogEditRef"
                @callback="loadDataList"></BlogEdit>
        <BlogDetail ref="blogDetailRef"></BlogDetail>
    </div>
    </template>
    
    <script setup>
import { getCurrentInstance, reactive,ref } from "vue"
import BlogEdit from "./BlogEdit.vue";
import BlogDetail from "./BlogDetail.vue";
const {proxy} =getCurrentInstance();

const userInfo =ref (proxy.VueCookies.get("userInfo")||{});


const api ={
    "loadCategory": "/category/loadAllCategory4Blog",
    "loadDataList": "/blog/loadBlog",
    "delBlog":"/blog/recoveryBlog"
}

//搜索
const searchFormData = reactive({})
const categoryList = ref([]);

const loadCategoryList =async ()=>{
    let result = await proxy.Request({
        url:api.loadCategory
    })
    categoryList.value = result.data;
}
loadCategoryList();

//列表
const columns=[{
        label:"封面",
        prop:"cover",
        width:80,
        scopedSlots:"cover",
    },{
        label:"文章信息",
        prop:"blogInfo",
        width:200,
        scopedSlots:"blogInfo",
    },{
        label:"编辑 ",
        prop:"editorTypeName",
        width:150,
     
    },{
        label:"类型",
        prop:"typeName",
        width:200,
        scopedSlots:"typeName",
    },{
        label:"评论",
        prop:"allowCommentTypeName",
        width:100,
    },{
        label:"状态",
        prop:"statusName",
        width:150,
        scopedSlots:"statusName",
    },{
        label:"时间",
        prop:"time",
        width:200,
        scopedSlots:"time",
    },{
        label:"操作",
        prop:"op",
        width:170,
        scopedSlots:"op",
    }]
const tableData = reactive({})
    const tableOptions = {
        extHeight: 81,
        
        
    }

    const loadDataList = async() => {
    let params ={
        pageNo:tableData.pageNo,
        pageSize:tableData.pageSize,
    }
        Object.assign(params,searchFormData);

        let result =await proxy.Request({
            url:api.loadDataList,
            params,
        })
        if(!result){
            return
        }
        Object.assign(tableData,result.data);
    }
    const blogEditRef =ref(null);
   const showEdit =(type,data) =>{
    blogEditRef.value.init(type, data);
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
            proxy.Message.success("删除成功");
            loadDataList();
        })
    }

    //详情
    const blogDetailRef= ref(null);
    const showDetail = (blogId)=>{
        blogDetailRef.value.showDetail(blogId);
    }
    </script>
    
    <style lang="scss">
    .top-panel{
        white-space: nowrap;
        //width: 130%;
        
    }
    </style>
    