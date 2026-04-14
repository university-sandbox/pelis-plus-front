# Documento base de flujos y funcionalidades — Plataforma de Cine, Membresías y Snacks

## 1. Objetivo del documento

Este documento define los **flujos funcionales**, **módulos**, **funcionalidades imprescindibles**, **mejoras recomendadas** y **puntos críticos de UI/UX** para iniciar el desarrollo de una plataforma web de cine con:

- autenticación de usuarios
- cartelera y reserva de entradas
- selección de asientos
- tienda de snacks y combos
- programa de membresías
- checkout y pagos
- perfil de usuario
- emisión de ticket digital

La prioridad de este documento es que los **flujos sean claros** para traducirlos luego a:
- frontend
- backend
- base de datos
- endpoints
- historias de usuario
- roadmap técnico

---

## 2. Alcance del producto

La plataforma debe permitir que un usuario pueda:

1. registrarse o iniciar sesión
2. explorar la cartelera
3. ver detalles de películas
4. elegir función, formato y asientos
5. agregar snacks al carrito
6. pagar entradas, snacks o membresías
7. recibir un ticket digital
8. administrar su cuenta y beneficios de socio

---

## 3. Módulos principales del sistema

### 3.1. Autenticación y usuarios
Maneja el acceso, registro, sesiones y recuperación de cuenta.

### 3.2. Cartelera y detalle de películas
Permite explorar películas, horarios, formatos y trailers.

### 3.3. Reserva de entradas y selección de asientos
Permite elegir función, cantidad y asientos.

### 3.4. Tienda de snacks y combos
Permite agregar productos al carrito y complementar la compra.

### 3.5. Membresías
Permite suscribirse a planes y aplicar beneficios.

### 3.6. Checkout y pasarela de pagos
Centraliza el resumen de compra y el pago por QR o tarjeta.

### 3.7. Perfil del usuario
Permite ver historial, tickets, beneficios, membresía y datos personales.

### 3.8. Notificaciones y tickets
Emite confirmaciones por pantalla, correo y ticket digital con QR.

---

## 4. Principios de diseño funcional

Antes de entrar a cada flujo, el producto debe cumplir estas reglas base:

- el usuario debe poder comprar con la menor fricción posible
- el estado de cada acción debe ser visible
- el carrito debe mantenerse mientras navega
- el sistema debe permitir compra individual o compra combinada
- los beneficios de membresía deben aplicarse automáticamente
- el checkout debe ser único y claro
- el ticket final debe servir como comprobante y como acceso

---

## 5. Flujo 1 — Registro, login y acceso

## 5.1. Objetivo
Permitir que un usuario cree una cuenta, acceda a la plataforma y recupere su acceso si lo pierde.

## 5.2. Flujo principal
**Landing / Home -> Registro -> Confirmación -> Login -> Acceso a la plataforma**

## 5.3. Subflujos

### A. Registro
1. El usuario entra a la opción “Registrarse”.
2. Completa:
   - nombre
   - apellidos o nombre completo
   - correo
   - contraseña
   - confirmar contraseña
3. El sistema valida:
   - formato de correo
   - longitud mínima de contraseña
   - coincidencia de contraseña
   - correo no duplicado
4. Si todo es correcto:
   - se crea la cuenta
   - se muestra confirmación
   - se redirige al login o se inicia sesión automáticamente

### B. Login
1. El usuario entra a “Iniciar sesión”.
2. Ingresa correo y contraseña.
3. El sistema valida credenciales.
4. Si son correctas:
   - crea sesión
   - redirige al home autenticado o dashboard

### C. Recuperación de contraseña
1. El usuario selecciona “¿Olvidaste tu contraseña?”
2. Ingresa correo.
3. El sistema envía enlace o código de recuperación.
4. El usuario crea nueva contraseña.
5. El sistema confirma cambio y redirige al login.

