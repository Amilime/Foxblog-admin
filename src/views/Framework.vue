<template>
    <div class="layout">
      <el-container >
        <el-header class="header">
          <div class="logo">狐のBlog</div>
          <div class="user-info">
            <span>欢迎回来，</span>
            <el-dropdown>
              <span class="nick-name">
                {{ userInfo.nickName }}
              <span class="iconfont icon-close"></span>
              </span>
              <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="gotUserInfo">
        个人信息
        </el-dropdown-item>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>   
      </el-dropdown-menu>
    </template>
  </el-dropdown>
    <div class="avatar"><img :src = "userInfo.avatar"></div>
          </div>
        </el-header>
        <el-container class="container">
          <el-aside width="200px"
          class="left-aside">
          <div>
           <el-button class="post-btn"
           @click="createHtml">发布>ω<</el-button>
          </div>
          <div class="menu-panel">
              <ul>
              <li v-for="(menu,index) in menuList">
              <span class="menu-title-p"
                   @click="openClose(index)">
              <span :class = "['iconfont',menu.icon]"></span>
                <span class="menu-title">{{ menu.title }}</span>
              <span :class="['iconfont','open-close',menu.open?
              'icon-open' : 'icon-close']"></span>
              </span>

                <ul class="sub-menu"
                v-show="menu.open">
                  <li v-for="subMenu in menu.children">
                  <router-link :to="subMenu.path"
                   :class="['sub-menu-item',activePath==subMenu.path?'active':'']"
                   v-if="subMenu.roleType==null||subMenu.roleType==userInfo.roleType">{{ subMenu.title }}</router-link>
                </li>
                </ul>
              </li>
            </ul>
          </div>
          
        </el-aside>
          <el-main class="right-main">
            <router-view />
            </el-main>
        </el-container>
      </el-container>

      <Dialog :show="progressDialog.show"
              :title="progressDialog.title"
              :buttons="progressDialog.buttons"
              @close="progressDialog.show=false"
              :show-close="false"
              :showCancel="false"
              width="400px">
        <div class="progress-container">
          <div class="progress-panel">
            <el-progress type="circle"
                        :percentage="progressInfo.progress"
                        :status="progressInfo.status"
                        :color="colors"/>
          </div>
          <div class="error"
              v-if="progressInfo.result==0">
              <div>生成页面出错:{{ progressInfo.errorMsg }}</div>
              <div class="info">请查看服务器日志</div>
          </div>
          <div class="success"
          v-if="progressInfo.progress==100 && progressInfo.result==1">
            发布成功>w<
          </div>
          <div class="btn-panel"
          v-if="progressInfo.progress==100 || progressInfo.result==0">
            <el-button class="btn"
                       type="primary"
                       @click = "progressDialog.show=false">关闭</el-button>
          </div>
        </div>
      </Dialog>

    </div>
  </template>
    
    <script setup>
    import {getCurrentInstance, ref, watch,reactive} from "vue"
    import { useRouter,useRoute } from 'vue-router';

     const router = useRouter();
     const route = useRoute();
     const {proxy} = getCurrentInstance();
     const menuList =ref([
      {
        title:"博客",
        icon:"icon-blog",
        open: true,
        children:[
          {
            title:"博客管理",
            path:"/blog/list",
          },
          {
            title:"分类管理",
            path:"/blog/category",
          },
        ],
      },
      {
        title:"专题",
        icon:"icon-zhuanti",
        open: true,
        children:[
          {
            title:"专题管理",
            path:"/special/list",
          },
        ],
      },
      {
        title:"设置",
        icon:"icon-settings",
        open: true,
        children:[
          {
            title:"个人信息设置",
            path:"/settings/my",
          },
          {
            title:"博客成员管理",
            path:"/settings/user",
          },
          {
            title:"系统设置",
            path:"/settings/SysInfo",
            roleType: 1,
          },
        ],
      },
      {
        title:"回收站",
        icon:"icon-delete",
        open: true,
        children: [
          {
            title:"回收站",
            path:"/recovery/list",
          },
        ],
      },
     ]);
const api={
  "getUserInfo":"getUserInfo",
  "logout":"logout",
  "createHtml":"createHtml",
  "checkProgress":"checkProgress",
}

const openClose = (index) =>{
  const open = menuList.value[index].open;
  menuList.value[index].open = !open;
}

const userInfo = ref({});

const getUserInfo = async()=> {

  let result = await proxy.Request({
    url: api.getUserInfo
  })
  if(!result){
    return;
  }
  userInfo.value = result.data;
  userInfo.value.avatar = proxy.globalInfo.imageUrl + result.data.avatar;
}
getUserInfo();
const activePath =ref(null);

watch(route,(newVal,oldVal)=>{
  activePath.value = newVal.path;
},{immediate: true, deep: true} );


const gotUserInfo =()=>{
  router.push("../settings/my");
}

