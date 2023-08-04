"use strict";(self.webpackChunk_typed_inject_website=self.webpackChunk_typed_inject_website||[]).push([[909],{9613:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>g});var r=n(9496);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=l(n),m=a,g=u["".concat(c,".").concat(m)]||u[m]||d[m]||i;return n?r.createElement(g,o(o({ref:t},p),{},{components:n})):r.createElement(g,o({ref:t},p))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[u]="string"==typeof e?e:a,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5644:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var r=n(1966),a=(n(9496),n(9613));const i={sidebar_position:8},o="Eager Services",s={unversionedId:"guide/services/eager-services",id:"guide/services/eager-services",title:"Eager Services",description:"Ordinarily, services aren't created until either:",source:"@site/docs/guide/services/eager-services.md",sourceDirName:"guide/services",slug:"/guide/services/eager-services",permalink:"/docs/guide/services/eager-services",draft:!1,editUrl:"https://github.com/freshgum-bubbles/typedi/tree/develop/docs/docs/docs/guide/services/eager-services.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"HostContainer",permalink:"/docs/guide/services/host-container"},next:{title:"Tokens",permalink:"/docs/guide/tokens/introduction"}},c={},l=[{value:"Example",id:"example",level:2},{value:"The Dangers of <code>eager: true</code>",id:"the-dangers-of-eager-true",level:2}],p={toc:l},u="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"eager-services"},"Eager Services"),(0,a.kt)("p",null,"Ordinarily, services aren't created until either:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"They're explicitly called via ",(0,a.kt)("inlineCode",{parentName:"li"},"Container.get"),", or..."),(0,a.kt)("li",{parentName:"ul"},"A service which ",(0,a.kt)("em",{parentName:"li"},"is")," called via ",(0,a.kt)("inlineCode",{parentName:"li"},"Container.get")," uses the service as a dependency.")),(0,a.kt)("p",null,"Therefore, if you need a way to start a service immediately, TypeDI provides a concept called Eager Services."),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"Eager Services create fragile application code, and should only be used in a few limited scenarios.\nIf you think you need this feature, consider its application carefully and use it very frugally."),(0,a.kt)("p",{parentName:"admonition"},"In future, eager services will not be initialised by default without an explicit call to ",(0,a.kt)("inlineCode",{parentName:"p"},"enableEagerLoading")," (see ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/freshgum-bubbles/typedi/pull/17"},"#17"),")."),(0,a.kt)("p",{parentName:"admonition"},"For more information on why eager services are discouraged, ",(0,a.kt)("a",{parentName:"p",href:"#the-dangers-of-eager-true"},"see the section below on its dangers"),".")),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("p",null,"To create a service which is immediately run upon declaration, we can do the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/log.service.ts"',title:'"src/log.service.ts"'},"import { Service } from '@freshgum/typedi';\n\n@Service({ eager: true }, [])\nexport class LogService {\n  constructor() {\n    this.log('LogService is ready!');\n  }\n\n  public log(message: string) {\n    console.log(message);\n  }\n}\n")),(0,a.kt)("p",null,"Then, once ",(0,a.kt)("inlineCode",{parentName:"p"},"LogService")," is imported, its constructor will immediately run and log the message to the console."),(0,a.kt)("h2",{id:"the-dangers-of-eager-true"},"The Dangers of ",(0,a.kt)("inlineCode",{parentName:"h2"},"eager: true")),(0,a.kt)("p",null,"If you declare an eager service, the service won't be run until it's been imported by another file.\nTherefore, if you forget to import your eager ",(0,a.kt)("inlineCode",{parentName:"p"},"DatabaseService"),", the connection to the database won't\nbe initialised early on in the application flow."),(0,a.kt)("p",null,"Another pain-point of eager services is testability: by making side-effects run on import, we\ncreate a dangerous precedent for the API, and overall make it much harder to test."),(0,a.kt)("p",null,"Consider the following (simplified) example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/database.service.ts"',title:'"src/database.service.ts"'},"import { Service } from '@freshgum/typedi';\n\n@Service({ eager: true }, [])\nexport class DatabaseService {\n  constructor() {\n    this.connect();\n  }\n\n  private connection: Connection;\n\n  private async connect() {\n    // Connect to the database here...\n  }\n\n  public async getValue(name: string): string {\n    return this.connection.getValue(name);\n  }\n}\n")),(0,a.kt)("p",null,"If we're looking to test our application and replace ",(0,a.kt)("inlineCode",{parentName:"p"},"DatabaseService")," with something else,\nhow would we import it to get the ID to replace?"),(0,a.kt)("p",null,"Normally, to stub the database connection, you would do something like this:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="spec/app.service.ts"',title:'"spec/app.service.ts"'},"import { Service } from '@freshgum/typedi';\nimport { DatabaseService } from '../src/database.service.ts'; // Oops!\n\n@Service({ id: DatabaseService }, [])\nexport class FakeDatabaseService implements DatabaseService {\n  private map = new Map<string, unknown>();\n\n  private async connect() {}\n\n  public async getValue(name: string): string {\n    return this.map.get(name);\n  }\n}\n\n// Test our app...\n")),(0,a.kt)("p",null,"Do you see the issue? We've imported ",(0,a.kt)("inlineCode",{parentName:"p"},"DatabaseService")," to get its ID (to replace with a stub),\nbut by doing that, we've created a connection to the database!\nThis means that, currently, we can't test the application without also creating a wasted database connection."),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"Instead of using eager services, consider creating a root service which runs side effects\nsuch as database initialisation before the rest of the environment is loaded.\nThis does the same thing without the above disadvantages.")))}d.isMDXComponent=!0}}]);