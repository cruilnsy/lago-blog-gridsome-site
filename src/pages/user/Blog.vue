<template>
  <Layout>
      <div style="min-height: 600px" v-loading="loading">
        <el-card shadow="never" style="margin-bottom: 20px">
            <el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
            <el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
            <el-button @click="$share()" style="margin-left: 10px" icon="el-icon-share" type="warning" plain circle></el-button>
            <el-button type="primary" icon="el-icon-edit" round plain style="float: right;" @click="goAdd">写博文</el-button>
        </el-card>

        <div v-if="blogs&&blogs.length>0">
            <el-card shadow="hover" v-for="blog in blogs" :key="'p'+blog.node.id" style="margin-bottom: 20px">
                <div slot="header">
                    <el-row>
                        <el-col :span="16">
                            <span>
                                <a style="text-decoration:none;cursor:pointer" @click="goDetails(blog.node.id)">
                                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp; {{blog.node.title}}
                                </a>
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: right;">
                                <el-button @click="$share('/user/blog/details/'+blog.node.id)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
                                <!-- <el-button @click="editBlog(blog.node.id)" style="padding: 3px 0" type="text" icon="el-icon-edit" v-if="token"></el-button>
                                <el-button @click="deleteBlog(blog.node.id)" style="padding: 3px 0" type="text" icon="el-icon-delete" v-if="token"></el-button> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                    最近更新 {{blog.node.updated_at}}
                </div>
                <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 10px 0px 0px 0px">
                    {{blog.node.description}}
                </div>
            </el-card>
            <div style="text-align: center">
                <!-- <el-pagination @current-change="list" background layout="prev, pager, next" :current-page.sync="query.page" :page-size="query.pageSize"
                    :total="query.pageNumber*query.pageSize">
                </el-pagination> -->
                <Pager :info="$page.blogs.pageInfo"/>
            </div>

        </div>

        <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-if="!blogs||blogs.length==0">
            <font style="font-size: 30px;color:#dddddd ">
                <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
            </font>
        </el-card>
    </div>
  </Layout>
</template>

<page-query>
    query  {
        blogs: allStrapiBlog {
            pageInfo {
                totalPages
                currentPage
            }
            edges {
                node  {
                    id
                    title
                    content
                    description
                    created_at
                    updated_at
                }
            }
        }
    }
</page-query>

<script>
import { Pager } from 'gridsome'

export default {
    name: 'BlogsPage',
    data () {
        return {
            loading: false,
            searchKey: ""
        }
    },
    components: {
        Pager
    },
    computed: {
        blogs () {
            return this.$page.blogs.edges
        }
    },
    methods: {
        search() {
                for (let i = 0; i < this.blogs.length; i++) {
                    this.blogs[i].hide = this.blogs[i].title.indexOf(this.searchKey) < 0
                }
        },
        goAdd() {
            alert('Go Add!')
        },
        goDetails(id) {
            this.$router.push("/user/blog/" + id)
        }
    }
}
</script>

<style>

</style>