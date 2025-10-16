# ⚠️ REGLAS DE ORO - NO ROMPER

**Fecha creación:** 15 de Octubre, 2025  
**Razón:** Lección aprendida - Perdí 6 horas + $1.77 intentando optimizar antes de terminar

---

## 🚨 REGLA #1: SI FUNCIONA, NO LO TOQUES

**Nunca refactorizar/optimizar hasta tener v1 COMPLETA y FUNCIONANDO**

❌ **NO HACER:**

- "Voy a unificar estos actions mientras desarrollo"
- "Déjame reutilizar estos componentes antes de terminar"
- "Puedo hacer esto más elegante ahora"
- "Voy a crear una abstracción porque veo que se repite"

✅ **SÍ HACER:**

- Escribir código que funcione (aunque se repita)
- Completar TODAS las features primero
- Probar que TODO funciona
- DESPUÉS refactorizar

---

## 🚨 REGLA #2: NO MEZCLAR CONTEXTOS ANTES DE TIEMPO

**Cada feature tiene su lugar y su momento**

❌ **NO HACER:**

- Construir Builder + Perfil Público simultáneamente
- Compartir componentes "porque van a ser parecidos"
- Crear abstracciones "para el futuro"
- Unificar datos "para tener una sola fuente"

✅ **SÍ HACER:**

- Terminar Builder completamente
- DESPUÉS hacer Perfil Público
- DESPUÉS (si hay duplicación real) extraer compartidos

---

## 🚨 REGLA #3: TERMINAR > OPTIMIZAR

**El orden correcto:**

```
1. Hacer que funcione (PRIMERO)
   ├─ Código simple
   ├─ Puede repetirse
   └─ Solo importa que FUNCIONE

2. Hacer que sea correcto (SEGUNDO)
   ├─ Probar TODO
   ├─ Verificar edge cases
   └─ Confirmar funcionalidad completa

3. Hacer que sea rápido/elegante (TERCERO)
   ├─ AHORA SÍ refactorizar
   ├─ AHORA SÍ unificar
   └─ AHORA SÍ optimizar
```

---

## 🚨 REGLA #4: NO IMPROVISAR MEJORAS

**Stick to the plan**

❌ **NO HACER:**

- "Se me ocurrió una mejor forma de hacer esto"
- "Déjame cambiar esto rápido antes de continuar"
- "Voy a mejorar esto que ya funciona"
- "Puedo hacer esto más DRY"

✅ **SÍ HACER:**

- Seguir el plan original
- Anotar ideas de mejora en un archivo MEJORAS_FUTURAS.md
- Terminar lo que estás haciendo
- Revisar mejoras cuando TODO funcione

---

## 💰 COSTO DE NO SEGUIR ESTAS REGLAS

**Última vez:**

- ⏰ 6 horas perdidas
- 💵 $1.77 USD en API calls
- 😤 Frustración y estrés
- 🔄 Tuve que revertir TODO

**Lección:**

> "Los $1.77 no se tiraron a la basura.  
> Compré la lección más valiosa del desarrollo de software:  
> **Terminar primero, optimizar después**"

---

## ✅ CHECKLIST ANTES DE REFACTORIZAR

Solo puedes refactorizar si respondes SÍ a TODAS:

- [ ] ¿La feature está 100% completa?
- [ ] ¿TODO funciona correctamente?
- [ ] ¿Está probado y validado?
- [ ] ¿Los usuarios pueden usarlo sin bugs?
- [ ] ¿Realmente hay duplicación (no solo "se parece")?
- [ ] ¿El refactor va a ahorrar trabajo FUTURO?
- [ ] ¿Tengo tiempo y presupuesto para refactorizar?

Si alguna es NO → **NO REFACTORIZAR TODAVÍA**

---

## 📋 PLAN ACTUAL (v2.builder.continue)

### ✅ Completado

- [x] Identidad - Funcional
- [x] Contacto - Funcional
- [x] Actions funcionando sin unificación

### ⏳ Por Completar

- [ ] Portafolio - Completar funcionalidad
- [ ] Catálogo - Completar funcionalidad
- [ ] Inicio - Completar funcionalidad
- [ ] Testing completo de TODO
- [ ] Validar que todo funciona end-to-end

### 🔮 Para DESPUÉS (solo cuando todo lo anterior esté ✅)

- [ ] Construir Perfil Público
- [ ] Testing del perfil público
- [ ] ENTONCES evaluar si hay duplicación real
- [ ] ENTONCES refactorizar si tiene sentido

---

## 🎯 MANTRA DIARIO

Antes de cada sesión de código, leer en voz alta:

> **"Primero funcionalidad, después elegancia"**  
> **"Si funciona, no lo toques"**  
> **"Terminar es mejor que perfecto"**  
> **"DRY solo después de WET (Write Everything Twice)"**

---

## 📞 SEÑALES DE ALERTA

Si te sorprendes pensando/diciendo:

- "Voy a unificar esto..."
- "Puedo reutilizar este componente..."
- "Déjame hacer esto más elegante..."
- "Esto se puede optimizar..."
- "Voy a crear una abstracción..."

**DETENTE INMEDIATAMENTE** y lee este documento.

---

## 🎓 LECCIONES DE OTROS DESARROLLADORES

**Kent C. Dodds:**

> "Don't abstract early, wait until you have duplication in 3+ places"

**Sandi Metz:**

> "Duplication is far cheaper than the wrong abstraction"

**Dan Abramov:**

> "Don't be a hero. Use a library. Wait... I mean, don't over-engineer"

**Steve Jobs:**

> "Simple can be harder than complex. But it's worth it in the end"

---

## 📝 HISTORIAL DE LECCIONES

### 2025-10-15: Refactor Prematuro

- **Qué hice:** Intenté unificar Builder + Perfil Público antes de terminar
- **Resultado:** 6 horas perdidas, $1.77, código roto
- **Lección:** No optimizar hasta tener v1 completa
- **Acción:** Revertí a código funcional (v2.ui.studio)

---

**Última actualización:** 2025-10-15  
**Próxima revisión:** Cuando termine el builder completo

---

## 🏆 ÉXITO = CÓDIGO QUE FUNCIONA

No código elegante.  
No código DRY.  
No código abstracto.

**CÓDIGO QUE FUNCIONA.**

Lo demás viene después.

---

_Este documento existe porque ya cometí el error.  
No lo vuelvas a cometer, Israel del futuro._
