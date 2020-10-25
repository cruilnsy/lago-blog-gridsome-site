<template>
    <div>
        <section class="page-header" :style="'background-image: linear-gradient(120deg, '+backgroundColorLeft+', '+backgroundColorRight+');color: '+fontColor+';'">
            <div style="position:absolute; top:20px; right:20px; z-index:2;">
                <el-tooltip effect="dark" :content="fullButton.full?'退出':'全屏'" placement="bottom-end">
                    <el-button @click="full" :icon="fullButton.full?'el-icon-close':'el-icon-rank'" circle></el-button>
                </el-tooltip>
            </div>
            <div v-for="(item,index) in randomIcon" :key="'ri'+index" :style="'position:absolute; top:'+item.top+'px; left:'+item.left+'px; z-index:1;'">
                <font :style="'font-size: '+item.size+'px;color:#fff;'">
                    <b>♪</b>
                </font>
            </div>
            <h1 class="project-name">{{blogTitle}}</h1>
            <h2 class="project-tagline">{{blogDescribe}}</h2>
            <a :href="'https://github.com/cruilnsy'+githubUsername" class="btn" target="_blank">我的GitHub</a>
            <a href="https://github.com/cruilnsy" class="btn" target="_blank" v-if="!mini">博客源码</a>
        </section>
        <div style="position:relative;  z-index:2;margin: auto;margin-top:-30px;width:64rem;">
            <el-card shadow="never" :body-style="{ padding: '0px' }">
                <el-row>
                    <el-col :span="10">
                        <el-menu @select="selectTopbar" :default-active="topbar.active" mode="horizontal" menu-trigger="click">
                            <el-submenu index="#more">
                                <template slot="title">了解博主</template>
                                <el-menu-item index="#githubHome">github主页</el-menu-item>
                                <el-menu-item index="#blog">其他博客</el-menu-item>
                            </el-submenu>
                            <el-submenu index="#webSites" v-if="webSites.length>0">
                                <template slot="title">其他网站</template>
                                <el-menu-item :index="'#webSites-'+index" v-for="(item,index) in webSites" :key="'#webSites'+index">{{item.name}}</el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                    <el-col :span="8" style="text-align: center;padding: 12px 0px 0px 10px">
                        <el-row>
                            <el-col :span="4">
                                <el-popover placement="top" trigger="hover">
                                    <div style="text-align: center">
                                        <el-progress color="#67C23A" type="circle" :percentage="music.volume"></el-progress>
                                        <br>
                                        <el-button @click="changeVolume(-10)" icon="el-icon-minus" circle></el-button>
                                        <el-button @click="changeVolume(10)" icon="el-icon-plus" circle></el-button>
                                    </div>

                                    <el-button @click="play" id="play" slot="reference" :icon="music.isPlay?'el-icon-refresh':'el-icon-caret-right'" circle></el-button>
                                </el-popover>
                            </el-col>
                            <el-col :span="14" style="padding-left: 20px">
                                <el-slider @change="changeTime" :format-tooltip="$util.formatTime" :max="music.maxTime" v-model="music.currentTime" style="width: 100%;"></el-slider>
                            </el-col>
                            <el-col :span="6" style="padding: 9px 0px 0px 10px;color:#909399;font-size: 13px">
                                {{$util.formatTime(music.currentTime)}}/{{$util.formatTime(music.maxTime)}}
                            </el-col>
                        </el-row>

                        <audio ref="music" loop autoplay v-if="audioAutoPlay">
                            <source :src="audioUrl" type="audio/mpeg">
                        </audio>
                        <audio ref="music" loop v-else>
                            <source :src="audioUrl" type="audio/mpeg">
                        </audio>
                    </el-col>
                    <el-col :span="4" style="text-align: right;">
                        <div style="font-size: 20px;color:#606266;margin-top: 5px">
                            <b>{{githubUsername}}</b>
                        </div>
                        <div style="color:#606266;">
                            <i class="el-icon-location"></i>&nbsp;{{location?location:'未填写地址'}}
                            <br>
                        </div>
                    </el-col>
                    <el-col :span="2" style="text-align: center;">
                        <img v-popover:bigAvatar :src="avatarUrl" style="margin-top: 4px;margin-right: 10px;width:52px; height:52px; border-radius:5px; border: 1px solid #EBEEF5"
                        />
                        <el-popover ref="bigAvatar" placement="top-start" :title="githubUsername" width="200" trigger="hover">
                            <i class="el-icon-star-on"></i>&emsp;{{name}}
                            <br>
                            <i class="el-icon-location"></i>&emsp;{{location}}
                            <br>
                            <img :src="avatarUrl" style="width: 200px;height: 200px;">
                        </el-popover>
                    </el-col>
                </el-row>

            </el-card>
        </div>
        <section class="main-content">
            <el-row>
                <el-col :span="6" style="padding-right:10px">
                    <sidebar></sidebar>
                </el-col>
                <el-col :span="18" style="padding-left:10px">
                    <slot/>
                    <!-- <app-main>
                    </app-main> -->
                </el-col>
                
            </el-row>
        </section>
        <section class="foot">
            <foot></foot>
        </section>


    </div>
