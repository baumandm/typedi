"use strict";(self.webpackChunk_freshgum_typedi_docs=self.webpackChunk_freshgum_typedi_docs||[]).push([[302],{5474:(e,t,n)=>{n.d(t,{Z:()=>a});var i=n(9496),o=n(8517);function a(e){const{title:t}=e;if(t?.startsWith('"')&&!t?.endsWith('"'))throw new Error(`Unterminated quote detected in code-block: ${t}.`);return i.createElement(i.Fragment,null,i.createElement(o.Z,e))}},1103:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>p});var i=n(1966),o=(n(9496),n(9613)),a=(n(5474),n(1362));const r={sidebar_position:4},s="Resolution Constraints",l={unversionedId:"guide/services/resolution-constraints",id:"guide/services/resolution-constraints",title:"Resolution Constraints",description:"Many times, you'll want a service to rely on a dependency, but there's always",source:"@site/docs/guide/services/resolution-constraints.mdx",sourceDirName:"guide/services",slug:"/guide/services/resolution-constraints",permalink:"/typedi/docs/guide/services/resolution-constraints",draft:!1,editUrl:"https://github.com/freshgum-bubbles/typedi/docs/docs/guide/services/resolution-constraints.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Multiple Services",permalink:"/typedi/docs/guide/services/multiple-services"},next:{title:"Singletons",permalink:"/typedi/docs/guide/services/singletons"}},c={},p=[{value:"Introduction",id:"introduction",level:2},{value:"Resolution Constraint Flags",id:"resolution-constraint-flags",level:2},{value:"Making dependencies optional with <code>Optional()</code>",id:"making-dependencies-optional-with-optional",level:2},{value:"Resolve via the container&#39;s parent with <code>SkipSelf()</code>",id:"resolve-via-the-containers-parent-with-skipself",level:2},{value:"Resolve non-recursively with <code>Self()</code>",id:"resolve-non-recursively-with-self",level:2},{value:"Acquire multiple services with <code>Many()</code>",id:"acquire-multiple-services-with-many",level:2}],u={toc:p},d="wrapper";function h(e){let{components:t,...n}=e;return(0,o.kt)(d,(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"resolution-constraints"},"Resolution Constraints"),(0,o.kt)("p",null,"Many times, you'll want a service to rely on a dependency, but there's always\nthe possibility of it not existing (and you wouldn't want your service to fail if it didn't)."),(0,o.kt)("p",null,"Or, you want to take advantage of ",(0,o.kt)("a",{parentName:"p",href:"../containers/introduction#container-inheritance"},"container inheritance"),"\nand resolve a symbol in the context of the current parent's container, or restrict the\nresolution process to return ",(0,o.kt)("inlineCode",{parentName:"p"},"null")," if the ",(0,o.kt)("em",{parentName:"p"},"current")," container doesn't have it."),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"(There are more features too.)")),(0,o.kt)("hr",null),(0,o.kt)("p",null,"This is where ",(0,o.kt)("em",{parentName:"p"},"resolution constraints")," shine.  They allow you to specify how you'd like a certain\ndependency to be resolved, by a set-list of pre-defined strategies."),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"This feature is ",(0,o.kt)("em",{parentName:"p"},"very")," similar to ",(0,o.kt)("a",{parentName:"p",href:"https://angular.io/guide/dependency-injection-in-action#qualify-dependency-lookup-with-parameter-decorators"},"Angular's DI decorators"),".\nIn fact, resolution constraints ",(0,o.kt)("em",{parentName:"p"},"were")," originally designed to mimic these features in TypeDI."),(0,o.kt)("p",{parentName:"admonition"},"Therefore, if you're familiar with Angular, you most likely already\nunderstand resolution constraints.")),(0,o.kt)("h2",{id:"introduction"},"Introduction"),(0,o.kt)("p",null,"When a service requests an identifier (which can be another service or a token) as a dependency,\nthe Dependency Injection framework has to check its internal map for that identifier and, if found,\nreturn an instance of that value.",(0,o.kt)("br",{parentName:"p"}),"\n","If the identifier cannot be found, it checks its parent, which checks its parent (recursively)\nuntil the chain is exhausted. An error is then thrown."),(0,o.kt)("details",null,(0,o.kt)("summary",null,"If you're a visual learner, here's a flow-chart of the process."),(0,o.kt)(a.Z,{value:'\nflowchart\n\t1("A service is requested \nfrom the container.") --\x3e 704938("Lookup the item\nin the container.")\n\t704938 --\x3e 627865{"Was it\nfound?"}\n\t627865 ---|"Yes"| 326567("Return value.")\n\t627865 ---|"No"| 392131{"Does container\nhave parent?"}\n\t392131 ---|"No"| 415873("Throw error.")\n\t392131 ---|"Yes"| 924841("Set container to\nparent container.")\n\t924841 --- 704938\n',mdxType:"Mermaid"})),(0,o.kt)("p",null,"While this behaviour makes sense for most configurations, there are most certainly times when you'll\nwant to modify it a little.  In the below sections, we'll explore how to do that in TypeDI."),(0,o.kt)("h2",{id:"resolution-constraint-flags"},"Resolution Constraint Flags"),(0,o.kt)("p",null,"In TypeDI, the concept of constraining certain resolutions is done through specific functions which,\nwhen called, return a ",(0,o.kt)("em",{parentName:"p"},"bit"),".  Multiple functions can be conjoined with the ",(0,o.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR"},"Bitwise OR"),"\noperator to form a bitmask, like so:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},"Optional() | Many() | Self()\n")),(0,o.kt)("admonition",{type:"note"},(0,o.kt)("p",{parentName:"admonition"},"You don't have to understand how bitmasks work to make use of resolution constraints.\nThe functions above construct the bitmask for you, which can then be safely passed to TypeDI.")),(0,o.kt)("admonition",{type:"warning"},(0,o.kt)("p",{parentName:"admonition"},"You should always make use of the above functions instead of constructing a bitmask yourself,\nas the signature of the mask could change at any time.")),(0,o.kt)("h2",{id:"making-dependencies-optional-with-optional"},"Making dependencies optional with ",(0,o.kt)("inlineCode",{parentName:"h2"},"Optional()")),(0,o.kt)("p",null,"If your service ",(0,o.kt)("em",{parentName:"p"},"wants")," a dependency, but doesn't ",(0,o.kt)("em",{parentName:"p"},"need")," it, you can make use of the ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional()")," flag.\nIf the identifier cannot be found, the value will be substituted with ",(0,o.kt)("inlineCode",{parentName:"p"},"null"),". ",(0,o.kt)("em",{parentName:"p"},"(This would be useful if you were,\nfor example, building a library where some parts of the configuration might not have been set-up by the end-user.)")),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"Adding an optinal constraint isn't always necessary: only add it if you're not 100% sure that\nthe service you're using as a dependency will not be available at runtime.")),(0,o.kt)("p",null,"Let's explore how we could make use of ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," in an example service, which\nrequests an identifier from the container that may not exist."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/configuration-reader.service.ts"',title:'"src/configuration-reader.service.ts"'},"import { Service, Optional } from '@freshgum/typedi';\nimport { APP_TOKEN } from './configuration'; // Where APP_TOKEN is a Token<string>.\n\n@Service([\n  [APP_TOKEN, Optional()]\n])\nexport class ConfigurationReaderService {\n  constructor (private appToken: string | null) { }\n\n  validateConfiguration () {\n    if (this.appToken === null) {\n      console.warn('An app token was not provided!');\n    }\n  }\n}\n")),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"If you're using an optional service, make sure you also allow the type\nto be null (like above, where we used ",(0,o.kt)("inlineCode",{parentName:"p"},"| null"),")\nOtherwise in usage, you may forget that the value may not exist, causing runtime errors.")),(0,o.kt)("p",null,"In the above service, we requested ",(0,o.kt)("inlineCode",{parentName:"p"},"APP_TOKEN")," as a dependency.\nIn the case of our library, this would be set by the user before they start the root service."),(0,o.kt)("p",null,"However, if that value isn't set, we log a warning to the console."),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"Normally, if ",(0,o.kt)("inlineCode",{parentName:"em"},"APP_TOKEN")," wasn't present in the container, the container itself would throw an error.")),(0,o.kt)("h2",{id:"resolve-via-the-containers-parent-with-skipself"},"Resolve via the container's parent with ",(0,o.kt)("inlineCode",{parentName:"h2"},"SkipSelf()")),(0,o.kt)("p",null,"Much like in Angular, the ",(0,o.kt)("inlineCode",{parentName:"p"},"SkipSelf")," can be applied to individual dependencies\nto tell the container to resolve them from its parent container."),(0,o.kt)("p",null,"This can be useful in the case of an application which makes use of container\ninheritance to provide a different set of tokens to services under it."),(0,o.kt)("admonition",{type:"caution"},(0,o.kt)("p",{parentName:"admonition"},"Use of ",(0,o.kt)("inlineCode",{parentName:"p"},"SkipSelf")," makes your services dependent on a certain container structure.\nIf you were to change that structure, resolutions may fail, leading to runtime errors.\nUse it carefully.")),(0,o.kt)("p",null,"For instance, consider the following example of an blog.\nThe application creates a ",(0,o.kt)("inlineCode",{parentName:"p"},"Page")," service for each page of the blog.\nEach ",(0,o.kt)("inlineCode",{parentName:"p"},"Page")," service has access to the ",(0,o.kt)("inlineCode",{parentName:"p"},"DOM_NODE")," token, which:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"in the child container the ",(0,o.kt)("inlineCode",{parentName:"li"},"Page")," is run in, is set to the DOM element containing the individual page."),(0,o.kt)("li",{parentName:"ul"},"in the parent container, is set to the ",(0,o.kt)("inlineCode",{parentName:"li"},"body")," element.")),(0,o.kt)("p",null,'Each page contains a dark mode button which, when clicked,\ntoggles the "dark-mode" class on the ',(0,o.kt)("inlineCode",{parentName:"p"},"<body>")," element."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/dom-node.token.ts"',title:'"src/dom-node.token.ts"'},"import { Token } from '@freshgum/typedi';\n\nexport const DOM_NODE = new Token<HTMLElement>(`\\\nThe current DOM node. In services for individual pages,\nthis will be set to the node of the page element.\nIn the root, this will be set to the body of the document.\n`);\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/page.service.ts"',title:'"src/page.service.ts"'},"import { Service, SkipSelf } from '@freshgum/typedi';\nimport { STORAGE } from './storage.token';\n\n@Service([\n  DOM_NODE,\n  [DOM_NODE, SkipSelf()]\n])\nexport class PageService {\n  constructor (private pageNode: HTMLElement, private rootNode: HTMLElement) { }\n\n  bootstrap () {\n    this.pageNode.getElementById('dark-mode-button').addEventListener('click', () => {\n      this.rootNode.classList.toggle('dark-mode');\n    });\n  }\n}\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="src/root.service.ts"',title:'"src/root.service.ts"'},"import { ContainerInstance, Service, HostContainer } from '@freshgum/typedi';\nimport { PageService } from './page.service';\nimport { route } from 'my-router'; // Placeholder for your router :-)\n\n@Service([\n  HostContainer()\n])\nexport class RootService {\n  constructor (private container: ContainerInstance) {\n    container.set({ id: DOM_NODE, value: document.body, dependencies: [ ] });\n  }\n\n  async renderPage (pageUrl: string) {\n    const childContainer = this.container.ofChild(Symbol('page'));\n    const { renderedElement } = await route(pageUrl);\n    childDontainer.set({ id: DOM_NODE, value: renderedElement, dependencies: [ ] });\n    childContainer.get(PageService).bootstrap();\n  }\n}\n\nconst root = Container.get(RootService);\nroot.renderPage('/introduction');\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"(While this is a rather contrived example, it serves as a guide for how to use the constraint.)")),(0,o.kt)("h2",{id:"resolve-non-recursively-with-self"},"Resolve non-recursively with ",(0,o.kt)("inlineCode",{parentName:"h2"},"Self()")),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"Self")," constraint allows you to tell the container ",(0,o.kt)("em",{parentName:"p"},"not")," to traverse up the container\nparent tree until it finds a value."),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"This constraint is most useful when combined with ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional"),".\nThat way, if the current container doesn't have the value, a runtime error would not occur.")),(0,o.kt)("details",null,(0,o.kt)("summary",null,"If you're a visual learner, here's a flow-chart of the resolution process with ",(0,o.kt)("code",null,"Self"),"."),(0,o.kt)("p",null,"If we were to modify our flow-chart from above, the resolution for resolving identifiers marked with ",(0,o.kt)("code",null,"Self")," would look like this:"),(0,o.kt)(a.Z,{value:'\nflowchart\n\t1("A service is requested \nfrom the container.") --\x3e 704938("Lookup the item\nin the container.")\n\t704938 --\x3e 627865{"Was it\nfound?"}\n\t627865 ---|"Yes"| 326567("Return value.")\n\t627865 ---|"No"| 415873("Throw error.")\n',mdxType:"Mermaid"})),(0,o.kt)("h2",{id:"acquire-multiple-services-with-many"},"Acquire multiple services with ",(0,o.kt)("inlineCode",{parentName:"h2"},"Many()")),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"Many")," constraint is functionally equivalent to ",(0,o.kt)("inlineCode",{parentName:"p"},"Container.getMany"),".\nIt can also be combined with ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"SkipSelf")," (or ",(0,o.kt)("inlineCode",{parentName:"p"},"Self"),") to further constrain resolution."),(0,o.kt)("p",null,"To provide an example of this, consider the following:"),(0,o.kt)("p",null,"XXX"))}h.isMDXComponent=!0}}]);