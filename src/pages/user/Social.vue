<template>
	<Layout>
		<div>
        <el-card shadow="never" style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px">
            <el-tabs v-model="activeTab" type="card" @tab-click="onSelect">
                <el-tab-pane :label="'粉丝 '+$page.followers.totalCount" name="followers" style="padding: 5px">
                    <div v-loading="followers.loading">
                        <div v-if="followers.list.length">
                            <el-row style="min-height: 200px; ">
                                <el-col :span="8" v-for="follower in followers.list" :key="'followers'+follower.node.id" style="padding: 10px">
                                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                        <i class="el-icon-star-off"></i>&emsp;
                                        <a @click="$router.push(`/user/social/details/${follower.node.name}`)" style=" text-decoration:none;cursor:pointer">{{follower.node.name}}</a>
                                        <br>
                                        <i class="el-icon-message"></i>&emsp;
                                        <a :href="follower.node.htmlUrl" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                        <br>
                                        <img :src="follower.node.avatarUrl" style="width: 100%;border-radius:5px;margin-top: 5px">
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div style="text-align: center;margin-top: 10px">
                                <el-pagination @current-change="onSelect" background layout="prev, pager, next" :current-page.sync="followers.query.page"
                                    :page-size="followers.query.pageSize" :total="followers.query.pageNumber*followers.query.pageSize">
                                </el-pagination>
                            </div>
                        </div>
                        <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                            <font style="font-size: 30px;color:#dddddd ">
                                <b>(￢_￢) 没有一个粉丝</b>
                            </font>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="'关注 '+$page.followings.totalCount" name="following" style="padding: 5px">
                    <div v-loading="following.loading">
                        <div v-if="following.list.length">
                            <el-row style="min-height: 200px; ">
                                <el-col :span="8" v-for="following in following.list" :key="'following'+following.node.id" style="padding: 10px">
                                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                        <i class="el-icon-star-off"></i>&emsp;
                                        <a @click="$router.push(`/user/social/details/${following.node.name}`)" style=" text-decoration:none;cursor:pointer">{{following.node.name}}</a>
                                        <br>
                                        <i class="el-icon-message"></i>&emsp;
                                        <a :href="following.node.htmlUrl" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                        <br>
                                        <img :src="following.node.avatarUrl" style="width: 100%;border-radius:5px;margin-top: 5px">
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div style="text-align: center;margin-top: 10px">
                                <el-pagination @current-change="onSelect" background layout="prev, pager, next" :current-page.sync="following.query.page"
                                    :page-size="following.query.pageSize" :total="following.query.pageNumber*following.query.pageSize">
                                </el-pagination>
                            </div>
                        </div>
                        <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                            <font style="font-size: 30px;color:#dddddd ">
                                <b>(￢_￢) 还没有关注一个人</b>
                            </font>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
	</Layout>
</template>

<page-query>
query  {
  followings: allStrapiFollowing {
    totalCount
    edges {
      node  {
		id
        name
        htmlUrl
        avatarUrl
        created_at
        updated_at
      }
    }
  }
  followers: allStrapiFollower {
    totalCount
    edges {
      node  {
		id
        name
        htmlUrl
        avatarUrl
        created_at
        updated_at
      }
    }
  }
}

</page-query>

<script>
export default {
	name: "SocialPage",
	data () {
		return {
			activeTab: "followers",
			followers: {
				query: {
					page: 1,
					pageSize: 9,
					pageNumber: 1
				},
				loading: false,
				list: []
			},
			following: {
				query: {
					page: 1,
					pageSize: 9,
					pageNumber: 1
				},
				loading: false,
				list: []
			}
		}
	},
	mounted() {
        this.onSelect()

    },
	methods: {
		onSelect() {
			switch (this.activeTab) {
				case "followers":
					this.listFollowers()
					break
				case "following":
					this.listFollowing()
					break
				default:
					break
			}
		},
		listFollowers() {
			this.followers.loading = true
			this.followers.list = this.$page.followers.edges
			this.followers.loading = false
		},
		listFollowing() {
			this.following.loading = true
			this.following.list = this.$page.followings.edges
			this.following.loading = false
		}
	}
};
</script>

<style></style>
