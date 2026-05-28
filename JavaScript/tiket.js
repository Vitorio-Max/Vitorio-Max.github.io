import CONFIG from '../JavaScript/config.js';
import { supabase } from '../JavaScript/supabase.js';

const { useState, useEffect } = React; // Añadido useEffect para el usuario

function TicketAnalyzer() {
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [user, setUser] = useState(null); // Estado para guardar el usuario de Supabase

    // Obtener el usuario autenticado al cargar el componente
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleImageUpload = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Por favor, carga una imagen válida');
            return;
        }
        setError(null);
        setImage(URL.createObjectURL(file));

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageBase64(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleImageUpload(file);
    };

    const analyzeTicket = async () => {
        if (!imageBase64) {
            setError('Por favor, carga una imagen primero');
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const partes = imageBase64.split(',');
            const mimeType = partes[0].match(/:(.*?);/)[1];
            const base64Data = partes[1];

            // Reemplaza la línea de tu URL por esta versión más segura:
            const cleanApiKey = CONFIG.GEMINI_API_KEY.trim();
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanApiKey}`;

            // Hemos alineado los nombres de las propiedades del JSON con los de tu tabla de Supabase
            const promptText = `Analiza esta imagen de un tique/recibo de taxi (taxímetro) y extrae la información con precisión en formato JSON.
Es OBLIGATORIO que respondas ÚNICAMENTE con el objeto JSON y nada más. No utilices bloques de código de markdown (\`\`\`json ). 

Establece los siguientes campos en el JSON (si los números tienen comas, déjalos como texto, ej: "178,35"):
{
    "fecha": "Fecha del tique en formato YYYY-MM-DD si es posible, o texto original",
    "importe": "Importe total de las carreras (ej: 178,35)",
    "carreras": "Número total de servicios o carreras como número entero",
    "kms_total": "Distancia total recorrida (ej: 45,20)"
}
Si algún campo específico no se visualiza en la imagen, asígnale el valor null.`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: promptText },
                            { inlineData: { mimeType: mimeType, data: base64Data } }
                        ]
                    }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Error en la API de Gemini');
            }

            const jsonText = data.candidates[0].content.parts[0].text.trim();
            const parsedResults = JSON.parse(jsonText);

            setResults(parsedResults);

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Error al procesar el tique.');
        } finally {
            loading ? setLoading(false) : null;
            setLoading(false);
        }
    };

    // Función auxiliar para limpiar y transformar texto "12,34" a número flotante 12.34
    const parseCurrencyOrFloat = (value) => {
        if (!value) return null;
        if (typeof value === 'number') return value;
        const cleanValue = value.toString().replace(/[^0-9.,]/g, '').replace(',', '.');
        const parsed = parseFloat(cleanValue);
        return isNaN(parsed) ? null : parsed;
    };

    const insertToSupabase = async () => {
        if (!results) return;

        if (!user) {
            setError('No se ha detectado ningún usuario autenticado. Por favor inicia sesión.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Mapeo exacto con los tipos de tu base de datos (int8, numeric, text, uuid)
            const { data, error: sbError } = await supabase
                .from('tiques')
                .insert([
                    {
                        fecha: results.fecha || null,
                        importe: parseCurrencyOrFloat(results.importe),
                        carreras: results.carreras ? parseInt(results.carreras, 10) : null,
                        kms_total: parseCurrencyOrFloat(results.kms_total),
                        user_id: user.id // Ahora 'user' viene de supabase.auth.getUser()
                    }
                ]);

            if (sbError) throw sbError;
            alert('¡Datos del taxímetro guardados con éxito en Supabase! 🚕🎉');
        } catch (err) {
            console.error('Error Supabase:', err);
            setError('Error de Base de Datos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setImage(null);
        setImageBase64(null);
        setResults(null);
        setError(null);
    };

    return React.createElement("div", { className: "container" },
        React.createElement("div", { className: "main-grid" },
            React.createElement("div", { className: "upload-section" },
                React.createElement("div", {
                    className: "upload-area " + (dragOver ? 'drag-over' : ''),
                    onClick: () => document.getElementById('fileInput').click(),
                    onDragOver: handleDragOver,
                    onDragLeave: handleDragLeave,
                    onDrop: handleDrop
                },
                    React.createElement("span", { className: "upload-icon" }, "📸"),
                    React.createElement("div", { className: "upload-text" }, "Sube el tique de Taxi"),
                    React.createElement("div", { className: "upload-subtext" }, "Arrastra la imagen o haz clic aquí")
                ),

                React.createElement("input", {
                    id: "fileInput",
                    type: "file",
                    accept: "image/*",
                    style: { display: 'none' },
                    onChange: (e) => handleImageUpload(e.target.files[0])
                }),

                image ? React.createElement("div", { className: "preview-container" },
                    React.createElement("img", { src: image, alt: "Preview", className: "preview-image" }),
                    React.createElement("div", { className: "button-group" },
                        React.createElement("button", { className: "btn-analyze", onClick: analyzeTicket, disabled: loading },
                            loading ? 'Analizando...' : '🔍 Analizar'
                        ),
                        React.createElement("button", { className: "btn-clear", onClick: clearAll }, "✕ Limpiar")
                    )
                ) : null,

                error ? React.createElement("div", { className: "error-message" }, error) : null
            ),

            React.createElement("div", { className: "results-section" },
                React.createElement("div", { className: "results-title" },
                    loading ? '⏳ Analizando...' : '📋 Datos del Taxímetro'
                ),

                loading ? React.createElement("div", { className: "loading" },
                    React.createElement("div", { className: "spinner" }),
                    React.createElement("p", null, "Gemini leyendo taxímetro...")
                ) : null,

                (!loading && results) ? React.createElement("div", { style: { flex: 1, overflow: 'auto' } },
                    React.createElement("div", { className: "data-grid" },
                        React.createElement("div", { className: "data-item" },
                            React.createElement("div", { className: "data-label" }, "Fecha"),
                            React.createElement("div", { className: "data-value" }, results.fecha || '-')
                        ),
                        React.createElement("div", { className: "data-item" },
                            React.createElement("div", { className: "data-label" }, "Carreras"),
                            React.createElement("div", { className: "data-value" }, results.carreras || '-')
                        ),
                        React.createElement("div", { className: "data-item" },
                            React.createElement("div", { className: "data-label" }, "Importe"),
                            React.createElement("div", { className: "data-value price" }, results.importe ? `${results.importe}€` : '-')
                        ),
                        React.createElement("div", { className: "data-item" },
                            React.createElement("div", { className: "data-label" }, "Kms Total"),
                            React.createElement("div", { className: "data-value" }, results.kms_total ? `${results.kms_total} km` : '-')
                        )
                    ),

                    React.createElement("div", { style: { marginTop: '25px' } },
                        React.createElement("button", {
                            className: "btn-analyze",
                            style: { background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', width: '100%' },
                            onClick: insertToSupabase,
                            disabled: loading
                        }, "💾 Insertar a BBDD (Supabase)")
                    ),

                    React.createElement("div", { className: "raw-json" },
                        React.createElement("div", { style: { marginBottom: '10px', color: '#bdc3c7' } }, "JSON RAW:"),
                        React.createElement("pre", { style: { margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' } },
                            JSON.stringify(results, null, 2)
                        )
                    )
                ) : null,

                (!loading && !results) ? React.createElement("div", { className: "empty-state" },
                    React.createElement("div", { className: "empty-icon" }, "🚖"),
                    React.createElement("p", null, "Sube un tique para ver el desglose del taxímetro aquí")
                ) : null
            )
        )
    );
}

// CÓDIGO NUEVO (Asegura que el HTML esté listo antes de renderizar React)
document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        ReactDOM.render(React.createElement(TicketAnalyzer), rootElement);
    } else {
        console.error("No se encontró el elemento #root en el DOM.");
    }
});