const walk=d=>{
	const dE=d.documentElement;
	if(dE!==null){
		const w=d.defaultView,
		O=w.Object,
		tags=O.create(null),
		nth=[1],
		types=[],
		blanks=[],
		fullpath=[],
		cachepath=[],
		//
		re_BlankLines=/^\s*$(?:\r\n?|\n)/gm,
		//
		SpaceReg=[/\u0020+/gm,/\t+/gm,/\n+/gm,/\r+/gm],
		SpaceRep=['\\s','\\t','\\n','\\r'],
		//
		queryscope=new w.Map(),
		//…
		console=w.console,consoleGroup=console.group,consoleGroupCollapsed=console.groupCollapsed,consoleGroupEnd=console.groupEnd;
		//
		let depth=0,mem,next=dE,exist=true,ascend=false,descend=false;
		//
		consoleGroup('walked:');
			consoleGroup('dom:');
			do{
				if((mem=next.nodeType)!==0){
					const e=next,n=mem;
					let m=types,i=m.length,l;
					if(n<i){(m=m[n])[l=m.length]=e}else{m[n]=[e];l=0};
					if(n!==3){
						if(n!==1){
							m=e
						}else{
							if((i=e.tagName) in (m=tags)){(m=m[i])[m.length]=e}else{m[i]=[e]};
							fullpath[depth]=[(e.hasAttribute('id') && (m=e.id).length!==0)?'#'+m:i.toLowerCase(),nth[depth],e];
							if(descend||ascend===false){
								m=fullpath.map(x=>{
									let t=x[0];
									if(t[0]!=='#'){
										const i=x[1];
										if(i>1){
											const p=x[2].parentElement,l=p.children.length;
											if(l>1){
												const q=queryscope;
												let v;
												if(q.has(p)){
													if((v=q.get(p)).has(t)){v=v.get(t)}
												}else{
													v=new w.Map();
													v.set(t,t=p.querySelectorAll(':scope > '+t));
													q.set(p,v);
													v=t
												};
												if(v.length>1){t+=i!==l ?(':nth('+i+')'):':last-child'}
											}
										}
									};
									return t
								});
								i=m;
								m=(m=i.join('>')).substring(m.lastIndexOf('#'));
								--i.length;
								cachepath[depth]=i.join('>')
							}else{
								m=cachepath.join('>')
							}
						}
					}else{
						if((m=(i=e.nodeValue).trim()).length<1||m.replace(re_BlankLines,'').length<1){
							(m=blanks)[m.length]=[l,e];
							l=(a,b)=>a<2?b:b+'{'+a+'}';
							m=i;
							SpaceReg.forEach((a,b)=>{m=m.replace(a,s=>l(s.length,SpaceRep[b]))})
						}
					};
					console.log('\t'.repeat(depth),depth,ascend?'↸':(descend?'⇲':'⇢'),m)
				};
				//
				queryscope.clear();
				//mem
				//
				if(descend=exist=((next=(mem=next).firstChild)!==null)){
					nth[++depth]=next.nodeType!==1?null:1
				}else{
					ascend=false;
					next=mem;
					do{
						if(exist=(depth!==0)){
							if(exist=((next=(mem=next).nextSibling)!==null)){
								if(next.nodeType===1){
									const m=nth,i=depth;
									if(i>m.length){m[i]=0}else{++m[i]}
								};
								break
							}else{
								cachepath.length=fullpath.length=--depth;
								next=mem.parentNode;
								ascend=exist=true
							}
						}
					}while(exist)
				}
			}while(exist);
			consoleGroupEnd();
			if(types.length!==0){
				consoleGroup('found:');
					const n=[
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
					consoleGroupCollapsed('node-types:',O.keys(types).map(i=>n[i]).join());
						types.forEach((x,i)=>{console.log(n[i>0 && i<14?i:0]+'%O',x)});
					consoleGroupEnd();
					consoleGroupCollapsed('blank-texts:',blanks.length);
						console.dir(blanks);
					consoleGroupEnd();
					consoleGroupCollapsed('tags:',(mem=O.keys(tags)).join());
						mem.forEach(x=>{const m=tags[x];if(m.length!==0){console.log(x+':%O',m)}});
						mem=null;
					consoleGroupEnd();
					//…
				consoleGroupEnd()
			};
		consoleGroupEnd()
	}
};
//---------------------------------
console.clear();
//#run:
(w=>{
	const d=w.document,f=walk;
	if(d.readyState!=='complete'){
		const g=o=>{
			w.removeEventListener('load',g);
			f(o.target)
		};
		w.addEventListener('load',g)
	}else{
		f(d)
	}
})(window);
//#end.
