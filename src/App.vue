<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}

.blue-btn {
    background: rgb(112, 165, 236) !important;
    border: none !important;
}
.red-btn{
	background:#E0595B !important;
	opacity:0.66
}
.right{
	float:right;
}
.mg_bottom_20{
	margin-bottom:20px;
}
.mg_5{
	margin: 5px
}
.mg_20{
	margin: 20px
}
.brand_select {
    width: 260px !important;
}
.input_select {
    width: 195px !important;
}
.brand_text{
    font-size:8px;
    color:#ccc;
    margin-right:10px;
}
.spec_content{
    width:100% !important;
    padding:10px !important;
    background:#eee !important;
    position:relative !important;
}
.wt_100{
	width:100%
}
.goods_close{
    color:#20a0ff;
    right: 21px;
    top: 21px;
    position: absolute;
}
.sku_select{
    width:50%;
    padding:10px;
}
.sku_value{
   width:100%;
   background-color:transparent;
   -webkit-appearance:none;
}
.mg-l-10{
	margin-left: 10px;
}
.mg-r-20{
	margin-right:20px;
}
.mg-r-50{
	margin-right:50px !important;
}
.color_3{
	color:#333;
}
.text_center{
	text-align:center
}
.mg-auto{
margin:auto 0;
}
.pd-10{
	padding:10px;
}
.case_table{
    width: 100%;
    margin-bottom: 20px;
    height: 380px;
    overflow-y: scroll !important;
}
</style>