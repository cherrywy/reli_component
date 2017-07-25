<template>
  <div class='total'>
    <div class='content'>
      <el-form label-position='top' :model="ruleForm2" :rules="rules2" ref="ruleForm2"  label-width="20%" class="demo-ruleForm login-container">
    <el-form-item prop="account" label="账号">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass" label="密码">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;text-align:center;">
      <el-button type="primary" style="width:30%;margin:0 auto;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
    </el-form>
    </div>
    <div class='footer'>
      <span class='text'>@shoppingdata.cn 2017</span>
    </div>
  </div>
</template>

<script>
  import { requestLogin } from '../api/api';
  
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
           
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
          
            this.logining = true;
           
            var loginParams = { phone: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            requestLogin(loginParams).then(data => {
              this.logining = false;
         
              let { msg, error_code,result } = data;
              if (error_code !== 0) {
                this.$message({
                  message: msg,
                  duration: 1000,
                  type: 'error'
                });
              } else {
               
                localStorage.setItem('uid',result.id );
                localStorage.setItem('shop_id',result.user_data.shop_id );
                localStorage.setItem('head_office_id',result.user_data.head_office_id );
                localStorage.setItem('phone',result.user_data.phone );
                this.$router.push({ path: '/' });
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .content{
    width:100%;
    height:100%;
    position:absolute;
    top:0px;
    left:0px;
    background:url('/static/img/bg.jpg') no-repeat;
    background-size:100% 100%;
  }
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 300px;
    padding: 35px 35px 15px 35px;
    background: #f6f0eb;
    opacity:0.7;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .footer{
			position:absolute;
			bottom:25px;
			text-align:center;
      width:100%;
			.text{
				color:#999;
        font-size:18px;
			}
	}
</style>