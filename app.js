const SUPABASE_URL = "https://manaejtcurxbcsozqcsh.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_LTZY6uMVRCnd_K41dneBtw_xn3XU0ke";
const SLUG_NAVE = "babylonia";

async function arrancarReactor() {
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

        // Inyectar datos dinámicos manteniendo intacta la maqueta rústica
        document.getElementById('babylonia-title').innerText = content.header?.title || "BABYLONIA GLOW";
        
        const grid = document.getElementById('contenedor-productos');
        if (grid && content.catalogo?.productos) {
            grid.innerHTML = content.catalogo.productos.map(prod => `
                <div class="producto-card">
                    <h3>` + prod.name + `</h3>
                    <span class="precio-tag">$` + prod.precio_venta + `</span>
                    ` + (prod.stock <= 3 ? `<span class="alerta-stock">BAJO STOCK (` + prod.stock + `)</span>` : '') + `
                </div>
            `).join('');
        }

        // Enlace táctico de WhatsApp dinámico si existe en el JSONB
        const wsBtn = document.getElementById('ws-link');
        if (wsBtn && content.tenant_info?.whatsapp) {
            wsBtn.href = "https://wa.me/" + content.tenant_info.whatsapp;
        }

    } catch (err) {
        console.error("Fallo de sincronización:", err);
    }
}

window.onload = arrancarReactor;
