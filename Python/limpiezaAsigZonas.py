import pandas as pd

def asignar_zona_madrid(direccion):
    if pd.isna(direccion):
        return "ZONA DESCONOCIDA"
    
    # Limpiamos el texto, pasamos a mayúsculas y quitamos caracteres rotos comunes
    dir_clean = str(direccion).upper().replace('', 'O') # Corrección rápida de encoding
    
    # Lógica de reglas de negocio para agrupar por palabras clave
    if "CHAMARTIN" in dir_clean or "PRINCIPE DE VERGARA" in dir_clean:
        return "ZONA CHAMARTIN"
    elif "GREGORIO MARANON" in dir_clean or "RETIRO" in dir_clean:
        return "ZONA RETIRO"
    elif "GARCETA" in dir_clean or "MARQUES DE VADILLO" in dir_clean:
        return "ZONA MARQUES DE VADILLO"
    elif "VELAZQUEZ" in dir_clean or "ORTEGA Y GASSET" in dir_clean:
        return "ZONA VELAQUEZ"
    elif "ALCOBENDAS" in dir_clean or "BRUSELAS" in dir_clean:
        return "ZONA ALCOBENDAS"
    elif "BRAVO" in dir_clean or "ALCALA" in dir_clean or "SALAMANCA" in dir_clean:
        return "ZONA SALAMANCA"
    elif "COMUNICACION" in dir_clean or "LAS TABLAS" in dir_clean:
        return "ZONA LAS TABLAS"
    elif "LOPEZ DE HOYOS" in dir_clean:
        return "ZONA GTA. LOPEZ DE HOYOS"
    
    return "ZONA OTRAS"

# --- APLICACIÓN EN TU PIPELINE DE PANDAS ---
# Cuando proceses tu dataframe en Python, antes de subirlo a Supabase, creas la columna limpia:
# df['ORIGEN_ZONA'] = df['ORIGEN'].apply(asignar_zona_madrid)