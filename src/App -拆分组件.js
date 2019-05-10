import React, { Component } from 'react';
import './App.css';
import { isRestElement } from '@babel/types';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
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
// 过滤功能
function isSearched(searchTerm) {
		return function(item){
			return item.title.toLowerCase().includes(searchTerm.toLowerCase())
		}
}
	class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			list,
			searchTerm:''
		};
		// this.onDismiss = this.onDismiss.bind(this);
		this.searchList = this.searchList.bind(this);
	}
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
		const isNotId = item => item.objectID !== id;
		const updatedList = this.state.list.filter(isNotId);
		this.setState({ list: updatedList });
	}

	searchList(event) {
		this.setState({
			searchTerm:event.target.value
		})
		// console.log(this.state.searchTerm)
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
				const {list,searchTerm} = this.state;
				const listHtml = list.filter(isSearched(searchTerm)).map(item =>
				<div key={item.objectID}>
					<span><a href={item.url} >{item.title}</a></span>
					<span>{item.num_comments}</span>
					<span>{item.points}</span>
					<span>
						<button 
						type="button"
						onClick={()=>this.onDismiss(item.objectID)}
						>
							删除
						</button>
					</span>
				</div>);
			
        return (
            <div className = "App" >
            	<h2> {helloWorld} </h2> 
							<form>
								<input type="text" 
									onChange={this.searchList}
									value={searchTerm}
									// value={this.state.searchTerm}
								/>
							</form>
							{listHtml}
							{/* {
								this.state.list.map(item => 
								<span>
									<button
										type="button"
										onClick = {() => console.log(item.objectID)}
										//onClick={console.log(item.objectID)}
									>
										Click me
									</button>
								</span>
							)
							}  */}
							{/* 函数会立即执行，点击时不显示 */}
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

// 当使用 onClick={doSomething()}时，doSomething()函数会在浏览器打开程序时立即执行；由于监听表达式时函数执行返回值而不是函数，所以点击按钮时不会有任何事情发生。
// 但当使用onClick={doSomething} 时，因为doSomething是一个函数，所以它会在点击按钮时执行。同样规则适用于在程序中使用的onDismiss()类方法
// 然后使用这个并不够，因为类方法里需要接收item.objectID属性来识别那个将要被忽略的项，因此需要封装到另一个函数传递这个属性，这个概念在js中被称为高阶函数
// 其中一个解决方案就是在外部定义一个包装函数，并且只将定义的函数传递给处理程序。因为需要访问特定的列表项，所以它必须位于map函数块内部
export default App;
// export default ExplainBindingsComponent;

