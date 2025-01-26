<template>
    <div class="body">
        <div class="top-panel">
        <el-form :model ="searchForm"
                  @submit.native.prevent
                  labelAlign="left">
                  <el-row :gutter="5">
                    <el-col :span="5">
            <el-form-item   label="标题">
                <el-input placeholder="支持模糊搜索" 
                          v-model="searchForm.titleFuzzy"
                          @keyup.enter.native="loadDataList"
                          allowClear />
            </el-form-item>
                  </el-col>
                <el-col :span="5">
                    <el-form-item>
                    <el-button type="danger"
                    @click="loadDataList()">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </div>
        <Table :columns="columns" 
               :dataSource="tableData"
               :fetch="loadDataList"
               :options="tableOptions">
               <!--封面-->
            <template #cover = "{index,row}">
                    <Cover :cover="row.cover"></Cover>
            </template>
    <!--文章信息-->
            <template #blogInfo = "{index,row}">
                <div>标题：{{ row.title }}</div>
                <div>分类：{{ row.blogType==0?'博客':'专题' }}
                <el-divider direction="vertical"></el-divider>
                <span>{{ row.blogType==0?'分类':'专题' }}</span>:{{ row.categoryName||'--' }} 
                </div>  
                <div>作者：{{ row.nickName }}</div>              
            </template>

    <!--发布颜色-->
            <template #status = "{index,row}">
               <span v-if="row.status==0"
                    :style="{color:'#8089ae'}">{{ row.statusName }}</span>
               <span v-else
                    :style="{color:'#ff94a6'}">{{ row.statusName }}</span>
                </template>
    <!--时间-->
    <template #timeInfo = "{index,row}">
                <div>创建时间:{{ row.createTime }}</div>
                <div>更新时间:{{ row.lastUpdateTime }}</div>
                </template>

            <template #operation="{index,row}">
                <div class="op">
                    <a href="javascript:void(0)"
                    class="a-link" 
                    @click="reductionBlog(row)"
                    v-if="userInfo.userId==row.userId">恢复</a>
                    <span v-else>--</span>
                    <el-divider direction="vertical" ></el-divider> 
                <a href="javascript:void(0)"
                    class="a-link" 
                    @click="delBlog(row)"
                    v-if="userInfo.userId==row.userId">删除</a>        
                    <span v-else>--</span>
                </div>        
            </template>
        </Table>
    </div>
</template>
    
 <script setup>
import { getCurrentInstance, reactive,ref } from "vue"
import {useRouter}from "vue-router";
const router =useRouter();
const {proxy} =getCurrentInstance();
const api ={
    "reductionBlog": "/blog/reductionBlog",
    "loadDataList": "/blog/loadRecoveryList",
    "delBlog":"/blog/delBlog",
}



//搜索
const userInfo =ref (proxy.VueCookies.get("userInfo")||{});


const tableData = reactive({});
    const tableOptions = reactive({
        extHeight: 81,  
    });

//列表
const columns=[{
        label:"封面",
        prop:"cover",
        width:80,
        scopedSlots:"cover",
    },{
        label:"文章信息",
        prop:"title",
        width:500,
        scopedSlots:"blogInfo",
    },{
        label:"编辑 ",
        prop:"editorTypeName",
        width:150,
     
    },{
        label:"评论",
        prop:"allowCommentTypeName",
        width:100,
    },{
        label:"时间",
        prop:"createTime",
        width:250,
        scopedSlots:"timeInfo",
    },{
        label:"操作",
        prop:"operation",
        width:200,
        scopedSlots:"operation",
    }]
 const searchForm = reactive({});

    const loadDataList = async() => {
    let params ={
        pageNo:tableData.pageNo,
        pageSize:tableData.pageSize,
    }
        Object.assign(params,searchForm);

        let result =await proxy.Request({
            url:api.loadDataList,
            params:params,
        });
        if(!result){
            return;
        }
        Object.assign(tableData,result.data);
    }

//删除博客
   const delBlog = (data)=>{
        proxy.Confirm('真的要删除嘛?', async()=>{
            let result=await proxy.Request({
                url:api.delBlog,
                params:{
                    blogId: data.blogId,
                },
            });
            if(!result){
                return;
            }
            proxy.Message.success("删除成功");
            loadDataList();
        })
    }

    //恢复
    const reductionBlog = (data)=>{
        proxy.Confirm('要恢复吗?!', async()=>{
            let result=await proxy.Request({
                url:api.reductionBlog,
                params:{
                    blogId: data.blogId,
                },
            });
            if(!result){
                return;
            }
            proxy.Message.success("恢复成功");
            loadDataList();
        })
    }
    </script>

    <style lang="scss">
    </style>
    