<template>
    <el-upload name="file" :show-file-list="false"
    accept=".png,.PNG,.jpg,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
            :multiple="false"
            :http-request="uploadImage">
    <div class="cover-upload-btn">
        <template v-if="modelValue">
            <img :src="proxy.globalInfo.imageUrl+modelValue">
        </template>
        <span v-else></span>
    </div>
  </el-upload>
    </template>
    
    <script setup>
    import { getCurrentInstance } from 'vue';
    
    const { proxy } = getCurrentInstance();

        const props = defineProps({
            modelValue:{
                type:String,
                default:null,
            }
        })
        
        const api = {
            uploadUrl: "file/uploadImage"
        }
        const emit = defineEmits();
        const uploadImage = async(file)=>{

            let result = await proxy.Request({
            url: api.uploadUrl,
            dataType:"file",
                params:{
                    file:file.file,
                    type:0,
                }
            })
            const fileName =result.data.fileName
            //console.log(fileName);
            emit("update:modelValue",fileName);
            emit("callback",fileName);
        }
    </script>
    
    <style lang="scss">
    .cover-upload-btn{
        width:150px;
        height:150px;
        border-radius: 70px;
        background-image:url(../assets/default_img.png);
    img{
        width:100%;
        border-radius: 70px;
    }
    }
    </style>
    