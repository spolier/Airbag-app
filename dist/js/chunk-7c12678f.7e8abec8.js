(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7c12678f"],{"1d52":function(t,e,i){"use strict";(function(t){i("c5f6"),i("cadf"),i("551c"),i("097d");e["a"]={name:"home",props:[""],data:function(){return{article:[],index:1,size:6,length:Number,prev:!1,next:!0}},components:{},computed:{},beforeMount:function(){},mounted:function(){this.axios(),this.$nextTick(function(){t("#opts a").eq(0).siblings().children(".opt").removeClass("active"),t("#opts a").eq(0).children(".opt").addClass("active")})},methods:{axios:function(){var t=this,e=[];this.$axios(this.HOST+"/list").then(function(i){for(var a=0,s=i.data.length;a<s;a++)e.push({id:i.data[a]._id,title:i.data[a].title,date:i.data[a].date,path:i.data[a].path,show:!0});t.article=e,t.pager(),console.log(i.data)}).catch(function(t){console.log(t)})},pagerPrev:function(){this.index--,this.index<1&&(this.index=1),this.pager()},pagerNext:function(){if(this.index++,this.index>this.total)return!1;this.pager()},pager:function(){this.index>1?this.prev=!0:1===this.index&&(this.prev=!1),this.index===this.total?this.next=!1:this.index<this.total&&(this.next=!0),this.length=this.article.length,this.total=Math.ceil(this.length/this.size);var t=(this.index-1)*this.size,e=this.index*this.size;e=e>this.length?this.length:e;for(var i=0,a=this.length;i<a;i++)this.article[i].show=i>=t&&i<e}},watch:{}}}).call(this,i("1157"))},b3d7:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[t._l(t.article,function(e,a){return e.show?i("article",{key:a,staticClass:"container container-index post"},[i("router-link",{staticClass:"entry-link",attrs:{to:{path:"/app/article",query:{id:e.id}}}},[i("header",{style:{backgroundImage:"url("+e.path+")"}},[i("h2",[t._v(t._s(e.title))]),i("span",[i("time",[t._v(t._s(e.date))])])])])],1):t._e()}),i("nav",{staticClass:"container",attrs:{id:"pagination-wrapper"}},[i("hr"),i("ul",{staticClass:"pager",attrs:{id:"pager"}},[i("li",{staticClass:"pager-prev text-left"},[i("a",{directives:[{name:"show",rawName:"v-show",value:t.prev,expression:"prev"}],staticClass:"page-link float-left",attrs:{href:"#"},on:{click:t.pagerPrev}},[t._v("上一页")])]),i("li",{staticClass:"pager-next text-right"},[i("a",{directives:[{name:"show",rawName:"v-show",value:t.next,expression:"next"}],staticClass:"page-link float-right",attrs:{href:"#"},on:{click:t.pagerNext}},[t._v("下一页")])])]),i("hr")])],2)},s=[],n=i("1d52"),r=n["a"],h=(i("cd22"),i("2877")),o=Object(h["a"])(r,a,s,!1,null,"45430978",null);o.options.__file="Home.vue";e["default"]=o.exports},c2f3:function(t,e,i){},cd22:function(t,e,i){"use strict";var a=i("c2f3"),s=i.n(a);s.a}}]);
//# sourceMappingURL=chunk-7c12678f.7e8abec8.js.map