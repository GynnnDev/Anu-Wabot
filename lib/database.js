module.exports = class Database{
create(value,name,expired){
if(typeof value == 'object' && !Array.isArray(this) && name){
this[name] = value
this[name].create = this.create
this[name].get = this.get
} else if (typeof value == 'object' && Array.isArray(this)){
this.push({value,create:this.create,get:this.get})
} else if(!Array.isArray(this)){
this[name] = value
} else {
this.push(value)
}
return this
}
get(method){
let result_data = {}
let isArr = Array.isArray(this)
switch(typeof method){
case 'string':
if (isArr){
result_data.index = this.findIndex(tr => tr == method)
result_data.value = this[result_data.index] 
} else {
result_data.value = this[method] 
result_data.index = method
}
break
case 'number':
result_data.value = this[method] 
result_data.index = method
break
case 'function':
if (Array.isArray(this)){
for (let i=0;i<this.length;i++){
if(method(this[i],i,i))result_data = {value:this[i],index:i}
}
} else {
for (let i =0;i<Object.keys(this).length;i++){
if(method(this[Object.keys(this)[i]],Object.keys(this)[i],i))result_data = {value:this[Object.keys(this)[i]],index:Object.keys(this)[i]}
}
}
break
}
if (!result_data.value)return
return result_data
}
}
