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
    let countryDesc = document.getElementById("country-desc-content");
    let flagImage = document.getElementById("country-flag");
    flagImage.alt = result['label'].value + " Flag";
    flagImage.src = result['flag'].value;
    let readMoreTag = " <a href='{1}' target='_blank' rel='noopener noreferrer'>{2}</a>";
    readMoreTag = readMoreTag.replace('{1}', result['link'].value);
    readMoreTag = readMoreTag.replace('{2}', "Read More");
    countryDesc.innerHTML = result['desc'].value + readMoreTag;
}

function loadSearch() {
    // todo : HANDLE SEARCH CONTENT NULL -> search only country
    // get parameters (null if not defined)
    let countryParameter = findGetParameter('country');
    document.getElementById("country-title").innerHTML = countryParameter;
    document.getElementById("country-dishes-title").innerHTML = "Food from " + countryParameter;
    document.title = "Food from " + countryParameter;
    
    console.log('Searched for (country) description:', countryParameter);
    let query = 'SELECT ?label ?desc ?flag ?link WHERE {\n' +
    '?country a dbo:Country.\n' +
    '?country rdfs:label "{1}"@en;\n' +
    'rdfs:comment ?desc;\n' +
    'rdfs:label ?label;\n' +
    'dbo:thumbnail ?flag;\n' +
    'foaf:isPrimaryTopicOf ?link.\n' +
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
    query = 'SELECT DISTINCT (SAMPLE(?Food) AS ?food) ?label (SAMPLE(?Thumbnail) AS ?thumbnail) (SAMPLE(?Abstract) as ?abstract) WHERE  {\n' +
    '    ?Food a dbo:Food ; rdfs:label ?label ; dbo:country ?country ; dbo:thumbnail ?Thumbnail ; dbo:abstract ?Abstract .\n' +
    '    ?country rdfs:label ?CountryName.\n' +
    '\n' +
    '    FILTER(langMatches(lang(?Abstract), "en") || lang(?Abstract) = "")\n' +
    '    FILTER(langMatches(lang(?CountryName), "en") || lang(?CountryName) = "")\n' +
    '    FILTER(regex(?CountryName, "(?i){1}"))\n' +
    '    FILTER((lang(?label) = "" || langMatches(lang(?label), "en")))\n' +
    '} \n' +
    'GROUP BY ?label\n' +
    'ORDER BY ASC(?label) \n' +
    'LIMIT 200';
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