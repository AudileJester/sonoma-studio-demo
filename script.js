/* Lógica del Sidebar */
function cambiarJuego(elementoSeleccionado) {
    document.querySelectorAll('.sidebar-icon').forEach(icono => icono.classList.remove('active'));
    elementoSeleccionado.classList.add('active');
    elementoSeleccionado.style.transform = "scale(0.9)";
    setTimeout(() => { elementoSeleccionado.style.transform = "scale(1)"; }, 150);
}

/* Efecto 3D en Tarjetas */
document.querySelectorAll('.news-card').forEach(tarjeta => {
    tarjeta.addEventListener('mousemove', (e) => {
        const rect = tarjeta.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;  
        const cx = rect.width / 2, cy = rect.height / 2;
        tarjeta.style.transform = `perspective(1000px) rotateX(${((y - cy) / cy) * -10}deg) rotateY(${((x - cx) / cx) * 10}deg) scale3d(1.02, 1.02, 1.02)`;
        tarjeta.style.boxShadow = "0 15px 30px rgba(0, 255, 204, 0.15)";
        tarjeta.style.borderColor = "rgba(0, 255, 204, 0.3)";
    });
    tarjeta.addEventListener('mouseleave', () => {
        tarjeta.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        tarjeta.style.boxShadow = "none";
        tarjeta.style.borderColor = "rgba(255,255,255,0.05)";
        tarjeta.style.transition = "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease";
    });
    tarjeta.addEventListener('mouseenter', () => { tarjeta.style.transition = "none"; });
});

/* Transiciones de página */
document.querySelectorAll('.legal-links a, .logo-img-effect').forEach(enlace => {
    enlace.addEventListener('click', function(e) {
        const dest = this.getAttribute('href');
        if (dest && dest !== '#') {
            e.preventDefault();
            document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            document.body.style.opacity = '0';
            document.body.style.transform = 'scale(0.98)';
            setTimeout(() => { window.location.href = dest; }, 300);
        }
    });
});

/* =======================================
   LÓGICA GLOBAL Y VENTANITAS MODALES
   ======================================= */
function iniciarSesionSimulada(gamertag) {
    localStorage.setItem('sonomaLoggedIn', 'true');
    localStorage.setItem('sonomaGamertag', gamertag);
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = 'index.html'; }, 300);
}

function abrirModalLogout(e) {
    if(e) e.preventDefault();
    const modal = document.getElementById('logoutModalOverlay');
    if(modal) modal.classList.remove('hidden');
    const dropdown = document.getElementById('accountDropdown');
    if(dropdown) dropdown.classList.remove('show-dropdown');
}

function cerrarModalLogout() { 
    const modal = document.getElementById('logoutModalOverlay');
    if(modal) modal.classList.add('hidden'); 
}

function confirmarLogout() {
    localStorage.setItem('sonomaLoggedIn', 'false');
    window.location.reload(); 
}

/* --- LÓGICA DEL PANEL DE CONFIGURACIÓN --- */
let activeGearBtn = null;

function abrirAjustes(boton) {
    activeGearBtn = boton;
    const gearIcon = boton.querySelector('.fa-gear');
    if(gearIcon) gearIcon.classList.add('spin-infinite-active');
    
    const overlay = document.getElementById('settingsModalOverlay');
    if(overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => { overlay.classList.add('show'); }, 10);
    }
    
    const gamertagInput = document.getElementById('ajustesGamertagActual');
    if (gamertagInput) {
        const currentTag = localStorage.getItem('sonomaGamertag');
        if (!localStorage.getItem('sonomaLoggedIn') || localStorage.getItem('sonomaLoggedIn') === 'false') {
            gamertagInput.value = "Inicia sesión primero";
            document.getElementById('ajustesNuevoGamertag').disabled = true;
        } else {
            gamertagInput.value = currentTag;
            document.getElementById('ajustesNuevoGamertag').disabled = false;
        }
    }
    verificarCooldownGamertag();
}

function cerrarAjustes() {
    const overlay = document.getElementById('settingsModalOverlay');
    if(overlay) {
        overlay.classList.remove('show');
        setTimeout(() => { overlay.classList.add('hidden'); }, 400);
    }
    if(activeGearBtn) {
        const gearIcon = activeGearBtn.querySelector('.fa-gear');
        if(gearIcon) gearIcon.classList.remove('spin-infinite-active');
    }
}

