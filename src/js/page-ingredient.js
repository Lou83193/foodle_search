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
  $("#search-desc").html(searchContent);
  $("#buy-link").html("<a href='https://www.walmart.com/search?q=" + searchContent + "' class='btn btn-info btn-lg' target='_blank'>Buy at Walmart</a>"); 

  let query = queryBuilder(
    [
      "?Food ?predicat ?sujet .", 
      "?sujet rdfs:label ?labelIngredient ." 
    ], 
    [
      "FILTER((isLiteral(?sujet) && regex(?sujet, '(?i){1}')) || (!isLiteral(?sujet) && regex(?labelIngredient, '(?i){1}'))).",
      "FILTER(?predicat IN (dbo:ingredient, dbo:ingredientName, dbp:mainIngredient, dbp:minorIngredient))."
    ],
    200);
  query = query.replaceAll('{1}', searchContent);
  
  rechercher(query, data => {
    console.log(data);
    cleanSearchResults();
    $('.loader-overlay').css('display', 'none');

    let index = [];
    data.head.vars.forEach((v, _) => {
      index.push(v);
    });

    data.results.bindings.forEach(r => {
      displaySearchResult(index, r);
    });
  });
}