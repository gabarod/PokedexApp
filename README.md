# 🎮 PokedexApp - Aplicación de Pokémon

Una aplicación web completa desarrollada en Angular 17+ que simula una Pokédex interactiva con funcionalidades avanzadas de gestión de equipos, batallas y análisis de Pokémon.

## 🌐 **Aplicación en Vivo**

**🔗 [Acceder a la Aplicación](https://gabarod.github.io/PokedexApp/login)**

*Usa las credenciales de demo: `test@pokemon.com` con cualquier contraseña*

## 🚀 Características Principales

### 📱 **Pokédex Completa**
- **+1000 Pokémon** de todas las generaciones (1-9)
- **Filtros avanzados** por tipo, generación y nombre
- **Búsqueda en tiempo real** con autocompletado
- **Vista detallada** de estadísticas, habilidades y evoluciones
- **Comparación lado a lado** entre Pokémon

### ⚔️ **Simulador de Batallas**
- **Sistema de combate realista** con cálculos de daño precisos
- **Efectividad de tipos** (super efectivo, no muy efectivo, inmune)
- **Ataques críticos** y variaciones de daño
- **Animaciones fluidas** y efectos visuales
- **Música de batalla** y efectos de sonido

### 👥 **Gestión de Equipos**
- **Crear y gestionar equipos** de hasta 6 Pokémon
- **Análisis de cobertura de tipos** para estrategias
- **Estadísticas detalladas** de cada equipo
- **Exportar/importar equipos** en formato JSON
- **Historial de equipos** y favoritos

### 📊 **Análisis y Estadísticas**
- **Gráficos interactivos** de estadísticas de Pokémon
- **Análisis de fortalezas y debilidades** por tipo
- **Comparación de generaciones** y tendencias
- **Dashboard personalizado** con métricas clave

### 🌍 **Internacionalización**
- **Soporte multiidioma**: Español, Inglés y Portugués
- **Interfaz completamente traducida**
- **Cambio de idioma en tiempo real**

### 🔐 **Sistema de Usuario**
- **Registro y autenticación** de usuarios
- **Perfil personalizable** con estadísticas
- **Sistema de roles** y permisos
- **Almacenamiento local** seguro

### 🔑 **Credenciales de Acceso**
- **Usuario por defecto**: `test@pokemon.com`
- **Contraseña**: Cualquier contraseña (sistema de demo)
- **Nota**: Este es un sistema de demostración, cualquier contraseña será aceptada

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 17+ con Standalone Components
- **Styling**: SCSS con diseño responsive
- **Estado**: RxJS para manejo de estado reactivo
- **Gráficos**: Chart.js para visualizaciones
- **Iconos**: Font Awesome
- **Animaciones**: CSS3 y Angular Animations
- **Almacenamiento**: LocalStorage para persistencia
- **Internacionalización**: Angular i18n

## 📋 Requisitos del Sistema

- **Node.js** 18+ 
- **npm** 9+
- **Angular CLI** 17+

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone https://github.com/gabarod/PokedexApp.git
cd PokedexApp/pokemon-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Levantar la Aplicación
```bash
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

### 4. Compilar para Producción
```bash
ng build --configuration production
```

## 🎯 Funcionalidades Desarrolladas

### **Sistema de Pokédex**
- Sistema completo de búsqueda y filtrado de Pokémon
- Algoritmos de búsqueda eficientes con debounce
- Sistema de caché para optimizar el rendimiento
- Paginación virtual para manejar grandes datasets

### **Simulador de Batallas**
- Fórmulas de daño balanceadas basadas en las mecánicas oficiales
- Sistema de efectividad de tipos con multiplicadores precisos
- Sistema de ataques críticos y variaciones de daño
- Interfaz de batalla con animaciones fluidas

### **Gestión de Equipos**
- Sistema de creación y edición de equipos
- Análisis de cobertura de tipos para estrategias
- Sistema de validación de equipos competitivos
- Exportación/importación de equipos

### **Sistema de Usuario**
- Autenticación segura con JWT
- Sistema de roles y permisos
- Perfil de usuario con estadísticas personalizadas
- Sistema de notificaciones

### **Internacionalización**
- Sistema completo de traducciones
- Cambio de idioma dinámico
- Archivos de traducción para ES/EN/PT
- Formateo de fechas y números por región

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── battle-simulator-modal/
│   │   ├── add-pokemon-modal/
│   │   └── user-profile-modal/
│   ├── pages/              # Páginas principales
│   │   ├── pokedex/
│   │   ├── teams/
│   │   └── team-detail/
│   ├── services/           # Servicios de lógica de negocio
│   │   ├── pokemon.service.ts
│   │   ├── auth.service.ts
│   │   └── translation.service.ts
│   ├── pipes/              # Pipes personalizados
│   └── interceptors/       # Interceptores HTTP
├── assets/                 # Recursos estáticos
│   ├── i18n/              # Archivos de traducción
│   └── images/            # Imágenes de Pokémon
└── environments/          # Configuraciones de entorno
```

## 🎨 Características de Diseño

- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **Tema Oscuro/Claro**: Interfaz adaptable a preferencias del usuario
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **UX Intuitiva**: Navegación clara y accesible
- **Accesibilidad**: Cumple estándares WCAG 2.1

## 🔧 Scripts Disponibles

```bash
# Desarrollo
ng serve                    # Servidor de desarrollo
ng serve --port 5000       # Puerto personalizado

# Construcción
ng build                   # Build de desarrollo
ng build --prod           # Build de producción

# Testing
ng test                   # Ejecutar tests unitarios
ng e2e                    # Ejecutar tests e2e

# Linting
ng lint                   # Verificar código
```

## 📱 Capturas de Pantalla

### Pokédex Principal
- Vista de lista con filtros avanzados
- Búsqueda en tiempo real
- Información detallada de cada Pokémon

### Simulador de Batallas
- Interfaz de combate interactiva
- Cálculos de daño en tiempo real
- Efectos visuales y animaciones

### Gestión de Equipos
- Creación y edición de equipos
- Análisis de cobertura de tipos
- Estadísticas detalladas

## 🤝 Contribuciones

Este proyecto fue desarrollado como una demostración de habilidades en:
- **Angular 17+** con arquitectura moderna
- **TypeScript** avanzado
- **SCSS** y diseño responsive
- **RxJS** para programación reactiva
- **Arquitectura de software** escalable

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Gabriel Rodriguez**
- Email: rodriguezpgabriel@gmail.com
- GitHub: [@gabarod](https://github.com/gabarod)

---