const logout =(data) =>{
  proxy.Confirm('退出哦',async()=>{
    let result = await proxy.Request({
      url:api.logout,
    })
    if(!result){
      return;
    }
    router.push("/login");
  })
}

//发布
const colors =[
    {color:"#f56c6c",percentage:20},
    {color:"#e6a23c",percentage:40},
    {color:"#6f7ad3",percentage:60},
    {color:"#1989fa",percentage:80},
    {color:"#5cb87a",percentage:100},
];

const progressDialog = reactive({
    title:"发布",
    buttons:[],
    show:false,
});

const progressInfo = reactive({
    progress:0,
});

let checkTimer = null;
const createHtml = async()=>{
    progressDialog.show=true;
    progressInfo.progress=0;
    progressInfo.status=undefined;
    let result = await proxy.Request({
        url:api.createHtml,
    });
    if(!result){
        return;
    }
    checkProgress();
    checkTimer = setInterval(()=>{
        checkProgress();
    },1000);
};

const checkProgress = async() =>{
    let result = await proxy.Request({
        url:api.checkProgress,
        showLoading:false,
    });
    if(!result){
        return;
    }
    if(result.data.result ==0){
        progressInfo.status = "exception";
        progressInfo.errorMsg = result.data.errorMsg;
    }else{
        progressInfo.progress = result.data.progress;
    }
    progressInfo.result = result.data.result;
    if(
        (result.data.progress ==100|| result.data.result ==0) &&
        checkTimer !=null
    ){
        clearInterval(checkTimer);
    }
};
    </script>
    
<style lang = "scss">
    .layout{
        .header{
        border-bottom: 1px solid #8089ae;
        display: flex;
        align-items:center;
        justify-content: space-between;
        color: #ffffff;
        /* 主体阴影 
        text-shadow:
         
        0 0 20px #c32626;  增加阴影层级 */
        font-weight: bold;
        font-style:italic;
        height: 100px;
        background-image:url(../assets/index_picture2.jpg);
        background-position: 50% 32%;
        
       
        .logo{
          font-size: 34px;
          margin-left: 65px;
          
        }
        .user-info{
          display: flex;
          align-items:center;
          
          border: none;
          .nick-name{
            cursor: pointer;
            color: rgb(203, 202, 225);
            .icon-close{
              font-size:17px;
            }
          }
          .avatar{
            width:50px;
            height: 50px;
            margin-left: 10px;
            align-items: center;
            justify-content: center;
            display: flex;
            background: #d6dced;
            border-radius: 25px;
            img{
              border-radius: 25px;
              width:100%;

            }
          }
          .nick-name:focus-visible {
            outline: none !important;
          }
        }
    }
    .container{
        
        padding-top: 10px;
        background: #ffffff;
        height:calc(100vh - 100px);
        .left-aside{
          
            padding:0px 15px;
            width:250px;
            
            .post-btn{
              background: #ff8290;
              color:#ffffff;
              height: 50px;
              width:85%;
              font-weight: bold;
              font-size: 17px;
              margin-left: 6%;
              
              
            }
            .post-btn:hover{
              background: #ff94a6
            }
            .menu-panel {
              margin-top: 10px;
             
              ul,
              li{
                padding:0px;
                margin:0px;
                list-style:none;
              }

              .menu-title-p{
                font-size: 17px;
                margin-top: 5px;
                margin-bottom: 5px;
                background: #dfe4f5;
                padding: 0px 5px;
                line-height: 50px;
                cursor:pointer;
                display: flex;
                .iconfont{
                  color: #af4a4a;
                }
                .menu-title{
               
                flex: 1;
                  color: #423425;
                  margin-left: 15px;
                  
                  
                }
                .open-close{
                  width:40px;
                }
              }

              .menu-title-p:hover{
                border-radius: 5px;
                background: #d6dced;
                margin-top: 5px;
                margin-bottom: 5px;
              }

              .sub-menu{
                color: #4b4033;
                padding-left: 20px;
                font-size: 15px;
                margin-top: 10px;
                margin-bottom: 10px;
                .sub-menu-item{ 
                  padding: 5px 30px;
                  display: block;
                  cursor: pointer;
                  text-decoration: none;
                  color: #4b4033; 
              line-height: 30px;
            }
            .active{
              background: #d6dced;
            }
            .sub-menu-item:hover{
              border-radius: 5px;
              background: #d7dceb;
            }
              }

            }
        }
        .right-main{
            background: #fff1f4;
            border-radius: 30px;
            padding: 20px 10px 10px 20px;
            position: relative;
            
        }
    }
}
.progress-container{
  .progress-panel{
    display: flex;
    justify-content: center;
  }

  .error{
    color:red;
    margin-top: 20px;

    .info{
      font-size: 13px;
    }
  }

  .success{
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    color: green;
  }

  .btn-panel{
    text-align: center;
    margin-top: 20px;
  }
}  
</style>