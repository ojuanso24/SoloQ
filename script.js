let key = "RGAPI-aa2c526a-9378-4e2f-8dc8-7b22e3da86b0";
let LOLVersion = '12.11.1';

let nombreUsuarios = ["comeoncounterme", "Matujinh0", "AtunConMayonesa", "EDQNQD", "JHíníÙS", "tqlmhzwnq", "KataGriffa2"]

let usuarios = new Map();

let champions = new Map();

let ordenJugadorPorLiga = new Map();
ordenJugadorPorLiga.set("CHALLENGER", 0);
ordenJugadorPorLiga.set("GRAND MASTER", 1);
ordenJugadorPorLiga.set("MASTER", 2);

ordenJugadorPorLiga.set("DIAMON I", 3);
ordenJugadorPorLiga.set("DIAMON II", 4);
ordenJugadorPorLiga.set("DIAMON III", 5);
ordenJugadorPorLiga.set("DIAMON IV", 6);

ordenJugadorPorLiga.set("PLATINUM I", 7);
ordenJugadorPorLiga.set("PLATINUM II", 8);
ordenJugadorPorLiga.set("PLATINUM III", 9);
ordenJugadorPorLiga.set("PLATINUM IV", 10);

ordenJugadorPorLiga.set("GOLD I", 11);
ordenJugadorPorLiga.set("GOLD II", 12);
ordenJugadorPorLiga.set("GOLD III", 13);
ordenJugadorPorLiga.set("GOLD IV", 14);

ordenJugadorPorLiga.set("SILVER I", 15);
ordenJugadorPorLiga.set("SILVER II", 16);
ordenJugadorPorLiga.set("SILVER III", 17);
ordenJugadorPorLiga.set("SILVER IV", 18);

ordenJugadorPorLiga.set("BRONZE I", 19);
ordenJugadorPorLiga.set("BRONZE II", 20);
ordenJugadorPorLiga.set("BRONZE III", 21);
ordenJugadorPorLiga.set("BRONZE IV", 22);

ordenJugadorPorLiga.set("IRON I", 23);
ordenJugadorPorLiga.set("IRON II", 24);
ordenJugadorPorLiga.set("IRON III", 25);
ordenJugadorPorLiga.set("IRON IV", 26);

ordenJugadorPorLiga.set("UNRANKED", 27);
ordenJugadorPorLiga.set(undefined, 28);

let ordenJugadore = [
    [], [], [],
    [], [], [], [],
    [], [], [], [],
    [], [], [], [],
    [], [], [], [],
    [], [], [], [],
    [], [], [], [],
    [], []]

iniarPagina();

async function iniarPagina() {
    datosCampeones();
    for (let index = 0; index < nombreUsuarios.length; index++) {
        let data = await datosCuenta(nombreUsuarios[index]);
        let cuenta = new Cuenta(data.id, data.accountId, data.puuid, data.name, data.profileIconId, data.revisionDate, data.summonerLevel);
        usuarios.set(data.name, cuenta);
        let datos = await datosRanket(cuenta);
        if (Object.keys(datos).length === 0) {
            cuenta.summonerId = 0;
                cuenta.leaguePoints = 0;
                cuenta.losses =0;
                cuenta.rank = "";
                cuenta.tier = "Unranked";
                cuenta.wins = 0;
        } else if (Object.keys(datos).length === 1 && datos[0].queueType === "RANKED_SOLO_5x5") {
            cuenta.summonerId = datos[0].summonerId;
            cuenta.leaguePoints = datos[0].leaguePoints;
            cuenta.losses = datos[0].losses;
            cuenta.rank = datos[0].rank;
            cuenta.tier = datos[0].tier;
            cuenta.wins = datos[0].wins;
        } else {
            if (Object.keys(datos).length === 2 && datos[1].queueType === "RANKED_SOLO_5x5") {
                cuenta.summonerId = datos[1].summonerId;
                cuenta.leaguePoints = datos[1].leaguePoints;
                cuenta.losses = datos[1].losses;
                cuenta.rank = datos[1].rank;
                cuenta.tier = datos[1].tier;
                cuenta.wins = datos[1].wins;
            } else if (Object.keys(datos).length === 2 && datos[0].queueType === "RANKED_SOLO_5x5") {
                cuenta.summonerId = datos[0].summonerId;
                cuenta.leaguePoints = datos[0].leaguePoints;
                cuenta.losses = datos[0].losses;
                cuenta.rank = datos[0].rank;
                cuenta.tier = datos[0].tier;
                cuenta.wins = datos[0].wins;
            }
        }
        datosIdTresCampeones(cuenta);
        datosPuntos(cuenta);
    }

    insertarUsuariosHTML();
}


