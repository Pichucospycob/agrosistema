# Guía de Sincronización con GitHub

Para subir tu proyecto Agrosistema a GitHub y tener copias de seguridad en la nube, sigue estos pasos:

## 1. Crear el Repositorio en GitHub
1. Abre tu navegador y ve a [github.com/new](https://github.com/new).
2. Ponle un nombre al repositorio (ej: `agrosistema`).
3. Elige si quieres que sea **Public** o **Private**.
4. **IMPORTANTE**: No marques las opciones de "Initialize with README", "license" o ".gitignore" (ya que tu proyecto ya tiene estos archivos).
5. Haz clic en **Create repository**.

## 2. Vincular tu Carpeta Local
Una vez creado, verás una página con instrucciones. Los comandos que debes ejecutar en la terminal de este editor (PowerShell) son:

```powershell
# 1. Inicializar el repositorio local
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "Primer commit: Estructura Agrosistema"

# 4. Cambiar el nombre de la rama principal a 'main'
git branch -M main

# 5. Conectar con el servidor de GitHub (Copia el link exacto de tu GitHub)
git remote add origin https://github.com/TU_USUARIO/agrosistema.git

# 6. Subir por primera vez
git push -u origin main
```

## 3. Notas Importantes
- **Autenticación**: La primera vez que hagas `git push`, Windows te pedirá que inicies sesión en GitHub (se abrirá una ventana en el navegador).
- **Copias Diarias**: En el futuro, cuando quieras guardar cambios, solo haz:
  ```powershell
  git add .
  git commit -m "Descripción de lo que cambiaste"
  git push
  ```

> [!TIP]
> Si tienes dudas con el paso 5, copia aquí el link que te de GitHub y yo te preparo el comando exacto.
