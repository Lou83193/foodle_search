function chargerInfosPlat(plat) {

    // Nom du plat 
    $("#nom-plat").html("<h1>" + plat + "</h>");

    // Description du plat
    let query1 = "SELECT * WHERE { ?food a dbo:Food. ?food rdfs:label '{1}'@en. ?food ?predicat ?sujet. FILTER(!isLiteral(?sujet) || lang(?sujet) = '' || langMatches(lang(?sujet), 'en')). FILTER(?predicat IN (dbo:abstract, rdfs:comment, dbp:caption)). }";
    query1 = query1.replace('{1}', plat);
    rechercher(query1, chargerDescriptionPlat);

    // Origine du plat
    let query2 = "SELECT * WHERE {?food a dbo:Food. ?food rdfs:label '{1}'@en. ?food ?predicat ?sujet. FILTER(!isLiteral(?sujet) || lang(?sujet) = '' || langMatches(lang(?sujet), 'en')). FILTER(?predicat IN (dbo:country, dbo:region, dbo:cuisine, dbp:nationalCuisine)). }";
    query2 = query2.replace('{1}', plat);
    rechercher(query2, chargerOriginePlat); 

    // Type du plat
    let query3 = "SELECT * WHERE {?food a dbo:Food. ?food rdfs:label '{1}'@en. ?food ?predicat ?sujet. FILTER(!isLiteral(?sujet) || lang(?sujet) = '' || langMatches(lang(?sujet), 'en')). FILTER(?predicat IN (dbo:type, dbo:servingTemperature, dbp:served)). }";
    query3 = query3.replace('{1}', plat);
    rechercher(query3, chargerTypePlat);

    // Ingrédients du plat
    let query4 = "SELECT * WHERE { ?food a dbo:Food. ?food rdfs:label '{1}'@en. ?food ?predicat ?sujet. FILTER(!isLiteral(?sujet) || lang(?sujet) = '' || langMatches(lang(?sujet), 'en')). FILTER(?predicat IN (dbo:ingredient, dbo:ingredientName, dbp:mainIngredient, dbp:minorIngredient)). }";
    query4 = query4.replace('{1}', plat);
    rechercher(query4, chargerIngredientsPlat);


    // Valeurs nutritionnelles du plat
    let query5 = "SELECT * WHERE {?Food a dbo:Food. ?Food rdfs:label '{1}'@en. ?Food ?predicat ?sujet. FILTER(!isLiteral(?sujet) || lang(?sujet) = '' || langMatches(lang(?sujet), 'en')). FILTER(?predicat IN (dbp:kj, dbp:fat, dbp:satfat, dbp:sodiumMg,  dbr:Carbohydrate, dbp:fiber, dbp:sugars, dbp:protein, dbp:vitcMg, dbp:calciumMg, dbp:ironMg)). }";
    query5 = query5.replace('{1}', plat);
    rechercher(query5, chargerNutritionPlat);

    /*
    // Images du plat
    let query6 = "SELECT ?image WHERE { ?food a dbo:Food. ?food rdfs:label '{1}'@en. ?food foaf:depiction ?image. } LIMIT 4";
    query6 = query6.replace('{1}', plat);
    rechercher(query6, chargerImagesPlat);
    */

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

function obtenirResultatsJson(json) {

    // Itérer à travers tous les résultats et les stocker dans une map
    const n = json.results.bindings.length;
    const map = new Map();

    for(var i = 0; i < n; i++) {
        let obj = json.results.bindings[i];

        // Récupérer le prédicat
        let predicat = obj.predicat.value;
        if (obj.predicat.type == 'uri') {
            let uriSplit = predicat.split('/');
            predicat = uriSplit[uriSplit.length-1];
        }

        // Récupérer le sujet
        let sujet = obj.sujet.value;
        if (obj.sujet.type == 'uri') {
            let uriSplit = sujet.split('/');
            sujet = uriSplit[uriSplit.length-1];
        }
        
        if (!map.has(predicat)) {
            map.set(predicat, [sujet]);
        }
        else {
            values = map.get(predicat);
            values.push(sujet); 
            map.set(predicat, values);
        }

    }

    console.log(json)

    return map;
    
}

function chargerDescriptionPlat(json) {

    const map = obtenirResultatsJson(json);
    let description = ""; 
    if (map.has('abstract')) {
        description = map.get('abstract')[0];
    }
    else if (map.has('rdf-schema#comment')) {
        description = map.get('rdf-schema#comment')[0];
    }
    else if (map.has('caption')) {
        description = map.get('caption')[0];
    }
    $('#description-plat').html(description);

    /*
    var el = document.getElementById('description-plat');
    var divHeight = el.offsetHeight;
    var lineHeight = 1.5*parseFloat(getComputedStyle(el).fontSize);
    var lines = divHeight / lineHeight;
    console.log(divHeight, lineHeight, lines) 
    if (lines <= 3) {
        $('#description > a').css('display', 'none');
    } 
    */


}

function chargerOriginePlat(json) {

    const map = obtenirResultatsJson(json);
    let pays = [""]; 
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
        region = map.get("region")[0];
    }

    for (var i = 0; i < pays.length; i++) {
        pays[i] = normalizeString(pays[i], true);
    }
    pays = pays.join(", ");
    region = normalizeString(region, true);

    $('#origine-pays').html(pays);
    $('#origine-region').html(region);

    if (pays == "") { $('#origine-pays').remove(); }
    if (region == "") { $('#origine-region').remove(); }
    if (pays == "" && region == "") { $('#origine').remove(); }
    
}

