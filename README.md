# FootySage ⚽️💻

FootySage es una aplicación web de análisis y simulación de partidos de fútbol en tiempo real, con visualización de eventos en el terreno de juego, predicciones mediante modelos de ML, análisis de ligas mediante gráficas por liga y comparativas y un apartado informativo de próximos partidos. Desarrollado utilizando: 
- **Backend:** Django + Django REST Framework
- **Frontend:** React
- **Base de datos:** PostgreSQL
- **Entornos separados:** Python (`venv`) y Node (`npm`)

---

## 📁 Estructura del Proyecto

```
FootySage/
├── backend/           # Backend con Django + DRF
│   ├── venv/          # Entorno virtual Python
│   ├── backend/
│   └── manage.py
├── frontend/          # Frontend con React
└── .gitignore
```

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- [Python 3.8+](https://www.python.org/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/) (incluyendo SQL Shell o pgAdmin)
- [Node.js + npm](https://nodejs.org/)

---

## 🚀 Instrucciones para levantar el proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Jaime-Linares/FootySage.git
cd FootySage
```

---

### 🐘 2️⃣ Crear la base de datos en PostgreSQL

Abre SQL Shell (psql) o tu terminal y ejecuta:

```bash
psql -U tu_usuario -d tu_usuario
```

Una vez dentro del prompt `postgres=#`, ejecuta:

```sql
CREATE DATABASE footysage_db;
```

Para salir de la consola:

```sql
\q
```

---

## 🔙 Backend (Django + DRF)

### 3️⃣ Crear entorno virtual e instalar dependencias

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1              # En Windows
# source venv/bin/activate               # En Linux/Mac

pip install -r requirements.txt
```

### 4️⃣ Configurar la base de datos en `backend/settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'footysage_db',
        'USER': 'tu_usuario',
        'PASSWORD': 'tu_contraseña',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 5️⃣ Ejecutar migraciones

```bash
python manage.py migrate
```

### 6️⃣ Levantar el servidor Django

```bash
python manage.py runserver
```

Accede a: [http://localhost:8000](http://localhost:8000)

---

## 🌐 Frontend (React)

### 7️⃣ Instalar dependencias y levantar el frontend

```bash
cd ../frontend
npm install
npm start
```

Accede a: [http://localhost:3000](http://localhost:3000)

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Puedes ver los detalles [aquí](https://github.com/Jaime-Linares/FootySage/blob/main/LICENSE).