async function datosIdTresCampeones(cuenta){
    let datosCampeones = await datosMaestria(cuenta);
    console.log();
    cuenta.campeon1 = champions.get(`${datosCampeones[0].championId}`);
    cuenta.campeon2 = champions.get(`${datosCampeones[1].championId}`);
    cuenta.campeon3 = champions.get(`${datosCampeones[2].championId}`);
}

async function datosMaestria(cuenta){
    try {
        let resPost = await fetch(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${cuenta.id}?api_key=${key}`);
        let post = await resPost.json();
        return post;
    } catch (error) {
        console.log(error);
    }
}


function insertarUsuariosHTML() {
    for (let i = 0; i < ordenJugadore.length; i++) {
        if (ordenJugadore[i].length != 0) {
            for (let j = 0; j < ordenJugadore[i].length; j++) {
                anadirDatos(ordenJugadore[i][j]);
            }
        }

    }
}

function anadirDatos(cuenta) {
    const divIzquiera = document.createElement("div");
    divIzquiera.classList.add("divIzquiera");

    const card = document.createElement("div");
    card.classList.add("persona");

    const divIcono = document.createElement("div");
    divIcono.classList.add("divIcono");

    const icono = document.createElement("img");
    icono.classList.add("icono");

    icono.src = cuenta.profileIconId

    divIcono.appendChild(icono);
    divIzquiera.appendChild(divIcono);

    const divMedio = document.createElement("div");
    divMedio.classList.add("divMedio");

    const divNombre = document.createElement("div");
    divNombre.classList.add("divNombre");

    const nombre = document.createElement("p");
    nombre.classList.add("nombre");
    nombre.textContent = `${cuenta.name}`;


    const nivel = document.createElement("p");
    nivel.classList.add("nivel");
    nivel.textContent = `Nivel: ${cuenta.summonerLevel}`;

    divNombre.appendChild(nombre);
    divNombre.appendChild(nivel);
    divMedio.appendChild(divNombre);

    const divRango = document.createElement("div");
    divRango.classList.add("divRango");

    const rango = document.createElement("p");
    rango.classList.add("rango");
    rango.textContent = `${cuenta.tier} ${cuenta.rank}, ${cuenta.leaguePoints}pl`;
    //
    const iconoLiga = document.createElement("img");
    iconoLiga.classList.add("iconoLiga");
    let img = cuenta.tier;
    if (img === undefined || img === "Unranked"){
        img = "UNRANKED";
    }
    iconoLiga.src = `ranket_iconos/${img}.png`;
    divRango.appendChild(iconoLiga);
    //
    divRango.appendChild(rango);
    divMedio.appendChild(divRango);

    const divPartidas = document.createElement("div");
    divPartidas.classList.add("divPartidas");

    const partidas = document.createElement("p");
    partidas.classList.add("partidas");
    partidas.textContent = `Partidas: ${cuenta.losses + cuenta.wins}, Ganadas: ${cuenta.wins}, Perdidas: ${cuenta.losses}, WinRate: ${(cuenta.wins * 100 / (cuenta.losses + cuenta.wins)).toFixed(2)}`;
    divPartidas.appendChild(partidas);
    divMedio.appendChild(divPartidas);

    const divDerecha = document.createElement("div");
    divDerecha.classList.add("divDerecha");
    //  

    const campeon1 = document.createElement("img");
    campeon1.classList.add("campeon");
    campeon1.classList.add("icono");
    campeon1.src = `champion/${cuenta.campeon1}.png`;
    divDerecha.appendChild(campeon1);

    const campeon2 = document.createElement("img");
    campeon2.classList.add("campeon");
    campeon2.classList.add("icono");
    campeon2.src = `champion/${cuenta.campeon2}.png`;
    divDerecha.appendChild(campeon2);

    const campeon3 = document.createElement("img");
    campeon3.classList.add("campeon");
    campeon3.classList.add("icono");
    campeon3.src = `champion/${cuenta.campeon3}.png`;
    divDerecha.appendChild(campeon3);
    // 
    card.appendChild(divIzquiera);
    card.appendChild(divMedio);
    card.appendChild(divDerecha);

    document.getElementById('main').appendChild(card);
}

async function datosCampeones() {
    try {
        let resPost = await fetch(`./campeones.json`);
        let post = await resPost.json();
        if (post.hasOwnProperty('data')) {
            for (var clave in post.data){
                champions.set(post.data[clave].key, post.data[clave].name)
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function datosCuenta(nombreCuenta) {
    try {
        let resPost = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nombreCuenta}?api_key=${key}`);
        let post = await resPost.json();
        return post;
    } catch (error) {
        console.log(error);
    }
}


