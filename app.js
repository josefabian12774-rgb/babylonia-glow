const SUPABASE_URL = "https://manaejtcurxbcsozqcsh.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_LTZY6uMVRCnd_K41dneBtw_xn3XU0ke";
const SLUG_NAVE = "babylonia";

async function sincronizarBunker() {
    try {
        const url = SUPABASE_URL + "/rest/v1/naves?perfil_slug=eq." + SLUG_NAVE;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        if (!data || data.length === 0) return;

        const content = data[0].content;

        // Renderizado del Catálogo dentro de los contenedores industriales
        const grid = document.getElementById('contenedor-productos');
        if (grid && content.catalogo?.productos) {
            grid.innerHTML = content.catalogo.productos.map(prod => `
                <div class="card-suministro">
                    <div>
                        <h3>` + prod.name + `</h3>
                        <div class="card-meta">Origen: ARG | Suministro</div>
                    </div>
                    <div>
                        <span class="card-precio">$` + prod.precio_venta + `</span>
                        ` + (prod.stock <= 3 ? `<span class="badge-suministro">Bajo Stock (` + prod.stock + `)</span>` : '') + `
                    </div>
                </div>
            `).join('');
        }

        // Sincronización del enlace seguro de WhatsApp
        const linkWs = document.getElementById('ws-link');
        if (linkWs && content.tenant_info?.whatsapp) {
            linkWs.href = "https://wa.me/" + content.tenant_info.whatsapp;
        }

    } catch (err) {
        console.error("Fallo crítico de enlace táctico:", err);
    }
}

window.onload = sincronizarBunker;
