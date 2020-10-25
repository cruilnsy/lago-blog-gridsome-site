<template>
    <Layout>
        <div style="min-height: 600px" v-loading="loading">
            <el-card shadow="never" style="min-height: 400px">
                <div slot="header">
                    <el-row>
                        <el-col :span="12">
                            <span>{{$page.blog.title}}</span>
                        </el-col>
                        <el-col :span="12">
                            <div style="text-align: right;">
                                <el-button @click="$share()" style="padding: 3px 0" type="text" icon="el-icon-share">分享</el-button>
                                <!-- <el-button @click="edit" style="padding: 3px 0" type="text" icon="el-icon-edit" v-if="token">编辑</el-button>
                                <el-button style=" padding: 3px 0" type="text" icon="el-icon-more-outline" @click="more">更多博客</el-button> -->
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                    发布 {{$page.blog.created_at}}
                    <br> 更新 {{$page.blog.updated_at}}
                </div>
                <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;border-bottom: 1px solid #E4E7ED;padding: 5px 0px 5px 0px">
                    <pre style="font-family: '微软雅黑'">{{$page.blog.description}}</pre>
                </div>
                <div v-html="$page.blog.content" class="markdown-body" style="padding-top: 20px"></div>
            </el-card>
        </div>
    </Layout>
</template>

<page-query>
    query ($id: ID!) {
        blog: strapiBlog (id: $id) {
            id
            title
            content
            description
            created_at
            updated_at
        }
    }
</page-query>

<script>
export default {
    name: "BlogPage",
    data () {
        return {
            loading: false
        }
    }
};
</script>

<style></style>
