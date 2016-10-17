import { take, select } from 'redux-saga/effects'
import { ACTION } from './types'

const RETURN = "__SAGAREDUCER_RETURN";

const loggerConfig = {
  [ACTION.RETURN]: { emoji: "️✅" },
  [ACTION.ADD_TODO]: { emoji: `📌`, payload: 'text' },
  [ACTION.EDIT_TODO]: { emoji: '✏️', payload: 'text' },
  [ACTION.DELETE_TODO]: { emoji: '🗑', payload: 'id'},
  [ACTION.COMPLETE_TODO]: { emoji: "✅", payload: 'completed' },
  [ACTION.TOGGLE_ALL]: { emoji: "✅" },
  [ACTION.CHANGE_VISIBILITY_FILTER]: { emoji: "👁", payload: 'filter' },
  [ACTION.UPDATE_CREATE_FIELD]: { emoji: "💭", payload: 'text' }
}

export function* logAndWatch() {
  const typeStyle = "text-transform: uppercase; font-weight: bold; color: gray; font-size: 8px;"
  const actionStyle = "color: #46B2DE; font-weight: bold;"
  const payloadStyle = "font-style: italic; color: #88a73e; font-weight: normal; font-size: 10px;"
  const expandedLabelStyle = "color: #567cb1; font-weight: bold;"

  const table = new Proxy(loggerConfig, {
    get: (target, name /*, receiver */) => target[name] || ''
  })

  while (true) {
    const { type, ...rest } = yield take("*")
    const state = yield select()
    const keys = Object.keys(rest).join(', ')

    if (type !== RETURN) {
      console.groupCollapsed(
        `%ctype ${table[type]['emoji'] || ''}\t=>\t%c${type}\n%c${'payload\t=>\t'}%c${table[type]['payload'] ? rest[table[type]['payload']] : keys}`,
        typeStyle, 
        actionStyle, 
        typeStyle, 
        payloadStyle
      )
      console.log('%c action', expandedLabelStyle, rest)
      console.log('%c state', expandedLabelStyle, state.toJS())
      console.groupEnd()
    }
  }
}