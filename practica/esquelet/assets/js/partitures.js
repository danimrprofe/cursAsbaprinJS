function Partitura(titol, idiomaOriginal) {
    this.titol = titol;
    this.idiomaOriginal = idiomaOriginal;
}

var partitura1 = new Partitura("La balanguera", "Catala")
var partitura2 = new Partitura("Happy birthday", "Catala")
var partitura3 = new Partitura("Sant Antoni", "Catala")

var partitures = [partitura1, partitura2, partitura3];

var main = document.querySelector("#main");
main.innerHTML += '<button>Nova partitura</button>';
main.innerHTML += '<table id="taula"></table>'

var table = document.querySelector("#taula");
var row = table.insertRow(0);
var titolTH = document.createElement("TH");
titolTH.innerHTML = "Titol";
row.appendChild(titolTH);
