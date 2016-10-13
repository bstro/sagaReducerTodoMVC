import React from 'react'
import { ACTION, APP } from './types'
import { connect } from 'react-redux'
import './App.css'

const App = () => <TodosContainer />

const TodosContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todos)

function Todos({ props, actions }) {
  const
    { onChangeVisibilityFilter, onUpdateCreateField
    , onAdd, onToggleClick, onToggleAll
    , onEdit, onDestroyClick, onClearCompleted
    } = actions

  const 
    { todos
    , count
    , nowShowing
    , createField 
    } = props
  
  return (
    <section className="todoapp">

      <header className="header">
        <h1>Todos</h1>
        <form onSubmit={onAdd(createField)}>
          <input className="new-todo" type="text" onChange={onUpdateCreateField} value={createField} placeholder="What needs to be done?" tabIndex={-1} />
        </form>
      </header>
      
      <section className="main">
        {todos.size ? <input onChange={onToggleAll} className="toggle-all" id="toggle-all" type="checkbox" /> : '' }
        <ul className="todo-list">
          {todos.map(todo => {
            let text = todo.get('text')
            let id = todo.get('id')
            let completed = todo.get('completed')
            return (
              <li key={id} className={completed ? "completed" : ""}>
                <div className="view">
                  <input className="toggle" onClick={onToggleClick(id, completed)} type="checkbox" checked={completed} />
                  <input type="text" value={ text } onChange={onEdit(id)} />
                  <button className="destroy" onClick={onDestroyClick(id)} ></button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <footer className="footer">
        <span className="todo-count">
          <strong>{count}</strong> todo(s) left
        </span>
        
        <ul className="filters">
          <li>
            <a onClick={onChangeVisibilityFilter(APP.ALL_TODOS)} className={nowShowing === APP.ALL_TODOS ? "selected" : ""}>
              All
            </a>
          </li>

          <li>
            <a onClick={onChangeVisibilityFilter(APP.ACTIVE_TODOS)} className={nowShowing === APP.ACTIVE_TODOS ? "selected" : ""}>
              Active
            </a>
          </li>

          <li>
            <a onClick={onChangeVisibilityFilter(APP.COMPLETED_TODOS)}  className={nowShowing === APP.COMPLETED_TODOS ? "selected" : ""}>
              Completed
            </a>
          </li>
        </ul>

        <button
          className="clear-completed"
          onClick={onClearCompleted}>
          Clear completed
        </button>

      </footer>
    </section>
  )
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case APP.ALL_TODOS:
      return todos
    case APP.ACTIVE_TODOS:
      return todos.filter(t => !t.get('completed'))
    case APP.COMPLETED_TODOS:
      return todos.filter(t => t.get('completed'))
    default:
      return todos
  }
}

function mapStateToProps(state) {
  return {
    props: {
      todos: getVisibleTodos(state.get('todos'), state.get('nowShowing')),
      createField: state.get('createField'),
      nowShowing: state.get('nowShowing'),
      count: state.get('todos').filter(todo => !todo.get('completed')).size
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      onUpdateCreateField: ({target}) =>
        dispatch({ type: ACTION.UPDATE_CREATE_FIELD, text: target.value }),

      onChangeVisibilityFilter: (filter) =>
        () =>
          dispatch({ type: ACTION.CHANGE_VISIBILITY_FILTER, filter }),

      onAdd: (text) => (e) => {
        e.preventDefault()
        dispatch({ type: ACTION.ADD_TODO, text })
      },

      onEdit: (id, text) =>
        ({target}) =>
          dispatch({ type: ACTION.EDIT_TODO, text: target.value, id }),

      onClearCompleted: () =>
        dispatch({ type: ACTION.CLEAR_COMPLETED }),

      onDestroyClick: (id) =>
        () =>
          dispatch({ type: ACTION.DELETE_TODO, id }),

      onToggleClick: (id, completed) =>
        () =>
          dispatch({ type: ACTION.COMPLETE_TODO, completed: !completed, id }),

      onToggleAll: () =>
        dispatch({ type: ACTION.TOGGLE_ALL })
    }
  }
}

export default App
