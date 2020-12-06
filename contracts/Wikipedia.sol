pragma solidity ^0.5.0;

contract Wikipedia {
  struct Article {
    string content;
  }

  uint[] public ids;
  mapping (uint => Article) public articlesById;
  mapping (uint => uint) public nbModifById;
  mapping (uint => mapping(uint => Article)) public historyById;
  
  constructor() public {
    uint index = 0;
    ids.push(index);
    Article memory newArticle = Article("This is your first article in your contract");
    articlesById[index] = newArticle;
  }

  function articleContent(uint index) public view returns (string memory) {
    return articlesById[index].content;
  }

  function getAllIds() public view returns (uint[] memory) {
    return ids;
  }

  // Write your code here.

  // ajoute un article dans la liste, son index dans la liste des index
  function addArticle(string memory texte) public view {
    index++;
    ids.push(index);
    Article memory newArticle = Article(texte);
    articlesById[index] = newArticle;
  }

  // met a jour un article dans la liste
  function updateArticle(uint id, string memory texte) public view {

    // augmentation de 1 du nombre de modifications de l'article
    uint i = nbModifById[id];
    nbModifById[id]++;
    // ajout de la version avant modification de l'article
    // dans la liste des anciennes versions
    historyById[id][i] = articlesById[id];

    // remplacement de l'article dans la liste
    Article memory article = Article(texte);
    articlesById[id] = article;
  }

  // donne le nombre de fois qu'un article a ete modifie
  function getNbModif(uint id) public view returns (uint i){
    return nbModifById[id];
  }

  // donne la version de l'article apres i modifications
  function getVersion(uint id, uint i) public view returns(string memory){
    return historyById[id][i].content;
  }

}
