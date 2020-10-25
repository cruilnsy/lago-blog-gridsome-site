<template>
    <div>
        <el-card shadow="never">
            <el-menu :default-active="active" @select="onSelect">
                <el-menu-item v-for="item in constantRouterMap"
                    :key="item.path" :index="item.path"
                    v-if="item.meta&&item.meta.type=='user'&&(token||!item.meta.LoginRequired)&&(!mini||!item.meta.mini)">
                        <i :class="item.meta.icon"></i>
                        <span slot="title">{{item.meta.title}}</span>
                </el-menu-item>
            </el-menu>
        </el-card>

        <el-card shadow="never" style="margin-top: 20px;text-align: center">
            <div v-if="!token" style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                <el-tag type="danger" size="small">&nbsp;</el-tag>&nbsp;&nbsp; Token未绑定&nbsp;&nbsp;
                <!-- <el-button type="text" @click="openTokenDialog">绑定</el-button> -->
            </div>
            <div v-if="token" style="font-size: 0.9rem;line-height: 1.5;color: #303133;">
                <el-tag type="success" size="small">&nbsp;</el-tag>&nbsp;&nbsp; Token已绑定&nbsp;&nbsp;
                <!-- <el-button type="text" @click="cancellation">注销</el-button> -->
            </div>
            <div style="margin-top: 10px;text-align: left">
                <el-alert title="Token获取" type="info" description="在 github-> settings-> developerSettings-> personalAccessTokens 勾选gist权限,获取Token. 详情参考README.md"
                    :closable="false">
                </el-alert>
            </div>
        </el-card>
        <!-- <token-dialog ref="tokenDialog"></token-dialog> -->
    </div>
</template>

<script>
    // import { mapGetters } from 'vuex'
    // import { constantRouterMap } from '@/router'
    // import TokenDialog from '@/views/common/TokenDialog'
    const constantRouterMap = [
        {
            path: '/user/new',
            redirect: '/user/new/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-star-off',
                title: '最新动态'
            },
            children: [
                {
                    path: 'main',
                    // component: NewMain,
                    meta: { title: '最新动态' }
                }
            ]
        },
        {
            path: '/user/social',
            redirect: '/user/social/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-mobile-phone',
                title: '社交圈'
            },
            children: [
                {
                    path: 'main',
                    // component: SocialMain,
                    meta: { title: '社交圈' }
                },
                {
                    path: 'details/:name',
                    // component: SocialDetails,
                    meta: { title: '用户资料' }
                }
            ]
        },
        {
            path: '/user/blog',
            redirect: '/user/blog/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-edit-outline',
                title: '博客列表'
            },
            children: [
                {
                    path: 'main',
                    // component: BlogMain,
                    meta: { title: '博客列表' }
                },
                {
                    path: 'add',
                    // component: BlogAdd,
                    meta: { title: '发表博客' }
                },
                {
                    path: 'edit/:id',
                    // component: BlogEdit,
                    meta: { title: '编辑博客' }
                },
                {
                    path: 'details/:id',
                    // component: BlogDetails,
                    meta: { title: '博客详情' }
                }
            ]
        },
        {
            path: '/user/project',
            redirect: '/user/project/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-service',
                title: '开源项目'
            },
            children: [
                {
                    path: 'main',
                    // component: ProjectMain,
                    meta: { title: '项目列表' }
                },
                {
                    path: 'details/:name',
                    // component: ProjectDetails,
                    meta: { title: '项目详情' }
                }
            ]
        },
        {
            path: '/user/helper',
            redirect: '/user/helper/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-printer',
                title: '使用帮助',
                mini: true
            },
            children: [
                {
                    path: 'main',
                    // component: HelperMain,
                    meta: { title: '使用帮助' }
                }
            ]
        },
        {
            path: '/user/readme',
            redirect: '/user/readme/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-document',
                title: 'README.md'
            },
            children: [
                {
                    path: 'main',
                    // component: ReadmeMain,
                    meta: { title: 'README.md' }
                }
            ]
        },
        {
            path: '/user/configure',
            redirect: '/user/configure/main',
            // component: Layout,
            meta: {
                type: "user",
                icon: 'el-icon-setting',
                title: '系统配置',
                LoginRequired: true
            },
            children: [
                {
                    path: 'main',
                    // component: ConfigureMain,
                    meta: { title: '系统配置' }
                }
            ]
        },



        {
            path: "/404",
            // component: Error404
        },
        {
            path: '/',
            redirect: '/user/new',
        },
        {
            path: "*",
            redirect: "/404"
        },

        //mobile
        {
            path: '/mobile/user/blog',
            redirect: '/mobile/user/blog/main',
            // component: MobileLayout,
            meta: {
                type: "mobile",
                icon: 'edit',
                title: '博客'
            },
            children: [
                {
                    path: 'main',
                    // component: MobileBlogMain,
                    meta: {
                        scrollTop: true
                    }
                },
                {
                    path: 'details/:id',
                    // component: MobileBlogDetails,
                    meta: {
                        scrollTop: true
                    }
                }
            ]

        },
        {
            path: '/mobile/user/project',
            redirect: '/mobile/user/project/main',
            // component: MobileLayout,
            meta: {
                type: "mobile",
                icon: 'like-o',
                title: '项目'
            },
            children: [
                {
                    path: 'main',
                    // component: MobileProjectMain,
                    meta: {
                        scrollTop: true
                    }
                },
                {
                    path: 'details/:name',
                    // component: MobileProjectDetails,
                    meta: {
                        scrollTop: true
                    }
                }
            ]

        },
        {
            path: '/mobile/user/self',
            redirect: '/mobile/user/self/main',
            // component: MobileLayout,
            meta: {
                type: "mobile",
                icon: 'contact',
                title: '个人'
            },
            children: [
                {
                    path: 'main',
                    // component: MobileSelfMain,
                    meta: {
                        scrollTop: true
                    }
                }
            ]

        },
    ]

    export default {
        // components: {
        //     TokenDialog
        // },
        data() {
            return {
                constantRouterMap,
                active: "",
                parentUrl: "",
                menuList: [],
                token: false,
                githubUsername: '',
                mini: false
            }
        },
        mounted() {
            let arr = this.$route.path.split("/")
            this.active = "/" + arr[1] + "/" + arr[2]
        },
        methods: {
            onSelect(index) {
                this.$router.push(index)
            },
            // openTokenDialog() {
            //     this.$refs.tokenDialog.open(() => {
           
            //     })
            // },
            cancellation() {
                this.$store.dispatch("Cancellation")
            }
        }
    }
</script>