function cambiarPestañaAjustes(elemento, tabId) {
    document.querySelectorAll('.setting-tab-btn').forEach(btn => btn.classList.remove('active'));
    if(elemento) elemento.classList.add('active');
    
    document.querySelectorAll('.setting-section').forEach(sec => sec.classList.add('hidden'));
    const tab = document.getElementById(tabId);
    if(tab) tab.classList.remove('hidden');
}

/* Lógica de Gamertag */
const groserias = ['puto', 'pendejo', 'nazi', 'racista', 'mierda', 'cabron', 'zorra'];

function verificarCooldownGamertag() {
    const hasCooldown = localStorage.getItem('gamertagCooldown') === 'true';
    const panelUnlock = document.getElementById('premiumUnlockPanel');
    const inputNuevo = document.getElementById('ajustesNuevoGamertag');
    const statusMsg = document.getElementById('gamertagStatusMsg');
    const btnActualizar = document.querySelector('.change-tag-group .submit-btn');

    if(panelUnlock && inputNuevo && statusMsg && btnActualizar) {
        if (hasCooldown) {
            panelUnlock.classList.remove('hidden');
            inputNuevo.disabled = true;
            btnActualizar.disabled = true;
            statusMsg.textContent = "Error: Nombre bloqueado. Tienes que esperar 6 meses.";
            statusMsg.style.color = "#ff2a4b";
        } else {
            panelUnlock.classList.add('hidden');
            if(localStorage.getItem('sonomaLoggedIn') === 'true') {
                inputNuevo.disabled = false;
                btnActualizar.disabled = false;
                statusMsg.textContent = "El sistema te permite 1 cambio gratuito ahora.";
                statusMsg.style.color = "var(--primary-color)";
            }
        }
    }
}

