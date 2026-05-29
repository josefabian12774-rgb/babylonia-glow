// CONFIGURACIÓN DE CONEXIÓN A NAVE-POM-POM
const SUPABASE_URL = "https://manaejtcurxbcsozqcsh.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_LTZY6uMVRCnd_K41dneBtw_xn3XU0ke";
const SLUG_NAVE = "babylonia";

async function arrancarReactor() {
    try {
        // CONCATENACIÓN CLÁSICA CON "+" PARA EVITAR FALLOS DE COMILLAS INVERTIDAS
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
        if (!data || data.length === 0) {
            document.getElementById('babylonia-title').innerText = "🚫 ERROR DE COORDENADAS";
            return;
        }

        const filaNave = data[0];
        const fechaCreacion = new Date(filaNave.created_at);
        let content = filaNave.content; // Mapeo del JSONB

        // 1. MODO FANTASMA (Control efímero local de 24 horas)
        const STORAGE_KEY = "nexo_ghost_" + SLUG_NAVE;
        const copiaLocal = localStorage.getItem(STORAGE_KEY);
        if (copiaLocal) {
            const { datos, timestamp } = JSON.parse(copiaLocal);
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                content = datos;
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }

        // 2. DIRECTIVA MANDATORIA DE CONTROL DE SUMINISTROS (Kill-Switch de 20 Días)
        const diasTranscurridos = Math.floor((Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24));
        const rango = content.tenant_info?.rango || 'prueba';
        const statusContrato = content.tenant_info?.status || 'active';

        if ((rango === 'prueba' && diasTranscurridos > 20) || statusContrato === 'waiting' || statusContrato === 'anchored') {
            document.body.innerHTML = `
                <div style="position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:#0c0a09; font-family:monospace; color:#fff; padding:20px; z-index:99999;">
                    <div style="text-align:center; padding:30px; border:1px solid #27272a; background:#18181b; border-radius:12px; max-width:350px;">
                        <span style="font-size:40px; display:block; margin-bottom:15px;">⏸️</span>
                        <h2 style="color:#eab308; text-transform:uppercase; letter-spacing:2px; margin:0; font-size:16px;">Nave en carga de suministros en pausa</h2>
                        <p style="font-size:11px; color:#a1a1aa; margin-top:15px; line-height:1.6;">
                            El ciclo de prueba de 20 días para Babylonia ha concluido. Conecte con el centro de control NEXO ARQUETIPO para estabilizar el suministro.
                        </p>
                    </div>
                </div>`;
            return;
        }

        // 3. ARMADO DE INTERFAZ CAMALEÓNICA
        const tokens = content.design_tokens || {};
        document.body.style.backgroundColor = tokens.color_bg || "#1c1917";
        document.body.style.color = tokens.color_text || "#4ade80";

        document.getElementById('babylonia-title').innerText = content.header?.title || "BABYLONIA GLOW";
        document.getElementById('babylonia-subtitle').innerText = content.header?.subtitle || "";

        // Render del catálogo
        const grid = document.getElementById('contenedor-productos');
        if (grid && content.catalogo?.productos) {
            grid.innerHTML = content.catalogo.productos.map(prod => `
                <div class="producto-card" style="background: #262626; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
                    <h3 style="margin:0 0 10px 0;">` + prod.name + `</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:18px; font-weight:bold;">$` + prod.precio_venta + `</span>
                        ` + (prod.stock <= 3 ? `<span style="background:#dc2626; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px;">STOCK BAJO (` + prod.stock + `)</span>` : '') + `
                    </div>
                </div>
            `).join('');
        }

    } catch (err) {
        console.error("Fallo de conexión con Nave-Pom-Pom:", err);
    }
}

window.onload = arrancarReactor;
