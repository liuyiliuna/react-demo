import React, { Component } from 'react';
import './App.css';
import { isRestElement } from '@babel/types';

// 导入prop-types 是第三方组件库对props中的变量进行类型检测
import PropTypes from 'prop-types'

// import propTypes form 'prop-types';
// 不受控组件在原生html中就是有自己的状态，此时需要将不受控组件变成受控组件
// 绑定到一个类的函数叫做类的方法
// ES6K扩展运算符...
const userList = ['Robin', 'Andrew', 'Dan'];
const additionalUser = 'Joradan';
const allUsers = [...userList,additionalUser];
console.log(allUsers);
const list = [
		{
		title: 'React',
		url: 'https://facebook.github.io/react/',
		author: 'Jordan Walke',
		num_comments: 3,
		points: 4,
		objectID: 0,
		},
		{
		title: 'Redux',
		url: 'https://github.com/reactjs/redux',
		author: 'Dan Abramov, Andrew Clark',
		num_comments: 2,
		points: 5,
		objectID: 1,
		},
	];

// function isSearched(searchTerm) {
// 	return function(item) {
// 		return item.title.toLowerCase().includes(searchTerm.toLowerCase())
// 	}
// }

// 过滤函数写在组件外部是访问不到constructor里面初始化里面state的数据，此时需要使用高阶函数，闭包有点像，返回一个函数
// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
// 过滤功能 （使用服务端控制搜索结果移除过滤功能）
// function isSearched(searchTerm) {
// 		return function(item){
// 			return item.title.toLowerCase().includes(searchTerm.toLowerCase())
// 		}
// }

// 错误处理是React的另外一种状态，当错误发生时候将它存在本地状态中，然后利用条件渲染在组件中显示错误信息
const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
// 错误处理
// const PATH_BASE = 'https://hn.foo.bar.com/api/v1'
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
// const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${DEFAULT_QUERY}`
// console.log(url);
// 处理分页数据
const PARAM_PAGE = 'page=';

// 请求时候抓取一定量数据
const DEFAULT_HPP = '10'
// 请求时候抓取一定量数据
const PARAM_HPP = 'hitsPerPage=';
	class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			// list,
			// searchTerm:''
			// result:null,
			// searchTerm:DEFAULT_QUERY,
			// 利用setState实现缓存
			results:null,
			searchKey:'',
			searchTerm:DEFAULT_QUERY,

			// 错误处理
			error:null
		};
		// this.onDismiss = this.onDismiss.bind(this);
		this.searchList = this.searchList.bind(this);
		// 搜索改成服务端搜索
		this.onSearchSubmit =  this.onSearchSubmit.bind(this);
		// 请求数据
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		// 缓存(如果缓存中存在就不请求或者请求)
		// this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
	}
	// 缓存
	// needsToSearchTopStories(searchTerm) {
	// 	return !this.state.results[searchTerm];
	// }
	
needsToSearchTopStories(searchTerm) {
	return !this.state.results[searchTerm];
}

	// 搜索改成服务端搜索
	onSearchSubmit(event) {
		const {searchTerm} = this.state;
		this.setState({searchKey:searchTerm})
		// this.fetchSearchTopStories(searchTerm);
	// 用于缓存
		// if (this.needsToSearchTopStories(searchTerm)) {
		// 	this.fetchSearchTopStories(searchTerm);
		// 	}

		if(this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm);
		}
		// 阻止原生js默认行为
		event.preventDefault();
	}
// 请求数据
componentDidMount() {
	const { searchTerm } = this.state;
	this.setState({searchKey:searchTerm})
	this.fetchSearchTopStories(searchTerm)
};

// 将新数据追加到老数据上面
// setSearchTopStories(result) {
// 	const { hits, page } = result;
// 	const oldHits = page !== 0
// 	? this.state.result.hits
// 	: [];
// 	const updatedHits = [
// 	...oldHits,
// 	...hits
// 	];
// 	this.setState({
// 	result: { hits: updatedHits, page }
// 	});
// 	}

// 增加功能
	setSearchTopStories(result) {
		const {hits,page} = result;
		// 缓存
		const {searchKey,results} = this.state;
		const oldHits = results && results[searchKey]
							? results[searchKey].hits
							:[]
		// const oldHits = page !== 0
		// ?this.state.result.hits
		// :[];
		// 将老数据和新数据合并
		const updatedHits = [
			...oldHits,...hits
		]

		// 缓存
		this.setState({
			results:{
				...results,
				[searchKey]: {hits:updatedHits,page}
			}
		})

		// this.setState({
		// 	result:{hits:updatedHits,page}
		// })
		
	}
// 复写老的数据
// setSearchTopStories(result) {
// 	this.setState({
// 		result,
// 	})
// };

