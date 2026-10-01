document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtenemos la URL de la página actual
    const currentLocation = window.location.pathname;
    
    // 2. Seleccionamos todos los enlaces del menú
    const navLinks = document.querySelectorAll(".nav-links a");

    // 3. Recorremos los enlaces y comparamos su 'href' con la URL actual
    navLinks.forEach(link => {
        // Extraemos el nombre del archivo del href (ej. "juegos.html")
        const linkPath = link.getAttribute("href");
        
        // Si la URL de la página incluye el href del enlace, le damos la clase activa
        if (currentLocation.includes(linkPath) || (currentLocation.endsWith("/") && linkPath === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});


// 4. Lógica para el Acordeón de Preguntas Frecuentes
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            
            // Si quieres que al abrir una se cierren las demás, descomenta estas tres líneas:
            // faqQuestions.forEach(q => {
            //     if (q !== question) q.parentElement.classList.remove("active");
            // });

            // Alternar la clase 'active' para abrir o cerrar
            faqItem.classList.toggle("active");
        });
    });

    // Mensaje Newsletter
    document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("newsletterForm");
    const emailInput = document.getElementById("newsletterEmail");
    const messageP = document.getElementById("newsletterMessage");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault(); // Evita que la página recargue
            
            const email = emailInput.value.trim();
            
            if (email !== "") {
                // Oculta el formulario o limpia el campo
                emailInput.value = "";
                
                // Muestra el mensaje de agradecimiento personalizado
                messageP.style.display = "block";
                messageP.textContent = "¡Gracias por suscribirte! Revisa tu correo para confirmar tu suscripción.";
                
                // Opcional: Oculta el mensaje a los 5 segundos si lo deseas, o déjalo fijo
            }
        });
    }
});


//Juego de memoria

document.addEventListener('DOMContentLoaded', () => {
    const tablero = document.getElementById('tablero');
    const contadorMovimientos = document.getElementById('movimientos');
    const contadorTiempo = document.getElementById('tiempo');
    const btnReiniciar = document.getElementById('reiniciar');

    // Iconos para las parejas (16 cartas = 8 parejas)
    const iconos = ['🧠', '📖', '🧩', '💡', '🌿', '🎨', '🎶', '🎲'];
    let cartasMazo = [...iconos, ...iconos]; // Duplicamos para hacer las parejas
    
    let cartasVolteadas = [];
    let movimientos = 0;
    let parejasEncontradas = 0;
    let bloqueoTablero = false;
    let tiempo = 0;
    let temporizador = null;
    let juegoIniciado = false;

    function iniciarJuego() {
        // Resetear variables
        tablero.innerHTML = '';
        cartasVolteadas = [];
        movimientos = 0;
        parejasEncontradas = 0;
        bloqueoTablero = false;
        tiempo = 0;
        juegoIniciado = false;
        
        contadorMovimientos.textContent = movimientos;
        contadorTiempo.textContent = tiempo + 's';
        clearInterval(temporizador);

        // Barajar cartas (Algoritmo de Fisher-Yates)
        cartasMazo.sort(() => Math.random() - 0.5);

        // Generar HTML de las cartas
        cartasMazo.forEach(icono => {
            const carta = document.createElement('div');
            carta.classList.add('memory-card');
            carta.dataset.icono = icono;

            carta.innerHTML = `
                <div class="memory-card-face memory-card-front"></div>
                <div class="memory-card-face memory-card-back">${icono}</div>
            `;

            carta.addEventListener('click', voltearCarta);
            tablero.appendChild(carta);
        });
    }

    function iniciarTemporizador() {
        if (!juegoIniciado) {
            juegoIniciado = true;
            temporizador = setInterval(() => {
                tiempo++;
                contadorTiempo.textContent = tiempo + 's';
            }, 1000);
        }
    }

    function voltearCarta() {
        if (bloqueoTablero || this === cartasVolteadas[0] || this.classList.contains('flipped')) return;
        
        iniciarTemporizador();
        
        this.classList.add('flipped');
        cartasVolteadas.push(this);

        if (cartasVolteadas.length === 2) {
            comprobarPareja();
        }
    }

    function comprobarPareja() {
        bloqueoTablero = true;
        movimientos++;
        contadorMovimientos.textContent = movimientos;

        const [carta1, carta2] = cartasVolteadas;
        const coinciden = carta1.dataset.icono === carta2.dataset.icono;

        if (coinciden) {
            parejasEncontradas++;
            cartasVolteadas = [];
            bloqueoTablero = false;
            
            // Comprobar victoria
            if (parejasEncontradas === iconos.length) {
                clearInterval(temporizador);
                setTimeout(() => alert(`¡Enhorabuena! Has completado el juego en ${movimientos} movimientos y ${tiempo} segundos.`), 500);
            }
        } else {
            // Si fallan, se vuelven a girar tras un segundo
            setTimeout(() => {
                carta1.classList.remove('flipped');
                carta2.classList.remove('flipped');
                cartasVolteadas = [];
                bloqueoTablero = false;
            }, 1000);
        }
    }

    btnReiniciar.addEventListener('click', iniciarJuego);

    // Inicializar el tablero al cargar la página
    iniciarJuego();
});

