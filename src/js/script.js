function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function rechercher(contenu_requete, trigger_resultat) {

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";
    var results;

    // Requête HTTP et traitement des résultats
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            results = JSON.parse(this.responseText);
            trigger_resultat(results);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function searchButtonClicked(idBarrePlats, idBarrePays) {
    console.log(document.getElementById(idBarrePlats));
    searchContent = (idBarrePlats != '') ? document.getElementById(idBarrePlats).value : '';
    countryContent = (idBarrePays != '') ? document.getElementById(idBarrePays).value : '';
    if (searchContent != '' || countryContent != '') {
        // launch search !
        // redirect with get parameters (if defined) of both !
        // the other page, on load, gets parameters, fetches content based on it and renders
        redirectParameters = '?searchType=dish&' + (searchContent != '' ? 'searchKeyword='+searchContent : '') + (searchContent != '' && countryContent != ''? '&' : '') + (countryContent != ''? 'countryFilter='+countryContent : '');
        window.location.href = 'recherche.html' + redirectParameters;
    }
}


function normalizeString(str, uppercaseAll) {
    str = str.trim();
    str = str.replaceAll('_', ' ');
    strList = str.split(' ');
    if (uppercaseAll) {
        for (let i = 0; i < strList.length; i++) {
            subStr = strList[i];
            subStr = subStr.toLowerCase();
            subStr = subStr.charAt(0).toUpperCase() + subStr.slice(1);
            strList[i] = subStr;
        }
        str = strList.join(' ');
    }
    else {
        str = str.toLowerCase();
        str = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
}

function applyHeaderSearchBarListeners() {

    $('#search-button').click(function(event) {
        searchButtonClicked('search-input', '');
    });
    
    $("#search-input").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#search-button").click();
        }
    });

}

function queryBuilder(triplets, filters, limit) {

    let query = "";

    // Header
    query += "SELECT DISTINCT (SAMPLE(?Food) AS ?food) ?label (SAMPLE(?CountryName) AS ?countryName) (SAMPLE(?Thumbnail) AS ?thumbnail) (SAMPLE(?Abstract) as ?abstract) WHERE  { \n" +
    "?Food a dbo:Food ; rdfs:label ?label ; dbo:country ?country ; dbo:thumbnail ?Thumbnail ; dbo:abstract ?Abstract .\n" +
    "?country rdfs:label ?CountryName .";

    // Extra triplets 
    for (let i = 0; i < triplets.length; i++) {
        query += triplets[i] + "\n";
    }

    // Filters 
    query += "FILTER(langMatches(lang(?Abstract), 'en') || lang(?Abstract) = '') \n" +
    "FILTER(langMatches(lang(?CountryName), 'en') || lang(?CountryName) = '') \n" + 
    "FILTER(langMatches(lang(?label), 'en') || lang(?label) = '').";

    // Extra filters 
    for (let i = 0; i < filters.length; i++) {
        query += filters[i] + "\n";
    }

    // Footer 
    query += "} \n" +
    "GROUP BY ?label \n" +
    "ORDER BY ASC(?label) \n" + 
    "LIMIT " + limit; 

    return query;

}