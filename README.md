# Sistema de Inventario

Este es un proyecto de ejemplo para gestionar un inventario simple de productos. La aplicación permite agregar, editar y visualizar productos a través de una interfaz web básica.

---

## Cómo Ejecutar Localmente

Para poner en marcha este proyecto en tu propia máquina, sigue estos pasos:

1.  **Clona el repositorio:**
    *Reemplaza la URL por la de tu propio repositorio de GitHub.*
    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd inventory
    ```

2.  **Crea un entorno virtual (Recomendado):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # En Windows usa: `venv\Scripts\activate`
    ```

3.  **Instala las dependencias:**
    *El archivo `requirements.txt` contiene todas las librerías necesarias.*
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configura la Base de Datos:**
    *Esta aplicación está configurada para usar PostgreSQL. Asegúrate de tener un servidor de PostgreSQL en ejecución y actualiza la cadena de conexión en el archivo `application.py` con tus credenciales.*

5.  **Ejecuta la aplicación:**
    *La aplicación está configurada para ejecutarse en el puerto 80. En sistemas como Linux o macOS, necesitarás privilegios de administrador para usar este puerto.*
    ```bash
    sudo python3 application.py
    ```
    Una vez ejecutado, podrás acceder a la aplicación abriendo `http://127.0.0.1:80` en tu navegador.

---

## 🛠️ Tecnologías Utilizadas

* **Backend:** Python
* **Framework:** Flask
* **Base de Datos:** PostgreSQL
* **ORM:** Flask-SQLAlchemy
