pragma solidity ^0.5.0;

contract Wikipedia {
  struct Article {
    string content;
  }

  uint[] public ids;
  mapping (uint => Article) public articlesById;

  // liste du nombre de modifications de chaque article
  mapping (uint => uint) public nbModifsById;
  // liste de chaque version de chaque article
  mapping (uint => (mapping uint => Article)) public historyById;

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

  // ajout d'un article dans la liste d'article
  // et de son id dans la liste des id
  function addNewArticle(string memory content) public {
    uint index = ids.length;
    ids.push(index);
    Article memory newArticle = Article(content);
    articlesById[index] = newArticle;
  }

  // mise a jour d'un article
  function updateArticle(uint index, string memory content) public {
    Article memory updatedArticle = Article(content);

    // ajout de l'ancienne version dans l'historique
    historyById[id][nbModifsById[index]] = articlesById[index];
    nbModifsById[index] += 1;

    // mise a jour de l'article dans la liste d'articles
    articlesById[index] = updatedArticle;
  }


  function getNbModifs(uint index) public returns(uint memory){
    return nbModifsById[index];
  }

  function getVersionById(uint id, uint ver) public returns(string memory){
    return historyById[id][ver].content;
  }

  function getAllVersionsById(uint id) public returns(Article[] memory){
    return historyById[id];
  }
}
