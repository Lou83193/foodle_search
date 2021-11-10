queryNoCountryFilter = queryBuilder(
  [],
  [
    "FILTER (regex(?label, '{1}($|\s|-)|(^|\s|-){1}', 'i'))"
  ],
  200
);

queryCountryFilter = queryBuilder(
  [],
  [
    "FILTER(regex(?CountryName, '(?i){2}'))",
    "FILTER (regex(?label, '{1}($|\s|-)|(^|\s|-){1}', 'i'))"
  ],
  200
);

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

function loadSearch() {
  // get parameters (null if not defined)
  let searchContent = findGetParameter('search');
  let countryFilter = findGetParameter('country');
  if (searchContent == null) {
    window.location.href = "page-pays.html?country="+countryFilter;
    return;
  }// redirect to country search

  document.getElementById("search-desc").innerHTML = searchContent;
  console.log('Searched for (query, country):', searchContent, countryFilter);
  let query = (countryFilter == null? queryNoCountryFilter : queryCountryFilter);
  query = query.replaceAll('{1}', searchContent);
  if (countryFilter != null) query = query.replaceAll('{2}', countryFilter);
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