### D. Social login
1. El usuario elige “Continuar con Google”.
2. Autoriza la cuenta.
3. El sistema crea o vincula la cuenta automáticamente.
4. Se inicia sesión sin formulario manual.

## 5.4. Funcionalidades imprescindibles
- registro de usuario
- login con email y contraseña
- cierre de sesión
- recuperación de contraseña
- validaciones de formulario
- mensajes de error y éxito
- sesión persistente
- protección de rutas autenticadas

## 5.5. Mejoras recomendadas
- social login con Google
- validación en tiempo real
- indicador de fortaleza de contraseña
- autologin tras registrarse
- verificación de correo
- reCAPTCHA o protección anti spam

## 5.6. Puntos críticos de UX
- no hacer formularios largos
- mostrar errores debajo de cada campo
- no borrar los campos si falla el envío
- usar CTA claros: “Crear cuenta”, “Ingresar”
- ofrecer acceso rápido con Google para reducir abandono

---

## 6. Flujo 2 — Explorar cartelera

## 6.1. Objetivo
Permitir que el usuario descubra películas y entre al detalle de la función que quiere comprar.

## 6.2. Flujo principal
**Home -> Cartelera -> Explorar películas -> Ver detalle -> Elegir función**

## 6.3. Subflujos

### A. Vista de cartelera
1. El usuario entra a “Cartelera”.
2. Ve tarjetas de películas con:
   - póster
   - título
   - género
   - duración
   - clasificación
   - breve sinopsis
   - estado: estreno, popular, etc.

### B. Hover o preview rápido
1. El usuario pasa el mouse o toca una tarjeta.
2. Se muestran detalles rápidos:
   - sinopsis breve
   - trailer o teaser
   - botón “Ver más”
   - botón “Comprar”

### C. Página de detalle
1. El usuario entra a una película.
2. Ve:
   - portada
   - sinopsis completa
   - trailer
   - duración
   - género
   - clasificación
   - idiomas
   - formatos disponibles
   - horarios
   - sedes o salas

## 6.4. Funcionalidades imprescindibles
- listado de películas
- tarjetas con información resumida
- pantalla de detalle de película
- horarios disponibles
- botón de compra o reserva
- distinción entre películas activas e inactivas

## 6.5. Mejoras recomendadas
- buscador por nombre
- filtros por género
- filtros por formato: 2D, 3D, XD
- filtros por horario
- filtros por sede
- sección de recomendadas
- integración rápida de trailer
- etiquetas visuales: estreno, infantil, subtitulada, doblada

## 6.6. Puntos críticos de UX
- no ocultar información importante solo en hover si el producto debe funcionar bien en móvil
- el CTA de compra debe verse siempre
- los filtros deben poder quitarse rápido
- mostrar primero lo más importante: horario, formato y disponibilidad

---

## 7. Flujo 3 — Selección de función y reserva de entradas

## 7.1. Objetivo
Permitir que el usuario elija una función específica antes de seleccionar asientos.

## 7.2. Flujo principal
**Detalle de película -> Elegir sede -> Elegir fecha -> Elegir horario -> Elegir formato -> Continuar**

## 7.3. Subflujos

### A. Selección de función
1. El usuario selecciona:
   - cine o sede
   - fecha
   - horario
   - formato
2. El sistema muestra disponibilidad.
3. El usuario continúa al mapa de asientos.

### B. Lógica de disponibilidad
1. El sistema verifica que la función siga abierta.
2. Si ya no hay cupo:
   - se bloquea la compra
   - se sugiere otro horario

## 7.4. Funcionalidades imprescindibles
- selector de sede
- selector de fecha
- selector de horario
- selector de formato
- control de disponibilidad
- validación de función activa

## 7.5. Mejoras recomendadas
- mostrar precio antes de pasar a asientos
- mostrar aforo restante
- mostrar promociones disponibles por esa función
- sugerir horarios cercanos cuando uno se agota

## 7.6. Puntos críticos de UX
- la selección debe ser paso a paso
- no mezclar demasiadas decisiones en una sola pantalla
- destacar la función elegida con un resumen fijo superior o lateral