</template>
<script>
    import Sidebar from './components/Sidebar'
    // import AppMain from './components/AppMain'
    import Foot from './components/Foot'
    export default {
        components: {
            Sidebar,
            // AppMain,
            Foot
        },
        data() {
            return {
                music: {
                    isPlay: false,
                    currentTime: 0,
                    maxTime: 0,
                    volume: 100
                },
                fullButton: {
                    full: false
                },
                topbar: {
                    active: "",
                },
                randomIcon: [],
                githubUsername:'',
                blogTitle: 'Welcome to Blog Cui',
                blogDescribe: '欢迎来到 Cui Rui 的博客',
                avatarUrl: '',
                name: '',
                location: '',
                blog: '',
                fontColor: '#fff',
                useBackgroundImage: '',
                backgroundColorLeft: 'rgb(38, 144, 249)',
                backgroundColorRight:'rgb(252, 45, 45)',
                audioUrl: '',
                mini: '',
                followersTotal: '',
                followingTotal: '',
                audioAutoPlay: '',
                webSites: []
            }
        },
        watch: {
            '$refs.music.currentTime': function () {
                console.log(this.$refs.music.currentTime)
            }
        },
        mounted() {
            this.$nextTick(() => {
                setInterval(this.listenMusic, 1000)
            })
            let width = window.innerWidth
            for (let i = 0; i < 12; i++) {
                let temp = {}
                let left = this.$util.randomInt(10, width - 310)
                if(left>width/2-150){
                    left+=300
                }
                temp["left"] = left
                temp["top"] = this.$util.randomInt(20, 300)
                temp["size"] = this.$util.randomInt(20, 40)
                this.randomIcon.push(temp)
            }
        },
        created() {

        },
        methods: {
            selectTopbar(index) {
                //取消菜单选中状态
                this.topbar.active = this.topbar.active == "" ? " " : ""
                switch (index) {
                    case "#githubHome":
                        window.open('https://github.com/' + this.githubUsername)
                        break
                    case "#blog":
                        if (this.blog) {
                            window.open((this.blog.match(/https?:\/\//i)?'':'https://') + this.blog)
                        } else {
                            this.$message({
                                message: '博主没有其他博客',
                                type: 'info'
                            })
                        }
                        break
                    default:
                        if(/#webSites-\d+/.test(index)){
                            let i = parseInt(index.split('-')[1])
                            let url = this.webSites[i].url
                            window.open((url.match(/https?:\/\//i)?'':'https://') + url)
                        }
                        break
                }
            },
            moveIcon(index) {
                let width = window.innerWidth
                this.randomIcon[index]["top"] = this.$util.randomInt(20, 300)
                let left = this.$util.randomInt(10, width - 310)
                if(left>width/2-150){
                    left+=300
                }
                this.randomIcon[index]["left"] = left
            },
            full() {
                if (!this.fullButton.full) {
                    this.$util.fullScreen()
                    this.fullButton.full = true
                } else {
                    this.$util.fullExit()
                    this.fullButton.full = false
                }
            },
            listenMusic() {
                if (!this.$refs.music) {
                    return
                }
                if (this.$refs.music.readyState) {
                    this.music.maxTime = this.$refs.music.duration
                }
                this.music.isPlay = !this.$refs.music.paused
                this.music.currentTime = this.$refs.music.currentTime
            },
            play() {
                if (this.$refs.music.paused) {
                    this.$refs.music.play()
                } else {
                    this.$refs.music.pause()
                }
                this.music.isPlay = !this.$refs.music.paused
                this.$nextTick(() => {
                    document.getElementById('play').blur()
                })

            },
            changeTime(time) {
                this.$refs.music.currentTime = time
            },
            changeVolume(v) {
                this.music.volume += v
                if (this.music.volume > 100) {
                    this.music.volume = 100
                }
                if (this.music.volume < 0) {
                    this.music.volume = 0
                }
                this.$refs.music.volume = this.music.volume / 100
            }
        }
    }
</script>

<style>
</style>