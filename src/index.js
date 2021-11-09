

function applyMainSearchBarListeners() {

    $('#bouton-recherche').click(function(event) {
        searchButtonClicked('barre-recherche-plats', 'barre-recherche-pays');
    });
    
    $("#barre-recherche-plats").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#bouton-recherche").click();
        }
    });
    
}


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
        '} \n ' +'ORDER BY ASC (?label) ';
    let pays = [];
    rechercher(query, data => {
        console.log(data);
        data.results.bindings.forEach((v, _) => {
            pays.push(v["label"]["value"]);
        });

        let list = document.getElementById('liste-recherche-pays');

        pays.forEach(function(item){
            //console.log(item);
            let option = document.createElement('option');
            option.value = item;
            list.appendChild(option);
        });
    });

}


function loadHighlightedFood() {

    let random = Math.floor(Math.random() * 4470) + 1;

    let query= 'SELECT * WHERE {\n'+
            '?Food a dbo:Food.\n'+
            '?Food dbo:country ?Country.\n'+
            '?Country a dbo:Country.\n'+
            '?Food rdfs:label ?label.\n'+
            '?Food rdfs:comment ?detail.\n'+
            '?Food dbo:type ?type\n'+
            'FILTER(!isLiteral(?detail) || lang(?detail) = "" || langMatches(lang(?detail), "en"))\n'+
            'FILTER (lang(?label) = "" || langMatches(lang(?label), "en"))\n'+
    '}\n'+
    'OFFSET '+ random+'\n'+
    'LIMIT 1' ;

    console.log("random number ="+random);


    rechercher(query, data => {
        console.log(data);
        let foodname = data.results.bindings["0"]["label"]["value"];
        let type = data.results.bindings["0"]["type"]["value"];
        let link = data.results.bindings["0"]["Food"]["value"];
        let i= 'http://dbpedia.org/resource/'.length;
        type = " - "+ type.substring(i)
        let x = document.createElement("A");
        x.setAttribute("href", link);
        let clickable=document.createTextNode(foodname+type);
        x.appendChild(clickable);
        document.getElementById("plat-du-jour-nom").appendChild(x);


        let description = document.createTextNode(data.results.bindings["0"]["detail"]["value"]);      // Create a text node
        document.getElementById("plat-du-jour-description").appendChild(description);

        let query2='SELECT ?image WHERE {\n'+
            '?food a dbo:Food.\n'+
            '?food rdfs:label "{1}"@en.\n'+
            '?food foaf:depiction ?image.\n'+
            '} LIMIT 1';

        rechercher(query2.replaceAll('{1}',foodname), data2 => {
            console.log(data2);
            let img = document.createElement('img');
            img.src=data2.results.bindings["0"]["image"]["value"];
            checkImage(img.src, img);
            document.getElementById('plat-du-jour-image').append(img);

        });

    });
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

