-- CreateTable
CREATE TABLE "public"."plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "activeProjectLimit" INTEGER NOT NULL,
    "priceMonthly" DECIMAL(65,30) NOT NULL,
    "priceYearly" DECIMAL(65,30) NOT NULL,
    "features" JSONB NOT NULL,
    "stripePriceId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."studios" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "planId" TEXT NOT NULL,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial',
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeAccountId" TEXT,
    "stripeOnboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "commissionRate" DECIMAL(65,30) NOT NULL DEFAULT 0.30,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."studio_users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "telefono" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "studioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."revenue_transactions" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amountTotal" DECIMAL(65,30) NOT NULL,
    "prosocialCommission" DECIMAL(65,30) NOT NULL,
    "studioAmount" DECIMAL(65,30) NOT NULL,
    "commissionRate" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "stripeTransferId" TEXT,
    "stripeFee" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenue_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sesiones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'activo',
    "canalId" TEXT,
    "userId" TEXT,
    "passwordHash" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."eventos" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "eventoTipoId" TEXT,
    "nombre" TEXT DEFAULT 'Pendiente',
    "fecha_evento" TIMESTAMP(3) NOT NULL,
    "sede" TEXT,
    "direccion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "eventoEtapaId" TEXT,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evento_bitacoras" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "importancia" TEXT NOT NULL DEFAULT '1',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evento_bitacoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evento_tipos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evento_tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evento_etapas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evento_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."canales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pagos" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT,
    "cotizacionId" TEXT,
    "condicionesComercialesId" TEXT,
    "condicionesComercialesMetodoPagoId" TEXT,
    "metodoPagoId" TEXT,
    "metodo_pago" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "comisionStripe" DOUBLE PRECISION,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "stripe_session_id" TEXT,
    "stripe_payment_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "tipo_transaccion" TEXT DEFAULT 'ingreso',
    "categoria_transaccion" TEXT DEFAULT 'abono',

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cotizaciones" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "eventoTipoId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "descuento" DOUBLE PRECISION,
    "descripcion" TEXT,
    "condicionesComercialesId" TEXT,
    "condicionesComercialesMetodoPagoId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "archivada" BOOLEAN NOT NULL DEFAULT false,
    "visible_cliente" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) DEFAULT now() + interval '10 day',

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cotizacion_servicios" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "servicioId" TEXT,
    "servicioCategoriaId" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "fechaAsignacion" TIMESTAMP(3),
    "FechaEntrega" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "seccion_nombre_snapshot" TEXT,
    "categoria_nombre_snapshot" TEXT,
    "nombre_snapshot" TEXT NOT NULL DEFAULT 'Servicio migrado',
    "descripcion_snapshot" TEXT,
    "precio_unitario_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costo_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gasto_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilidad_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "precio_publico_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tipo_utilidad_snapshot" TEXT NOT NULL DEFAULT 'servicio',
    "precioUnitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nombre" TEXT,
    "descripcion" TEXT,
    "costo" DOUBLE PRECISION DEFAULT 0,
    "gasto" DOUBLE PRECISION DEFAULT 0,
    "utilidad" DOUBLE PRECISION DEFAULT 0,
    "precio_publico" DOUBLE PRECISION DEFAULT 0,
    "tipo_utilidad" TEXT DEFAULT 'servicio',
    "categoria_nombre" TEXT,
    "seccion_nombre" TEXT,
    "es_personalizado" BOOLEAN NOT NULL DEFAULT false,
    "servicio_original_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizacion_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cotizacion_costos" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL DEFAULT 'adicional',
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotizacion_costos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cotizacion_visitas" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotizacion_visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."servicios" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "servicioCategoriaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gasto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "precio_publico" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tipo_utilidad" TEXT NOT NULL DEFAULT 'servicio',
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "visible_cliente" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."servicio_secciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicio_secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seccion_categorias" (
    "id" TEXT NOT NULL,
    "seccionId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "seccion_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."servicio_gastos" (
    "id" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicio_gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."servicio_categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicio_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."paquetes" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "eventoTipoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DOUBLE PRECISION,
    "gasto" DOUBLE PRECISION,
    "utilidad" DOUBLE PRECISION,
    "precio" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."paquete_servicios" (
    "id" TEXT NOT NULL,
    "paqueteId" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "servicioCategoriaId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "visible_cliente" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paquete_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."configuraciones" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "utilidad_servicio" DOUBLE PRECISION NOT NULL,
    "utilidad_producto" DOUBLE PRECISION NOT NULL,
    "comision_venta" DOUBLE PRECISION NOT NULL,
    "sobreprecio" DOUBLE PRECISION NOT NULL,
    "claveAutorizacion" TEXT,
    "numeroMaximoServiciosPorDia" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metodos_pago" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "comision_porcentaje_base" DOUBLE PRECISION,
    "comision_fija_monto" DOUBLE PRECISION,
    "num_msi" INTEGER,
    "comision_msi_porcentaje" DOUBLE PRECISION,
    "orden" INTEGER DEFAULT 0,
    "payment_method" TEXT DEFAULT 'card',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."condiciones_comerciales" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "descuento" DOUBLE PRECISION,
    "porcentaje_anticipo" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "orden" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condiciones_comerciales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."condiciones_comerciales_metodo_pago" (
    "id" TEXT NOT NULL,
    "condicionesComercialesId" TEXT NOT NULL,
    "metodoPagoId" TEXT NOT NULL,
    "orden" INTEGER DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condiciones_comerciales_metodo_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."campanias" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campanias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."anuncio_plataformas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anuncio_plataformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."anuncio_tipos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anuncio_tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."anuncio_categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anuncio_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."anuncios" (
    "id" TEXT NOT NULL,
    "campaniaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "anuncioTipoId" TEXT NOT NULL,
    "anuncioCategoriaId" TEXT NOT NULL,
    "anuncioPlataformaId" TEXT NOT NULL,
    "imagen_url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anuncios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."anuncio_visitas" (
    "id" TEXT NOT NULL,
    "anuncioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anuncio_visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agenda" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "userId" TEXT,
    "eventoId" TEXT NOT NULL,
    "concepto" TEXT,
    "descripcion" TEXT,
    "googleMapsUrl" TEXT,
    "direccion" TEXT,
    "fecha" TIMESTAMP(3),
    "hora" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agendaTipo" TEXT,

    CONSTRAINT "agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agenda_tipos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notificaciones" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'general',
    "metadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "cotizacionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nominas" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventoId" TEXT,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto_bruto" DOUBLE PRECISION NOT NULL,
    "deducciones" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monto_neto" DOUBLE PRECISION NOT NULL,
    "tipo_pago" TEXT NOT NULL DEFAULT 'individual',
    "servicios_incluidos" INTEGER NOT NULL DEFAULT 1,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_autorizacion" TIMESTAMP(3),
    "fecha_pago" TIMESTAMP(3),
    "periodo_inicio" TIMESTAMP(3),
    "periodo_fin" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "autorizado_por" TEXT,
    "pagado_por" TEXT,
    "metodo_pago" TEXT DEFAULT 'transferencia',
    "costo_total_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gasto_total_snapshot" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comision_porcentaje" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nominas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nomina_servicios" (
    "id" TEXT NOT NULL,
    "nominaId" TEXT NOT NULL,
    "cotizacionServicioId" TEXT,
    "servicio_nombre" TEXT NOT NULL,
    "seccion_nombre" TEXT,
    "categoria_nombre" TEXT,
    "costo_asignado" DOUBLE PRECISION NOT NULL,
    "cantidad_asignada" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nomina_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suscripciones" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'evento',
    "status" TEXT NOT NULL DEFAULT 'activa',
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "precio" DOUBLE PRECISION,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gastos" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "categoria" TEXT NOT NULL,
    "subcategoria" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFactura" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'activo',
    "metodoPago" TEXT,
    "numeroFactura" TEXT,
    "proveedor" TEXT,
    "eventoId" TEXT,
    "usuarioId" TEXT NOT NULL,
    "comprobanteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."negocios" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "sitioWeb" TEXT,
    "logoUrl" TEXT,
    "isotipoUrl" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'MXN',
    "timezone" TEXT NOT NULL DEFAULT 'America/Mexico_City',
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "negocios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."negocio_rrss" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "username" TEXT,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "negocio_rrss_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."negocio_horarios" (
    "id" TEXT NOT NULL,
    "negocioId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT,
    "horaFin" TEXT,
    "cerrado" BOOLEAN NOT NULL DEFAULT false,
    "fechaEspecial" TIMESTAMP(3),
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "negocio_horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solicitud_paquetes" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "paqueteId" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteEmail" TEXT NOT NULL,
    "clienteTelefono" TEXT,
    "mensaje" TEXT,
    "paqueteNombre" TEXT NOT NULL,
    "precioPaquete" DOUBLE PRECISION NOT NULL,
    "diferenciaPrecio" DOUBLE PRECISION,
    "eventoFecha" TIMESTAMP(3),
    "eventoLugar" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "notas" TEXT,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaProcesada" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitud_paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CondicionesComercialesMetodoPagoToCotizacion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CondicionesComercialesMetodoPagoToCotizacion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "public"."plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "studios_slug_key" ON "public"."studios"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "studios_email_key" ON "public"."studios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "studios_stripeCustomerId_key" ON "public"."studios"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "studios_stripeSubscriptionId_key" ON "public"."studios"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "studios_stripeAccountId_key" ON "public"."studios"("stripeAccountId");

-- CreateIndex
CREATE INDEX "studios_slug_idx" ON "public"."studios"("slug");

-- CreateIndex
CREATE INDEX "studios_planId_idx" ON "public"."studios"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "studio_users_email_key" ON "public"."studio_users"("email");

-- CreateIndex
CREATE INDEX "studio_users_studioId_status_idx" ON "public"."studio_users"("studioId", "status");

-- CreateIndex
CREATE INDEX "studio_users_email_idx" ON "public"."studio_users"("email");

-- CreateIndex
CREATE INDEX "revenue_transactions_studioId_transactionDate_idx" ON "public"."revenue_transactions"("studioId", "transactionDate");

-- CreateIndex
CREATE INDEX "revenue_transactions_status_idx" ON "public"."revenue_transactions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "sesiones_token_key" ON "public"."sesiones"("token");

-- CreateIndex
CREATE INDEX "clientes_studioId_status_idx" ON "public"."clientes"("studioId", "status");

-- CreateIndex
CREATE INDEX "clientes_telefono_idx" ON "public"."clientes"("telefono");

-- CreateIndex
CREATE INDEX "eventos_studioId_status_idx" ON "public"."eventos"("studioId", "status");

-- CreateIndex
CREATE INDEX "eventos_clienteId_idx" ON "public"."eventos"("clienteId");

-- CreateIndex
CREATE INDEX "eventos_fecha_evento_idx" ON "public"."eventos"("fecha_evento");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_stripe_session_id_key" ON "public"."pagos"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_stripe_payment_id_key" ON "public"."pagos"("stripe_payment_id");

-- CreateIndex
CREATE INDEX "cotizaciones_studioId_status_idx" ON "public"."cotizaciones"("studioId", "status");

-- CreateIndex
CREATE INDEX "cotizaciones_eventoId_idx" ON "public"."cotizaciones"("eventoId");

-- CreateIndex
CREATE INDEX "servicios_studioId_status_idx" ON "public"."servicios"("studioId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_secciones_nombre_key" ON "public"."servicio_secciones"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "seccion_categorias_categoriaId_key" ON "public"."seccion_categorias"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_categorias_nombre_key" ON "public"."servicio_categorias"("nombre");

-- CreateIndex
CREATE INDEX "paquetes_studioId_status_idx" ON "public"."paquetes"("studioId", "status");

-- CreateIndex
CREATE INDEX "configuraciones_studioId_idx" ON "public"."configuraciones"("studioId");

-- CreateIndex
CREATE INDEX "metodos_pago_studioId_idx" ON "public"."metodos_pago"("studioId");

-- CreateIndex
CREATE INDEX "condiciones_comerciales_studioId_idx" ON "public"."condiciones_comerciales"("studioId");

-- CreateIndex
CREATE INDEX "campanias_studioId_idx" ON "public"."campanias"("studioId");

-- CreateIndex
CREATE INDEX "agenda_studioId_idx" ON "public"."agenda"("studioId");

-- CreateIndex
CREATE UNIQUE INDEX "agenda_tipos_nombre_key" ON "public"."agenda_tipos"("nombre");

-- CreateIndex
CREATE INDEX "nominas_studioId_idx" ON "public"."nominas"("studioId");

-- CreateIndex
CREATE UNIQUE INDEX "nomina_servicios_nominaId_cotizacionServicioId_key" ON "public"."nomina_servicios"("nominaId", "cotizacionServicioId");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_clienteId_key" ON "public"."suscripciones"("clienteId");

-- CreateIndex
CREATE INDEX "gastos_fecha_categoria_idx" ON "public"."gastos"("fecha", "categoria");

-- CreateIndex
CREATE INDEX "gastos_eventoId_idx" ON "public"."gastos"("eventoId");

-- CreateIndex
CREATE INDEX "gastos_studioId_idx" ON "public"."gastos"("studioId");

-- CreateIndex
CREATE INDEX "negocios_studioId_idx" ON "public"."negocios"("studioId");

-- CreateIndex
CREATE INDEX "negocio_rrss_negocioId_activo_idx" ON "public"."negocio_rrss"("negocioId", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "negocio_rrss_negocioId_plataforma_key" ON "public"."negocio_rrss"("negocioId", "plataforma");

-- CreateIndex
CREATE INDEX "negocio_horarios_negocioId_activo_idx" ON "public"."negocio_horarios"("negocioId", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "negocio_horarios_negocioId_diaSemana_key" ON "public"."negocio_horarios"("negocioId", "diaSemana");

-- CreateIndex
CREATE INDEX "solicitud_paquetes_cotizacionId_idx" ON "public"."solicitud_paquetes"("cotizacionId");

-- CreateIndex
CREATE INDEX "solicitud_paquetes_paqueteId_idx" ON "public"."solicitud_paquetes"("paqueteId");

-- CreateIndex
CREATE INDEX "solicitud_paquetes_estado_idx" ON "public"."solicitud_paquetes"("estado");

-- CreateIndex
CREATE INDEX "solicitud_paquetes_fechaSolicitud_idx" ON "public"."solicitud_paquetes"("fechaSolicitud");

-- CreateIndex
CREATE INDEX "_CondicionesComercialesMetodoPagoToCotizacion_B_index" ON "public"."_CondicionesComercialesMetodoPagoToCotizacion"("B");

-- AddForeignKey
ALTER TABLE "public"."studios" ADD CONSTRAINT "studios_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."studio_users" ADD CONSTRAINT "studio_users_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."revenue_transactions" ADD CONSTRAINT "revenue_transactions_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sesiones" ADD CONSTRAINT "sesiones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."studio_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "public"."canales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos" ADD CONSTRAINT "eventos_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos" ADD CONSTRAINT "eventos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos" ADD CONSTRAINT "eventos_eventoTipoId_fkey" FOREIGN KEY ("eventoTipoId") REFERENCES "public"."evento_tipos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos" ADD CONSTRAINT "eventos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."studio_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."eventos" ADD CONSTRAINT "eventos_eventoEtapaId_fkey" FOREIGN KEY ("eventoEtapaId") REFERENCES "public"."evento_etapas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."evento_bitacoras" ADD CONSTRAINT "evento_bitacoras_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."cotizaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_condicionesComercialesId_fkey" FOREIGN KEY ("condicionesComercialesId") REFERENCES "public"."condiciones_comerciales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_condicionesComercialesMetodoPagoId_fkey" FOREIGN KEY ("condicionesComercialesMetodoPagoId") REFERENCES "public"."condiciones_comerciales_metodo_pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "public"."metodos_pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pagos" ADD CONSTRAINT "pagos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."studio_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizaciones" ADD CONSTRAINT "cotizaciones_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizaciones" ADD CONSTRAINT "cotizaciones_eventoTipoId_fkey" FOREIGN KEY ("eventoTipoId") REFERENCES "public"."evento_tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizaciones" ADD CONSTRAINT "cotizaciones_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizaciones" ADD CONSTRAINT "cotizaciones_condicionesComercialesId_fkey" FOREIGN KEY ("condicionesComercialesId") REFERENCES "public"."condiciones_comerciales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizacion_servicios" ADD CONSTRAINT "cotizacion_servicios_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizacion_servicios" ADD CONSTRAINT "cotizacion_servicios_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizacion_servicios" ADD CONSTRAINT "cotizacion_servicios_servicioCategoriaId_fkey" FOREIGN KEY ("servicioCategoriaId") REFERENCES "public"."servicio_categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizacion_servicios" ADD CONSTRAINT "cotizacion_servicios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."studio_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizacion_costos" ADD CONSTRAINT "cotizacion_costos_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cotizacion_visitas" ADD CONSTRAINT "cotizacion_visitas_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."servicios" ADD CONSTRAINT "servicios_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."servicios" ADD CONSTRAINT "servicios_servicioCategoriaId_fkey" FOREIGN KEY ("servicioCategoriaId") REFERENCES "public"."servicio_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seccion_categorias" ADD CONSTRAINT "seccion_categorias_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "public"."servicio_secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."seccion_categorias" ADD CONSTRAINT "seccion_categorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."servicio_categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."servicio_gastos" ADD CONSTRAINT "servicio_gastos_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paquetes" ADD CONSTRAINT "paquetes_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paquetes" ADD CONSTRAINT "paquetes_eventoTipoId_fkey" FOREIGN KEY ("eventoTipoId") REFERENCES "public"."evento_tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paquete_servicios" ADD CONSTRAINT "paquete_servicios_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "public"."paquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paquete_servicios" ADD CONSTRAINT "paquete_servicios_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paquete_servicios" ADD CONSTRAINT "paquete_servicios_servicioCategoriaId_fkey" FOREIGN KEY ("servicioCategoriaId") REFERENCES "public"."servicio_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."configuraciones" ADD CONSTRAINT "configuraciones_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."metodos_pago" ADD CONSTRAINT "metodos_pago_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."condiciones_comerciales" ADD CONSTRAINT "condiciones_comerciales_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."condiciones_comerciales_metodo_pago" ADD CONSTRAINT "condiciones_comerciales_metodo_pago_condicionesComerciales_fkey" FOREIGN KEY ("condicionesComercialesId") REFERENCES "public"."condiciones_comerciales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."condiciones_comerciales_metodo_pago" ADD CONSTRAINT "condiciones_comerciales_metodo_pago_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "public"."metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."campanias" ADD CONSTRAINT "campanias_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anuncios" ADD CONSTRAINT "anuncios_campaniaId_fkey" FOREIGN KEY ("campaniaId") REFERENCES "public"."campanias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anuncios" ADD CONSTRAINT "anuncios_anuncioTipoId_fkey" FOREIGN KEY ("anuncioTipoId") REFERENCES "public"."anuncio_tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anuncios" ADD CONSTRAINT "anuncios_anuncioCategoriaId_fkey" FOREIGN KEY ("anuncioCategoriaId") REFERENCES "public"."anuncio_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anuncios" ADD CONSTRAINT "anuncios_anuncioPlataformaId_fkey" FOREIGN KEY ("anuncioPlataformaId") REFERENCES "public"."anuncio_plataformas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."agenda" ADD CONSTRAINT "agenda_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."agenda" ADD CONSTRAINT "agenda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."studio_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."agenda" ADD CONSTRAINT "agenda_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nominas" ADD CONSTRAINT "nominas_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nominas" ADD CONSTRAINT "nominas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."studio_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nominas" ADD CONSTRAINT "nominas_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nominas" ADD CONSTRAINT "nominas_autorizado_por_fkey" FOREIGN KEY ("autorizado_por") REFERENCES "public"."studio_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nominas" ADD CONSTRAINT "nominas_pagado_por_fkey" FOREIGN KEY ("pagado_por") REFERENCES "public"."studio_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nomina_servicios" ADD CONSTRAINT "nomina_servicios_nominaId_fkey" FOREIGN KEY ("nominaId") REFERENCES "public"."nominas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nomina_servicios" ADD CONSTRAINT "nomina_servicios_cotizacionServicioId_fkey" FOREIGN KEY ("cotizacionServicioId") REFERENCES "public"."cotizacion_servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "suscripciones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gastos" ADD CONSTRAINT "gastos_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gastos" ADD CONSTRAINT "gastos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gastos" ADD CONSTRAINT "gastos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."studio_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."negocios" ADD CONSTRAINT "negocios_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."negocio_rrss" ADD CONSTRAINT "negocio_rrss_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "public"."negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."negocio_horarios" ADD CONSTRAINT "negocio_horarios_negocioId_fkey" FOREIGN KEY ("negocioId") REFERENCES "public"."negocios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitud_paquetes" ADD CONSTRAINT "solicitud_paquetes_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."solicitud_paquetes" ADD CONSTRAINT "solicitud_paquetes_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "public"."paquetes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CondicionesComercialesMetodoPagoToCotizacion" ADD CONSTRAINT "_CondicionesComercialesMetodoPagoToCotizacion_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."condiciones_comerciales_metodo_pago"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CondicionesComercialesMetodoPagoToCotizacion" ADD CONSTRAINT "_CondicionesComercialesMetodoPagoToCotizacion_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
