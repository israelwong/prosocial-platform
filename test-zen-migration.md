# 🧪 TESTING MANUAL DE MIGRACIÓN ZEN.PRO

## 📋 **CHECKLIST DE TESTING**

### **✅ FASE 1: RUTAS BÁSICAS**

#### **1.1 Landing Page**

- [ ] `http://localhost:3000/` → Debe mostrar nueva landing de zen.pro
- [ ] Título debe ser "zen.pro"
- [ ] Debe mostrar ejemplos de estudios
- [ ] Botón "Crear Mi Estudio" debe ir a `/sign-up`

#### **1.2 Rutas de Marketing**

- [ ] `http://localhost:3000/about` → Funciona normalmente
- [ ] `http://localhost:3000/pricing` → Funciona normalmente
- [ ] `http://localhost:3000/contact` → Funciona normalmente
- [ ] `http://localhost:3000/login` → Funciona normalmente
- [ ] `http://localhost:3000/sign-up` → Funciona normalmente

#### **1.3 Rutas de Admin**

- [ ] `http://localhost:3000/admin` → Redirige a login si no autenticado
- [ ] `http://localhost:3000/agente` → Redirige a login si no autenticado

### **✅ FASE 2: REWRITE DE ESTUDIOS**

#### **2.1 Slug Simple**

- [ ] `http://localhost:3000/mi-estudio` → Debe redirigir a `/mi-estudio/dashboard`
- [ ] URL final: `http://localhost:3000/mi-estudio/dashboard`
- [ ] NO debe mostrar `/studio/` en la URL ❌

#### **2.2 Slug con Subrutas**

- [ ] `http://localhost:3000/mi-estudio/configuracion` → Debe funcionar
- [ ] `http://localhost:3000/mi-estudio/kanban` → Debe funcionar
- [ ] URL se mantiene limpia (sin `/studio/`)

#### **2.3 Slugs de Ejemplo**

- [ ] `http://localhost:3000/fotografia-luna` → Redirige a dashboard
- [ ] `http://localhost:3000/video-pro` → Redirige a dashboard
- [ ] `http://localhost:3000/estudio-creativo` → Redirige a dashboard

### **✅ FASE 3: AUTENTICACIÓN**

#### **3.1 Acceso Sin Autenticación**

- [ ] `/mi-estudio` → Debe redirigir a `/login`
- [ ] `/admin` → Debe redirigir a `/login`
- [ ] `/agente` → Debe redirigir a `/login`

#### **3.2 Acceso Con Autenticación** (si tienes usuarios)

- [ ] Usuario suscriptor → Puede acceder a su estudio
- [ ] Usuario admin → Puede acceder a `/admin`
- [ ] Usuario agente → Puede acceder a `/agente`

### **✅ FASE 4: CONSOLE LOGS**

#### **4.1 Verificar Logs en Browser Console**

- [ ] Debe mostrar: `🔄 Rewriting /mi-estudio to /studio/mi-estudio`
- [ ] Debe mostrar: `🔄 Rewriting /mi-estudio/dashboard to /studio/mi-estudio/dashboard`
- [ ] NO debe mostrar errores 404

#### **4.2 Verificar Network Tab**

- [ ] Requests van a rutas internas `/studio/[slug]`
- [ ] URLs en browser siguen siendo limpias

### **✅ FASE 5: ERRORES COMUNES**

#### **5.1 Verificar que NO pasa**

- [ ] ❌ URLs con `/studio/` expuestas al usuario
- [ ] ❌ Errores 404 en rutas de marketing
- [ ] ❌ Loops de redirección infinita
- [ ] ❌ Conflictos entre rutas reservadas y slugs

## 🚨 **COMANDOS DE TESTING**

### **Iniciar Servidor de Desarrollo**

```bash
cd /Users/israelwong/Documents/Desarrollo/prosocial-platform
npm run dev
```

### **Testing con cURL (Opcional)**

```bash
# Verificar landing
curl -I http://localhost:3000/

# Verificar rewrite de estudio
curl -I http://localhost:3000/mi-estudio

# Verificar rutas de marketing
curl -I http://localhost:3000/about
curl -I http://localhost:3000/pricing
```

## ✅ **RESULTADOS ESPERADOS**

### **URLs Finales Correctas**

```
✅ localhost:3000/ → Landing zen.pro
✅ localhost:3000/about → Página about
✅ localhost:3000/mi-estudio → Redirige a /mi-estudio/dashboard
✅ localhost:3000/mi-estudio/dashboard → Dashboard del estudio
✅ localhost:3000/mi-estudio/configuracion → Configuración del estudio
```

### **URLs que NO deben aparecer**

```
❌ localhost:3000/studio/mi-estudio
❌ localhost:3000/studio/mi-estudio/dashboard
❌ Cualquier URL con /studio/ visible al usuario
```

## 📝 **NOTAS DE TESTING**

- **Variables de entorno**: Asegúrate de tener `NEXT_PUBLIC_DOMAIN=zen.pro` en `.env.local`
- **Cache**: Si hay problemas, limpia cache del browser (Ctrl+Shift+R)
- **Console**: Siempre revisa la consola del browser para errores
- **Network**: Usa Developer Tools → Network para ver requests reales

---

**Fecha**: $(date)
**Responsable**: Equipo de Desarrollo
**Estado**: En Testing
