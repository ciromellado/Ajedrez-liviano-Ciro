# ♟️ Ajedrez Liviano

**Una aplicación de ajedrez ultra-liviana, instalable y 100% offline con inteligencia artificial programada desde cero.**

👉 **[Jugar Ahora](https://ajedrez-liviano-ciro.vercel.app)** 👈

---

## 🌟 Características Principales

### ⚡ Rendimiento Excepcional
- **Peso mínimo**: Menos de **300 KB** (400x más liviana que apps comerciales)
- **100% Offline**: Funciona sin conexión a internet
- **PWA Instalable**: Instálala en tu celular como una app nativa
- **Optimizada para móviles antiguos**: Rendimiento fluido incluso en dispositivos con recursos limitados

### 🤖 Inteligencia Artificial Avanzada
- **Motor propio programado desde cero** en JavaScript puro
- **4 niveles de dificultad**:
  - 🟢 Principiante (~600 ELO)
  -  Intermedio (~1200 ELO)
  - 🟠 Avanzado (~1300 ELO)
  - 🔴 Experto (~1500 ELO)
- **Libro de aperturas**: +50 posiciones conocidas (responde al instante en las primeras 12 jugadas)
- **Algoritmo Minimax** con poda Alfa-Beta
- **Búsqueda de Quiescencia** para evitar errores tácticos

### 🎮 Experiencia de Juego
- **Juega con Blancas, Negras o Aleatorio**
- **Tablero dinámico**: Se gira automáticamente según tu color
- **Historial de partidas** en notación algebraica
- **Efectos de sonido** generados por Web Audio API
- **Coronación automática** de peones como dama
- **Interfaz minimalista** y fácil de usar

---

##  Cómo Usar

### Instalación en el Celular

**Android (Chrome):**
1. Abre [ajedrez-liviano-ciro.vercel.app](https://ajedrez-liviano-ciro.vercel.app) en Chrome
2. Toca los 3 puntitos (menú)
3. Selecciona **"Instalar aplicación"** o **"Añadir a pantalla de inicio"**
4. ¡Listo! Aparecerá el icono en tu menú de apps

**iPhone (Safari):**
1. Abre el link en Safari
2. Toca el botón **Compartir** (cuadrado con flecha)
3. Selecciona **"Añadir a la pantalla de inicio"**
4. ¡Listo!

### Jugar Offline
Una vez instalada, la app funciona **completamente sin internet**. Perfecta para:
- ✈️ Viajes en avión
- 🏕️ Zonas sin señal
- 🚇 Metro/subterráneo
- 💰 Ahorrar datos móviles

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **Vanilla JavaScript** | Lógica del juego y motor de IA |
| **Vite** | Build tool y desarrollo |
| **chess.js** | Validación de movimientos y reglas del ajedrez |
| **Web Workers** | Ejecución de la IA sin bloquear la interfaz |
| **Web Audio API** | Generación de sonidos sin archivos externos |
| **Service Worker** | Funcionamiento offline (PWA) |
| **CSS Grid** | Renderizado del tablero |

---
