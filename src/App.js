import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Link, Route, useParams } from 'react-router-dom'
import * as Ethereum from './services/Ethereum'
import styles from './App.module.css'
import MediumEditor from 'medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'
import DOMPurify from 'dompurify';

const NewArticle = () => {
  const [editor, setEditor] = useState(null)
  useEffect(() => {
    setEditor(new MediumEditor(`.${styles.editable}`))
  }, [setEditor])
  const handleSubmit = () => {
    if(contract){
      contract.methods.addNewArticle(DOMPurify.sanitize(editor.getContent())).send()
    }
  }
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <form onSubmit={handleSubmit}>
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

const AllArticles = () => {
  const [articles, setArticles] = useState([])
  const contract = useSelector(({ contract }) => contract)
  useEffect(() => {
    if (contract) {
      contract.methods.getAllIds().call().then(ids => {
        ids.forEach ( i => {
          contract.methods.articleContent(i).call().then(content => {
            setArticles(articles => [...articles, content])
          })
        })
      })
    }
  }, [contract, setArticles]);
  return (
  <div>
    <div>
      <Home/><br/><br/>
    </div>
    <div>
    {articles.map((article,index) => {
      return <div className={styles.articleWrapper} 
                    key={index}> Article : {index} : 
                    <Link to={"/article/update/" + index}>Update</Link>
                    <Link to={"/article/versions/" + index}>History</Link>
                <div className={styles.articleContent} 
                      dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article)}} />
            </div>}
          )}

    </div>
  </div>
  )
}

const Article = () => {
  const contract = useSelector(({ contract }) => contract);
  const { id } = useParams();
  const [content, setContent] = useState(null);

  if (contract) {
    contract.methods.articleContent(id).call().then((res) => {
      if (res !== "")
        setContent(res);
      else
        setContent("Article of id " + id + " doesn't exist");
    })
  }

  return (
    <div id="article" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize("<h5>Article [" + id + "]</h5>" + content )}} />
  )
}

const UpdateArticle = () => {
  const [editor, setEditor] = useState(null)
  const contract = useSelector(({ contract }) => contract)
  const { id } = useParams();

  useEffect(() => {
    if (contract) {
      contract.methods.articleContent(id).call().then((res) => {
        const editor = new MediumEditor(`.${styles.editable}`);
        editor.setContent(res);
        setEditor(editor);
      });
    }

  }, [setEditor, contract, id]);
  const handleSubmit = () => {
    if(contract){
      contract.methods.updateArticle(id, DOMPurify.sanitize(editor.getContent())).send()
    }
  }
  return (
    <div>
      <div>
        <Home/><br/><br/>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.subTitle}>Update article</div>
        <div className={styles.mediumWrapper}>
          <textarea className={styles.editable} >
            {contract.methods.articleContent(id).call()}
          </textarea>
        </div>
        <input type="submit" value="Submit" />
      </form>
    </div>
  )

}

// affiche l'historique de maniere similaire a AllArticles
const History = () => {
  const contract = useSelector(({ contract }) => contract);
  const { id } = useParams();
  const [content, setArticles] = useState(null);
  useEffect(() => {
    if (contract) {
      contract.methods.getAllVersionsById().call().then(ids => {
        ids.forEach ( i => {
            setArticles(articles => [...articles, i.content])
        })
      })
    }
  }, [contract, setArticles]);
  return (
  <div>
    <div>
      <Home/><br/><br/>
    </div>
    <div>
    {articles.map((article,index) => {
      return <div className={styles.articleWrapper} 
                    key={index}> Version : {index} : 
                <div className={styles.articleContent} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(article)}} />
            </div>}
          )}

    </div>
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
        <Route path="/article/update/:id">
          <UpdateArticle />
        </Route>
        <Route path="/article/article/:id">
          <Article />
        </Route>
        <Route path="/article/versions/:id">
          <History />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  )
}

export default App