fetchSearchTopStories(searchTerm,page = 0) {
	// const url =  `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`;
	// console.log(url);
	// 原生fetch API 首先传递url是必须的,然后将获取的数据结构转为json数据格式，再将结果赋值到组件内部状态里面此外用到catch处理错误请求，
	// 如果请求错误直接进入catch里面不会进入到then里面
	// fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
	// 处理分页数据
	// fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
	// 抓取一定数量的分页数据
	fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
	.then(response => response.json())
	.then(result => this.setSearchTopStories(result))
		// .catch(e => e);
	// 错误处理
	.catch(e => this.setState({error:e}));
};

	// onDismiss(id) {
	// 	function isNotId(item) {
	// 		return item.objectID !== id;
	// 		}
	// 	const updatedList = this.state.list.filter(isNotId);
	// 	this.setState = ({
	// 		list:updatedList
	// 	});
	// }

	onDismiss = (id) => {
		// assgin方法使用，合并对象第一个参数是目标对象，第二个参数是源对象，由于react拥护不变的数据结构所有要使用新的对象来保持原来数据不变
		// 扩展运算符也可以操作...将对象或者数组拷贝到新的对象或者数组中
		// const updatedHits = {hits:updatedHits}
		// const updatedResult = Object.assign({},this.state.result,updatedHits);

		// const isNotId = item => item.objectID !== id;
		// const updatedHits = this.state.result.hits.filter(isNotId);
		// this.setState({ 
		// 	result: Object.assign({},this.state.result,{hits:updatedHits}) 
		// });

		// ES6写法
		// const isNotId = item => item.objectID !== id;
		// const updatedHits = this.state.result.hits.filter(isNotId);
		// console.log(updatedHits);
		// this.setState({
		// 	result:{...this.state.result,hits:updatedHits}
		// })
		// console.log(this.state.result);


		// 缓存
		const { searchKey, results } = this.state;
		const { hits, page } = results[searchKey];
		const isNotId = item => item.objectID !== id;
		const updatedHits = hits.filter(isNotId);
		this.setState({
		results: {
		...results,
		[searchKey]: { hits: updatedHits, page }
			}
		})
	}
	searchList(event) {
		this.setState({
			searchTerm:event.target.value
		})
		//console.log(this.state.searchTerm)
	}

	// onDismiss(id) {
	// 	// function isNotId(item) {
	// 	// return item.objectID !== id;
	// 	// }
	// 	// const updatedList = this.state.list.filter(isNotId);
	// 	// this.setState({list: updatedList })

	// 	const isNotId = item =>  item.objectID !== id;
	// 	const updatedList = this.state.list.filter(isNotId);
	// 	this.setState({ list: updatedList });

	// 	}
	
	// 搜索 箭头函数绑定类方法不用写入绑定到constructor里面
	// searchList = (event) => {
	// 	console.log(event);
	// }

    render() {
			//  const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
				const helloWorld = "Welcome to the Road to learn React";
				// const mapHtml = this.state.list.map(function(item){return<div key={item.objectID}>{item.title}</div>})
				// filter(isSearched(this.state.searchTerm)).

				// if(!result) {return null};
				// const listHtml = list.filter(isSearched(searchTerm)).map(item =>
				// <div key={item.objectID}>
				// 	<span><a href={item.url} >{item.title}</a></span>
				// 	<span>{item.num_comments}</span>
				// 	<span>{item.points}</span>
				// 	<span>
				// 		<button 
				// 		type="button"
				// 		onClick={()=>this.onDismiss(item.objectID)}
				// 		>
				// 			删除
				// 		</button>
				// 	</span>
				// </div>);

				// const {result,searchTerm} = this.state;
				// // 处理分页
			  // const page = (result && result.page) || 0;

			
			// 错误处理error
			 const {searchTerm,results,searchKey,error} = this.state;
			 const page = (results && results[searchKey] && results[searchKey].page) || 0;
			const list = (results && results[searchKey] && results[searchKey].hits) || [];

		
        return (
							<div className = "App" >
								<div className="page">
									<div className="interactions">
										<Search
											value={searchTerm}
											onChange={this.searchList}
											onSubmit={this.onSearchSubmit}
											>
												Search
										</Search>
									</div>
								{/* 使用三目运算符操作 */}
								{/* {
									result ?
									<Table
									list={result.hits}
									pattern={searchTerm}
									onDismiss={this.onDismiss}									
									/> :
									null
								}
								 */}
								{/* 使用逻辑运算符&& 移除过滤功能*/}
								{/* {
									result 	&& 
									<Table
									list={result.hits}
									// pattern={searchTerm}
									onDismiss={this.onDismiss}									
									/>	
								} */}
								{/*  错误处理 */}
								{
									error?<div className="interactions">
													<p>Something went wrong.</p>
												</div>
											:<Table list={list}
												onDismiss={this.onDismiss}									
												/>
								}
							
								<div className="interactions">
									{/* <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
										More
									</Button> */}
									<Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
										More
									</Button>
								</div>
									{/* <h2> {helloWorld} </h2> 
									<form>
										<input type="text" 
											onChange={this.searchList}
											value={searchTerm}
											// value={this.state.searchTerm}
										/>
									</form>
									{listHtml} */}
									
								</div>
							</div>
        );

    }

}