---

## 8. Flujo 4 — Selección de asientos

## 8.1. Objetivo
Permitir elegir asientos disponibles de forma simple y visual.

## 8.2. Flujo principal
**Función seleccionada -> Mapa de asientos -> Selección -> Confirmación -> Agregar al carrito**

## 8.3. Subflujos

### A. Selección de asientos
1. El usuario ve el mapa.
2. Existe una leyenda clara:
   - disponible
   - ocupado
   - seleccionado
   - preferencial o especial si aplica
3. El usuario selecciona la cantidad de asientos permitida.
4. El sistema actualiza subtotal en tiempo real.

### B. Restricciones
1. Si supera el máximo permitido:
   - el sistema bloquea nuevas selecciones
2. Si otro usuario toma el asiento:
   - se invalida el asiento y se pide nueva selección

### C. Confirmación
1. El usuario confirma asientos.
2. Los asientos se agregan al carrito o resumen temporal.

## 8.4. Funcionalidades imprescindibles
- mapa de asientos interactivo
- leyenda visual
- bloqueo de asientos ocupados
- límite de entradas por compra
- actualización de precio en tiempo real
- reserva temporal de asientos por tiempo limitado

## 8.5. Mejoras recomendadas
- mostrar recomendación automática de asientos
- accesibilidad para sillas de ruedas
- temporizador de reserva
- selección múltiple asistida
- confirmación visual fuerte al elegir

## 8.6. Puntos críticos de UX
- los colores deben ser muy claros y accesibles
- no depender solo del color; usar iconos o patrones
- el usuario debe ver el resumen sin salir de la pantalla
- en móvil, el mapa debe poder hacer zoom

---

## 9. Flujo 5 — Snacks y combos

## 9.1. Objetivo
Permitir la compra de alimentos y bebidas como parte de la misma transacción.

## 9.2. Flujo principal
**Snacks -> Categorías -> Seleccionar producto -> Personalizar -> Agregar al carrito**

## 9.3. Subflujos

### A. Catálogo
1. El usuario entra a la tienda de snacks.
2. Ve categorías:
   - canchitas
   - bebidas
   - combos
   - dulces
   - extras

### B. Selección de producto
1. El usuario ve imagen, nombre, tamaño y precio.
2. Selecciona “Agregar”.
3. Si el producto requiere personalización:
   - tipo de canchita
   - tamaño
   - sabor
   - extras

### C. Carrito
1. El producto se agrega al carrito.
2. El sistema actualiza total acumulado.

## 9.4. Funcionalidades imprescindibles
- catálogo por categorías
- tarjetas de producto
- agregar al carrito
- editar cantidad
- eliminar producto
- total persistente
- resumen del carrito

## 9.5. Mejoras recomendadas
- upselling
- cross-selling
- combos sugeridos
- productos destacados
- personalización antes de agregar
- combo automático según película o cantidad de entradas

## 9.6. Ejemplos de mejoras
- “Agrega una bebida por S/ 5 más”
- “Tu combo ideal para 2 personas”
- “El snack más comprado con esta película”

## 9.7. Puntos críticos de UX
- el botón agregar debe ser rápido
- el carrito no debe interrumpir demasiado
- usar mini carrito visible
- mostrar claramente cantidades y subtotal

---

## 10. Flujo 6 — Membresías

## 10.1. Objetivo
Permitir al usuario suscribirse a un plan de beneficios.

## 10.2. Flujo principal
**Landing de membresías -> Comparación de planes -> Selección -> Pago -> Activación**

## 10.3. Subflujos

### A. Visualización de planes
1. El usuario entra a “Socio” o “Membresías”.
2. Ve planes disponibles:
   - Plata
   - Oro
   - Black
3. Ve beneficios comparados:
   - entradas gratis
   - descuentos
   - snacks incluidos
   - acceso anticipado
   - beneficios exclusivos

