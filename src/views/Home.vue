<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<el-button style='border:1px white solid;background:#70a5ec;color:white;' size='small' @click.native="logout"> 退出登录 </el-button>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="23" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title">
								<img :src="item.iconCls" width="20" height="20" style="vertical-align: middle;margin-right: 2px;">
								<span>{{item.name}}</span></template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
							<img :src="item.iconCls" width="20" height="20" style="vertical-align: middle;margin-right: 2px;">
							<span>{{item.children[0].name}}</span>

							</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<img :src="item.icon" width="20" height="20" style="vertical-align: middle;margin-right: 2px;">
							</div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active li-active':''" @click="$router.push(item.children[0].path)">
									<img :src="item.icon" width="20" height="20" style="vertical-align: middle;margin-right: 2px;">
								</div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container" style="margin-bottom:20x;">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<el-breadcrumb separator="/" class="breadcrumb-inner" style="margin-bottom: 20px;">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view>
							</router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		<el-col :span="24" class="footer">
			<span class='text'>@shoppingdata.cn 2017</span>
		</el-col>
	</el-row>
</template>

<script>
export default {
	data() {
		return {
			sysName: '智慧门店管理后台',
			collapsed: false,
			sysUserName: '',
			sysUserAvatar: '',
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			}
		}
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		},
		handleopen() {
			//console.log('handleopen');
		},
		handleclose() {
			//console.log('handleclose');
		},
		handleselect: function (a, b) {
		},
		//退出登录
		logout: function () {
			var _this = this;
			this.$confirm('确认退出吗?', '提示', {
				//type: 'warning'
			}).then(() => {
				sessionStorage.removeItem('user');
				_this.$router.push('/login');
			}).catch(() => {

			});


		},
		//折叠导航栏
		collapse: function () {
			this.collapsed = !this.collapsed;
		},
		showMenu(i, status) {
			this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
		}
	},
	mounted() {
		var user = sessionStorage.getItem('user');
		if (user) {
			user = JSON.parse(user);
			this.sysUserName = user.name || '';
			this.sysUserAvatar = user.avatar || '';
		}

	}
}

</script>

<style scoped lang="scss">
@import '~scss_vars';
.el-breadcrumb {
	font-size: 14px;
	line-height: 1;
}

.container {
	position: absolute;
	background: white;
	top: 0px;
	bottom: 0px;
	width: 100%;
	.header {
		height: 60px;
		line-height: 60px;
		background: #70a5ec;
		color: #fff;
		.userinfo {
			text-align: right;
			padding-right: 35px;
			float: right;
			.userinfo-inner {
				cursor: pointer;
				color: #fff;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 10px 0px 10px 10px;
					float: right;
				}
			}
		}
		.logo {
			//width:230px;
			height: 60px;
			font-size: 20px;
			padding-left: 30px;
			padding-right: 20px;
			border-color: #70a5ec;
			border-right-width: 1px;
			border-right-style: solid;
			img {
				width: 40px;
				float: left;
				margin: 10px 10px 10px 18px;
			}
			.txt {
				color: #fff;
			}
		}
		.logo-width {
			width: 230px;
		}
		.logo-collapse-width {
			width: 60px
		}
		.tools {
			padding: 0px 23px;
			width: 14px;
			height: 60px;
			line-height: 60px;
			cursor: pointer;
		}
	}
	.main {
		display: flex;
		position: absolute;
		top: 65px;
		border-radius: 5px;
		left: 2%;
		bottom: 30px;
		overflow: hidden;
		background: #eef1f6;
		aside {
			flex: 0 0 200px;
			width: 200px;
			border-right: white 3px solid;
			.el-menu {
				height: 100%;
				li .is-active {
					border-right: 3px #70a5ec solid;
				}
			}
			.collapsed {
				width: 60px;
				.item {
					position: relative;
				}
				.submenu {
					position: absolute;
					top: 0px;
					left: 60px;
					z-index: 99999;
					height: auto;
					display: none;
				}
			}
		}
		.menu-collapsed {
			flex: 0 0 60px;
			width: 60px;
		}
		.menu-expanded {
			flex: 0 0 200px;
			width: 200px;
		}
		.content-container {
			flex: 1;
			overflow-y: scroll;
			margin: 20px;
			.welcometext {
				font-size: 20px;
				padding: 10px 0px;
			}
			.smallimgs ul {
				height: 100px;
				float: left;
			}
			.smallimgs ul li {
				float: left;
				margin-right: 10px;
			}
			.smallimgs .moreimgs {
				width: 20px;
				height: 100px;
				background: #eee;
				border: none;
				outline: none;
			}
		}
	}
	.footer {
		position: absolute;
		bottom: 5px;
		text-align: center;
		.text {
			color: #999;
		}
	}
}
</style>