const walk=dE=>{
	if(dE!==null){
		const itera=dE.ownerDocument.createNodeIterator(dE,-1),stack=[];
		let num=0,depth=0,node,nth;
		while((node=itera.nextNode())!==null){
			const i=depth,tag=node.nodeType===1;
			++num;
			const child=node.firstChild;
			if(child!==null){
				++depth;
				if(child.nodeType===1){
					nth=1
				};

			}else{
				const sibling=node.nextSibling;
				if(sibling!==null){
					if(sibling.nodeType===1){
						++nth
					};
				}else{
					--depth;
				}
			};
			console.log(num.toString().padStart(4,'0'),i,tag?i:'','\t'.repeat(i),tag?(node.tagName+':'+nth):node);
		};
		console.dir(stack)
	}
};
//-----------------------------
walk(document.documentElement);