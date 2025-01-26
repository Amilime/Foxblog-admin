<template>
    <div>
        <el-form :model ="formData"
                 :rules="rules"
                  ref="formDataRef"
                  label-width="70px">
                  <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item   label="头像"
                            prop="avatar">
                <coverUpload v-model="formData.avatar"
                             @callback="saveAvatar"></coverUpload>     
            </el-form-item>
            <el-form-item label="昵称"
                            prop="nickName">
                <el-input  v-model="formData.nickName"
                            placeholder="ciallo~">
                </el-input>
            </el-form-item>
            <el-form-item label="手机"
                            prop="phone">
                <el-input  v-model="formData.phone"
                            placeholder="手机>w<">
                </el-input>
            </el-form-item>
            <el-form-item label="密码">
                <a href="javascript:void(0)"
                class="a-link"
                      @click="showUpdatePassword">修改密码</a>
            </el-form-item>
            <el-form-item label="编辑器"
                            prop="editorType">
            <el-radio-group v-model="formData.editorType">
                <el-radio :label="0">富文本编辑器</el-radio>
                <el-radio :label="1">MarkDown编辑器</el-radio>
            </el-radio-group>
            </el-form-item>
            <el-form-item label="职业"
                            prop="profession">
                <el-input  v-model="formData.profession"
                            placeholder="职业！">
                </el-input>
            </el-form-item>
            <el-form-item label=""
                            prop="editorType">
            <el-button type="danger"
                        @click="saveMy">保存</el-button>
            </el-form-item>
                    </el-col>
                    <el-col :span="13">
                        <el-form-item label="简介"
                                      prop="introduction">
                                <EditorHtml v-model="formData.introduction"></EditorHtml>
                        </el-form-item>
                       
                    </el-col>
                  </el-row>
           <Dialog :show="dialogConfig.show"
                :title="dialogConfig.title"
                :buttons="dialogConfig.buttons"
                
                @close="dialogConfig.show=false">
                <el-form :model ="passwordFormData"
                 :rules="rules"
                  ref="passwordFormRef"
                  label-width="50px">
            <el-form-item   label="密码"
                            prop="password">
                <el-input placeholder="密码咪" type="password"
                          v-model="passwordFormData.password">
                </el-input >
            </el-form-item>
            <el-form-item   label="重复"
                            prop="rePassword">
                <el-input placeholder="重复一下密码" type="password" 
                          v-model="passwordFormData.rePassword">
                </el-input >
            </el-form-item>
        </el-form>
        </Dialog>
          
        </el-form>        
    </div>
</template>

<script setup>
import {getCurrentInstance, ref,reactive, nextTick} from "vue";
const {proxy} =getCurrentInstance();
const api ={
    "getUserInfo":"getUserInfo",
    "saveMyInfo":"saveMyInfo",
    "saveAvatar":"saveAvatar",
    "updateMyPassword":"updateMyPassword",
}
const formData = ref({});

const validateRePass = (rule,value,callback)=>{
    if(value !== passwordFormData.value.password){
        callback(new Error(rule.message));
    }else{
        callback();
    }
};

const rules ={
    nickName:[{required: true,message:"昵称不为空"}],
    editorType:[{required: true,message:"选择默认编辑器"}],
    password:[
        {required: true,message:"输入密码"},
        {
            validator: proxy.Verify.password,
            message:"密码最少八位，数字字母或特殊字符",
        },
    ],
    rePassword:[
        {required: true,message:"再次输入密码"},
        {
            validator: validateRePass,
            message:"两次输入密码不一致",
        },
    ],
    phone:[
        {required: true,message:"输入手机号"},
        {
            validator:proxy.Verify.phone,
            trigger:"blur",
            message:"输入正确手机号",
        },
    ],
};

const getUserInfo = async()=>{
    let result = await proxy.Request({
        url:api.getUserInfo
    })

    if (!result){
        return;
    }
    formData.value = result.data;
}
getUserInfo();

const formDataRef = ref(null);
const saveMy = async()=>{
    formDataRef.value.validate(async (valid) =>{
        if(!valid){
            return ;
        }
        let result =await proxy.Request({
        url:api.saveMyInfo,
        params:{
            avatar:formData.value.avatar,
            nickName:formData.value.nickName,
            phone:formData.value.phone,
            editorType:formData.value.editorType,
            profession:formData.value.profession,
            introduction:formData.value.introduction,
        }
    })
    if(!result){
        return;
    }
    proxy.Message.success("保存成功");
    });
   
}
//修改头像
const saveAvatar =async(avatar)=>{
    let result = await proxy.Request({
                url: api.saveAvatar,
                params:{
                    avatar:avatar
                }
            })
            if(!result){
                return;
            }
            proxy.Message.success("头像修改成功");

            //document.location.reload();
}

//修改密码
const passwordFormData = ref({});
const passwordFormRef = ref(null);
const dialogConfig =reactive({
        show: false,
        title:"修改密码",
        buttons:[{
            type:"danger",
            text:"确定",
            click:(e)=>{
                submitPass();
            }
        }]
    })

    const showUpdatePassword = ()=>{
        dialogConfig.show=true;
        nextTick(()=>{
            passwordFormRef.value.resetFields();
            passwordFormData.value = {};
        })
    }

    const submitPass=()=>{
        passwordFormRef.value.validate(async(valid) =>{
            if(!valid){
                return;
            }
            let result = await proxy.Request({
                url: api.updateMyPassword,
                params:{
                    password:passwordFormData.value.password
                }
            })
            if(!result){
                return;
            }
            dialogConfig.show = false;
            proxy.Message.success("密码修改成功");
        });
    }
</script>

<style lang="scss">
.el-main{
    overflow: hidden;
}
.el-input__wrapper{
    height: 40px;
    border-radius: 20px;
}
</style>