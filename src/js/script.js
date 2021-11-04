

function rechercher(contenu_requete, trigger_resultat) {
    //var contenu_requete = document.getElementById("requete").value;

    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(contenu_requete) + "&format=json";
    var results;
    // Requête HTTP et affichage des résultats
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