function solicitarCambioGamertag() {
    const inputNuevo = document.getElementById('ajustesNuevoGamertag');
    const statusMsg = document.getElementById('gamertagStatusMsg');
    if(!inputNuevo || !statusMsg) return;

    const nuevoTag = inputNuevo.value.trim();

    if (nuevoTag.length < 3) {
        statusMsg.textContent = "El Gamertag debe tener al menos 3 letras.";
        statusMsg.style.color = "#ff2a4b";
        return;
    }

    let esOfensivo = false;
    groserias.forEach(palabra => {
        if(nuevoTag.toLowerCase().includes(palabra)) esOfensivo = true;
    });

    if (esOfensivo) {
        statusMsg.textContent = "¡INFRACCIÓN DE REGLAS! Nombre ofensivo detectado.";
        statusMsg.style.color = "#ff2a4b";
        return;
    }

    localStorage.setItem('sonomaGamertag', nuevoTag);
    localStorage.setItem('gamertagCooldown', 'true'); 
    
    document.getElementById('ajustesGamertagActual').value = nuevoTag;
    inputNuevo.value = "";
    
    statusMsg.textContent = "¡Gamertag actualizado con éxito!";
    statusMsg.style.color = "var(--primary-color)";
    
    const headerDisplay = document.querySelector('.gamertag-display');
    const loginBtn = document.querySelector('.login-btn');
    if(headerDisplay) headerDisplay.textContent = nuevoTag;
    if(loginBtn && localStorage.getItem('sonomaLoggedIn') === 'true') {
        loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${nuevoTag}`;
    }

    verificarCooldownGamertag();
}

function pagarDolarSimulado() {
    const panelUnlock = document.getElementById('premiumUnlockPanel');
    if(!panelUnlock) return;
    
    panelUnlock.innerHTML = `<h4><i class="fa-solid fa-check-circle"></i> ¡Pago Procesado!</h4>
                             <p>Gracias por tu dólar. La corporación te permite cambiar el nombre.</p>`;
    
    setTimeout(() => {
        localStorage.setItem('gamertagCooldown', 'false');
        panelUnlock.innerHTML = `<h4><i class="fa-solid fa-lock"></i> Cambio Bloqueado (6 Meses)</h4>
                                 <p>Soborna a la corporación para liberar el nombre inmediatamente.</p>
                                 <button class="premium-btn" onclick="pagarDolarSimulado()"><i class="fa-solid fa-sack-dollar"></i> Pagar $1.00 USD</button>`;
        verificarCooldownGamertag();
    }, 2500);
}

/* LÓGICA PRINCIPAL AL CARGAR LA PÁGINA */
document.addEventListener('DOMContentLoaded', () => {
    const settingsDrawer = document.getElementById('settingsDrawer');
    if(settingsDrawer) {
        settingsDrawer.addEventListener('click', (e) => { e.stopPropagation(); });
    }

    const isLoggedIn = localStorage.getItem('sonomaLoggedIn') === 'true';
    const storedGamertag = localStorage.getItem('sonomaGamertag');

    /* Lógica Header */
    const userAccount = document.getElementById('userAccount');
    const dropdown = document.getElementById('accountDropdown');
    const gamertagDisplay = document.querySelector('.gamertag-display');
    
    if (userAccount && dropdown && isLoggedIn) {
        const loginBtn = userAccount.querySelector('.login-btn');
        if(loginBtn) {
            loginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${storedGamertag}`;
            loginBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); dropdown.classList.toggle('show-dropdown'); };
        }
        if(gamertagDisplay) gamertagDisplay.textContent = storedGamertag;
        
        const btnIrPerfil = document.getElementById('btnIrPerfil');
        if(btnIrPerfil) btnIrPerfil.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'cuenta.html'; });
        document.addEventListener('click', (e) => { if (!userAccount.contains(e.target)) dropdown.classList.remove('show-dropdown'); });
    }

    /* Lógica Página de Cuenta */
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const profileBox = document.getElementById('profileBox');
    const authTabs = document.getElementById('authTabs');
    const socialSetupBox = document.getElementById('socialSetupBox');

    if (loginBox && profileBox && authTabs) {
        if (isLoggedIn) {
            authTabs.style.display = 'none'; 
            loginBox.classList.add('hidden'); 
            registerBox.classList.add('hidden');
            if(socialSetupBox) socialSetupBox.classList.add('hidden');
            profileBox.classList.remove('hidden');
            
            const display = document.getElementById('profileGamertagDisplay');
            if(display) {
                display.textContent = storedGamertag; 
                display.setAttribute('data-text', storedGamertag);
            }
            
            const btnIxora = document.querySelector('.game-tab-btn');
            if(btnIxora) cambiarStats(btnIxora, 'ixora'); 

        } else {
            const tabLogin = document.getElementById('tabLoginBtn');
            const tabReg = document.getElementById('tabRegisterBtn');
            if(tabLogin && tabReg) {
                tabReg.addEventListener('click', () => { tabLogin.classList.remove('active'); tabReg.classList.add('active'); loginBox.classList.add('hidden'); registerBox.classList.remove('hidden'); });
                tabLogin.addEventListener('click', () => { tabReg.classList.remove('active'); tabLogin.classList.add('active'); registerBox.classList.add('hidden'); loginBox.classList.remove('hidden'); });
            }
        }

        const loginForm = document.getElementById('loginFormSim');
        if (loginForm) loginForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            let gamertag = storedGamertag ? storedGamertag : 'Agente_Logueado';
            iniciarSesionSimulada(gamertag); 
        });

        const regForm = document.getElementById('registerFormSim');
        if (regForm) regForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            const regGT = document.getElementById('regGamertag');
            if(regGT) iniciarSesionSimulada(regGT.value); 
        });

        document.querySelectorAll('.google-btn, .facebook-btn').forEach(btn => {
            btn.addEventListener('click', (e) => { 
                e.preventDefault(); 
                if (storedGamertag) { iniciarSesionSimulada(storedGamertag); } 
                else {
                    authTabs.style.display = 'none'; loginBox.classList.add('hidden'); registerBox.classList.add('hidden');
                    if(socialSetupBox) socialSetupBox.classList.remove('hidden');
                }
            });
        });

        const socialForm = document.getElementById('socialSetupFormSim');
        if (socialForm) socialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const socGT = document.getElementById('socialGamertag');
            if(socGT) iniciarSesionSimulada(socGT.value);
        });
    }

    // Iniciar UI del Carrito
    actualizarContador();
    actualizarBotonesComprados();
});

