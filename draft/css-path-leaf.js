const walkDOM=startNode=>{
	let node=startNode,branch_depth=0,counted_nodes=0;
	const stack=[],path=[],d=node.ownerDocument,w=d.defaultView,Array=w.Array,console=w.console,
	founded_types=[
		[],//UNKNOWN
		[],//1:ELEMENT
		[],//2:ATTRIBUTE
		[],//3:TEXT
		[],//4:CDATA-SECTION
		[],//5:ENTITY-REFERENCE
		[],//6:ENTITY
		[],//7:PROCESSING-INSTRUCTION
		[],//8:COMMENT
		[],//9:DOCUMENT
		[],//10:DOCUMENT-TYPE
		[],//11:DOCUMENT-FRAGMENT
		[]//12:NOTATION
	];
	console.clear();
	console.group('walked');
		console.group('DOM');
		loop:while(node!==null){
			++counted_nodes;
			let x=node.nodeType,node_isElement=x===1;
			//-
			(x=founded_types[x>0&&x<14?x:0])[x.length]=node;
			//-
			if(node_isElement){
				let tag=node.tagName;
				const m=stack[stack.length=branch_depth]=[node,0,tag];//node,children-walked,css-path-leaf
				//
				x=node.parentElement;
				if(x!==null && x.children.length>1){
					x=stack[branch_depth-1];
					const n=x[1];
					if(n>1 && x[0].querySelectorAll(tag).length>1){
						tag=m[2]+=':nth-child('+n+')';
					}
				};
				x=branch_depth;
				x=path[x]=[(x!==0?path[x-1][0]+'>':'')+tag,node];
				console.info(x[0]);
			};
			//-
			x=node.firstChild;
			if(x!==null){
				++stack[branch_depth][1];//update:children-walked
				++branch_depth;//descend
				node=x;
			}else{
				while(node!==null){
					x=node.nodeType;
					node_isElement=x===1;
					//-
					x=node.nextSibling;
					if(x!==null){
						if(node_isElement){
							++stack[branch_depth-1][1];//children_counted
						};
						node=x;
						continue loop
					}else{
						if(--branch_depth!==0){
							node=node.parentNode;//ascend
						}else{//root!
							break loop
						}
					}
				}
			}
		};
		console.groupEnd();
		console.groupCollapsed('nodes:',counted_nodes);
			console.group('types:');
			[
				'UNKNOWN',
				'ELEMENT',
				'ATTRIBUTE',
				'TEXT',
				'CDATA-SECTION',
				'ENTITY-REFERENCE',
				'ENTITY',
				'PROCESSING-INSTRUCTION',
				'COMMENT',
				'DOCUMENT',
				'DOCUMENT-TYPE',
				'DOCUMENT-FRAGMENT',
				'NOTATION'
			].forEach((x,i)=>{
					const m=founded_types[i];
					if(m.length!==0){
						console.log(x+':%O',m)
					}
			});
		console.groupEnd();
	console.groupEnd();
}
//==============================
walkDOM(document.childNodes[0]);
