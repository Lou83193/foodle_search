var selectedSearchType = "name";

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

function applySearchTabListeners() {

    $('button[data-bs-toggle="tab"]').on('click', function (e) {

        // Save search type
        selectedSearchType = e.target.innerHTML.toLowerCase();

        // Change placeholder text in search bar
        switch (selectedSearchType) {
            case "name":
                $('#barre-recherche-plats').prop("placeholder", "Dish name...");
                break;
            case "ingredient":
                $('#barre-recherche-plats').prop("placeholder", "Ingredient...");
                break;
            case "type":
                $('#barre-recherche-plats').prop("placeholder", "Dish type...");
                break;
            case "country":
                $('#barre-recherche-plats').prop("placeholder", "Country name...");
                break;
        }

        // Clear search term (bad idea?)
        // $('#barre-recherche-plats').prop("value", "");
        
        // Show or hide country filter
        if (selectedSearchType == "country") {
            $('#barre-recherche-pays').css('display', 'none');
        }
        else {
            $('#barre-recherche-pays').css('display', 'block');
        }

    });

}


function searchButtonClicked() {

    let searchType = (selectedSearchType == "name") ? "dish" : selectedSearchType;
    searchContent = document.getElementById("barre-recherche-plats").value;
    countryContent = document.getElementById("barre-recherche-pays").value;

    if (searchContent != '') {
        
        if (searchType != 'country') { 
            page = '/recherche.html';
            parameters = '?searchType=' + searchType + '&searchKeyword='+ searchContent + ((countryContent != '') ? '&countryFilter=' + countryContent : '');
        }
        else {
            page = '/page-pays.html';
            parameters = '?country=' + searchContent;
        }
        window.location.href = window.location.href.replace('/index.html', page + parameters);

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
        //let link = data.results.bindings["0"]["Food"]["value"];
        let i= 'http://dbpedia.org/resource/'.length;
        type = " - "+ type.substring(i)
        let x = document.createElement("A");
        x.setAttribute("href", 'page-plat.html?plat='+foodname);
        let clickable=document.createTextNode(foodname+type);
        x.appendChild(clickable);
        document.getElementById("plat-du-jour-nom").appendChild(x);


        let description = document.createTextNode(data.results.bindings["0"]["detail"]["value"]);      // Create a text node
        document.getElementById("plat-du-jour-description").appendChild(description);

        let query2='SELECT ?image WHERE {\n'+
            '?food a dbo:Food.\n'+
            '?food rdfs:label "{1}"@en.\n'+
            '?food dbo:thumbnail ?image.\n'+
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

