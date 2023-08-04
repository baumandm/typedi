"use strict";(self.webpackChunk_typed_inject_website=self.webpackChunk_typed_inject_website||[]).push([[440],{9613:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>v});var n=r(9496);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),m=c(r),d=i,v=m["".concat(p,".").concat(d)]||m[d]||u[d]||o;return r?n.createElement(v,a(a({ref:t},l),{},{components:r})):n.createElement(v,a({ref:t},l))}));function v(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,a=new Array(o);a[0]=d;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[m]="string"==typeof e?e:i,a[1]=s;for(var c=2;c<o;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6004:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>a,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=r(1966),i=(r(9496),r(9613));const o={sidebar_position:6},a="Usage in JavaScript",s={unversionedId:"guide/services/usage-in-javascript",id:"guide/services/usage-in-javascript",title:"Usage in JavaScript",description:"TypeDI is primarily developed for use in TypeScript.",source:"@site/docs/guide/services/usage-in-javascript.md",sourceDirName:"guide/services",slug:"/guide/services/usage-in-javascript",permalink:"/docs/guide/services/usage-in-javascript",draft:!1,editUrl:"https://github.com/freshgum-bubbles/typedi/tree/develop/docs/docs/docs/guide/services/usage-in-javascript.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Transient Services",permalink:"/docs/guide/services/transient-services"},next:{title:"HostContainer",permalink:"/docs/guide/services/host-container"}},p={},c=[{value:"<code>JSService</code> type",id:"jsservice-type",level:2},{value:"Function classes",id:"function-classes",level:2}],l={toc:c},m="wrapper";function u(e){let{components:t,...r}=e;return(0,i.kt)(m,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"usage-in-javascript"},"Usage in JavaScript"),(0,i.kt)("p",null,"TypeDI is primarily developed for use in TypeScript.\nHowever, to make it ",(0,i.kt)("em",{parentName:"p"},"easier")," to make use of it in JavaScript, a ",(0,i.kt)("a",{parentName:"p",href:"pathname:///api-reference/functions/JSService-1.html"},(0,i.kt)("inlineCode",{parentName:"a"},"JSService"))," function is provided."),(0,i.kt)("p",null,"As an example of how to use it, let's tweak the logging service we made in the ",(0,i.kt)("a",{parentName:"p",href:"/docs/examples/hello-world"},"Hello World! example"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="src/log.service.js"',title:'"src/log.service.js"'},"import { JSService } from '@freshgum/typedi';\n\nexport const LogService = JSService(\n  [],\n  class LogService {\n    log(message) {\n      console.log(message);\n    }\n  }\n);\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/root.service.js"',title:'"src/root.service.js"'},"import { Service } from '@freshgum/typedi';\n\nexport const RootService = JSService(\n  [LogService],\n  class RootService {\n    public constructor(private logger) {}\n\n    run() {\n      this.logger.log('Hello World!');\n    }\n  }\n);\n")),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"As with ",(0,i.kt)("a",{parentName:"p",href:"pathname:///api-reference/functions/Service.html"},(0,i.kt)("inlineCode",{parentName:"a"},"Service")),", don't forget to place any dependencies your service requires in the array.\nOtherwise, TypeDI won't know your service requires them, and won't pass them in as arguments.")),(0,i.kt)("p",null,"As you can see, the API is quite similar to its TypeScript-friendly equivalent.\nWith our changes, the example above will run in plain JavaScript with no problems."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"But we're not done yet"),"."),(0,i.kt)("h2",{id:"jsservice-type"},(0,i.kt)("inlineCode",{parentName:"h2"},"JSService")," type"),(0,i.kt)("p",null,"In the examples above, TypeScript doesn't interpret each service as a class. That means the following will fail:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/example.ts"',title:'"src/example.ts"'},"import { LogService } from './log.service';\n// highlight-next-line-error\nconst logService: LogService = new LogService();\n// highlight-error-comment-start\n//    ^^^^^^^^^^\n//    'LogService' refers to a value, but is being used as a type here. Did you mean 'typeof MyService'?\n// highlight-error-comment-end\n")),(0,i.kt)("p",null,"If you're type-checking JavaScript with TypeScript, that can quickly become a problem.\nThat's where the ",(0,i.kt)("inlineCode",{parentName:"p"},"JSService")," ",(0,i.kt)("em",{parentName:"p"},"type")," comes in."),(0,i.kt)("p",null,"Cleverly, the ",(0,i.kt)("inlineCode",{parentName:"p"},"JSService")," import is actually ",(0,i.kt)("em",{parentName:"p"},"two")," imports: one for the function implementation, and another for a type.\nThe type allows you to wrap the service in the type to elide type errors, like so:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/example.ts"',title:'"src/example.ts"'},"import { JSService } from '@freshgum/typedi';\nimport { LogService } from './log.service';\n\nconst logService: JSService<typeof LogService> = new LogService();\n")),(0,i.kt)("admonition",{type:"note"},(0,i.kt)("p",{parentName:"admonition"},"Unfortunately, due to a limitation in TypeScript, it's not currently possible to export the equivalent ",(0,i.kt)("inlineCode",{parentName:"p"},"JSService"),"-wrapped\ntype from a ",(0,i.kt)("inlineCode",{parentName:"p"},".js")," file. See ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/microsoft/TypeScript/issues/48104"},"microsoft/TypeScript#48104"),".")),(0,i.kt)("h2",{id:"function-classes"},"Function classes"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"JSService")," function also supports functional classes as opposed to ES6 ones."),(0,i.kt)("p",null,"This lets us take advantage of TypeDI in ES5 environments without any transpilation steps."),(0,i.kt)("p",null,"As an example, let's change the ",(0,i.kt)("inlineCode",{parentName:"p"},"LogService")," we made above to the following:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="src/log.service.js"',title:'"src/log.service.js"'},"import { JSService } from '@freshgum/typedi';\n\nexport const LogService = JSService([], function LogService() {});\n\nLogService.prototype.log = function (message) {\n  console.log(message);\n};\n")),(0,i.kt)("p",null,"We've now moved our methods outside of the main call to ",(0,i.kt)("inlineCode",{parentName:"p"},"JSService"),".\nInstead, they reside below it."),(0,i.kt)("admonition",{type:"info"},(0,i.kt)("p",{parentName:"admonition"},"It's generally recommended to use ES6 classes wherever possible, as they provide\na better experience in editors such ",(0,i.kt)("a",{parentName:"p",href:"https://code.visualstudio.com/"},"Visual Studio Code"),". The example above might need additional typing in adjacent ",(0,i.kt)("inlineCode",{parentName:"p"},".d.ts")," files."),(0,i.kt)("p",{parentName:"admonition"},"As of currently, the methods in the above service are not automatically inferred by\nTypeScript. Therefore, when used, they are of type ",(0,i.kt)("inlineCode",{parentName:"p"},"any"),".")))}u.isMDXComponent=!0}}]);