var treeData;
var categories = {};

var typesMaterils = {
                      book: "Книги",
                      speech: "Стенограммы выступлений",
                      article: "Статьи"
                     };

var jsonContentFile = "../catalog.json";

var oReq = new XMLHttpRequest();
oReq.onload = makeDOMTree;
oReq.open("get", jsonContentFile, true);
oReq.send();


var $pageContent = document.querySelector('.author-page-content__container');
var $sortButtonsBlock = document.querySelector('.mix-panel');

$sortButtonsBlock.addEventListener('click', function (event) {
  var el = event.target;
  oldEl = el.parentNode.querySelector(".mix-panel-active");
  oldEl.classList.remove("mix-panel-active");
  el.classList.add("mix-panel-active");
  if ( el.getAttribute('sort') == "year") sortYears();
  if ( el.getAttribute('sort') == "alphabet") sortAlphabet();
  if ( el.getAttribute('sort') == "default") makeDOMTree();
});


function createCategory(typeMaterial, types){
  if (types === undefined) {
    types = false;
  }
  
  var elCategory = document.createElement('div');
  
  var elCategoryTitle = document.createElement('div');
  elCategoryTitle.setAttribute("class", "author-page-content__category-name")
  if (types == false ){
    elCategoryTitle.textContent = typesMaterils[typeMaterial] + ':';
  } else {
    if(types == "years"){
      elCategoryTitle.textContent = typeMaterial + ':';
    }
  }
  var elCategoryList = document.createElement('ul');
  elCategoryList.setAttribute("class", "category-list");

  elCategory.appendChild(elCategoryTitle);
  elCategory.appendChild(elCategoryList);
  
  return elCategory;
}

function addElementToCategory(container, elem ){

  var list = container.querySelector(".category-list");
  
  var el = document.createElement('li');
  el.setAttribute("class", "category-list__item");
  
  var el1 = document.createElement('a');
  el1.setAttribute("class", "text-color_black");
  el1.href = elem.link;
  el1.textContent = elem.title;
  
  el.appendChild(el1);
  
  list.appendChild(el);
}

function makeDOMTree() {
  delDOMTree();
  treeData = JSON.parse(oReq.responseText);
  treeData.forEach(function(item, i, arr) {
    if (item.author === directory){
      if (!(item.type in categories)){
        categories[item.type] = createCategory(item.type);   
        addElementToCategory(categories[item.type], item);
        $pageContent.appendChild(categories[item.type]);
      } else {
        addElementToCategory(categories[item.type], item);
      }
    }
  }); 
}

function compareYear(A, B) {
  return A.date.slice(0,4) - B.date.slice(0,4);
}

function compareTitle(A, B) {
  return A.title.localeCompare(B.title);
}

function delDOMTree(){
  var elem = $pageContent;
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
  categories = {};
}
  
function sortYears(){
  
  delDOMTree();
  
  treeData.sort(compareYear);
  console.log(treeData);
  treeData.forEach(function(item, i, arr) {
    year = item.date.slice(0,4);
    if (item.author === directory){
      if (!(year in categories)){
        categories[year] = createCategory(year, "years");   
        addElementToCategory(categories[year], item);
        $pageContent.appendChild(categories[year]);
      } else {
        addElementToCategory(categories[year], item);
      }
    }
  }); 
}


function sortAlphabet(){
  
  delDOMTree();
  
  treeData.sort(compareTitle);
  
  treeData.forEach(function(item, i, arr) {
    firstChar = item.title[0];
    if (item.author === directory){
      if (!(firstChar in categories)){
        categories[firstChar] = createCategory(firstChar, "years");   
        addElementToCategory(categories[firstChar], item);
        $pageContent.appendChild(categories[firstChar]);
      } else {
        addElementToCategory(categories[firstChar], item);
      }
    }
  }); 
}
