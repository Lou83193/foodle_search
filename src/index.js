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