### B. Selección y compra
1. El usuario selecciona un plan.
2. El sistema muestra:
   - precio
   - vigencia
   - beneficios
   - condiciones
3. El usuario procede al pago.
4. El plan se activa al confirmarse la transacción.

### C. Gestión posterior
1. El usuario puede ver su plan activo.
2. Puede ver beneficios disponibles y usados.
3. Puede renovar, mejorar o cancelar.

## 10.4. Funcionalidades imprescindibles
- pantalla comparativa de planes
- compra de membresía
- aplicación de beneficios
- visualización de estado de suscripción
- registro de beneficios usados
- historial de pagos

## 10.5. Mejoras recomendadas
- destacar plan recomendado
- renovación automática
- upgrade y downgrade
- dashboard de beneficios
- recordatorios de vencimiento
- beneficios mensuales visibles

## 10.6. Puntos críticos de UX
- la comparación debe ser muy clara
- mostrar ahorro estimado por plan
- indicar si el usuario ya tiene un plan
- no esconder condiciones importantes

---

## 11. Flujo 7 — Carrito unificado

## 11.1. Objetivo
Centralizar entradas, snacks y membresías en un resumen claro antes del pago.

## 11.2. Flujo principal
**Entradas y/o snacks y/o membresía -> Carrito -> Revisión -> Checkout**

## 11.3. Estructura del carrito
El carrito debe permitir:

- ver entradas seleccionadas
- ver asientos
- ver función y horario
- ver snacks
- ver membresía si aplica
- editar o eliminar ítems
- ver subtotal por categoría
- ver descuentos aplicados
- ver total final

## 11.4. Funcionalidades imprescindibles
- persistencia del carrito
- edición de cantidades
- eliminación de productos
- actualización en tiempo real
- aplicación de beneficios
- validación antes del pago

## 11.5. Mejoras recomendadas
- carrito lateral
- guardado temporal
- alertas de cambios de precio o disponibilidad
- resumen fijo en desktop y mobile

## 11.6. Puntos críticos de UX
- el usuario debe entender exactamente qué está comprando
- no debe haber cargos sorpresa
- todo descuento debe explicarse claramente

---

## 12. Flujo 8 — Checkout y pagos

## 12.1. Objetivo
Permitir pagar la compra de forma segura y con claridad.

## 12.2. Flujo principal
**Carrito -> Selección de método de pago -> Confirmación -> Procesamiento -> Resultado**

## 12.3. Métodos de pago esperados
- Yape
- Plin
- tarjeta de débito/crédito
- otros medios locales si se integran después

## 12.4. Subflujos

### A. Pago por QR
1. El usuario selecciona Yape o Plin.
2. El sistema genera QR o instrucción de pago.
3. El usuario escanea.
4. El sistema espera confirmación.
5. Si el pago es exitoso:
   - confirma la compra
   - emite ticket
6. Si falla:
   - permite reintentar o cambiar método

### B. Pago con tarjeta
1. El usuario ingresa:
   - nombre del titular
   - número de tarjeta
   - vencimiento
   - CVV
2. El sistema valida formato.
3. Se procesa el pago.
4. Si es exitoso:
   - se confirma compra
   - se emite ticket

## 12.5. Funcionalidades imprescindibles
- selección de método de pago
- integración con QR
- formulario de tarjeta
- validaciones de campos
- estado de transacción
- reintento de pago
- confirmación de pago
- registro de operación

## 12.6. Mejoras recomendadas
- estado de pago en tiempo real
- webhooks de confirmación
- ticket al correo
- descarga de comprobante
- guardar método de pago
- renovación automática de membresía

## 12.7. Puntos críticos de UX
- nunca dejar al usuario sin saber si pagó o no
- mostrar estados claros:
  - pendiente
  - procesando
  - exitoso
  - rechazado
- usar mensajes simples y confiables
- permitir volver al carrito sin perder todo

---

## 13. Flujo 9 — Ticket digital y confirmación

