function cleanSearchResults() {
  document.getElementById('results-container').innerHTML = '';
}

function displaySearchResult(index, result) {
  let template = document.getElementById('searchResult');
  let newNode = document.importNode(template.content, true);
  let cardImage = newNode.querySelector('img');
  cardImage.alt = result['label'].value + ' image';
  cardImage.src = result['thumbnail'].value;
  let cardTitle = newNode.querySelector('h5');
  cardTitle.innerHTML = result['label'].value;
  let cardText = newNode.querySelector('p');
  cardText.innerHTML = result['abstract'].value;
  let countryLink = newNode.querySelectorAll('a')[1];
  countryLink.href = "page-pays.html?country=" + result['countryName'].value;
  countryLink.innerHTML = result['countryName'].value;
  newNode.getElementById("card-link").href = "page-plat.html?plat=" + result['label'].value;
  document.getElementById('results-container').appendChild(newNode);
}

function loadIngredientSearch() {

  let searchContent = findGetParameter('search');
  document.getElementById("search-desc").innerHTML = searchContent;

  let query = "SELECT ?food WHERE { \
    ?food a dbo:Food. \
    ?food ?predicat ?sujet. \
    ?sujet rdfs:label ?label. \
    FILTER(regex(?label, '(?i){1}')) \
    FILTER(?predicat IN (dbo:ingredient, dbo:ingredientName, dbp:mainIngredient, dbp:minorIngredient)). \
    }";
  query = query.replaceAll('{1}', searchContent);
  
  rechercher(query, data => {
    console.log(data);
    cleanSearchResults();

    let index = [];
    data.head.vars.forEach((v, _) => {
      index.push(v);
    });

    data.results.bindings.forEach(r => {
      displaySearchResult(index, r);
    });
  });
}