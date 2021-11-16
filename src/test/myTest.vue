<template>
    <div class="myTest">
        <el-button @click="show = !show">点击查看</el-button>
        <el-dialog
            title="查看图片"
            :visible.sync="show"
            append-to-body>
            <canvas id="mycanvas" @click="doDraw"></canvas>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'myTest',
    data(){
        return {
            name: '查看',
            show: false,
            isDrow: false
        }
    },
    methods: {
        wait(ms){
            return new Promise(()=>{
                setTimeout(()=>{}, ms);
            });
        },
        doDraw(){
            console.log(this.name);
            var search = new Promise(async function(resolve){
                for (let i=0;i<3;i++){
                    var canvas = document.getElementById('mycanvas');
                    if(!canvas){
                        await this.wait(100);
                    }else{
                        break;
                    }
                }
                resolve(canvas);
            });
            search.then((canvas) => {
                if(!this.isDrow){
                    var context = canvas.getContext('2d');
                    context.font = "26px Arial bolder";
                    context.fillStyle = 'blue';
                    context.fillText("我要养猫",0,26);
                    this.isDrow = true;
                }
            });
        }
    }
}
</script>

<style scoped>
#mycanvas {
    border: 1px solid rgb(199, 198, 198);
}
</style>