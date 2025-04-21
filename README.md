# FootySage ⚽️💻

FootySage es una aplicación web de análisis y simulación de partidos de fútbol en tiempo real, con visualización de eventos en el terreno de juego, predicciones mediante modelos de ML, análisis de ligas mediante gráficas por liga y comparativas y un apartado informativo de próximos partidos. Desarrollado utilizando: 
- **Backend:** Django + Django REST Framework
- **Frontend:** React
- **Base de datos:** PostgreSQL
- **Entornos separados:** Python (`venv`) y Node (`npm`)

---

## 📁 Estructura del proyecto

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

## 🛠️ Requisitos previos

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

### 🐘 Base de Datos PostgreSQL

### 2️⃣ Crear la base de datos en PostgreSQL

Abre SQL Shell (psql) o tu terminal y ejecuta:

```bash
createdb -U tu_usuario footysage_db
```

Si te ha funcionado pasa al siguiente punto. Si no te funciona ejecuta lo siguiente:

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

### 🔙 Backend (Django + DRF)

### 3️⃣ Crear entorno virtual e instalar dependencias

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1              # En Windows
# source venv/bin/activate               # En Linux/Mac

pip install -r requirements.txt
```

### 4️⃣ Configurar el archivo `.env`

Copia el archivo de ejemplo y edita los valores:

```bash
cp .env.example .env
```

Contenido del `.env.example`:

```env
DB_NAME=footysage_db
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
API_FOOTBALL_KEY=
```

Modifica `.env` con tus credenciales de PostgreSQL y de [API-Football](https://www.api-football.com/).

### 5️⃣ Carga inicial de datos

#### Carga rápida (cargar base datos inicial)

```bash
pg_restore -U tu_usuario -d footysage_db -v database/footysage_db.bak
```

#### Carga a lenta (carga manual) 
⚠️ Puede llevar mucho tiempo ⚠️

```bash
python manage.py migrate
```

```bash
python scripts/load_statsbomb_data.py
```

### 6️⃣ Levantar el servidor Django

```bash
python manage.py runserver
```

Accede a: [http://localhost:8000](http://localhost:8000)

---

### 🌐 Frontend (React)

### 7️⃣ Configurar el archivo `.env`

Copia el archivo de ejemplo y edita los valores:

```bash
cd ../frontend
cp .env.example .env
```

Contenido del `.env.example`:

```env
REACT_APP_API_BASE_URL=
```

Modifica `.env` con la ruta a la API. Tal y como esta configurado deberías de poner lo siguiente:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### 8️⃣ Instalar dependencias y levantar el frontend

```bash
npm install
npm start
```

Accede a: [http://localhost:3000](http://localhost:3000)

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Puedes ver los detalles [aquí](https://github.com/Jaime-Linares/FootySage/blob/main/LICENSE).
