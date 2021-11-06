function chargerInfosPlat(plat) {

    // Nom du plat 
    $("#nom-plat").html(plat);

    // Description du plat
    let query1 = "SELECT * WHERE { ?Food a dbo:Food. ?Food rdfs:label '{1}'@en. ?Food ?attribut ?detail. FILTER(!isLiteral(?detail) || lang(?detail) = '' || langMatches(lang(?detail), 'en')). FILTER(?attribut IN (dbo:abstract, rdfs:comment, dbp:caption)). }";
    query1 = query1.replace('{1}', plat);
    rechercher(query1, chargerDescriptionPlat);

    // Origine du plat
    let query2 = "SELECT * WHERE {?Food a dbo:Food. ?Food rdfs:label '{1}'@en. ?Food ?attribut ?detail. FILTER(!isLiteral(?detail) || lang(?detail) = '' || langMatches(lang(?detail), 'en')). FILTER(?attribut IN (dbo:country, dbo:region, dbo:cuisine, dbp:nationalCuisine)). }";
    query2 = query2.replace('{1}', plat);
    rechercher(query2, chargerOriginePlat); 

    // Type du plat
    let query3 = "SELECT * WHERE {?Food a dbo:Food. ?Food rdfs:label '{1}'@en. ?Food ?attribut ?detail. FILTER(!isLiteral(?detail) || lang(?detail) = '' || langMatches(lang(?detail), 'en')). FILTER(?attribut IN (dbo:type, dbo:servingTemperature, dbp:served)). }";
    query3 = query3.replace('{1}', plat);
    rechercher(query3, chargerTypePlat);

    // Ingrédients du plat
    let query4 = "SELECT * WHERE { ?Food a dbo:Food. ?Food rdfs:label '{1}'@en. ?Food ?attribut ?detail. FILTER(!isLiteral(?detail) || lang(?detail) = '' || langMatches(lang(?detail), 'en')). FILTER(?attribut IN (dbo:ingredient, dbo:ingredientName, dbp:mainIngredient, dbp:minorIngredient)). }";
    query4 = query4.replace('{1}', plat);
    rechercher(query4, chargerIngredientsPlat);

    /*
    // Valeurs nutritionnelles du plat
    let query5 = "SELECT * WHERE {?Food a dbo:Food. ?Food rdfs:label '{1}'@en. ?Food ?attribut ?detail. FILTER(!isLiteral(?detail) || lang(?detail) = '' || langMatches(lang(?detail), 'en')). FILTER(?attribut IN (dbp:fat, dbp:ironMg, dbp:fiber)). }";
    query5 = query5.replace('{1}', plat);
    rechercher(query5, chargerNutritionPlat);

    // Images du plat
    let query6 = "SELECT ?image WHERE { ?food a dbo:Food. ?food rdfs:label '{1}'@en. ?food foaf:depiction ?image. } LIMIT 4";
    query6 = query6.replace('{1}', plat);
    rechercher(query6, chargerImagesPlat);
    */

} 

function normalizeString(str) {
    str = str.replace("_", " ");
    str = str.trim();
    str = str.toLowerCase();
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str;
}

function obtenirResultatsJson(json) {

    // Itérer à travers tous les résultats et les stocker dans une map
    const n = json.results.bindings.length;
    const map = new Map();

    for(var i = 0; i < n; i++) {
        let obj = json.results.bindings[i];

        // Récupérer le prédicat
        let predicat = obj.attribut.value;
        if (obj.attribut.type == 'uri') {
            let uriSplit = predicat.split('/');
            predicat = uriSplit[uriSplit.length-1];
        }

        // Récupérer le sujet
        let sujet = obj.detail.value;
        if (obj.detail.type == 'uri') {
            let uriSplit = sujet.split('/');
            sujet = uriSplit[uriSplit.length-1];
        }
        
        map.set(predicat, sujet);

    }

    return map;
    
}

function chargerDescriptionPlat(json) {

    const map = obtenirResultatsJson(json);
    let description = ""; 
    if (map.has('abstract')) {
        description = map.get('abstract');
    }
    else if (map.has('rdf-schema#comment')) {
        description = map.get('rdf-schema#comment');
    }
    else if (map.has('caption')) {
        description = map.get('caption');
    }
    $('#description-plat').html(description);

}

function chargerOriginePlat(json) {

    const map = obtenirResultatsJson(json);
    let pays = "";
    let region = "";
    if (map.has("country")) {
        pays = map.get("country");
    }
    else if (map.has("cuisine")) {
        pays = map.get("cuisine");
    }
    else if (map.has("nationalCuisine")) {
        pays = map.get("nationalCuisine");
    }
    if (map.has("region")) {
        region = map.get("region");
    }
    pays = normalizeString(pays);
    region = normalizeString(region);
    $('#origine-pays').html(pays);
    $('#origine-region').html(region);

}

function chargerTypePlat(json) {

    const map = obtenirResultatsJson(json);
    let type = "";
    let temperature = "";
    if (map.has("type")) {
        type = map.get("type");
    }
    if (map.has("servingTemperature")) {
        temperature = map.get("servingTemperature");
    }
    else if (map.has("served")) {
        temperature = map.get("served");
    }
    let fullType = "";
    if (type != "") {
        fullType = "<b>" + type + "</b>" + " - " + temperature;
    } 
    else {
        fullType =  "<b>" + "Serving temperature" + "</b>" + " - " + temperature; 
    }
    $('#type-plat').html(fullType);

}

function chargerIngredientsPlat(json) {

    let ingredientSet = new Set();
    function construireSetIngredients(strIngredients) {
        let listIngredients = strIngredients.split(",");
        let n = listIngredients.length;
        for (let i = 0; i < n; i++) {
            let ingredient = normalizeString(listIngredients[i]);
            ingredientSet.add(ingredient);
        }
    }

    const map = obtenirResultatsJson(json);
    console.log(map);
    if (map.has("ingredient")) {
        construireSetIngredients(map.get("ingredient"));
    }
    if (map.has("mainIngredient")) {
        construireSetIngredients(map.get("mainIngredient"));
    }
    else if (map.has("ingredientName")) {
        construireSetIngredients(map.get("ingredientName"));
    }
    if (map.has("minorIngredient")) {
        construireSetIngredients(map.get("minorIngredient"));
    }

    let ingredientList = Array.from(ingredientSet);
    let ingredientListHTML = "<b>List of ingredients</b><br/><ul>";
    let n = ingredientList.length;
    for (let i = 0; i < n; i++) {
        ingredientListHTML += "<li>" + ingredientList[i] + "</li>";
    }
    ingredientListHTML += "</ul>";
    $('#ingredient').html(ingredientListHTML); 

}

function chargerNutritionPlat(json) {}
function chargerImagesPlat(json) {}