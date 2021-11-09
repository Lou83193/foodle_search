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

  let searchContent = findGetParameter('ingredient');
  document.getElementById("search-desc").innerHTML = searchContent;

  let query = "SELECT (SAMPLE(?Food) AS ?food) ?label (SAMPLE(?CountryName) AS ?countryName) (SAMPLE(?Thumbnail) AS ?thumbnail) (SAMPLE(?Abstract) as ?abstract) WHERE { \
    ?Food a dbo:Food ; rdfs:label ?label ; dbo:country ?country ; dbo:thumbnail ?Thumbnail ; dbo:abstract ?Abstract . \
    ?country rdfs:label ?CountryName . \
    ?Food a dbo:Food. \
    ?Food ?predicat ?sujet. \
    ?sujet rdfs:label ?labelIngredient. \
    FILTER(langMatches(lang(?Abstract), 'en') || lang(?Abstract) = '') \
    FILTER(langMatches(lang(?CountryName), 'en') || lang(?CountryName) = '') \
    FILTER(lang(?label) = '' || langMatches(lang(?label), 'en')). \
    FILTER(regex(?labelIngredient, '(?i){1}')). \
    FILTER(?predicat IN (dbo:ingredient, dbo:ingredientName, dbp:mainIngredient, dbp:minorIngredient)). \
    } \
    LIMIT 200";
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