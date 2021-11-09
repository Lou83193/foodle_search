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
        redirectParameters = '?' + (searchContent != ''? 'search='+searchContent : '') + (searchContent != '' && countryContent != ''? '&' : '') + (countryContent != ''? 'country='+countryContent : '');
        window.location.href = '/recherche.html' + redirectParameters;
    }
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