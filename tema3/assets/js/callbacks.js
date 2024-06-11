//Sense callbacks
function saludar(nom) {
    return "Hola " + nom;
}

function despedir(nom) {
    return "Adeu " + nom;
}

function pintar(nom, isDespedir) {
    if (isDespedir) {
        alert(despedir(nom))
    } else {
        alert(saludar(nom))
    }
}

//Amb callbacks
//Passam una funció (no invocar) com a paràmetre

function pintar2(nom, funcio) { //funció sense()
    alert(funcio(nom))
}

//Adequats per funcions anònimes (no tenen nom)
var cognom = function () {
    return "Moreno"
}
pintar2("Dani", function (nom) {
    return "Com estàs? " + nom;
});