//Juego completa la palabra

document.addEventListener('DOMContentLoaded', () => {
    // Referencias al DOM
    const selectorNivel = document.getElementById('selector-nivel');
    const tablero = document.getElementById('tablero-palabras');
    const contenedorCajas = document.getElementById('palabra-cajas');
    const contenedorOpciones = document.getElementById('opciones-letras');
    const textoPista = document.getElementById('pista-texto');
    const mensaje = document.getElementById('mensaje-juego');
    const btnCambiarNivel = document.getElementById('btn-cambiar-nivel');

    const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    
    // Base de datos integrada con las 100 palabras
    const baseDatos = [
        {"palabra": "MANZANA", "pista": "Fruta que puede ser roja o verde"},
        {"palabra": "ELEFANTE", "pista": "Animal muy grande con trompa"},
        {"palabra": "PARAGUAS", "pista": "Lo usamos cuando llueve para no mojarnos"},
        {"palabra": "CUCHARA", "pista": "Cubierto que usamos para comer sopa"},
        {"palabra": "ABRIGO", "pista": "Prenda de ropa para no pasar frío"},
        {"palabra": "CARTERA", "pista": "Donde guardamos el dinero y las tarjetas"},
        {"palabra": "GIRASOL", "pista": "Flor amarilla que busca la luz del sol"},
        {"palabra": "TELEFONO", "pista": "Aparato para llamar a otras personas"},
        {"palabra": "VENTANA", "pista": "Apertura en la pared para ver hacia la calle"},
        {"palabra": "ZAPATO", "pista": "Prenda que nos ponemos en los pies"},
        {"palabra": "ESPEJO", "pista": "Superficie donde podemos vernos reflejados"},
        {"palabra": "LAPIZ", "pista": "Instrumento de madera para escribir o dibujar"},
        {"palabra": "RELOJ", "pista": "Sirve para mirar la hora"},
        {"palabra": "LIBRO", "pista": "Tiene hojas impresas y cuenta historias"},
        {"palabra": "SILLA", "pista": "Mueble con cuatro patas para sentarse"},
        {"palabra": "MESA", "pista": "Mueble horizontal para comer o apoyar cosas"},
        {"palabra": "CAMA", "pista": "Mueble donde dormimos y descansamos"},
        {"palabra": "LLAVE", "pista": "Sirve para abrir y cerrar las cerraduras"},
        {"palabra": "BARRER", "pista": "Acción de limpiar el suelo con escoba"},
        {"palabra": "COCINA", "pista": "Lugar de la casa donde se prepara la comida"},
        {"palabra": "JARRA", "pista": "Recipiente con asa para servir líquidos"},
        {"palabra": "VASO", "pista": "Recipiente pequeño de cristal para beber agua"},
        {"palabra": "PLATO", "pista": "Recipiente plano donde se sirve la comida"},
        {"palabra": "TENEDOR", "pista": "Cubierto de varios pinchos para comer"},
        {"palabra": "CUCHILLO", "pista": "Instrumento con filo para cortar alimentos"},
        {"palabra": "NEVERA", "pista": "Electrodoméstico para mantener la comida fría"},
        {"palabra": "LAVADORA", "pista": "Aparato que lava la ropa con agua y jabón"},
        {"palabra": "PLANCHA", "pista": "Aparato caliente para quitar las arrugas de la ropa"},
        {"palabra": "LAMPARA", "pista": "Objeto que da luz artificial en una habitación"},
        {"palabra": "ALMOHADA", "pista": "Donde apoyamos la cabeza al acostarnos"},
        {"palabra": "SABANA", "pista": "Tela fina que cubre el colchón de la cama"},
        {"palabra": "MANTA", "pista": "Tejido pesado que abriga por las noches"},
        {"palabra": "TOALLA", "pista": "Sirve para secarnos después de darnos un baño"},
        {"palabra": "JABON", "pista": "Pastilla o líquido para lavarnos las manos y el cuerpo"},
        {"palabra": "CEPILLO", "pista": "Sirve para peinarnos el cabello o lavar los dientes"},
        {"palabra": "PASTA", "pista": "Alimento hecho de harina con el que se hacen macarrones"},
        {"palabra": "ARROZ", "pista": "Cereal de grano pequeño y blanco"},
        {"palabra": "LECHE", "pista": "Bebida blanca que dan las vacas"},
        {"palabra": "QUESO", "pista": "Alimento elaborado a partir de la leche cuajada"},
        {"palabra": "PATATA", "pista": "Tubérculo que se come frito o cocido"},
        {"palabra": "TOMATE", "pista": "Fruto rojo que se usa mucho en ensaladas"},
        {"palabra": "CEBOLLA", "pista": "Verdura redonda que hace llorar al cortarla"},
        {"palabra": "AJO", "pista": "Bulbo de sabor fuerte usado para cocinar"},
        {"palabra": "NARANJA", "pista": "Fruta cítrica de color brillante con su mismo nombre"},
        {"palabra": "LIMON", "pista": "Fruta cítrica muy ácida y de color amarillo"},
        {"palabra": "PLATANO", "pista": "Fruta alargada y de color amarillo"},
        {"palabra": "FRESA", "pista": "Fruta pequeña de color rojo con pequeños puntos"},
        {"palabra": "UVAS", "pista": "Fruta pequeña que crece en racimos en la vid"},
        {"palabra": "MELON", "pista": "Fruta grande, dulce y redonda de verano"},
        {"palabra": "SANDIA", "pista": "Fruta grande con pulpa roja y muchas pepitas"},
        {"palabra": "POLLO", "pista": "Ave de corral muy común en la alimentación"},
        {"palabra": "CARNE", "pista": "Alimento procedente del tejido de los animales"},
        {"palabra": "PESCADO", "pista": "Animal acuático que se consume como alimento"},
        {"palabra": "HUEVO", "pista": "Alimento redondo con cáscara que ponen las aves"},
        {"palabra": "ACEITE", "pista": "Líquido graso que se usa para cocinar"},
        {"palabra": "AZUCAR", "pista": "Sustancia cristalina de sabor dulce"},
        {"palabra": "CAFE", "pista": "Bebida oscura y caliente que se toma por la mañana"},
        {"palabra": "AGUA", "pista": "Líquido transparente esencial para la vida"},
        {"palabra": "ZUMO", "pista": "Líquido que se extrae al exprimir las frutas"},
        {"palabra": "FLOR", "pista": "Parte colorida y hermosa de las plantas"},
        {"palabra": "ARBOL", "pista": "Planta de gran altura con tronco de madera"},
        {"palabra": "PLANTA", "pista": "Ser vivo vegetal que suele crecer en la tierra"},
        {"palabra": "TIERRA", "pista": "Sustancia marrón donde crecen las plantas"},
        {"palabra": "PIEDRA", "pista": "Materia mineral dura y sólida de la naturaleza"},
        {"palabra": "PLAYA", "pista": "Costa de arena junto al mar"},
        {"palabra": "MONTAÑA", "pista": "Gran elevación natural del terreno"},
        {"palabra": "SOL", "pista": "Estrella brillante que ilumina nuestros días"},
        {"palabra": "LUNA", "pista": "Satélite natural que brilla por la noche"},
        {"palabra": "ESTRELLA", "pista": "Punto luminoso que brilla en el cielo nocturno"},
        {"palabra": "CIELO", "pista": "Bóveda celeste que cubre la Tierra"},
        {"palabra": "NUBE", "pista": "Acumulación de vapor de agua en el cielo"},
        {"palabra": "LLUVIA", "pista": "Agua que cae de las nubes en gotas"},
        {"palabra": "VIENTO", "pista": "Corriente de aire en movimiento rápido"},
        {"palabra": "NIEVE", "pista": "Agua congelada que cae en copos blancos"},
        {"palabra": "FUEGO", "pista": "Emisión de luz y calor producida por la combustión"},
        {"palabra": "HUMO", "pista": "Gas visible que desprende una cosa que se quema"},
        {"palabra": "CALLE", "pista": "Vía pública urbana para caminar o circular"},
        {"palabra": "PUENTE", "pista": "Construcción para pasar por encima de un río"},
        {"palabra": "COCHE", "pista": "Vehículo de motor con cuatro ruedas"},
        {"palabra": "AUTOBUS", "pista": "Vehículo grande de transporte público urbano"},
        {"palabra": "TREN", "pista": "Medio de transporte que circula sobre raíles"},
        {"palabra": "AVION", "pista": "Vehículo con alas que vuela por el aire"},
        {"palabra": "BARCO", "pista": "Vehículo flotante para navegar por el agua"},
        {"palabra": "BICICLETA", "pista": "Vehículo de dos ruedas impulsado por pedales"},
        {"palabra": "HOSPITAL", "pista": "Lugar donde se atiende a los enfermos y heridos"},
        {"palabra": "FARMACIA", "pista": "Establecimiento donde se venden medicamentos"},
        {"palabra": "MEDICO", "pista": "Profesional de la salud que cuida y cura"},
        {"palabra": "PAPEL", "pista": "Material fino hecho de pasta de celulosa"},
        {"palabra": "TINTO", "pista": "Vino de color rojo oscuro"},
        {"palabra": "BOLIGRAFO", "pista": "Instrumento con tinta para escribir"},
        {"palabra": "CARPETA", "pista": "Sirve para ordenar y guardar papeles"},
        {"palabra": "TIJERAS", "pista": "Instrumento con dos hojas de corte para recortar"},
        {"palabra": "PEGAMENTO", "pista": "Sustancia para unir dos cosas de forma adhesiva"},
        {"palabra": "GUANTE", "pista": "Prenda para abrigar o proteger las manos"},
        {"palabra": "GORRO", "pista": "Prenda de punto o tela para la cabeza"},
        {"palabra": "BUFANDA", "pista": "Prenda larga para abrigar el cuello"},
        {"palabra": "CHAQUETA", "pista": "Prenda de abrigo que se abrocha por delante"},
        {"palabra": "BOLSA", "pista": "Recipiente flexible para transportar cosas"},
        {"palabra": "MALETA", "pista": "Caja con asa para llevar equipaje en los viajes"}
    ];

    let dificultadActual = '';
    let palabraActual = null;

    // 1. Eventos del menú de niveles
    document.querySelectorAll('.btn-nivel').forEach(boton => {
        boton.addEventListener('click', (e) => {
            dificultadActual = e.target.dataset.nivel;
            selectorNivel.style.display = 'none';
            tablero.style.display = 'block';
            btnCambiarNivel.style.display = 'inline-block';
            cargarPalabraAleatoria();
        });
    });

    btnCambiarNivel.addEventListener('click', () => {
        tablero.style.display = 'none';
        selectorNivel.style.display = 'block';
        btnCambiarNivel.style.display = 'none';
    });

    // 2. Selección aleatoria sin repetir
    function cargarPalabraAleatoria() {
        let disponibles = baseDatos.filter(p => p !== palabraActual);
        if (disponibles.length === 0) disponibles = baseDatos;

        palabraActual = disponibles[Math.floor(Math.random() * disponibles.length)];
        procesarAlgoritmo(palabraActual.palabra, palabraActual.pista);
    }

    // 3. Algoritmo de dificultad (calcula huecos dinámicos)
    function procesarAlgoritmo(palabra, pista) {
        let letras = palabra.split('');
        
        let numHuecos = 1; 
        if (dificultadActual === 'medio') numHuecos = 2;
        if (dificultadActual === 'dificil') numHuecos = Math.max(3, Math.floor(letras.length / 2));

        let indicesVacios = [];
        while (indicesVacios.length < numHuecos) {
            let rand = Math.floor(Math.random() * letras.length);
            if (!indicesVacios.includes(rand)) indicesVacios.push(rand);
        }

        let letrasCorrectas = [];
        indicesVacios.forEach(i => {
            letrasCorrectas.push(letras[i]);
        });

        let opciones = [...letrasCorrectas];
        while (opciones.length < numHuecos + 3) {
            let letraRandom = abecedario[Math.floor(Math.random() * abecedario.length)];
            if (!opciones.includes(letraRandom)) opciones.push(letraRandom);
        }
        opciones.sort(() => Math.random() - 0.5);

        dibujarTablero(letras, indicesVacios, pista, opciones);
    }

    // 4. Renderizado en el DOM
    function dibujarTablero(letras, indicesVacios, pista, opciones) {
        textoPista.textContent = pista;
        mensaje.textContent = '';
        mensaje.className = 'word-message';
        contenedorCajas.innerHTML = '';
        contenedorOpciones.innerHTML = '';

        letras.forEach((letra, index) => {
            const caja = document.createElement('div');
            caja.classList.add('letter-box');
            
            if (indicesVacios.includes(index)) {
                caja.classList.add('empty');
                caja.dataset.correcta = letra;
            } else {
                caja.textContent = letra;
            }
            contenedorCajas.appendChild(caja);
        });

        opciones.forEach(opcion => {
            const boton = document.createElement('button');
            boton.classList.add('btn-letter');
            boton.textContent = opcion;
            boton.addEventListener('click', () => verificarRespuesta(boton, opcion));
            contenedorOpciones.appendChild(boton);
        });
    }

    // 5. Validación secuencial
    function verificarRespuesta(boton, letraSeleccionada) {
        const cajasVacias = document.querySelectorAll('.letter-box.empty');
        if (cajasVacias.length === 0) return;

        const cajaActual = cajasVacias[0];
        const letraCorrecta = cajaActual.dataset.correcta;

        if (letraSeleccionada === letraCorrecta) {
            cajaActual.textContent = letraCorrecta;
            cajaActual.classList.remove('empty');
            cajaActual.style.backgroundColor = 'var(--color-cards)';
            boton.disabled = true;
            boton.style.opacity = '0.5';
            mensaje.textContent = '';

            if (document.querySelectorAll('.letter-box.empty').length === 0) {
                mensaje.textContent = '¡Palabra completada con éxito!';
                mensaje.className = 'word-message success';
                document.querySelectorAll('.btn-letter').forEach(btn => btn.disabled = true);
                
                setTimeout(() => cargarPalabraAleatoria(), 2000);
            }
        } else {
            mensaje.textContent = 'Inténtalo de nuevo.';
            mensaje.className = 'word-message error';
        }
    }
});