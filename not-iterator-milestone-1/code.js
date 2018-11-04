const walk=d=>{
	const dE=d.documentElement;
	if(dE!==null){
		const w=d.defaultView,
		O=w.Object,
		tags=O.create(null),
		nth=[1],
		types=[],
		blanks=[],
		//
		re_BlankLines=/^\s*$(?:\r\n?|\n)/gm,
		//
		SpaceReg=[/\u0020+/gm,/\t+/gm,/\n+/gm,/\r+/gm],
		SpaceRep=['\\s','\\t','\\n','\\r'],
		//…
		console=w.console,consoleGroup=console.group,consoleGroupCollapsed=console.groupCollapsed,consoleGroupEnd=console.groupEnd;
		//
		let depth=0,child=1,next=dE,mem=dE,exist=true,ascend=false,descend=false;
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
							m=i=e
						}else{
							if((i=e.tagName) in (m=tags)){(m=m[i])[m.length]=e}else{m[i]=[e]};
							m=i+':nth('+(l=child=nth[depth])+')';
							i=[i,l]
						}
					}else{
						i=e.nodeValue;
						if((m=i.trim()).length<1||m.replace(re_BlankLines,'').length<1){
							(m=blanks)[m.length]=[l,e];
							m=i;
							l=(a,b)=>a<2?b:b+'{'+a+'}';
							SpaceReg.forEach((a,b)=>{m=m.replace(a,s=>l(s.length,SpaceRep[b]))})
						}else{
							m=i
						}
					};
					mem=i;
					console.log('\t'.repeat(depth),depth,ascend?'↸':(descend?'⇲':'⇢'),m)
				};
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
								next=mem.parentNode;
								ascend=exist=true;
								--depth
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