async function datosRanket(cuenta) {
    let resPost = await fetch(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${cuenta.id}?api_key=${key}`);
    let post = await resPost.json();
    return post;
}


function datosPuntos(cuenta) {
    let posicionOrdenJugadore;
    if (cuenta.tier === "Unranked") {
        posicionOrdenJugadore = 28;
    } else if (cuenta.tier === "CHALLENGER") {
        console.log('entrada 2');
        posicionOrdenJugadore = 0;
    } else if (cuenta.tier === "GRAND MASTER") {
        console.log('entrada 3');
        posicionOrdenJugadore = 1;
    } else if (cuenta.tier === "MASTER") {
        console.log('entrada 4');
        posicionOrdenJugadore = 2;
    } else {
        posicionOrdenJugadore = ordenJugadorPorLiga.get(`${cuenta.tier} ${cuenta.rank}`);
    }
    ordenJugadore[posicionOrdenJugadore].push(cuenta);
    if (ordenJugadore[posicionOrdenJugadore].length > 0) {
        ordenJugadore[posicionOrdenJugadore].sort((o1, o2) => {
            if (o1.leaguePoints > o2.leaguePoints) {
                return -1;
            } else if (o1.leaguePoints < o2.leaguePoints) {
                return 1;
            } else {
                return 0;
            }
        })
    }
}

function imgLiga(cuenta){
    if (cuenta.rank === "GOLD"){
        return `ranketg_iconos/${Emble}`
    }
}


class Cuenta {
    id;
    accountId;
    puuid;
    name;
    profileIconId;
    revisionDate;
    summonerLevel;
    tier;
    summonerId;
    leaguePoints;
    losses;
    rank;
    wins;
    imgLiga;
    campeon1;
    campeon2;
    campeon3;

    constructor(id, accountId, puuid, name, profileIconId, revisionDate, summonerLevel) {
        this.id = id;
        this.accountId = accountId;
        this.puuid = puuid;
        this.name = name;
        if (name==="JHíníÙS"){
            this.profileIconId = `contenido/undefined.png`;
        }else{
            this.profileIconId = `https://ddragon.leagueoflegends.com/cdn/12.11.1/img/profileicon/${profileIconId}.png`;
        }
        
        this.revisionDate = revisionDate;
        this.summonerLevel = summonerLevel;
        console.log(this);
    }
}
