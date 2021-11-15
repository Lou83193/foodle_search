var countryFilterQuery = "FILTER(regex(?CountryName, '(?i){2}'))";

function cleanSearchResults() {
  document.getElementById('results-container').innerHTML = '';
}

function displaySearchResult(index, result) {
  let template = document.getElementById('search-result');
  let newNode = document.importNode(template.content, true);
  let cardImage = newNode.querySelector('img');
  cardImage.alt = result['label'].value + ' image';
  cardImage.src = result['thumbnail'].value;
  checkImage(cardImage.src, cardImage);
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

function loadSearch() {

  // Get parameters (null if not defined)
  let searchType = findGetParameter('searchType');
  let searchKeyword = findGetParameter('searchKeyword');
  let countryFilter = findGetParameter('countryFilter');

  // If there is no search keyword, redirect to 'country' search type with country filter as search keyword
  /*if (searchKeyword == null) {
    window.location.href = "page-pays.html?country=" + countryFilter;
    return;
  }*/

  // Load search query data in HTML
  if (searchType == "ingredient") {
    $('#results-title').html('Dishes made with <span id="search-desc"></span>:');
    $('#results-header').append('<div id="buy-link" class="blue-button ml-3"></div>'); 
    $("#buy-link").html("<a href='https://www.walmart.com/search?q=" + searchKeyword + "' class='btn btn-info btn-lg' target='_blank'>Buy at Walmart</a>"); 
  }
  $("#search-desc").html(normalizeString(searchKeyword));

  // Create appropriate query
  let triplets = []; let filters = [];
  switch(searchType) {

    // Dish search
    case "dish":
      triplets = [];
      filters = ["FILTER (regex(?label, '{1}($|\s|-)|(^|\s|-){1}', 'i'))"];
    break;

    // Ingredient search
    case "ingredient":
      triplets = [
        "?Food ?predicat ?sujet .", 
        "?sujet rdfs:label ?labelIngredient ." 
      ];
      filters = [
        "FILTER((isLiteral(?sujet) && regex(?sujet, '(?i){1}')) || (!isLiteral(?sujet) && regex(?labelIngredient, '(?i){1}'))).",
        "FILTER(?predicat IN (dbo:ingredient, dbo:ingredientName, dbp:mainIngredient, dbp:minorIngredient))."
      ];
      
    break;

    // Type search
    case "type":
      triplets = [
        "?Food dbo:type ?type"
      ];
      filters = [
        "FILTER(regex(?type, '(?i){1}'))."
      ];

    break;

  }
  if (countryFilter != null) filters.push(countryFilterQuery);
  let query = queryBuilder(triplets, filters, 200);
  query = query.replaceAll('{1}', searchKeyword); 
  if (countryFilter != null) query = query.replaceAll('{2}', countryFilter);

  // Launch query & inject results in HTML
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