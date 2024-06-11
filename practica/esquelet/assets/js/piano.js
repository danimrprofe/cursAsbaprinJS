function Partitura(nom, notes) {
    this.nom = nom;
    this.notes = notes;
}

function Nota(nota, tipus) {
    this.nota = nota;
    this.tipus = tipus;
}

function addCerca(nota, tipus) {
    cerca.push(new Nota(nota, tipus))
}

function cercador() {
    var resultat = [];

    for (var i = 0; i < partitures.length; i++) {
        for (var j = 0; j < partitures[i].notes.length; j++) {
            var trobat = true;
            for (var k = 0; k < cerca.length; k++) {

                if (
                    partitures[i].notes[j + k] === undefined ||
                    cerca[k].nota !== partitures[i].notes[j + k].nota ||
                    cerca[k].tipus !== partitures[i].notes[j + k].tipus
                ) {
                    trobat = false;
                }
            }

            if (trobat) {
                resultat.push(partitures[i]);
                break;
            }
        }
    }

    return resultat;

}

//Balanguera
var notesBalanguera = [
    new Nota("DO", "NORMAL"),
    new Nota("RE", "NORMAL"),
    new Nota("MI", "NORMAL"),
    new Nota("FA", "NORMAL"),
    new Nota("SOL", "NORMA"),
    new Nota("SOL", "NORMAL"),
    new Nota("SOL", "NORMAL"),
    new Nota("LA", "SOSTINGUT"),
    new Nota("LA", "SOSTINGUT"),
]

var partituraBalanguera = new Partitura("Balanguera", notesBalanguera);

var notesHappyBirthday = [
    new Nota("DO", "NORMAL"),
    new Nota("DO", "NORMAL"),
    new Nota("RE", "NORMAL"),
    new Nota("DO", "NORMAL"),
    new Nota("FA", "NORMAL"),
    new Nota("MI", "NORMAL"),
]

var partituraHappyBirthday = new Partitura("Happy Birthday", notesHappyBirthday);

var partitures = [
    partituraBalanguera,
    partituraHappyBirthday
]

var cerca = [];

addCerca("SOL", "NORMAL");
addCerca("SOL", "NORMAL");
addCerca("LA", "SOSTINGUT");

var resultat = cercador();
console.log(resultat);
