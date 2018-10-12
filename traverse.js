const traverse=d=>{
	var node=d.body,stack=[];
	if(node!==null && node.childNodes.length!==0){
		const w=d.defaultView,c=w.console;
		c.clear();
		c.group('DOM:');
		let depth=0,node=d.documentElement,prev=null,succ=null;
		walk:do{
			c.log(depth,'\t'.repeat(depth),node);
			stack[stack.length]=[depth,node];
			prev=node;
			if((succ=node.firstChild)!==null){
				node=succ;
				++depth
			}else{
				while(node!==null){
					if((succ=node.nextSibling)!==null){
						node=succ;
						continue walk
					}else{
						if(--depth!==0){//ascend
							node=node.parentNode
						}else{//root!
							break walk
						}
					}
				}
			}
		}while(node!==null);
		c.groupEnd()
	};
	return stack
};
//---------------------------
console.dir(traverse(document));
