-- CreateEnum
CREATE TYPE "public"."PlatformLeadBitacoraTipo" AS ENUM ('NOTA_PERSONALIZADA', 'CAMBIO_ETAPA', 'ASIGNACION_AGENTE', 'DESASIGNACION_AGENTE', 'CREACION_LEAD', 'ACTUALIZACION_DATOS', 'LLAMADA_REALIZADA', 'EMAIL_ENVIADO', 'REUNION_AGENDADA', 'CONTRATO_FIRMADO', 'SUSCRIPCION_ACTIVA', 'CANCELACION', 'DESCUENTO_APLICADO', 'CODIGO_DESCUENTO_GENERADO');

-- CreateEnum
CREATE TYPE "public"."UnidadMedida" AS ENUM ('BOOLEAN', 'CANTIDAD', 'HORAS', 'USUARIOS', 'CATALOGOS', 'GB', 'PROYECTOS', 'COTIZACIONES', 'LANDING_PAGES');

-- CreateTable
CREATE TABLE "public"."platform_billing_cycles" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "stripe_invoice_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_billing_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_config" (
    "id" TEXT NOT NULL,
    "nombre_empresa" TEXT NOT NULL,
    "logo_url" TEXT,
    "favicon_url" TEXT,
    "comercial_telefono" TEXT,
    "comercial_email" TEXT,
    "comercial_whatsapp" TEXT,
    "soporte_telefono" TEXT,
    "soporte_email" TEXT,
    "soporte_chat_url" TEXT,
    "direccion" TEXT,
    "horarios_atencion" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/Mexico_City',
    "facebook_url" TEXT,
    "instagram_url" TEXT,
    "twitter_url" TEXT,
    "linkedin_url" TEXT,
    "terminos_condiciones" TEXT,
    "politica_privacidad" TEXT,
    "aviso_legal" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "google_analytics_id" TEXT,
    "google_tag_manager_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_canales_adquisicion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT,
    "icono" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_canales_adquisicion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_plataformas_redes_sociales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT,
    "icono" TEXT,
    "urlBase" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_plataformas_redes_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_lead_bitacora" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "tipo" "public"."PlatformLeadBitacoraTipo" NOT NULL,
    "titulo" TEXT,
    "descripcion" TEXT NOT NULL,
    "metadata" JSONB,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_lead_bitacora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_leads" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "nombreEstudio" TEXT,
    "slugEstudio" TEXT,
    "fechaUltimoContacto" TIMESTAMP(3),
    "planInteres" TEXT,
    "presupuestoMensual" DECIMAL(65,30),
    "fechaProbableInicio" TIMESTAMP(3),
    "agentId" TEXT,
    "puntaje" INTEGER,
    "prioridad" TEXT NOT NULL DEFAULT 'media',
    "fechaConversion" TIMESTAMP(3),
    "studioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "etapaId" TEXT,
    "canalAdquisicionId" TEXT,
    "campañaId" TEXT,
    "tipo_lead" TEXT DEFAULT 'prospecto',
    "metodo_conversion" TEXT,
    "agente_conversion_id" TEXT,
    "fecha_primera_interaccion" TIMESTAMP(3),
    "numero_interacciones" INTEGER DEFAULT 0,
    "fuente_original" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,

    CONSTRAINT "platform_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'info',
    "categoria" TEXT NOT NULL DEFAULT 'general',
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "leadId" TEXT,
    "agentId" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_pipeline_types" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_pipeline_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_pipeline_stages" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pipeline_type_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_pipeline_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_plataformas_publicidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL,
    "color" TEXT,
    "icono" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_plataformas_publicidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "features" JSONB,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "limits" JSONB,
    "price_monthly" DECIMAL(65,30),
    "price_yearly" DECIMAL(65,30),
    "stripe_price_id" TEXT,
    "stripe_product_id" TEXT,

    CONSTRAINT "platform_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_activities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "resultado" TEXT,
    "proximaAccion" TEXT,
    "fechaProximaAccion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "platform_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_agents" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "metaMensualLeads" INTEGER NOT NULL DEFAULT 20,
    "comisionConversion" DECIMAL(65,30) NOT NULL DEFAULT 0.05,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_campana_plataformas" (
    "id" TEXT NOT NULL,
    "campañaId" TEXT NOT NULL,
    "plataformaId" TEXT NOT NULL,
    "presupuesto" DECIMAL(65,30) NOT NULL,
    "gastoReal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "conversiones" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_campana_plataformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_campanas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "presupuestoTotal" DECIMAL(65,30) NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'planificada',
    "leadsGenerados" INTEGER NOT NULL DEFAULT 0,
    "leadsSuscritos" INTEGER NOT NULL DEFAULT 0,
    "gastoReal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_campanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_discount_codes" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo_descuento" TEXT NOT NULL,
    "valor_descuento" DECIMAL(65,30) NOT NULL,
    "tipo_aplicacion" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "uso_maximo" INTEGER,
    "uso_actual" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "stripe_coupon_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_discount_usage" (
    "id" TEXT NOT NULL,
    "discount_code_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "subscription_id" TEXT,
    "monto_descuento" DECIMAL(65,30) NOT NULL,
    "fecha_uso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_discount_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."platform_agent_discount_codes" (
    "id" TEXT NOT NULL,
    "codigo_base" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "agente_id" TEXT NOT NULL,
    "codigo_completo" TEXT NOT NULL,
    "tipo_descuento" TEXT NOT NULL,
    "valor_descuento" DECIMAL(65,30) NOT NULL,
    "duracion_descuento" TEXT NOT NULL,
    "stripe_coupon_id" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_uso" TIMESTAMP(3),
    "subscription_id" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "platform_agent_discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "slogan" TEXT,
    "descripcion" TEXT,
    "palabras_clave" TEXT,
    "isotipo_url" TEXT,
    "planId" TEXT,
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

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_configuraciones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_configuraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_agenda" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_agenda_tipos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_agenda_tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_campanas" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "presupuestoTotal" DECIMAL(65,30),
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'activa',
    "plataforma" TEXT,
    "url_campana" TEXT,
    "leadsGenerados" INTEGER NOT NULL DEFAULT 0,
    "gastoReal" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_campanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_clientes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'activo',
    "userId" TEXT,
    "passwordHash" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_condiciones_comerciales" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "descuento" DOUBLE PRECISION,
    "porcentaje_anticipo" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "orden" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_condiciones_comerciales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_condiciones_comerciales_metodo_pago" (
    "id" TEXT NOT NULL,
    "condicionesComercialesId" TEXT NOT NULL,
    "metodoPagoId" TEXT NOT NULL,
    "orden" INTEGER DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_condiciones_comerciales_metodo_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_cotizacion_costos" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "costo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL DEFAULT 'adicional',
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_cotizacion_costos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_cotizacion_servicios" (
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

    CONSTRAINT "project_cotizacion_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_cotizacion_visitas" (
    "id" TEXT NOT NULL,
    "cotizacionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_cotizacion_visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_cotizaciones" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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
    "expiresAt" TIMESTAMP(3) DEFAULT (now() + '10 days'::interval),

    CONSTRAINT "project_cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_evento_bitacoras" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "importancia" TEXT NOT NULL DEFAULT '1',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_evento_bitacoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_evento_etapas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_evento_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_evento_tipos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_evento_tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_eventos" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_gastos" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_metodos_pago" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_nomina_servicios" (
    "id" TEXT NOT NULL,
    "nominaId" TEXT NOT NULL,
    "cotizacionServicioId" TEXT,
    "servicio_nombre" TEXT NOT NULL,
    "seccion_nombre" TEXT,
    "categoria_nombre" TEXT,
    "costo_asignado" DOUBLE PRECISION NOT NULL,
    "cantidad_asignada" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_nomina_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_nominas" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_nominas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_pagos" (
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

    CONSTRAINT "project_pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_paquete_servicios" (
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

    CONSTRAINT "project_paquete_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_paquetes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_revenue_products" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precioPublico" DECIMAL(65,30) NOT NULL,
    "comisionProsocial" DECIMAL(65,30) NOT NULL,
    "comisionStudio" DECIMAL(65,30) NOT NULL,
    "tipoFacturacion" TEXT NOT NULL,
    "cicloVida" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "configuracion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_revenue_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_revenue_transactions" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_revenue_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_seccion_categorias" (
    "id" TEXT NOT NULL,
    "seccionId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,

    CONSTRAINT "project_seccion_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_servicio_categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_servicio_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_servicio_gastos" (
    "id" TEXT NOT NULL,
    "servicioId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_servicio_gastos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_servicio_secciones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_servicio_secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_servicios" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
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

    CONSTRAINT "project_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_sesiones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_studio_revenue_products" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "revenueProductId" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "precioCustom" DECIMAL(65,30),
    "comisionCustom" DECIMAL(65,30),
    "configuracionStudio" JSONB,
    "activadoEn" TIMESTAMP(3),
    "desactivadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_studio_revenue_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "telefono" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_user_profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL,
    "projectId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" TEXT NOT NULL,
    "studio_id" TEXT NOT NULL,
    "stripe_subscription_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "billing_cycle_anchor" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plan_services" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "limite" INTEGER,
    "unidad" "public"."UnidadMedida",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "posicion" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_telefonos" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_telefonos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_horarios_atencion" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "dia_semana" TEXT NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_fin" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_horarios_atencion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_redes_sociales" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "plataformaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_redes_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_CondicionesComercialesMetodoPagoToCotizacion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CondicionesComercialesMetodoPagoToCotizacion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "platform_billing_cycles_period_start_period_end_idx" ON "public"."platform_billing_cycles"("period_start", "period_end");

-- CreateIndex
CREATE INDEX "platform_billing_cycles_status_idx" ON "public"."platform_billing_cycles"("status");

-- CreateIndex
CREATE INDEX "platform_billing_cycles_subscription_id_idx" ON "public"."platform_billing_cycles"("subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_services_name_key" ON "public"."platform_services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platform_services_slug_key" ON "public"."platform_services"("slug");

-- CreateIndex
CREATE INDEX "platform_services_active_posicion_idx" ON "public"."platform_services"("active", "posicion");

-- CreateIndex
CREATE INDEX "platform_services_categoryId_idx" ON "public"."platform_services"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_canales_adquisicion_nombre_key" ON "public"."platform_canales_adquisicion"("nombre");

-- CreateIndex
CREATE INDEX "platform_canales_adquisicion_isActive_idx" ON "public"."platform_canales_adquisicion"("isActive");

-- CreateIndex
CREATE INDEX "platform_canales_adquisicion_isVisible_idx" ON "public"."platform_canales_adquisicion"("isVisible");

-- CreateIndex
CREATE UNIQUE INDEX "platform_plataformas_redes_sociales_nombre_key" ON "public"."platform_plataformas_redes_sociales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "platform_plataformas_redes_sociales_slug_key" ON "public"."platform_plataformas_redes_sociales"("slug");

-- CreateIndex
CREATE INDEX "platform_plataformas_redes_sociales_isActive_idx" ON "public"."platform_plataformas_redes_sociales"("isActive");

-- CreateIndex
CREATE INDEX "platform_plataformas_redes_sociales_slug_idx" ON "public"."platform_plataformas_redes_sociales"("slug");

-- CreateIndex
CREATE INDEX "platform_lead_bitacora_createdAt_idx" ON "public"."platform_lead_bitacora"("createdAt");

-- CreateIndex
CREATE INDEX "platform_lead_bitacora_leadId_idx" ON "public"."platform_lead_bitacora"("leadId");

-- CreateIndex
CREATE INDEX "platform_lead_bitacora_tipo_idx" ON "public"."platform_lead_bitacora"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "platform_leads_email_key" ON "public"."platform_leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "platform_leads_studioId_key" ON "public"."platform_leads"("studioId");

-- CreateIndex
CREATE INDEX "platform_leads_agentId_idx" ON "public"."platform_leads"("agentId");

-- CreateIndex
CREATE INDEX "platform_leads_campañaId_idx" ON "public"."platform_leads"("campañaId");

-- CreateIndex
CREATE INDEX "platform_leads_canalAdquisicionId_idx" ON "public"."platform_leads"("canalAdquisicionId");

-- CreateIndex
CREATE INDEX "platform_leads_etapaId_prioridad_idx" ON "public"."platform_leads"("etapaId", "prioridad");

-- CreateIndex
CREATE INDEX "platform_notifications_createdAt_idx" ON "public"."platform_notifications"("createdAt");

-- CreateIndex
CREATE INDEX "platform_notifications_scheduledFor_idx" ON "public"."platform_notifications"("scheduledFor");

-- CreateIndex
CREATE INDEX "platform_notifications_tipo_categoria_idx" ON "public"."platform_notifications"("tipo", "categoria");

-- CreateIndex
CREATE INDEX "platform_notifications_userId_isActive_idx" ON "public"."platform_notifications"("userId", "isActive");

-- CreateIndex
CREATE INDEX "platform_notifications_userId_isRead_idx" ON "public"."platform_notifications"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "platform_pipeline_types_nombre_key" ON "public"."platform_pipeline_types"("nombre");

-- CreateIndex
CREATE INDEX "platform_pipeline_types_activo_idx" ON "public"."platform_pipeline_types"("activo");

-- CreateIndex
CREATE INDEX "platform_pipeline_types_orden_idx" ON "public"."platform_pipeline_types"("orden");

-- CreateIndex
CREATE INDEX "platform_pipeline_stages_isActive_idx" ON "public"."platform_pipeline_stages"("isActive");

-- CreateIndex
CREATE INDEX "platform_pipeline_stages_orden_idx" ON "public"."platform_pipeline_stages"("orden");

-- CreateIndex
CREATE INDEX "platform_pipeline_stages_pipeline_type_id_idx" ON "public"."platform_pipeline_stages"("pipeline_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "platform_plataformas_publicidad_nombre_key" ON "public"."platform_plataformas_publicidad"("nombre");

-- CreateIndex
CREATE INDEX "platform_plataformas_publicidad_isActive_idx" ON "public"."platform_plataformas_publicidad"("isActive");

-- CreateIndex
CREATE INDEX "platform_plataformas_publicidad_tipo_idx" ON "public"."platform_plataformas_publicidad"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "platform_plans_slug_key" ON "public"."platform_plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "platform_plans_stripe_price_id_key" ON "public"."platform_plans"("stripe_price_id");

-- CreateIndex
CREATE INDEX "platform_plans_active_orden_idx" ON "public"."platform_plans"("active", "orden");

-- CreateIndex
CREATE INDEX "platform_plans_stripe_price_id_idx" ON "public"."platform_plans"("stripe_price_id");

-- CreateIndex
CREATE INDEX "platform_activities_leadId_createdAt_idx" ON "public"."platform_activities"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "platform_activities_userId_createdAt_idx" ON "public"."platform_activities"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "platform_agents_email_key" ON "public"."platform_agents"("email");

-- CreateIndex
CREATE INDEX "platform_agents_activo_idx" ON "public"."platform_agents"("activo");

-- CreateIndex
CREATE INDEX "platform_campana_plataformas_campañaId_idx" ON "public"."platform_campana_plataformas"("campañaId");

-- CreateIndex
CREATE INDEX "platform_campana_plataformas_plataformaId_idx" ON "public"."platform_campana_plataformas"("plataformaId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_campana_plataformas_campañaId_plataformaId_key" ON "public"."platform_campana_plataformas"("campañaId", "plataformaId");

-- CreateIndex
CREATE INDEX "platform_campanas_fechaInicio_fechaFin_idx" ON "public"."platform_campanas"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "platform_campanas_isActive_idx" ON "public"."platform_campanas"("isActive");

-- CreateIndex
CREATE INDEX "platform_campanas_status_idx" ON "public"."platform_campanas"("status");

-- CreateIndex
CREATE INDEX "platform_campanas_projectId_idx" ON "public"."platform_campanas"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_discount_codes_codigo_key" ON "public"."platform_discount_codes"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "platform_discount_codes_stripe_coupon_id_key" ON "public"."platform_discount_codes"("stripe_coupon_id");

-- CreateIndex
CREATE INDEX "platform_discount_codes_activo_idx" ON "public"."platform_discount_codes"("activo");

-- CreateIndex
CREATE INDEX "platform_discount_codes_fecha_inicio_fecha_fin_idx" ON "public"."platform_discount_codes"("fecha_inicio", "fecha_fin");

-- CreateIndex
CREATE INDEX "platform_discount_codes_stripe_coupon_id_idx" ON "public"."platform_discount_codes"("stripe_coupon_id");

-- CreateIndex
CREATE INDEX "platform_discount_usage_discount_code_id_idx" ON "public"."platform_discount_usage"("discount_code_id");

-- CreateIndex
CREATE INDEX "platform_discount_usage_lead_id_idx" ON "public"."platform_discount_usage"("lead_id");

-- CreateIndex
CREATE INDEX "platform_discount_usage_subscription_id_idx" ON "public"."platform_discount_usage"("subscription_id");

-- CreateIndex
CREATE INDEX "platform_discount_usage_fecha_uso_idx" ON "public"."platform_discount_usage"("fecha_uso");

-- CreateIndex
CREATE UNIQUE INDEX "platform_agent_discount_codes_codigo_completo_key" ON "public"."platform_agent_discount_codes"("codigo_completo");

-- CreateIndex
CREATE UNIQUE INDEX "platform_agent_discount_codes_stripe_coupon_id_key" ON "public"."platform_agent_discount_codes"("stripe_coupon_id");

-- CreateIndex
CREATE INDEX "platform_agent_discount_codes_lead_id_idx" ON "public"."platform_agent_discount_codes"("lead_id");

-- CreateIndex
CREATE INDEX "platform_agent_discount_codes_agente_id_idx" ON "public"."platform_agent_discount_codes"("agente_id");

-- CreateIndex
CREATE INDEX "platform_agent_discount_codes_codigo_completo_idx" ON "public"."platform_agent_discount_codes"("codigo_completo");

-- CreateIndex
CREATE INDEX "platform_agent_discount_codes_usado_idx" ON "public"."platform_agent_discount_codes"("usado");

-- CreateIndex
CREATE INDEX "platform_agent_discount_codes_fecha_expiracion_idx" ON "public"."platform_agent_discount_codes"("fecha_expiracion");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_email_key" ON "public"."projects"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_stripeCustomerId_key" ON "public"."projects"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_stripeSubscriptionId_key" ON "public"."projects"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_stripeAccountId_key" ON "public"."projects"("stripeAccountId");

-- CreateIndex
CREATE INDEX "projects_planId_idx" ON "public"."projects"("planId");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "project_configuraciones_projectId_idx" ON "public"."project_configuraciones"("projectId");

-- CreateIndex
CREATE INDEX "project_agenda_projectId_idx" ON "public"."project_agenda"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_agenda_tipos_nombre_key" ON "public"."project_agenda_tipos"("nombre");

-- CreateIndex
CREATE INDEX "project_campanas_projectId_idx" ON "public"."project_campanas"("projectId");

-- CreateIndex
CREATE INDEX "project_campanas_status_idx" ON "public"."project_campanas"("status");

-- CreateIndex
CREATE INDEX "project_campanas_fechaInicio_fechaFin_idx" ON "public"."project_campanas"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "project_clientes_projectId_email_idx" ON "public"."project_clientes"("projectId", "email");

-- CreateIndex
CREATE INDEX "project_clientes_projectId_status_idx" ON "public"."project_clientes"("projectId", "status");

-- CreateIndex
CREATE INDEX "project_clientes_projectId_telefono_idx" ON "public"."project_clientes"("projectId", "telefono");

-- CreateIndex
CREATE INDEX "project_condiciones_comerciales_projectId_idx" ON "public"."project_condiciones_comerciales"("projectId");

-- CreateIndex
CREATE INDEX "project_cotizaciones_eventoId_idx" ON "public"."project_cotizaciones"("eventoId");

-- CreateIndex
CREATE INDEX "project_cotizaciones_projectId_status_idx" ON "public"."project_cotizaciones"("projectId", "status");

-- CreateIndex
CREATE INDEX "project_eventos_clienteId_idx" ON "public"."project_eventos"("clienteId");

-- CreateIndex
CREATE INDEX "project_eventos_fecha_evento_idx" ON "public"."project_eventos"("fecha_evento");

-- CreateIndex
CREATE INDEX "project_eventos_projectId_status_idx" ON "public"."project_eventos"("projectId", "status");

-- CreateIndex
CREATE INDEX "project_gastos_eventoId_idx" ON "public"."project_gastos"("eventoId");

-- CreateIndex
CREATE INDEX "project_gastos_fecha_categoria_idx" ON "public"."project_gastos"("fecha", "categoria");

-- CreateIndex
CREATE INDEX "project_gastos_projectId_idx" ON "public"."project_gastos"("projectId");

-- CreateIndex
CREATE INDEX "project_metodos_pago_projectId_idx" ON "public"."project_metodos_pago"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_nomina_servicios_nominaId_cotizacionServicioId_key" ON "public"."project_nomina_servicios"("nominaId", "cotizacionServicioId");

-- CreateIndex
CREATE INDEX "project_nominas_projectId_idx" ON "public"."project_nominas"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "project_pagos_stripe_session_id_key" ON "public"."project_pagos"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_pagos_stripe_payment_id_key" ON "public"."project_pagos"("stripe_payment_id");

-- CreateIndex
CREATE INDEX "project_paquetes_projectId_status_idx" ON "public"."project_paquetes"("projectId", "status");

-- CreateIndex
CREATE INDEX "project_revenue_products_categoria_activo_idx" ON "public"."project_revenue_products"("categoria", "activo");

-- CreateIndex
CREATE INDEX "project_revenue_transactions_status_idx" ON "public"."project_revenue_transactions"("status");

-- CreateIndex
CREATE INDEX "project_revenue_transactions_projectId_transactionDate_idx" ON "public"."project_revenue_transactions"("projectId", "transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "project_seccion_categorias_categoriaId_key" ON "public"."project_seccion_categorias"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "project_servicio_categorias_nombre_key" ON "public"."project_servicio_categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "project_servicio_secciones_nombre_key" ON "public"."project_servicio_secciones"("nombre");

-- CreateIndex
CREATE INDEX "project_servicios_projectId_status_idx" ON "public"."project_servicios"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "project_sesiones_token_key" ON "public"."project_sesiones"("token");

-- CreateIndex
CREATE INDEX "project_studio_revenue_products_projectId_activo_idx" ON "public"."project_studio_revenue_products"("projectId", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "project_studio_revenue_products_projectId_revenueProductId_key" ON "public"."project_studio_revenue_products"("projectId", "revenueProductId");

-- CreateIndex
CREATE UNIQUE INDEX "project_users_email_key" ON "public"."project_users"("email");

-- CreateIndex
CREATE INDEX "project_users_email_idx" ON "public"."project_users"("email");

-- CreateIndex
CREATE INDEX "project_users_projectId_status_idx" ON "public"."project_users"("projectId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "project_user_profiles_email_key" ON "public"."project_user_profiles"("email");

-- CreateIndex
CREATE INDEX "project_user_profiles_email_idx" ON "public"."project_user_profiles"("email");

-- CreateIndex
CREATE INDEX "project_user_profiles_role_idx" ON "public"."project_user_profiles"("role");

-- CreateIndex
CREATE INDEX "project_user_profiles_projectId_idx" ON "public"."project_user_profiles"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "public"."subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "public"."subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "public"."subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_studio_id_idx" ON "public"."subscriptions"("studio_id");

-- CreateIndex
CREATE INDEX "plan_services_plan_id_idx" ON "public"."plan_services"("plan_id");

-- CreateIndex
CREATE INDEX "plan_services_service_id_idx" ON "public"."plan_services"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_services_plan_id_service_id_key" ON "public"."plan_services"("plan_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "public"."service_categories"("name");

-- CreateIndex
CREATE INDEX "service_categories_active_posicion_idx" ON "public"."service_categories"("active", "posicion");

-- CreateIndex
CREATE INDEX "project_telefonos_projectId_idx" ON "public"."project_telefonos"("projectId");

-- CreateIndex
CREATE INDEX "project_telefonos_projectId_activo_idx" ON "public"."project_telefonos"("projectId", "activo");

-- CreateIndex
CREATE INDEX "project_horarios_atencion_projectId_idx" ON "public"."project_horarios_atencion"("projectId");

-- CreateIndex
CREATE INDEX "project_horarios_atencion_projectId_dia_semana_idx" ON "public"."project_horarios_atencion"("projectId", "dia_semana");

-- CreateIndex
CREATE UNIQUE INDEX "project_horarios_atencion_projectId_dia_semana_key" ON "public"."project_horarios_atencion"("projectId", "dia_semana");

-- CreateIndex
CREATE INDEX "project_redes_sociales_projectId_idx" ON "public"."project_redes_sociales"("projectId");

-- CreateIndex
CREATE INDEX "project_redes_sociales_projectId_plataformaId_idx" ON "public"."project_redes_sociales"("projectId", "plataformaId");

-- CreateIndex
CREATE UNIQUE INDEX "project_redes_sociales_projectId_plataformaId_key" ON "public"."project_redes_sociales"("projectId", "plataformaId");

-- CreateIndex
CREATE INDEX "_CondicionesComercialesMetodoPagoToCotizacion_B_index" ON "public"."_CondicionesComercialesMetodoPagoToCotizacion"("B");

-- AddForeignKey
ALTER TABLE "public"."platform_billing_cycles" ADD CONSTRAINT "platform_billing_cycles_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_services" ADD CONSTRAINT "platform_services_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_lead_bitacora" ADD CONSTRAINT "platform_lead_bitacora_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."platform_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_lead_bitacora" ADD CONSTRAINT "platform_lead_bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."project_user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_leads" ADD CONSTRAINT "platform_leads_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."platform_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_leads" ADD CONSTRAINT "platform_leads_campañaId_fkey" FOREIGN KEY ("campañaId") REFERENCES "public"."platform_campanas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_leads" ADD CONSTRAINT "platform_leads_canalAdquisicionId_fkey" FOREIGN KEY ("canalAdquisicionId") REFERENCES "public"."platform_canales_adquisicion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_leads" ADD CONSTRAINT "platform_leads_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "public"."platform_pipeline_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_leads" ADD CONSTRAINT "platform_leads_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_notifications" ADD CONSTRAINT "platform_notifications_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."platform_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_notifications" ADD CONSTRAINT "platform_notifications_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."platform_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_notifications" ADD CONSTRAINT "platform_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_pipeline_stages" ADD CONSTRAINT "platform_pipeline_stages_pipeline_type_id_fkey" FOREIGN KEY ("pipeline_type_id") REFERENCES "public"."platform_pipeline_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_activities" ADD CONSTRAINT "platform_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."platform_leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_activities" ADD CONSTRAINT "platform_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_campana_plataformas" ADD CONSTRAINT "platform_campana_plataformas_campañaId_fkey" FOREIGN KEY ("campañaId") REFERENCES "public"."platform_campanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_campana_plataformas" ADD CONSTRAINT "platform_campana_plataformas_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "public"."platform_plataformas_publicidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_campanas" ADD CONSTRAINT "platform_campanas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_discount_usage" ADD CONSTRAINT "platform_discount_usage_discount_code_id_fkey" FOREIGN KEY ("discount_code_id") REFERENCES "public"."platform_discount_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_discount_usage" ADD CONSTRAINT "platform_discount_usage_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."platform_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_discount_usage" ADD CONSTRAINT "platform_discount_usage_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_agent_discount_codes" ADD CONSTRAINT "platform_agent_discount_codes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."platform_leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_agent_discount_codes" ADD CONSTRAINT "platform_agent_discount_codes_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "public"."platform_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platform_agent_discount_codes" ADD CONSTRAINT "platform_agent_discount_codes_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."platform_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_configuraciones" ADD CONSTRAINT "project_configuraciones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_agenda" ADD CONSTRAINT "project_agenda_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."project_eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_agenda" ADD CONSTRAINT "project_agenda_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_agenda" ADD CONSTRAINT "project_agenda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_campanas" ADD CONSTRAINT "project_campanas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_clientes" ADD CONSTRAINT "project_clientes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_condiciones_comerciales" ADD CONSTRAINT "project_condiciones_comerciales_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_condiciones_comerciales_metodo_pago" ADD CONSTRAINT "project_condiciones_comerciales_metodo_pago_condicionesCom_fkey" FOREIGN KEY ("condicionesComercialesId") REFERENCES "public"."project_condiciones_comerciales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_condiciones_comerciales_metodo_pago" ADD CONSTRAINT "project_condiciones_comerciales_metodo_pago_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "public"."project_metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizacion_costos" ADD CONSTRAINT "project_cotizacion_costos_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."project_cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizacion_servicios" ADD CONSTRAINT "project_cotizacion_servicios_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."project_cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizacion_servicios" ADD CONSTRAINT "project_cotizacion_servicios_servicioCategoriaId_fkey" FOREIGN KEY ("servicioCategoriaId") REFERENCES "public"."project_servicio_categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizacion_servicios" ADD CONSTRAINT "project_cotizacion_servicios_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."project_servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizacion_servicios" ADD CONSTRAINT "project_cotizacion_servicios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizacion_visitas" ADD CONSTRAINT "project_cotizacion_visitas_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."project_cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizaciones" ADD CONSTRAINT "project_cotizaciones_condicionesComercialesId_fkey" FOREIGN KEY ("condicionesComercialesId") REFERENCES "public"."project_condiciones_comerciales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizaciones" ADD CONSTRAINT "project_cotizaciones_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."project_eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizaciones" ADD CONSTRAINT "project_cotizaciones_eventoTipoId_fkey" FOREIGN KEY ("eventoTipoId") REFERENCES "public"."project_evento_tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_cotizaciones" ADD CONSTRAINT "project_cotizaciones_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_evento_bitacoras" ADD CONSTRAINT "project_evento_bitacoras_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."project_eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_eventos" ADD CONSTRAINT "project_eventos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."project_clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_eventos" ADD CONSTRAINT "project_eventos_eventoEtapaId_fkey" FOREIGN KEY ("eventoEtapaId") REFERENCES "public"."project_evento_etapas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_eventos" ADD CONSTRAINT "project_eventos_eventoTipoId_fkey" FOREIGN KEY ("eventoTipoId") REFERENCES "public"."project_evento_tipos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_eventos" ADD CONSTRAINT "project_eventos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_eventos" ADD CONSTRAINT "project_eventos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_gastos" ADD CONSTRAINT "project_gastos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."project_eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_gastos" ADD CONSTRAINT "project_gastos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_gastos" ADD CONSTRAINT "project_gastos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."project_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_metodos_pago" ADD CONSTRAINT "project_metodos_pago_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nomina_servicios" ADD CONSTRAINT "project_nomina_servicios_cotizacionServicioId_fkey" FOREIGN KEY ("cotizacionServicioId") REFERENCES "public"."project_cotizacion_servicios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nomina_servicios" ADD CONSTRAINT "project_nomina_servicios_nominaId_fkey" FOREIGN KEY ("nominaId") REFERENCES "public"."project_nominas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nominas" ADD CONSTRAINT "project_nominas_autorizado_por_fkey" FOREIGN KEY ("autorizado_por") REFERENCES "public"."project_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nominas" ADD CONSTRAINT "project_nominas_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "public"."project_eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nominas" ADD CONSTRAINT "project_nominas_pagado_por_fkey" FOREIGN KEY ("pagado_por") REFERENCES "public"."project_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nominas" ADD CONSTRAINT "project_nominas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_nominas" ADD CONSTRAINT "project_nominas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_pagos" ADD CONSTRAINT "project_pagos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."project_clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_pagos" ADD CONSTRAINT "project_pagos_condicionesComercialesId_fkey" FOREIGN KEY ("condicionesComercialesId") REFERENCES "public"."project_condiciones_comerciales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_pagos" ADD CONSTRAINT "project_pagos_condicionesComercialesMetodoPagoId_fkey" FOREIGN KEY ("condicionesComercialesMetodoPagoId") REFERENCES "public"."project_condiciones_comerciales_metodo_pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_pagos" ADD CONSTRAINT "project_pagos_cotizacionId_fkey" FOREIGN KEY ("cotizacionId") REFERENCES "public"."project_cotizaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_pagos" ADD CONSTRAINT "project_pagos_metodoPagoId_fkey" FOREIGN KEY ("metodoPagoId") REFERENCES "public"."project_metodos_pago"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_pagos" ADD CONSTRAINT "project_pagos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_paquete_servicios" ADD CONSTRAINT "project_paquete_servicios_paqueteId_fkey" FOREIGN KEY ("paqueteId") REFERENCES "public"."project_paquetes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_paquete_servicios" ADD CONSTRAINT "project_paquete_servicios_servicioCategoriaId_fkey" FOREIGN KEY ("servicioCategoriaId") REFERENCES "public"."project_servicio_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_paquete_servicios" ADD CONSTRAINT "project_paquete_servicios_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."project_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_paquetes" ADD CONSTRAINT "project_paquetes_eventoTipoId_fkey" FOREIGN KEY ("eventoTipoId") REFERENCES "public"."project_evento_tipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_paquetes" ADD CONSTRAINT "project_paquetes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_revenue_transactions" ADD CONSTRAINT "project_revenue_transactions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_seccion_categorias" ADD CONSTRAINT "project_seccion_categorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."project_servicio_categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_seccion_categorias" ADD CONSTRAINT "project_seccion_categorias_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "public"."project_servicio_secciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_servicio_gastos" ADD CONSTRAINT "project_servicio_gastos_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "public"."project_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_servicios" ADD CONSTRAINT "project_servicios_servicioCategoriaId_fkey" FOREIGN KEY ("servicioCategoriaId") REFERENCES "public"."project_servicio_categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_servicios" ADD CONSTRAINT "project_servicios_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_sesiones" ADD CONSTRAINT "project_sesiones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."project_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_studio_revenue_products" ADD CONSTRAINT "project_studio_revenue_products_revenueProductId_fkey" FOREIGN KEY ("revenueProductId") REFERENCES "public"."project_revenue_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_studio_revenue_products" ADD CONSTRAINT "project_studio_revenue_products_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_users" ADD CONSTRAINT "project_users_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_user_profiles" ADD CONSTRAINT "project_user_profiles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."platform_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_services" ADD CONSTRAINT "plan_services_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."platform_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plan_services" ADD CONSTRAINT "plan_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."platform_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_telefonos" ADD CONSTRAINT "project_telefonos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_horarios_atencion" ADD CONSTRAINT "project_horarios_atencion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_redes_sociales" ADD CONSTRAINT "project_redes_sociales_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_redes_sociales" ADD CONSTRAINT "project_redes_sociales_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "public"."platform_plataformas_redes_sociales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CondicionesComercialesMetodoPagoToCotizacion" ADD CONSTRAINT "_CondicionesComercialesMetodoPagoToCotizacion_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."project_condiciones_comerciales_metodo_pago"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CondicionesComercialesMetodoPagoToCotizacion" ADD CONSTRAINT "_CondicionesComercialesMetodoPagoToCotizacion_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."project_cotizaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
