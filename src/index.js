function searchButtonClicked() {
    searchContent = document.getElementById("barre-recherche-plats").value;
    countryContent = document.getElementById("barre-recherche-pays").value;
    if (searchContent != '' || countryContent != '') {
        // launch search !
        // redirect with get parameters (if defined) of both !
        // the other page, on load, gets parameters, fetches content based on it and renders
        redirectParameters = '?' + (searchContent != ''? 'search='+searchContent : '') + (searchContent != '' && countryContent != ''? '&' : '') + (countryContent != ''? 'country='+countryContent : '');
        window.location.href = window.location.href.replace('/index.html', '/recherche.html' + redirectParameters);
    }
}

function loadCountries() {

    let query= 'SELECT DISTINCT ?label WHERE {\n' +
        '?Country a dbo:Country. \n' +
        '?Country rdfs:label ?label.\n' +
        '?Food a dbo:Food.\n' +
        '?Food dbo:country ?Country.\n' +
        'FILTER((lang(?label) = "" || langMatches(lang(?label), "en")) && !contains(?label,"cuisine") ).\n' +
        '\n' +
        '}';
    let pays = [];
    rechercher(query, data => {
        console.log(data);
        //ne marche pas
        data.results.bindings.forEach((v, _) => {
            pays.push(v["label"]["value"]);
        });

        let list = document.getElementById('liste-recherche-pays');

        pays.forEach(function(item){
            console.log(item);
            let option = document.createElement('option');
            option.value = item;
            list.appendChild(option);
        });
    });

}
