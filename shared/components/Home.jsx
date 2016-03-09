import React                   from 'react';
import { bindActionCreators }  from 'redux';
import { connect }             from 'react-redux'; 

class Home extends React.Component{
	// static needs = [
	//     TodoActions.getTodos
	// ];
	
	render() {
		const { todos, dispatch } = this.props;

		return (
			<div id="todo-list">
				<h3>Home</h3>
			</div>
		);
	}
}

export default connect(state => ({ todos: state.todos }))(Home);