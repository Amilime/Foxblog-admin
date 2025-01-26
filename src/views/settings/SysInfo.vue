<template>
  <div>
    <el-form ref="editFormRef"
                :style="{width:'50%'}"
                :model="formData"
                :rules="rules"
                label-width="200px">
          
                    <el-form-item label="是否开启评论留言"
                                  prop="openCommentType">
                                  <div>
                    <el-radio-group v-model="formData.openCommentType">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    </div>
                    </el-form-item>
                    <template v-if="formData.openCommentType==1">
                        <el-form-item label="畅言appId"
                                      prop="changyanAppId">
                                      <el-input :maxlength="50"
                                        v-model="formData.changyanAppId"/>
                         </el-form-item>
                         <el-form-item label="畅言appKey"
                                      prop="changyanAppKey">
                                      <el-input :maxlength="50"
                                        v-model="formData.changyanAppKey"/>
                         </el-form-item>
                    </template>


                    <el-form-item label="是否开启Git Pages"
                                  prop="gitPagesType">
                       <div>
                        <el-radio-group v-model="formData.gitPagesType">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                       </div>
                    </el-form-item>

                    <el-form-item label="开启公安备案和ICP备案信息"
                                  prop="showIcp">
                        <el-radio-group v-model="formData.showIcp">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    </el-form-item>
                    <template v-if="formData.showIcp==1">
                        <el-form-item label="ICP备案域名"
                                      prop="icpDomain">
                                      <el-input :maxLength="200"
                                        v-model="formData.icpDomain"/>
                         </el-form-item>
                            <el-form-item label="ICP备案号"
                                        prop="icpNo">
                                        <el-input :maxlength="100"
                                            v-model="formData.icpNo"/>
                            </el-form-item>
                            <el-form-item label="ICP备案省份"
                                        prop="policeProvince">
                                <el-select v-model="formData.policeProvince"
                                            clearable
                                            showSearch>
                                    <el-option v-for="(item,index) in provinceList"
                                            :label="item"
                                            :value="item"
                                            :key="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="公安备案号"
                                        prop="policeNo">
                                        <el-input :maxLength="100"
                                            v-model="formData.policeNo"/>
                            </el-form-item>
                    </template>

                    <el-form-item label="下载静态页面">
                        <div>
                            <a href="javascript:void(0)"
                               @click="createZip()"
                               class="a-link">点击下载</a>
                        </div>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="danger"
                        @click="submitForm">保存</el-button>
                    </el-form-item>              
        </el-form> 
  </div>
</template>

<script setup>
import {getCurrentInstance, reactive, ref} from "vue"

const {proxy} =getCurrentInstance();
const api={
    "getSysSetting":"sysSetting/getSysSetting",
    "saveSysSetting":"sysSetting/saveSysSetting",
    "createZip":"sysSetting/createZip"
}
const formData = reactive({});
const provinceList =["北京","天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", 
                                                    "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", 
                                                  "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", 
                                                    "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾", "香港", "澳门"]

const rules={
    openCommentType:[{required: true,message:"是否开启评论不能为空"}],
    changyanAppId:[{required: true,message:"检查appId不为空"}],
    changyanAppKey:[{required: true,message:"我草懒得写了你自己看"}],
    gitPagesType:[{required: true,message:"不能为空"}],
    showIcp:[{required: true,message:"不能为空"}],
    icpDomain:[{required: true,message:"不能为空"}],
    icpNo:[{required: true,message:"不能为空"}],
    policeProvince:[{required: true,message:"不能为空"}],
    policeNo:[{required: true,message:"不能为空"}],

 }                                                     
const getSysSetting=async()=>{
    let result = await proxy.Request({
        url:api.getSysSetting
    })
    if(result!=null) {
        Object.assign(formData,result.data);
    }
};
getSysSetting();

const editFormRef = ref();
const submitForm =()=>{
    editFormRef.value.validate(async(valid) =>{
        if(!valid){
            return false;
        }
        let params = {};
        Object.assign(params,formData);
        let result = await proxy.Request({
            url:api.saveSysSetting,
            params:params,
        });
        if(!result){
            return;
        }
        proxy.Message.success("保存成功");
    });
};
const createZip = async()=>{
    let result = await proxy.Request({
        url:api.createZip
    });
    if(!result){
        return;
    }
    document.location.href = "/api/file/download/" + result.data + "/" + encodeURI("静态页面.zip");
};


</script>

<style lang="scss">
</style>