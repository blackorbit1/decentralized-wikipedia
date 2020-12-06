export const UPDATE_USER = 'UPDATE_USER'
export const CONNECT_ETHEREUM = 'CONNECT_ETHEREUM'
export const ARTICLES = 'ARTICLES'
export const HISTORY = 'HISTORY'

const initialState = {
  user: null,
  account: null,
  contract: null,
}

const updateUser = user => ({ type: UPDATE_USER, user })

const connectEthereum = ({ account, contract }) => ({
  type: CONNECT_ETHEREUM,
  account,
  contract,
})

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      const { user } = action
      return { ...state, user }
    case CONNECT_ETHEREUM:
      const { account, contract } = action
      return { ...state, account, contract }
    case ARTICLES:
      const{articles} = action
      return { ...state, articles}
    case HISTORY:
      const{history} = action
      return { ...state, history}    
    default:
      return state
  }
}

// servent a la communication entre fichiers
const getArticles = ({articles}) => ({tpye: ARTICLES, articles})
const updateHistory = ({history}) => ({type: HISTORY, history})


export default rootReducer
export { updateUser, connectEthereum, getArticles, updateHistory }
