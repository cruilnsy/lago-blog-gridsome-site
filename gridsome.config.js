// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
	siteName: "Gridsome",
	plugins: [
		{
			use: "@gridsome/source-strapi",
			options: {
				apiURL: "http://localhost:1337",
				queryLimit: 1000, // Defaults to 100
				contentTypes: ["blog", "project", "follower", "following"], // StrapiBlog,
				// typeName: 'Strapi',
				//  singleTypes: ['general'],
				// Possibility to login with a Strapi user,
				// when content types are not publicly available (optional).
				// loginData: {
				//   identifier: '',
				//   password: ''
				// }
			},
		},
	],
	templates: {
		StrapiBlog: [
			{
				path: "/user/blog/:id",
				component: "./src/templates/Blog.vue",
			},
		],
		StrapiProject: [
			{
				path: "/user/project/:id",
				component: "./src/templates/Project.vue",
			},
		],
	},
};