## 13.1. Objetivo
Entregar al usuario un comprobante funcional de su compra.

## 13.2. Flujo principal
**Pago exitoso -> Pantalla de confirmación -> Ticket digital -> Envío por correo**

## 13.3. Contenido del ticket
- nombre del usuario
- código QR
- código de reserva o compra
- película
- sede
- sala
- fecha y hora
- asientos
- snacks comprados
- total pagado
- estado de pago

## 13.4. Funcionalidades imprescindibles
- pantalla final de confirmación
- ticket digital visible
- QR descargable
- envío por correo
- acceso posterior desde el perfil

## 13.5. Mejoras recomendadas
- agregar a wallet
- reenviar ticket
- compartir ticket
- historial de tickets

## 13.6. Puntos críticos de UX
- el usuario debe sentir certeza de que la compra quedó hecha
- el ticket debe verse limpio y fácil de entender
- el QR debe tener un buen tamaño y contraste

---

## 14. Flujo 10 — Perfil del usuario

## 14.1. Objetivo
Dar al usuario control sobre su cuenta, compras y beneficios.

## 14.2. Secciones del perfil
- datos personales
- seguridad
- membresía activa
- beneficios disponibles
- historial de compras
- tickets
- medios de pago guardados
- preferencias de comunicación

## 14.3. Funcionalidades imprescindibles
- editar perfil
- cambiar contraseña
- ver historial
- ver membresía
- ver tickets
- cerrar sesión

## 14.4. Mejoras recomendadas
- dashboard de socio
- beneficios restantes del mes
- recomendaciones personalizadas
- favoritos o wishlist
- historial con filtros

## 14.5. Puntos críticos de UX
- usar navegación lateral o tabs
- separar compras, beneficios y configuración
- hacer visible la información más consultada

---

## 15. Reglas de negocio clave

Estas reglas son importantes desde el inicio del desarrollo.

### 15.1. Sobre entradas
- no vender asientos ocupados
- limitar número máximo por compra
- bloquear asientos temporalmente durante checkout
- liberar asientos si no se completa el pago

### 15.2. Sobre snacks
- permitir modificar cantidad
- validar stock si corresponde
- mantener el carrito persistente

### 15.3. Sobre membresías
- aplicar beneficios según plan activo
- impedir canjes si el usuario ya agotó su beneficio
- registrar cada beneficio consumido
- permitir vigencias y renovaciones

### 15.4. Sobre pagos
- toda compra debe quedar con estado
- no emitir ticket sin confirmación de pago
- registrar intentos fallidos
- permitir reintento sin duplicar orden

### 15.5. Sobre tickets
- el ticket debe ser único
- debe poder reconsultarse desde el perfil
- debe poder validarse en acceso o boletería

---

## 16. Estados importantes del sistema

Para desarrollo, conviene definir estados desde el principio.

### 16.1. Usuario
- invitado
- registrado
- autenticado
- suspendido si aplica

### 16.2. Función
- disponible
- casi llena
- agotada
- no disponible

### 16.3. Asiento
- libre
- ocupado
- reservado temporalmente
- seleccionado

### 16.4. Carrito
- vacío
- activo
- expirado

### 16.5. Pago
- pendiente
- procesando
- aprobado
- rechazado
- expirado
- cancelado

### 16.6. Membresía
- inactiva
- activa
- vencida
- en renovación
- cancelada

---

## 17. Estructura sugerida de pantallas

## Públicas
- Home
- Cartelera
- Detalle de película
- Snacks
- Membresías
- Login
- Registro
- Recuperar contraseña

## Privadas
- Perfil
- Mis tickets
- Mis compras
- Mi membresía
- Checkout
- Confirmación

---

## 18. Priorización por fases de desarrollo

## Fase 1 — MVP
Lanzar lo mínimo que permita operar.

- registro y login
- cartelera
- detalle de película
- selección de función
- selección de asientos
- carrito básico
- checkout
- pago básico
- ticket digital
- perfil simple

