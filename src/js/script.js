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

    $('#quicksearch-button').click(function(event) {
        quickSearchButtonClicked('quicksearch-input');
    });
    
    $("#quicksearch-input").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#quicksearch-button").click();
        }
    });   

}

function quickSearchButtonClicked(idBarrePlats) {

    searchContent = document.getElementById(idBarrePlats).value;
    if (searchContent != '') {
        parameters = '?searchType=dish&searchKeyword=' + searchContent;
        window.location.href = 'recherche.html' + parameters;
    }

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



function checkImage(url, img) {
    var image = new Image();
    image.onload = function() {
        if (this.width > 0) {
            console.log("image exists");
        }
    }
    image.onerror = function() {
        console.log("image doesn't exist");
        img.src="style/img/imageNotFound.png"

    }
    image.src = url;
}
