(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"1OvB":function(t,e,a){"use strict";a.r(e);var i={name:"BlogPage",data:function(){return{loading:!1}}},n=a("KHd+"),o=null,l=Object(n.a)(i,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("Layout",[a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{"min-height":"600px"}},[a("el-card",{staticStyle:{"min-height":"400px"},attrs:{shadow:"never"}},[a("div",{attrs:{slot:"header"},slot:"header"},[a("el-row",[a("el-col",{attrs:{span:12}},[a("span",[t._v(t._s(t.$page.blog.title))])]),a("el-col",{attrs:{span:12}},[a("div",{staticStyle:{"text-align":"right"}},[a("el-button",{staticStyle:{padding:"3px 0"},attrs:{type:"text",icon:"el-icon-share"},on:{click:function(e){return t.$share()}}},[t._v("分享")])],1)])],1)],1),a("div",{staticStyle:{"font-size":"0.9rem","line-height":"1.5",color:"#606c71"}},[t._v("\n                发布 "+t._s(t.$page.blog.created_at)+"\n                "),a("br"),t._v(" 更新 "+t._s(t.$page.blog.updated_at)+"\n            ")]),a("div",{staticStyle:{"font-size":"1.1rem","line-height":"1.5",color:"#303133","border-bottom":"1px solid #E4E7ED",padding:"5px 0px 5px 0px"}},[a("pre",{staticStyle:{"font-family":"'微软雅黑'"}},[t._v(t._s(t.$page.blog.description))])]),a("div",{directives:[{name:"g-image",rawName:"v-g-image"}],staticClass:"markdown-body",staticStyle:{"padding-top":"20px"},domProps:{innerHTML:t._s(t.$page.blog.content)}})])],1)])}),[],!1,null,null,null);"function"==typeof o&&o(l);e.default=l.exports}}]);