function chargerTypePlat(json) {

    const map = obtenirResultatsJson(json);
    let type = [""];
    let temperature = [""]; 
    if (map.has("type")) {
        type = map.get("type");
    }
    if (map.has("servingTemperature")) {
        temperature = map.get("servingTemperature");
    }
    else if (map.has("served")) {
        temperature = map.get("served");
    }

    for (var i = 0; i < type.length; i++) {
        type[i] = normalizeString(type[i], true);
    }
    type = type.join(", ");

    for (var i = 0; i < temperature.length; i++) {
        temperature[i] = normalizeString(temperature[i], true);
    }
    temperature = temperature.join(", ");

    let fullType = (temperature != "") ? type + " - " + temperature : type; 
    $('#type-plat > div').html(fullType);

    if (fullType == "") { $('#type-plat').remove(); }

}

function chargerIngredientsPlat(json) {

    let ingredientSet = new Set();
    function construireSetIngredients(ingredients) {
        for (let k = 0; k < ingredients.length; k++) {
            let strIngredients = ingredients[k];
            let listIngredients = strIngredients.split(",");
            if (listIngredients.length == 1) listIngredients = strIngredients.split(";");
            for (let i = 0; i < listIngredients.length; i++) {
                let ingredient = normalizeString(listIngredients[i], false);
                ingredientSet.add(ingredient);
            }
        }
    }

    const map = obtenirResultatsJson(json);
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
    let ingredientListHTML = "<ul>";
    let n = ingredientList.length;
    for (let i = 0; i < n; i++) {
        ingredientListHTML += "<li>" + ingredientList[i] + "</li>";
    }
    ingredientListHTML += "</ul>";
    $('#ingredient > div').html(ingredientListHTML); 

}

function chargerNutritionPlat(json) {
    const map = obtenirResultatsJson(json);
    // Calories field
    if (map.has("kj")) {
        $('#calories > span').html(map.get('kj') + ' KJ');
    }

    // Nutrient fields
    if(map.size != 0) {
        $("#nutrient_NA").remove();
    } else
    {
        $('#nutrition').remove();
    }
    if(map.has('fat')){
        let nutrientHtml = "<tr><td>Total Fat";
        if(map.has('satfat')){
            nutrientHtml += "</br>&nbsp Saturated</td><td>" + map.get('fat') + "g </br>" + map.get('satfat') + "g</td></tr>";
        }
        nutrientHtml += "</td><td>" + map.get('fat') + "g</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }
    if(map.has('sodiumMg'))
    {
        let nutrientHtml = "<tr><td>Sodium</td><td>" + map.get('sodiumMg') + "mg</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }
    if(map.has('Carbohydrate'))
    {
        let nutrientHtml = "<tr><td id='carbohydrate-text'>Total Carbohydrate</td><td id='carbohydrate-value'>" + map.get('Carbohydrate') + "g</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }
    if(map.has('fiber')){
        if(map.has('Carbohydrate')) {
            $('#carbohydrate-text').append('</br>&nbsp Fiber');
            $('#carbohydrate-value').append('</br>' + map.get('fiber') + 'g');
        } else {
            let nutrientHtml = "<tr><td>Fiber</td><td>" + map.get('fiber') + "g</td></tr>";
            $("#nutrientFacts tbody").append(nutrientHtml);
        }
    }
    if(map.has('sugars')){
        if(map.has('Carbohydrate')) {
            $('#carbohydrate-text').append('</br>&nbsp Sugars');
            $('#carbohydrate-value').append('</br>' + map.get('sugars') + 'g');
        } else {
            let nutrientHtml = "<tr><td>Sugars</td><td>" + map.get('sugars') + "g</td></tr>";
            $("#nutrientFacts tbody").append(nutrientHtml);
        }
    }
    if(map.has('protein'))
    {
        let nutrientHtml = "<tr><td>Protein</td><td>" + map.get('protein') + "g</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }
    if(map.has('vitcMg'))
    {
        let nutrientHtml = "<tr><td>Vitamin C</td><td>" + map.get('vitcMg') + "mg</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }
    if(map.has('calciumMg'))
    {
        let nutrientHtml = "<tr><td>Calcium</td><td>" + map.get('calciumMg') + "mg</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }
    if(map.has('ironMg'))
    {
        let nutrientHtml = "<tr><td>Iron</td><td>" + map.get('ironMg') + "mg</td></tr>";
        $("#nutrientFacts tbody").append(nutrientHtml);
    }




}

function chargerImagesPlat(json) {}