// 绑定  
// 1、在构造函数中绑定类方法，在构造函数之外写业务逻辑（官方文档中推荐使用）
// 2、可以在render()函数中绑定类的方法（不推荐使用）
// 3、在构造函数中写业务逻辑和方法（不推荐使用，构造函数只是用来实例化所有属性和类）
// 4、类方法可以通过ES6的箭头函数自动绑定 (推荐使用)
class ExplainBindingsComponent extends Component {
	// 这里构造函数的作用只是实例化类，以及所有的属性，业务逻辑定义在构造函数之外
	// constructor(){
	// 	super();
	// 	// this.onClickMe = this.onClickMe.bind(this);
	// }
	// onClickMe(){
	// 	console.log(this);
	// }
	onClickMe = () => console.log(this);
	render() {
   return (
		 <button
		  onClick={this.onClickMe} //将类的方法绑定在render函数中每次更新会导致性能损耗，当在构造函数中绑定时候，绑定只会在组件实例化时运行一次，这样做更好方式，如果不绑定到类的方法中打印出来将是undefined
			type="button"
		 >
			 Click Me
		 </button>
	 )
	}
}


// search组件
// class Search extends Component {
// 	render() {
// 		const {value,onChange} = this.props;
// 		return(
// 			<form>
// 				<input  	
// 					type="text"
// 					value={value}
// 					onChange={onChange}
// 				/>
// 			</form>
// 		)
// 	}
// }

// 函数式无状态组件,可组合组件在props有个小小的属性children，通过它可以将元素从上层传到下层中去这些元素对组件来说是未知的，
// 为组件互相组合提供可能性，总之children属性不仅可以把文本作为子元素传递，还可以将一个元素或者元素树（再次封装成组件）z
// 作为子元素传递，children可以让元素互相组合成为可能
// 注意：函数式无状态组件接收一个输入和返回一个输出，输入是props,输出就是一个普通JSX组件的实例，它没有生命周期方法同时也没有所谓的this以及state
// constructor是初始化所有的属性和方法只执行一次，render会在一开始执行一次，并且每次组件更新时候都会执行相当于(设置事件，然后改变属性状态this.setState({}))
// 的时候会再次执行render函数

// function Search(props) {
//  const {value,onChange,children} = props;
//  return <form>
//  				{children}
// 					<input  	
// 						type="text"
// 						value={value}
// 						onChange={onChange}
// 					/>
// 			</form>
// }
// 简化写法使用箭头函数 前面需要加const ;轻量无状态组件
const Search = ({value,onChange,onSubmit,children}) => {
								return (
									<form onSubmit={onSubmit}>
									{children}
									<input  	
										type="text"
										value={value}
										onChange={onChange}
									/>
									<button type="submit">
										{children}
									</button>
									</form>
								)
}
											

// Table组件
// ES6类组件，在类的定义中，它们会继承来自React组件。extends会注册所有生命周期方法，只要在React Component API中。都可以在组件中使用
//因此可以使用 render方法，通过this.state = {}以及this.setState({}),可以在ES6类组件中存储和操控state
// 当不需要本地状态或者组件生命周期方法时候，应该使用函数式无状态组件实现你的组件，一旦要访问state和生命周期方法时候采用ES6类组件

// 内联样式style={{ width:'30%' }}
// js
const largeColumn = {
	width:'40%',
};
const midColumn = {
	width:'30%'
};
const smallColumn = {
	width:'10%'
}
class Table extends Component {
	render(){
		const {list,pattern,onDismiss} = this.props;
		return(
				<div className="table">
					{
						list.map(item =>
							<div key={item.objectID} className="table-row">
								<span style={{ width: '40%' }}>
									<a href={item.url}>{item.title}</a>
								</span>
								<span style={midColumn}>{item.author}</span>
								<span style={smallColumn}>{item.num_comments}</span>
								<span style={{ width:'10%' }}>{item.points}</span>
								<span style={{ width:'10%' }}>
									{/* <button 
									type="button"
									onClick={() => onDismiss(item.objectID)}
									>
										删除
									</button> */}
									<Button
										onClick={()=>onDismiss(item.objectID)}
										type="button"
										className="button-inline"
									>
										删除
									</Button>
								</span>
							</div>
						)
					}
				</div>
		)
	}
}

