import Web3 from 'web3'
import ContractInterface from '../build/contracts/Wikipedia.json'
import store from '../store'
import { connectEthereum,  getArticles, updateHistory } from '../store/reducers/root'

const connect = async dispatch => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    try {
      const [account] = await window.ethereum.enable()
      const contract = new window.web3.eth.Contract(
        ContractInterface.abi,
        ContractInterface.networks['5777'].address,
        { from: account }
      )

      const articles = await getAllArticles(contract);
      const versionsE = await getVersion(contract);


      dispatch(connectEthereum({ account, contract }))
      // servent a la communication entre fichiers
      dispatch(getArticles({articles})); 
      dispatch(updateHistory({versionsE})); 

    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Not Dapp browser.')
  }
}

// ajoute un article dans la liste
const createArticle = (article) => async dispatch => {
  if(article != null) {
    // ajout de l'article dans le contrat
    const { contract } = store.getState() 
    await contract.methods.createArticle(article.toString()).send(); 

    // mise a jour de la liste des articles apres l'ajout
    const articles = getAllArticles(contract);
    dispatch(getArticles({ articles })); 
  }
}

const updateArticle = (id,article) => async dispatch => {
  const { contract } = store.getState();
  await contract.methods.modifyArticle(id,article.toString()).send(); // Envoie de la modification du contenu

  // mise a jour de la liste des articles apres la modification
  const articles = getAllArticles(contract);
  dispatch(getArticles({articles})); 

  // mise a jour de l'historique de l'article apres la modification
  const history = await getVersion(contract);
  dispatch(updateHistory({history})); 
}

// donne une liste de tous les articles du contrat
async function getAllArticles (contract) {
  // recuperation de tous les id
  const ids = await contract.methods.getAllIds().call(); 
  var articles = [];
  for (var i = 0; i < ids.length; i++) {
    const article = await contract.methods.articleContent(ids[i]).call(); 
    // ajout de l'id et du contenu (article) dans la liste des articles
    articles.push({ id: ids[i], article: article }); 
  }

  return articles;
}

// donne une liste de toutes les versions de tous les article
async function getVersion(contract){
  const ids = await contract.methods.getAllIds().call(); 
  const history = [];
  for(var i = 0; i < ids.length; i++){
    const numHisto = await contract.methods.getNbModif(ids[i]).call(); 
    const articles = [];
    for(var j = 0; j < numHisto; j++){
      const hist = await contract.methods.getVersion(ids[i], j).call(); 
      articles.push(hist);
    }
    history.push({id : ids[i], articlesVersion: articles}); 
  }

  return history;
}


export { connect, createArticle,updateArticle }