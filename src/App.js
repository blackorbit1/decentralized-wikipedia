import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route, useParams } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
import MediumEditor from 'medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'

const NewArticle = () => {
  const [editor, setEditor] = useState(null)
  useEffect(() => {
    setEditor(new MediumEditor(`.${styles.editable}`))
  }, [setEditor])
  const dispatch = useDispatch()
  const createArticle = () => dispatch(Ethereum.createArticle(editor))
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <form onSubmit={createArticle}>
        <div className={styles.subTitle}>New article</div>
        <div className={styles.mediumWrapper}>
          <textarea className={styles.editable} />
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

const Home = () => {
  return (
    <div className={styles.links}>
      <Link to="/">Home</Link>
      <Link to="/article/new">Add an article</Link>
      <Link to="/article/all">All articles</Link>
    </div>
  )
}

//affichage de la version actuelle d'un article
const Article = ({ id, article }) => {
  const update = "update/"+id;
  const historique = "history/"+id;
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <div>
        Article {id}
        <br/><br/>
      </div>
      <div>
        <Link to={update}>Update</Link>
        <Link to={historique}>History</Link>
        <br/>
        {article}
      </div>

    </div>
  )
}

//affichage d'une ancienne version d'un article
const ArticleOld = ({id, article }) => {
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <div>
        Version {id}, 
        <br/><br/>
      </div>
      <div>
        {article}
      </div>

    </div>
  )
}


const AllArticles = () => {
  const [articles, setArticles] = useState([])
  const contract = useSelector(({ contract }) => contract)
  const articles1 = useSelector (({ articles }) => articles)
  useEffect(() => {
    if (contract) {
      var liste = []
      var la1 = articles1.length
      for(var i = 0; i < la1; i++){
        liste.push(<Article id={articles1[i].id} article={articles1[i].article}/>)
      }
    }
    setArticles(liste)
  }, [setArticles, articles1])
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <div>
        {articles}
      </div>
    </div>
  )
}

const ArticleVersions = () => {
  let { id } = useParams();
  const [articles, setArticles] = useState([])
  const versions = useSelector(({ versionsE }) => versionsE)
  useEffect(() => {
    var liste = []
    for(var i = 0; i < versions.length; i++){
      if(versions[i].id == id){
        for(var j = 0; j < versions[i].articlesVersion.length; j++) {
          liste.push(<ArticleOld id={j} article={versions[i].articlesVersion[j]} />)
        }
      }
    }
    setArticles(liste)
  }, [setArticles, versions])

  return (
  <div>
    <Home/>
    <div>
      {articles}
    </div>
  </div>
  )
}


const UpdateArticle = () => {
  let { id } = useParams();
  const [editor, setEditor] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    setEditor(new MediumEditor(`.${styles.editable}`))
  }, [setEditor])

  const updateArticle = () => dispatch(Ethereum.updateArticle(id,(editor == null ? article : editor)))

  const articles1 = useSelector(({ articles }) => articles)
  const history = useSelector(({ versionsE }) => versionsE)
  var article = "";

  for(var i = 0; i < articles1.length; i++){
    if(articles1[i].id === id) article = articles1[i].article
  }
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <form onSubmit={updateArticle}>
        <div className={styles.subTitle}>Update article</div>
        <div className={styles.mediumWrapper}>
          <textarea className={styles.editable} defaultValue={article}/>
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}


const NotFound = () => {
  return <div>Not found</div>
}

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(Ethereum.connect)
  }, [dispatch])
  return (
    <div className={styles.app}>
      <div className={styles.title}>Welcome to Decentralized Wikipedia</div>
      <Switch>
        <Route path="/article/new">
          <NewArticle />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/article/all">
          <AllArticles />
        </Route>     
        <Route path="/article/update/:id" children={<UpdateArticle />} />
        <Route path="/article/history/:id" children={<ArticleVersions />} />
        <Route>   
         <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App
