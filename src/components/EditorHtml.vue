<template>
    <div class="editor-html">
        <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"/>
      <Editor
        :style="{height: height+'px','overflow-y': 'hidden'}"
        :model-value="modelValue"
        @onChange ="onChange"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated" 
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import {onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'


const props = defineProps({
    modelValue:{
        type:String,
        default:"",
    },
    height:{
        type:Number,
        default: 500,
    }
})
console.log('ppp',props)
const mode=ref('default');

const editorRef = shallowRef()

// 内容 HTML
//不应该使用这里的modelValue 应该到Test.vue里输出markdownContent
// const modelValue = ref('<p>hello</p>')
// const modelValue = props.modelValue

const toolbarConfig = {}
const editorConfig = { 
    placeholder: '请输入内容...', MENU_CONF: {
    uploadImage:{
        maxFileSize:3*1024*1024,
        server:"/api/file/uploadImage4WangEditor",
        customInsert(res,insertFn){
            insertFn(res.data.url, "" , "" );
        }
        }
    } 
}

//应该是emit想办法绑定双方
const emit = defineEmits();
const onChange = (editor)=>{
emit("update:modelValue",editor.getHtml());
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<style lang="scss">
.editor-html{
    border: 1px solid #ddd;
}</style>