function cleanSearchResults() {
    document.getElementById('results-container').innerHTML = '';
}

function displaySearchResult(index, result) {
    const template = document.getElementById('search-result');
    let newNode = document.importNode(template.content, true);
    let cardImage = newNode.querySelector('img');
    cardImage.alt = result['label'].value + ' image';
    cardImage.src = result['thumbnail'].value;
    checkImage(cardImage.src, cardImage);
    let cardTitle = newNode.querySelector('h5');
    cardTitle.innerHTML = result['label'].value;
    let cardText = newNode.querySelector('p');
    cardText.innerHTML = result['abstract'].value;
    newNode.getElementById("card-link").href = "page-plat.html?plat=" + result['label'].value;
    document.getElementById('results-container').appendChild(newNode);
}

function displayCountryDesc(index, result) {
    let countryDesc = document.getElementById("country-desc-content");
    let flagImage = document.getElementById("country-flag");
    flagImage.alt = result['label'].value + " Flag";
    flagImage.src = result['flag'].value;
    checkImage(flagImage.src, flagImage);
    let readMoreTag = " <a href='{1}' class='ml-2' target='_blank' rel='noopener noreferrer'>{2}</a>";
    readMoreTag = readMoreTag.replace('{1}', result['link'].value);
    readMoreTag = readMoreTag.replace('{2}', "Read&nbsp;More");
    countryDesc.innerHTML = result['desc'].value + readMoreTag;
}

function loadSearch() {
    // todo : HANDLE SEARCH CONTENT NULL -> search only country
    // get parameters (null if not defined)
    $('#page-body-content').css('display', 'none');
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
        
        if(data.results.bindings.length != 0){
            data.results.bindings.forEach(r => {
                displayCountryDesc(index, r);
            });
        }else {
            $('#country-desc-content').css('display', 'none');
            $('#toggle-show-more').css('display', 'none');

        }

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
        $('.loader-overlay').css('display', 'none');
        
        let index = [];
        data.head.vars.forEach((v, _) => {
            index.push(v);
        });

        if(data.results.bindings.length != 0) {
            $('#page-body-content').css('display', 'block');
            data.results.bindings.forEach(r => {
                displaySearchResult(index, r);
            });
        }else{
            $('#page-body').append('<h5>This country does not seem to exist, sorry :(</h5>');
        }

    });
}

// this overrides `contains` to make it case insenstive
jQuery.expr[':'].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0;
};

var filterKeyUp = function () {
    $('.card').removeClass('d-none');
    var filter = $(this).val(); // get the value of the input, which we filter on
    $('#results-container').find(".card .card-body h5:not(:contains('" + filter + "'))").parent().parent().parent().parent().parent().addClass('d-none');
}