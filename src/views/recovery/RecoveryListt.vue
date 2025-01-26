<template>
    <div>
        
    </div>
</template>

<script setup>

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

<style lang="scss">
</style>