"use strict";(self.webpackChunk_freshgum_typedi_docs=self.webpackChunk_freshgum_typedi_docs||[]).push([[300],{9613:(e,r,t)=>{t.d(r,{Zo:()=>c,kt:()=>v});var n=t(9496);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=n.createContext({}),l=function(e){var r=n.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},c=function(e){var r=l(e.components);return n.createElement(p.Provider,{value:r},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,s=e.originalType,p=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),d=l(t),m=o,v=d["".concat(p,".").concat(m)]||d[m]||u[m]||s;return t?n.createElement(v,i(i({ref:r},c),{},{components:t})):n.createElement(v,i({ref:r},c))}));function v(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var s=t.length,i=new Array(s);i[0]=m;var a={};for(var p in r)hasOwnProperty.call(r,p)&&(a[p]=r[p]);a.originalType=e,a[d]="string"==typeof e?e:o,i[1]=a;for(var l=2;l<s;l++)i[l]=t[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},5617:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>p,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var n=t(1966),o=(t(9496),t(9613));const s={sidebar_position:2,sidebar_class_name:"sidebar_doc_incomplete"},i="Stopping Our App",a={unversionedId:"examples/nodejs-web-server/application-disposal",id:"examples/nodejs-web-server/application-disposal",title:"Stopping Our App",description:"Our WebServerService is pretty smart. It creates a server for us on-demand,",source:"@site/docs/examples/nodejs-web-server/application-disposal.md",sourceDirName:"examples/nodejs-web-server",slug:"/examples/nodejs-web-server/application-disposal",permalink:"/typedi/docs/examples/nodejs-web-server/application-disposal",draft:!1,editUrl:"https://github.com/freshgum-bubbles/typedi/docs/docs/examples/nodejs-web-server/application-disposal.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,sidebar_class_name:"sidebar_doc_incomplete"},sidebar:"tutorialSidebar",previous:{title:"NodeJS Web Server",permalink:"/typedi/docs/examples/nodejs-web-server/implementation"},next:{title:"Adding Testing",permalink:"/typedi/docs/examples/nodejs-web-server/testing"}},p={},l=[],c={toc:l},d="wrapper";function u(e){let{components:r,...t}=e;return(0,o.kt)(d,(0,n.Z)({},c,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"stopping-our-app"},"Stopping Our App"),(0,o.kt)("p",null,"Our ",(0,o.kt)("inlineCode",{parentName:"p"},"WebServerService")," is pretty smart. It creates a server for us on-demand,\nwhile also handling any requests from users on the server's port."),(0,o.kt)("p",null,"However, one thing it doesn't do is allow the consumer to shut ",(0,o.kt)("em",{parentName:"p"},"down")," the server.\nCurrently, the only way to do this is to stop the Node.js process altogether."),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"This is an anti-pattern; services should ",(0,o.kt)("em",{parentName:"p"},"always")," provide a way to close down\nany resources they may create over their lifetime. For example, a service\nmanaging database connections should allow for the closing of connections too.")),(0,o.kt)("p",null,"Let's update our web server service to provide a ",(0,o.kt)("inlineCode",{parentName:"p"},"shutdown")," method, which will\nshutdown the active HTTP server."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'src="webserver.service.ts"',src:'"webserver.service.ts"'},"// ...\n\n@Service([DatabaseService])\nclass WebServerService {\n  // ...\n  // highlight-revision-start\n  stopServer() {\n    if (this.server?.listening) {\n      this.server.close();\n    }\n  }\n  // highlight-revision-end\n  // ...\n}\n")))}u.isMDXComponent=!0}}]);