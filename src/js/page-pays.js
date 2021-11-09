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
    newNode.getElementById("card-link").href = "page-plat.html?plat=" + result['label'].value;
    document.getElementById('results-container').appendChild(newNode);
    // todo : add onclick -> redirects to detail?plat=nom
}

function displayCountryDesc(index, result) {
    let countryDesc = document.getElementById("country-desc");
    let flagImage = document.getElementById("country-flag");
    flagImage.alt = result['label'].value + " Flag";
    flagImage.src = result['flag'].value;
    countryDesc.innerHTML = result['desc'].value;
}

function loadSearch() {
    // todo : HANDLE SEARCH CONTENT NULL -> search only country
    // get parameters (null if not defined)
    let countryParameter = findGetParameter('country');
    document.getElementById("country-title").innerHTML = countryParameter;
    console.log('Searched for (country) description:', countryParameter);
    let query = 'SELECT ?label ?desc ?flag WHERE {\n' +
    '?country a dbo:Country.\n' +
    '?country rdfs:label "{1}"@en;\n' +
    'dbo:abstract ?desc;\n' +
    'rdfs:label ?label;\n' +
    'dbo:thumbnail ?flag.\n' +
    'FILTER(langMatches(lang(?desc), "EN"))\n' +
    '} LIMIT 1';
    query = query.replaceAll('{1}', countryParameter);
    rechercher(query, data => {
        console.log(data);
        let index = [];
        data.head.vars.forEach((v, _) => {
            index.push(v);
        });
        
        data.results.bindings.forEach(r => {
            displayCountryDesc(index, r);
        });
    });
    
    console.log('Searched for (country) food:', countryParameter);
    query = 'SELECT ?food WHERE {\n' +
    '?country a dbo:Country.\n' +
    '?country rdfs:label "{1}"@en.\n' +
    '?country dbo:country ?food.\n' +
    '?food a dbo:Food.\n' +
    '} LIMIT 10';
    query = query.replaceAll('{1}', countryParameter);
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