// 为Table组件定义接口
Table.propTypes = {
	list:PropTypes.arrayOf(
		PropTypes.shape({
			objectID:PropTypes.string.isRequired,
			// 用于展示的属性不是必须的
			author:PropTypes.string,
			url:PropTypes.string,
			num_comments:PropTypes.number,
			points:PropTypes.number,
		})
	).isRequired,
	onDismiss:PropTypes.func.isRequired,
}


// Button 组件,Button组件期望传递一个className属性，但是在使用时候并没有传递className属性，所有用来确定className是可选的，因此给一个默认参数
// className=''默认参数为空，如果没有使用则表示为空不会是undefined
// class Button extends Component {
// 	render() {
// 		const {onClick,className='',children} = this.props
// 		return(
// 				<button
// 				onClick={onClick}
// 				className ={className}
// 				type="button"
// 				>
// 					{children}
// 				</button>
// 		)
// 	}

// }

// function Button(props) {
// 	const {onClick,className='',children} = props
// 	return <button
// 					onClick={onClick}
// 					className ={className}
// 					type="button"
// 					>
// 					{children}
// 				</button>
// }

// 优化之前的写法 es6函数入参
// function Button({onClick,className='',children}) {
// 	return <button
// 					onClick={onClick}
// 					className ={className}
// 					type="button"
// 					>
// 					{children}
// 				</button>
// }


const Button = ({onClick,className='',children}) =>{
	return <button
					onClick={onClick}
					className ={className}
					type="button"
					>
					{children}
				</button>
}
// 为组件添加接口 测试props传入参数的类型
// propTypes的基本类型和复杂对象有
// PropTypes.array;PropTypes.bool;PropTypes.func;PropTypes.number;PropTypes.object;PropTypes.string
// 渲染节点 PropsType.node;PropTypes.element
// 函数签名：只有在强类型语言才有，js没有函数签名，函数签名就是函数形参的数据类型
// Button.propTypes = {
// 	onClick:PropTypes.func,
// 	className:PropTypes.string,
// 	children:PropTypes.node,
// }

// 强制定义的props可以使用
Button.propTypes = {
	onClick:PropTypes.func.isRequired,
	className:PropTypes.string,
	children:PropTypes.node.isRequired,
}

// 给组件定义默认的prop 与es6一样
Button.defaultProps = {
	className:'',
}



// 当使用 onClick={doSomething()}时，doSomething()函数会在浏览器打开程序时立即执行；由于监听表达式时函数执行返回值而不是函数，所以点击按钮时不会有任何事情发生。
// 但当使用onClick={doSomething} 时，因为doSomething是一个函数，所以它会在点击按钮时执行。同样规则适用于在程序中使用的onDismiss()类方法
// 然后使用这个并不够，因为类方法里需要接收item.objectID属性来识别那个将要被忽略的项，因此需要封装到另一个函数传递这个属性，这个概念在js中被称为高阶函数
// 其中一个解决方案就是在外部定义一个包装函数，并且只将定义的函数传递给处理程序。因为需要访问特定的列表项，所以它必须位于map函数块内部

// React ES6类组件生命周期方法
// React生命周期方法，这些方法嵌入到React组件生命周期的一组挂钩，它们可以在ES6类组件中使用不能在函数式无状态组件中使用
// constructor(构造函数) 只有在组件实例化并插入到DOM中的时候才会被调用，组件实例化的过程叫做挂载 (mount)
// render()会在组件挂载的过程中被调用，同时当组件更新时也会被调用每当组件状态state或者props改变时，组件render方法会被调用。
// 组件挂载过程中还有两个方法，componentWillMount()和componentDidMount().

// 在挂载过程中有四个生命周期方法。它们的调用顺序  constructor();componentWillMount();rend();componentDidMount()

// 但当组件的状态或者属性改变时候用来更新组件的生命周期共有五个生命周期方法用于组件更新
// componentWillReceiveProps();shouldComponentUpdate();componentWillUpdate(),render();componentDidUpdate();

// 组件卸载也有生命周期，只有一个生命周期方法，componentWillUnmount();


// 这里用到的default语句可以有以下使用情况
//1、为了导入和导出单一功能，2、为了强调一个模块输出API的主要功能 3、可以向后兼容ES5只有一个到初五功能。
// 使用default时候可以省略花括号，导入和导出功能可以一样也可以不一样
export default App;
// export default ExplainBindingsComponent;

export {
	Button,
	Search,
	Table,
}

