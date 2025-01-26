const regs={
    phone: /^((1[0-9]))\d{9}$/ ,
    //number: /^[0-9]*$/,
    password: /^\w+$/,
    //account:/^[O-9a-zA-Z_]{1,}$/,
    //ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    //pInt:/^[1-9]+[0-9]*$/,

}
const verify =(rule,value,reg,callback)=>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            callback(new Error(rule.message))
        }
    }else{
        callback()
    }
}

export default{
    phone:(rule,value,callback)=>{
        return verify(rule,value,regs.phone,callback)
    },
    password:(rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    },
   // account:(rule,value,callback)=>{
   //     return verify(rule,value,regs.account,callback)
    //},
   // pInt:(rule,value,callback)=>{
   //     return verify(rule,value,regs.pInt,callback)
   // },
   // ip:(rule,value,callback)=>{
   //     return verify(rule,value,regs.ip,callback)
   // },
}