/* Lógica Estadísticas del Perfil Gamer */
function cambiarStats(btn, juego) {
    document.querySelectorAll('.game-tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    
    const container = document.getElementById('statsContainer');
    if(!container) return;

    container.style.opacity = '0';
    setTimeout(() => {
        if(juego === 'ixora') {
            container.innerHTML = `<div class="stat-item"><i class="fa-regular fa-clock"></i> <span>142 Horas</span></div><div class="stat-item"><i class="fa-solid fa-trophy"></i> <span>45/50 Logros</span></div><div class="stat-item"><i class="fa-solid fa-medal"></i> <span>Rango: Mutante Élite</span></div>`;
        } else if(juego === 'phantom') {
            container.innerHTML = `<div class="stat-item"><i class="fa-regular fa-clock"></i> <span>12 Horas</span></div><div class="stat-item"><i class="fa-solid fa-trophy"></i> <span>5/20 Logros</span></div><div class="stat-item"><i class="fa-solid fa-medal"></i> <span>Rango: Espectro</span></div>`;
        } else if(juego === 'neon') {
            container.innerHTML = `<div class="stat-item"><i class="fa-regular fa-clock"></i> <span>87 Horas</span></div><div class="stat-item"><i class="fa-solid fa-trophy"></i> <span>28/30 Logros</span></div><div class="stat-item"><i class="fa-solid fa-medal"></i> <span>Rango: Piloto Neón</span></div>`;
        }
        container.style.opacity = '1';
    }, 300);
}

/* =======================================
   ENCUESTA
   ======================================= */
function abrirEncuesta() {
    const modal = document.getElementById('surveyModalOverlay');
    if(modal) modal.classList.remove('hidden');
}

function cerrarEncuesta() {
    const modal = document.getElementById('surveyModalOverlay');
    if(modal) modal.classList.add('hidden');
}

function enviarEncuesta(e) {
    e.preventDefault();
    mostrarAlertaSonoma("TELEMETRÍA ENVIADA", "¡Datos de percepción recibidos! Gracias por ayudar a la corporación.", "success");
    cerrarEncuesta();
}

/* =======================================
   SISTEMA UNIFICADO DE E-COMMERCE PRO Y DESCARGAS
   ======================================= */

let saldoMP = 1000.00;

function obtenerNombreUsuario() {
    const nombreGuardado = localStorage.getItem('sonomaGamertag');
    return nombreGuardado && nombreGuardado !== "Cargando..." ? nombreGuardado : "Agente";
}

function mostrarAlertaSonoma(titulo, mensaje, tipo) {
    const overlay = document.getElementById('sonomaAlertOverlay');
    const icon = document.getElementById('sonomaAlertIcon');
    const title = document.getElementById('sonomaAlertTitle');
    const msg = document.getElementById('sonomaAlertMessage');
    const btns = document.getElementById('sonomaAlertButtons');

    if(!overlay) return;

    title.innerText = titulo;
    msg.innerHTML = mensaje;

    if(tipo === 'error') {
        icon.innerHTML = '<i class="fa-solid fa-triangle-exclamation icon-error"></i>';
        btns.innerHTML = '<button class="modal-btn btn-yes" onclick="cerrarAlertaSonoma()" style="background:rgba(255, 42, 75, 0.1); color:#ff2a4b; border-color:#ff2a4b;">Cerrar</button>';
    } else if (tipo === 'success') {
        icon.innerHTML = '<i class="fa-solid fa-circle-check icon-success"></i>';
        btns.innerHTML = '<button class="modal-btn btn-yes" onclick="cerrarAlertaSonoma()" style="background:rgba(0, 255, 204, 0.1); color:var(--primary-color); border-color:var(--primary-color);">Excelente</button>';
    } else {
        icon.innerHTML = '<i class="fa-solid fa-circle-info icon-warning"></i>';
        btns.innerHTML = '<button class="modal-btn btn-yes" onclick="cerrarAlertaSonoma()">Entendido</button>';
    }
    overlay.classList.remove('hidden');
}

function cerrarAlertaSonoma() {
    const overlay = document.getElementById('sonomaAlertOverlay');
    if(overlay) overlay.classList.add('hidden');
}

function actualizarContador() {
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    
    if (carrito.length > 0) {
        badge.textContent = carrito.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function agregarAlCarrito(nombre, precio, img) {
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    let compras = JSON.parse(localStorage.getItem('sonomaCompras')) || [];
    const nombreUsuario = obtenerNombreUsuario();

    if(compras.some(c => nombre.includes(c) || c.includes(nombre))) {
        mostrarAlertaSonoma("ACCESO DENEGADO", `${nombreUsuario}, ya posees este artículo en tu biblioteca.`, "warning");
        return;
    }
    if(carrito.some(item => item.nombre.includes(nombre) || nombre.includes(item.nombre))) {
        mostrarAlertaSonoma("DUPLICADO", `${nombreUsuario}, este artículo ya está en tu carrito esperando pago.`, "warning");
        return;
    }

    carrito.push({nombre, precio, img});
    localStorage.setItem('sonoma_cart', JSON.stringify(carrito));

    const btnCart = document.querySelector('.cart-btn');
    if(btnCart) {
        btnCart.classList.add('cart-anim');
        setTimeout(() => btnCart.classList.remove('cart-anim'), 400);
    }

    actualizarContador();
    actualizarBotonesComprados();
    renderCarrito();
    abrirCarrito();
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('sonoma_cart', JSON.stringify(carrito));
    
    renderCarrito();
    actualizarContador();
    actualizarBotonesComprados(); 
}

function renderCarrito() {
    const listContainer = document.getElementById('cartItemsList');
    const totalDisplay = document.getElementById('cartTotalDisplay');
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    
    if(!listContainer || !totalDisplay) return;
    listContainer.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        listContainer.innerHTML = '<p style="color:#8b92a5; text-align:center; padding:20px;">Tu carrito está vacío.</p>';
    } else {
        carrito.forEach((item, index) => {
            total += item.precio;
            listContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.nombre}">
                    <div class="cart-item-info">
                        <h4>${item.nombre}</h4>
                        <p style="color:var(--primary-color); font-weight:bold;">$${item.precio}.00 MXN</p>
                    </div>
                    <button class="remove-item" onclick="eliminarDelCarrito(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
    }
    totalDisplay.innerText = `$${total.toFixed(2)} MXN`;
}

function procederPagoMP() {
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    let total = carrito.reduce((acc, item) => acc + item.precio, 0);

    if (total === 0) {
        mostrarAlertaSonoma("CARRITO VACÍO", "Agrega algún artículo antes de intentar procesar el pago.", "warning");
        return;
    }

    const overlay = document.getElementById('sonomaAlertOverlay');
    const icon = document.getElementById('sonomaAlertIcon');
    const title = document.getElementById('sonomaAlertTitle');
    const msg = document.getElementById('sonomaAlertMessage');
    const btns = document.getElementById('sonomaAlertButtons');

    if(!overlay) return;

    icon.innerHTML = '<i class="fa-solid fa-shield-halved icon-success"></i>';
    title.innerText = "VERIFICACIÓN DE SEGURIDAD";
    msg.innerHTML = `¿Autorizas el cargo de <strong>$${total}.00 MXN</strong> a tu cuenta de Mercado Pago?<br><br>Saldo disponible: $${saldoMP.toFixed(2)} MXN`;

    btns.innerHTML = `
        <button class="modal-btn btn-no" onclick="cerrarAlertaSonoma()">Cancelar</button>
        <button class="modal-btn btn-yes" id="btnConfirmarPago" style="background:rgba(0, 255, 204, 0.1); color:var(--primary-color); border-color:var(--primary-color);">Autorizar Pago</button>
    `;

    document.getElementById('btnConfirmarPago').onclick = function() {
        cerrarAlertaSonoma();
        iniciarPantallaCarga(total);
    };

    overlay.classList.remove('hidden');
}

function iniciarPantallaCarga(total) {
    const loading = document.getElementById('loadingPaymentOverlay');
    if(loading) loading.classList.remove('hidden');

    setTimeout(() => {
        if(loading) loading.classList.add('hidden');
        procesarPagoReal(total);
    }, 2500); 
}

function procesarPagoReal(total) {
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    let compras = JSON.parse(localStorage.getItem('sonomaCompras')) || [];
    const nombreUsuario = obtenerNombreUsuario();

    if (saldoMP >= total) {
        saldoMP -= total; 
        
        carrito.forEach(item => { if(!compras.includes(item.nombre)) compras.push(item.nombre); });
        localStorage.setItem('sonomaCompras', JSON.stringify(compras));
        localStorage.removeItem('sonoma_cart'); 
        
        cerrarCarrito();
        actualizarContador();
        actualizarBotonesComprados();
        renderBiblioteca();
        
        mostrarAlertaSonoma("TRANSACCIÓN EXITOSA", `¡Perfecto <strong>${nombreUsuario}</strong>! El pago se procesó correctamente. Los artículos se han vinculado a tu biblioteca Sonoma.`, "success");
        
        const bellBtn = document.getElementById('btnNotificaciones');
        const notifBadge = document.getElementById('notifBadge');
        if(bellBtn) {
            bellBtn.classList.add('bell-anim');
            setTimeout(() => bellBtn.classList.remove('bell-anim'), 600);
        }
        if(notifBadge) notifBadge.classList.remove('hidden');

    } else {
        mostrarAlertaSonoma("PAGO DECLINADO", `Saldo insuficiente en Mercado Pago.<br>Te faltan $${(total - saldoMP).toFixed(2)} MXN para completar la operación.`, "error");
    }
}

// LÓGICA DE BOTONES GRISES Y DESCARGA PARA IXORA
function actualizarBotonesComprados() {
    let compras = JSON.parse(localStorage.getItem('sonomaCompras')) || [];
    let carrito = JSON.parse(localStorage.getItem('sonoma_cart')) || [];
    
    // 1. Tarjetas normales
    document.querySelectorAll('.promo-card').forEach(card => {
        const h4 = card.querySelector('h4');
        const btn = card.querySelector('.btn-add-cart-pro');
        if(!h4 || !btn) return;

        const nombrePantalla = h4.innerText;
        const nombreLimpio = nombrePantalla.split('(')[0].trim();

        const yaComprado = compras.some(c => nombrePantalla.includes(c) || c.includes(nombrePantalla));
        const enCarrito = carrito.some(i => nombrePantalla.includes(i.nombre) || i.nombre.includes(nombrePantalla));

        if(yaComprado) {
            btn.innerHTML = '<i class="fa-solid fa-check-double"></i> ADQUIRIDO';
            btn.classList.add('btn-disabled');
            btn.onclick = null;
        } else if (enCarrito) {
            btn.innerHTML = '<i class="fa-solid fa-clock"></i> EN CARRITO';
            btn.classList.add('btn-disabled');
            btn.onclick = null;
        } else {
            btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Añadir al carrito';
            btn.classList.remove('btn-disabled');
            const precioText = card.querySelector('.promo-price') ? card.querySelector('.promo-price').innerText : "0";
            const precio = parseInt(precioText.replace(/[^0-9]/g, ''));
            const img = card.querySelector('img') ? card.querySelector('img').src : "";
            btn.onclick = () => agregarAlCarrito(nombreLimpio, precio, img);
        }
    });

    // 2. Botón principal de Ixora
    const btnIxora = document.getElementById('btnBuyIxora');
    if (btnIxora) {
        const nombreJuego = "Ixora: El Cambio";
        const yaCompradoIxora = compras.some(c => nombreJuego.includes(c) || c.includes("Ixora"));
        const enCarritoIxora = carrito.some(i => nombreJuego.includes(i.nombre) || i.nombre.includes("Ixora"));
        const descargado = localStorage.getItem('ixora_downloaded') === 'true';

        if (descargado) {
            btnIxora.innerHTML = '<i class="fa-solid fa-play"></i> JUGAR AHORA';
            btnIxora.className = 'gp-buy-now-btn btn-play'; 
            btnIxora.onclick = abrirJuegoSimulado;
        } else if (yaCompradoIxora) {
            btnIxora.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> DESCARGAR JUEGO';
            btnIxora.className = 'gp-buy-now-btn btn-download'; 
            btnIxora.onclick = iniciarDescargaSimulada;
        } else if (enCarritoIxora) {
            btnIxora.innerHTML = '<i class="fa-solid fa-clock"></i> EN CARRITO';
            btnIxora.className = 'gp-buy-now-btn btn-disabled';
            btnIxora.onclick = null;
        } else {
            btnIxora.innerHTML = '<i class="fa-solid fa-cart-plus"></i> AGREGAR AL CARRITO - $149.00 MXN';
            btnIxora.className = 'gp-buy-now-btn';
            btnIxora.onclick = () => agregarAlCarrito(nombreJuego, 149, 'imagenes/logo-ixora.jpg');
        }
    }
}

function abrirCarrito() {
    const overlay = document.getElementById('cartOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('show'), 10);
    renderCarrito(); 
}

function cerrarCarrito() {
    const overlay = document.getElementById('cartOverlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function abrirNotificaciones() {
    const overlay = document.getElementById('notifOverlay');
    const badge = document.getElementById('notifBadge');
    
    if(overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.add('show'), 10);
    }
    if(badge) badge.classList.add('hidden');
    
    renderBiblioteca();
}

function cerrarNotificaciones() {
    const overlay = document.getElementById('notifOverlay');
    if(overlay) {
        overlay.classList.remove('show');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function renderBiblioteca() {
    const compras = JSON.parse(localStorage.getItem('sonomaCompras')) || [];
    const lista = document.getElementById('purchasedItemsList');
    if(!lista) return;

    lista.innerHTML = '';
    if(compras.length === 0) {
        lista.innerHTML = '<p style="color:#8b92a5; text-align:center;">No hay adquisiciones recientes.</p>';
    } else {
        compras.forEach(nombre => {
            lista.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4 style="color:white; margin-bottom: 5px;">${nombre}</h4>
                        <button style="background:transparent; border:1px dashed var(--primary-color); color:var(--primary-color); border-radius:5px; padding:5px 10px; cursor:pointer; font-size:0.8rem;" onclick="window.print()"><i class="fa-solid fa-file-invoice"></i> Imprimir Ticket</button>
                    </div>
                </div>
            `;
        });
    }
}

/* =======================================
   SIMULADOR DE DESCARGA (EXCLUSIVO IXORA)
   ======================================= */
function iniciarDescargaSimulada() {
    const overlay = document.getElementById('downloadOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    
    const bar = document.getElementById('dlProgressBar');
    const status = document.getElementById('dlStatus');
    const sizeInfo = document.getElementById('dlSize');
    const speedInfo = document.getElementById('dlSpeed');
    const pingInfo = document.getElementById('dlPing');

    let progress = 0;
    const totalSize = 450; // MB
    
    status.innerText = "Descargando Ixora_El_Cambio_v1.0.exe...";
    
    const interval = setInterval(() => {
        progress += Math.random() * 8 + 3; 
        if(progress >= 100) progress = 100;
        
        bar.style.width = progress + "%";
        
        let currentSize = (progress / 100) * totalSize;
        sizeInfo.innerText = `${currentSize.toFixed(1)} MB / ${totalSize} MB`;
        speedInfo.innerText = `${(Math.random() * 8 + 4).toFixed(1)} MB/s`;
        pingInfo.innerText = `Ping: ${Math.floor(Math.random() * 20 + 10)}ms`;

        if(progress === 100) {
            clearInterval(interval);
            status.innerText = "¡DESCARGA COMPLETADA! Extrayendo paquetes...";
            speedInfo.innerText = "0 MB/s";
            
            setTimeout(() => {
                overlay.classList.add('hidden');
                
                localStorage.setItem('ixora_downloaded', 'true');
                actualizarBotonesComprados(); 
                
                // Descarga simulada de la imagen
                const link = document.createElement('a');
                link.href = 'imagenes/logo-ixora.jpg';
                link.download = 'Ixora_Launcher_Files.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                mostrarAlertaSonoma("INSTALACIÓN EXITOSA", "El juego se ha instalado correctamente en tu sistema. Ya puedes iniciarlo.", "success");
            }, 2000);
        }
    }, 400); 
}

function abrirJuegoSimulado() {
    window.open('imagenes/logo-ixora.jpg', '_blank');
}

/* =======================================
   BOTÓN DE EMERGENCIA PARA RESETEAR PRUEBAS
   ======================================= */
function resetCompras() {
    localStorage.clear();
    location.reload();
}