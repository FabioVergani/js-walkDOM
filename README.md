# js-walkDOM - ITERATIVE:

const walk=d=>{
	const dE=d.documentElement;
	if(dE!==null){
		const w=d.defaultView,console=w.console,blankLines=/^\s*$(?:\r\n?|\n)/gm;
		//
		const types=[],tags={},nth=[1];
		//
		const storeNext=(x,o,i)=>{
			const e=next;
			if(x){
				const m=o[i];
				m[m.length]=e
			}else{
				o[i]=[e]
			}
		};
		//
		let depth=0,next=dE,mem=dE,exist=true,ascend=false,descend=false;
		//
		console.group('walked:');
			console.group('dom:');
			do{
				const type=next.nodeType;//,branch=next.parentElement
				storeNext(type<types.length,types,type);
				//
				if(type!==1){
					if(type!==3){//0,2,4,5,6,7,8,9,10,11,12
						exist=next;
					}else{//isText
						exist=(exist=next.nodeValue).replace(blankLines,'').trim().length<1?'-text-':exist;
					};
				}else{//isTag!
					const o=tags,p=next.tagName;
					storeNext(p in o,o,p);
					exist=p+':nth('+nth[depth]+')'
				};
				//§

				console.log(ascend?'↸':(descend?'⇲':'⇢'),depth,'\t'.repeat(depth),exist);

				//§
				ascend=false;
				if(descend=exist=((next=(mem=next).firstChild)!==null)){
					const i=++depth;
					nth[i]=next.nodeType!==1?0:1
				}else{
					next=mem;
					do{
						const i=depth;
						if(exist=(i!==0)){
							if(exist=((next=(mem=next).nextSibling)!==null)){
								if(next.nodeType===1){
									const m=nth;
									if(i>m.length){
										m[i]=0
									}else{
										++m[i]
									}
								};
								break
							}else{
								next=mem.parentNode;
								ascend=exist=true;
								--depth
							}
						}
					}while(exist)
				}
			}while(exist);
			console.groupEnd();
			//§
			depth=next=mem=exist=branch=null;
			//§
			console.group('found:');
				mem=[
					'UNKNOWN',//:0
					'ELEMENT',//:1
					'ATTRIBUTE',//:2
					'TEXT',//:3
					'CDATA-SECTION',//:4
					'ENTITY-REFERENCE',//:5
					'ENTITY',//:6
					'PROCESSING-INSTRUCTION',//:7
					'COMMENT',//:8
					'DOCUMENT',//:9
					'DOCUMENT-TYPE',//:10
					'DOCUMENT-FRAGMENT',//:11
					'NOTATION'//:12
				];
				console.groupCollapsed('node-types:',Object.keys(types).map(i=>mem[i]).join());
				types.forEach((x,i)=>{console.log(mem[i>0&&i<14?i:0]+'%O',x)});
				console.groupEnd();
				//
				mem=Object.keys(tags);
				console.groupCollapsed('tags:',mem.join());
				mem.forEach(x=>{const m=tags[x];if(m.length!==0){console.log(x+':%O',m)}});
				//
				mem=null;
				console.groupEnd();
			console.groupEnd();
		//
		console.groupEnd();
	}
};
//---------------------------------
(w=>{
	const d=w.document;
	if(d.readyState!=='complete'){
		const f=o=>{
			w.removeEventListener('load',f);
			walk(o.target)
		};
		w.addEventListener('load',f)
	}else{
		walk(d)
	}
})(window);
//#end