## Fase 2 — Monetización y fidelización
- snacks y combos
- membresías
- beneficios automáticos
- historial completo
- correo de confirmación
- filtros de cartelera

## Fase 3 — Optimización
- social login
- upselling de snacks
- renovación automática
- recomendaciones
- favoritos
- analítica
- promociones inteligentes

---

## 19. Tips UI/UX prioritarios

Estos no son el foco principal del documento, pero sí afectan mucho la implementación.

### 19.1. Reducir fricción
- menos pasos
- menos campos
- CTAs claros
- autocompletado cuando sea posible

### 19.2. Mantener contexto
- siempre mostrar qué película o compra está haciendo el usuario
- usar breadcrumb o resumen fijo

### 19.3. Feedback constante
- loaders
- estados
- mensajes claros
- confirmaciones visibles

### 19.4. Pensar en mobile desde el inicio
- mapa de asientos usable
- botones grandes
- checkout simple
- QR legible

### 19.5. No depender solo de hover
- en móvil no existe hover real
- usar cards expandibles o botones “Ver más”

### 19.6. Diseño visual recomendado
- usar jerarquía clara
- priorizar horario, precio y CTA
- mantener consistencia entre cartelera, snacks y membresías

---

## 20. Lista consolidada de funcionalidades

## 20.1. Autenticación
- registro
- login
- logout
- recuperar contraseña
- social login
- validaciones
- sesión persistente

## 20.2. Películas
- ver cartelera
- ver detalle
- ver trailer
- ver horarios
- filtrar
- buscar

## 20.3. Entradas
- elegir sede
- elegir formato
- elegir horario
- elegir asientos
- limitar cantidad
- reservar temporalmente

## 20.4. Snacks
- ver categorías
- agregar al carrito
- personalizar
- editar cantidades
- upselling

## 20.5. Membresías
- comparar planes
- comprar plan
- ver beneficios
- activar beneficios
- renovar
- ver historial

## 20.6. Checkout y pagos
- carrito unificado
- seleccionar medio de pago
- pagar con QR
- pagar con tarjeta
- confirmar transacción
- reintentar pago

## 20.7. Tickets y perfil
- emitir ticket digital
- ver QR
- descargar ticket
- enviar por correo
- ver historial
- gestionar cuenta

---

## 21. Dependencias técnicas que conviene considerar desde ya

Aunque este documento es funcional, estas dependencias afectan los flujos.

- sistema de autenticación
- pasarela de pagos
- servicio de correo
- motor de QR
- gestión de sesiones
- base de datos para usuarios, funciones, asientos, pedidos y membresías
- control de concurrencia para asientos
- almacenamiento de tickets y órdenes

---

## 22. Recomendación final de enfoque

Para comenzar el desarrollo sin trabarse, conviene trabajar en este orden:

1. autenticación
2. cartelera
3. detalle de película
4. función y asientos
5. carrito
6. checkout y pago
7. ticket digital
8. perfil
9. snacks
10. membresías

Ese orden permite sacar primero el flujo principal de negocio:
**usuario -> elige película -> reserva -> paga -> recibe ticket**

Luego se agregan las capas de monetización y fidelización:
**snacks + membresías**

---

## 23. Resultado esperado del producto

Si todos estos flujos se implementan correctamente, la plataforma debería permitir:

- comprar entradas de manera simple
- complementar la compra con snacks
- pagar por medios locales
- fidelizar mediante membresías
- dar confianza con tickets claros y perfil consultable

---

## 24. Rol de administrador — MVP

El administrador es un usuario interno con acceso a un panel privado para operar la plataforma. En el MVP se limita a lo estrictamente necesario para que el negocio funcione.

---

### 24.1. Principios del panel de admin

- acceso exclusivo por rol; no comparte rutas con el usuario normal
- interfaz funcional y sin adornos, prioriza velocidad de operación
- cada acción debe tener confirmación antes de aplicarse
- no requiere diseño elaborado en fase MVP; tablas y formularios simples son suficientes

