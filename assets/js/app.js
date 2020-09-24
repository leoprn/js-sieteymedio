const mod = (()=>{
'use strict'

    let baraja = [];
    const tipos = ['B', 'E', 'O', 'C'];
    let puntajeJugador = 0, 
        puntajeBanca = 0;

    let puntajeHistoricoBanca = localStorage.getItem('puntajeHistoricoBanca') == null ? 0 : localStorage.getItem('puntajeHistoricoBanca');
    let puntajeHistoricoJugador = localStorage.getItem('puntajeHistoricoJugador') === null ? 0 : localStorage.getItem('puntajeHistoricoJugador');

    const btnNuevoJuego = document.querySelector('#btnNuevo');
    const btnPedirCarta = document.querySelector('#btnPedir');
    const btnRetirarme  = document.querySelector('#btnDetener');

    const puntosHTML       = document.querySelectorAll('small');
    const divCartasJugador = document.querySelector('#jugador-cartas');
    const divCartasBanca   = document.querySelector('#computadora-cartas');

    const puntoHistoricoJugador = document.querySelector('#historicoJugador');
    const puntoHistoricoBanca = document.querySelector('#historicoBanca');

    puntoHistoricoJugador.innerHTML=`<strong> ${puntajeHistoricoJugador} </strong> `;
    puntoHistoricoBanca.innerHTML = `<strong> ${puntajeHistoricoBanca} </strong> `;
    btnNuevoJuego.style.display = 'inline';
    btnPedirCarta.style.display = 'none';
    btnRetirarme.style.display = 'none';

    const modal = document.getElementById("myModal");
    const btnCerrarModal = document.querySelector("#btnCerrarModal");
    const textoModal = document.querySelector("#textoModal");

    const crearBaraja = () => {
        
        for( let i = 1; i <= 12; i++){

            if(i==8 || i==9){
                continue;
            }

            tipos.forEach((elem)=>{            
                baraja.push(i > 7 ? i + elem: '0'+i+elem);
            });
        }

        return _.shuffle(baraja);
    }


    const pedirCarta = () => {

        if(baraja.length === 0){
            throw 'No hay mas cartas para repartir';
        }

        btnRetirarme.style.display = 'inline';
        return baraja.pop();
    }



    const valorCarta = (carta) => {

        let valor = carta.substring(0, carta.length-1)*1;
        return valor>7?0.5:valor;

    }

    //Inicio del Juego
    const inicio = () => {
            
        console.clear();

        baraja = [];
        puntajeJugador = 0, puntajeBanca = 0;

        //Agrego el puntaje al DOM
        puntosHTML[0].innerText = puntajeJugador;
        puntosHTML[1].innerText = puntajeBanca;
        divCartasBanca.innerHTML = '';
        divCartasJugador.innerHTML = '';

            
        btnNuevoJuego.style.display = 'none';
        btnPedirCarta.style.display = 'inline';
        btnPedirCarta.disabled = false;
        btnRetirarme.style.display = 'none';
        btnRetirarme.disabled = false;

        baraja = crearBaraja();

    };


    //Turno de la Banca
    const turnoBanca  =  (puntosMinimos) =>{


        do{

                const carta = pedirCarta();
                puntajeBanca = puntajeBanca + valorCarta(carta);

                //Agrego el puntaje al DOM
                puntosHTML[1].innerText = puntajeBanca;

                //Crea Carta----------------------------------
                const imgCarta = document.createElement('img');
                imgCarta.src = `assets/cartas/${carta}.png`;
                imgCarta.classList.add('carta');
                //--------------------------------------------

                //Agrego la carta al div
                divCartasBanca.append(imgCarta);

                if(puntosMinimos>7.5){
                    break;
                }


        } while ((puntajeBanca < puntosMinimos) && puntosMinimos<=7.5);

        
        setTimeout(() => {
                verificarQuienGano(puntajeBanca, puntosMinimos);       
        }, 80);
    }


    const verificarQuienGano = (pBanca, pJugador) => {
        
        btnNuevoJuego.disabled = false;
        btnPedirCarta.disabled = true;
        btnRetirarme.disabled = true;

        if(pJugador>7.5){
            return ganoBanca();
        }

        if(pBanca>7.5){
            return ganoJugador();        
        }
        return pBanca >= pJugador ? ganoBanca() : ganoJugador();
    }

    const ganoJugador = () => {
            puntajeHistoricoJugador = incrementarLocalStorage('puntajeHistoricoJugador');
            puntoHistoricoJugador.innerHTML=`<strong> ${puntajeHistoricoJugador} </strong>`;        
            return mostrarModalResultado('GANASTE!!', 'textoModalGanaste', 'winner.gif');
    };

    const ganoBanca = () => {
            puntajeHistoricoBanca = incrementarLocalStorage('puntajeHistoricoBanca');        
            puntoHistoricoBanca.innerHTML = `<strong> ${puntajeHistoricoBanca} </strong>`;
            return mostrarModalResultado('LA BANCA GANA!!', 'textoModalPerdiste', 'losser.gif');
    };


    const mostrarModal = (mensaje)=>{
    
        modal.style.display = "block";
        textoModal.classList.add('textoModal');
        textoModal.innerHTML = `<strong>${mensaje}</strong>`;
    
    }

    const mostrarModalResultado = (mensaje, claseTexto, emoticon) => {    
        
        modal.style.display = "block";        
        textoModal.classList.add(claseTexto);
        textoModal.innerHTML = `<img  src='assets/img/${emoticon}' alt='' class='emoticon col-4'>
        <p class = "col-8 ${claseTexto}"> <strong> ${mensaje} </strong></p> `;

    }


    const incrementarLocalStorage = (key) =>{    
        let valor = localStorage.getItem(key);
        valor = valor*1 + 1;
        localStorage.setItem(key, valor);
        return valor;
    }



    //Eventos
    btnNuevoJuego.addEventListener('click', () => {    
        inicio();
    });


    btnPedirCarta.addEventListener('click', ()=>{

        const carta = pedirCarta();
        puntajeJugador = puntajeJugador + valorCarta(carta);
        
        //Agrego el puntaje al DOM
        puntosHTML[0].innerText = puntajeJugador;


        //Crea Carta----------------------------------
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        //--------------------------------------------

        //Agrego la carta al div
        divCartasJugador.append(imgCarta);  


        if(puntajeJugador>7.5){
            
            btnNuevoJuego.disabled = false;
            btnPedirCarta.disabled = true;
            btnRetirarme.disabled = true;
            
            setTimeout(() => {
                        mostrarModalResultado('TE PASASTE, LA BANCA GANA!!', 'textoModalPerdiste', 'losser.gif');
                        turnoBanca(puntajeJugador);
            }, 10);
            


        }

    });

    btnRetirarme.addEventListener('click', ()=>{    
    turnoBanca(puntajeJugador);
    });



    btnCerrarModal.addEventListener('click', () => {
        modal.style.display = 'none';
        inicio();
    });

})();