import I from 'immutable'
import uuid from 'node-uuid'
import { select, call, fork } from 'redux-saga/effects'
import { createSelector } from 'reselect'

import createSagaStore, { next } from 'redux-saga-reducers'
import { logAndWatch } from './helpers'
import { ACTION, APP } from './types'

const initialState = I.fromJS({
  nowShowing: APP.ALL_TODOS,
  createField: '',
  todos: [
    {
      id: uuid.v4(),
      text: 'foo',
      completed: false
    },
    {
      id: uuid.v4(),
      text: 'bar',
      completed: false
    },
    {
      id: uuid.v4(),
      text: 'baz',
      completed: false
    }
  ]
})

const todosSelector = state => state.get('todos')

const createFieldSelector = state => state.get('createField')

const completedSelector = createSelector(
  todosSelector,
  todos =>
    todos.every(todo => todo.get('completed'))
)

const sagaReducer = (channel) => ({

  [ACTION.CHANGE_VISIBILITY_FILTER]: function* (action) {
    const state = yield select()
    yield next(state.set('nowShowing', action.filter))
  },

  [ACTION.UPDATE_CREATE_FIELD]: function* (action) {
    const state = yield select()
    yield next(state.set('createField', action.text))
  },

  [ACTION.ADD_TODO]: function* () {
    const state = yield select()
    if (createFieldSelector(state).length) {
      yield next(state.set('createField', '').updateIn(['todos'],
        todos => todos.push(I.Map({
          id: uuid.v4(),
          text: createFieldSelector(state),
          completed: false
        }))))
    }
  },

  [ACTION.DELETE_TODO]: function* (action) {
    const state = yield select()
    yield next(state.updateIn(['todos'], 
      todos =>
        todos.filter(todo => todo.get('id') !== action.id)))
  },

  [ACTION.EDIT_TODO]: function* (action) {
    const state = yield select()
    yield next(state.updateIn(['todos'],
      todos => {
        const idx = todos.findIndex(todo => todo.get('id') === action.id)
        return todos.set(idx, todos.get(idx).set('text', action.text))
      }))
  },

  [ACTION.COMPLETE_TODO]: function* (action) {
    const state = yield select()
    yield next(state.updateIn(['todos'],
      todos => {
        const idx = todos.findIndex(todo => todo.get('id') === action.id)
        return todos.set(idx, todos.get(idx).set('completed', !todos.getIn([idx, 'completed'])))
      }))
  },

  [ACTION.TOGGLE_ALL]: function* () {
    const state = yield select()
    const toggled = yield call(completedSelector, state)
    yield next(state.updateIn(['todos'],
      todos => todos.map(
        todo => todo.set('completed', !toggled))))
  },

  [ACTION.CLEAR_COMPLETED]: function* () {
    const state = yield select()
    yield next(state.updateIn(['todos'],
      todos => todos.filter(
        todo => todo.get('completed') === false)))
  }
})

const store = createSagaStore(sagaReducer, initialState, [
  fork(logAndWatch)
])

export default store