---

### 24.2. Módulos del admin en el MVP

#### A. Gestión de películas
El admin puede:
- listar todas las películas
- crear una película con: título, sinopsis, duración, género, clasificación, idiomas, formatos disponibles, póster y trailer
- editar cualquier campo de una película
- activar o desactivar una película (no eliminar en MVP)

#### B. Gestión de funciones
El admin puede:
- listar todas las funciones programadas
- crear una función con: película, sede, sala, fecha, hora y formato
- editar fecha, hora o sala de una función existente
- cancelar una función (la marca como no disponible)

Reglas de negocio:
- no se puede crear una función si ya existe otra en la misma sala al mismo horario
- al cancelar una función, los asientos reservados deben liberarse

#### C. Gestión de salas y asientos
El admin puede:
- listar salas por sede
- crear una sala con: nombre, capacidad total y distribución de filas y columnas
- definir si un asiento es estándar o preferencial
- activar o desactivar asientos individuales

En el MVP no se requiere editor visual de mapa; basta con formularios.

#### D. Gestión de snacks
El admin puede:
- listar productos del catálogo
- crear un producto con: nombre, categoría, precio, imagen y estado
- editar precio, imagen o estado
- activar o desactivar un producto

No se requiere gestión de stock en MVP, solo estado activo/inactivo.

#### E. Gestión de órdenes
El admin puede:
- listar todas las órdenes con filtros por fecha, estado y película
- ver el detalle de una orden: usuario, entradas, asientos, snacks y pago
- ver el estado del pago de cada orden

El admin no puede crear ni modificar órdenes manualmente en MVP.

#### F. Gestión de usuarios
El admin puede:
- listar usuarios registrados
- ver datos básicos: nombre, correo, fecha de registro, membresía activa
- activar o desactivar una cuenta

No se requiere edición de datos de usuario por parte del admin en MVP.

---

### 24.3. Funcionalidades imprescindibles del admin

- login independiente o acceso por rol desde el mismo login
- protección de todas las rutas del panel admin
- CRUD de películas
- CRUD de funciones
- CRUD básico de salas
- CRUD de snacks
- listado y vista de detalle de órdenes
- listado y gestión básica de usuarios

---

### 24.4. Mejoras recomendadas (post-MVP)

- dashboard con métricas: ventas del día, entradas vendidas, snacks más comprados
- gestión de membresías y planes
- reportes exportables
- control de aforo en tiempo real
- gestión de promociones y descuentos
- roles internos diferenciados: cajero, supervisor, administrador general

---

### 24.5. Puntos críticos de UX del panel admin

- las acciones destructivas (cancelar función, desactivar usuario) deben pedir confirmación explícita
- usar paginación en listados; no cargar todo a la vez
- mostrar mensajes claros de éxito o error tras cada operación
- el panel debe funcionar bien en desktop; no es prioridad mobile en MVP

---

### 24.6. Estados del admin

- **Película**: activa / inactiva
- **Función**: programada / cancelada / finalizada
- **Sala**: activa / inactiva
- **Producto (snack)**: activo / inactivo
- **Usuario**: activo / inactivo
- **Orden**: pendiente / aprobada / rechazada / cancelada

---

### 24.7. Pantallas del panel admin en MVP

- Login de admin (o acceso por rol)
- Listado de películas + formulario de creación/edición
- Listado de funciones + formulario de creación/edición
- Listado de salas + formulario de creación
- Listado de snacks + formulario de creación/edición
- Listado de órdenes + detalle de orden
- Listado de usuarios

---

## 25. Siguiente entregable recomendado

Después de este documento, el siguiente paso más útil sería generar uno de estos:

1. **Historias de usuario + criterios de aceptación**
2. **Modelo de base de datos**
3. **Mapa de pantallas**
4. **Endpoints del backend**
5. **Roadmap técnico por sprints**

