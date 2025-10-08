import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
    console.log("🎯 WEBHOOK STRIPE SUBSCRIPTIONS - Evento recibido");

    if (!endpointSecret) {
        console.error("❌ STRIPE_WEBHOOK_SECRET no está configurado");
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    const body = await request.text();
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
        console.error("❌ No se encontró stripe-signature en headers");
        return NextResponse.json(
            { error: "No stripe signature found" },
            { status: 400 }
        );
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        console.log("✅ Webhook verificado:", event.type);
    } catch (err) {
        console.error("❌ Error verificando webhook:", err);
        return NextResponse.json(
            { error: `Webhook Error: ${err}` },
            { status: 400 }
        );
    }

    try {
        console.log(`🔔 Procesando evento de suscripción: ${event.type}`);
        console.log("📋 Datos del evento:", JSON.stringify(event.data.object, null, 2));

        switch (event.type) {
            // 🎯 SUBSCRIPTION EVENTS
            case "customer.subscription.created":
                await handleSubscriptionCreated(event.data.object);
                break;

            case "customer.subscription.updated":
                await handleSubscriptionUpdated(event.data.object);
                break;

            case "customer.subscription.deleted":
                await handleSubscriptionDeleted(event.data.object);
                break;

            case "customer.subscription.trial_will_end":
                await handleSubscriptionTrialWillEnd(event.data.object);
                break;

            // 💳 INVOICE EVENTS
            case "invoice.payment_succeeded":
                await handleInvoicePaymentSucceeded(event.data.object);
                break;

            case "invoice.payment_failed":
                await handleInvoicePaymentFailed(event.data.object);
                break;

            case "invoice.created":
                await handleInvoiceCreated(event.data.object);
                break;

            // 🚨 CUSTOMER EVENTS
            case "customer.created":
                await handleCustomerCreated(event.data.object);
                break;

            case "customer.updated":
                await handleCustomerUpdated(event.data.object);
                break;

            default:
                console.log(`🔔 Evento no manejado: ${event.type}`);
        }

        return NextResponse.json({ received: true, type: event.type });
    } catch (error) {
        console.error("❌ Error procesando webhook:", error);
        return NextResponse.json(
            { error: "Webhook processing failed", details: error.message },
            { status: 500 }
        );
    }
}

// 🎯 SUBSCRIPTION HANDLERS

async function handleSubscriptionCreated(subscription: any) {
    console.log("✅ Suscripción creada:", subscription.id);
    console.log("📊 Metadata:", subscription.metadata);

    const { studio_id } = subscription.metadata;

    if (!studio_id) {
        console.error("❌ No se encontró studio_id en metadata");
        return;
    }

    try {
        // Buscar el plan por stripe_price_id
        const priceId = subscription.items.data[0].price.id;
        const plan = await prisma.plan.findFirst({
            where: { stripe_price_id: priceId },
        });

        if (!plan) {
            console.error(`❌ No se encontró plan para price_id: ${priceId}`);
            return;
        }

        // Crear o actualizar suscripción en base de datos
        const dbSubscription = await prisma.subscription.upsert({
            where: { stripe_subscription_id: subscription.id },
            update: {
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                billing_cycle_anchor: new Date(subscription.billing_cycle_anchor * 1000),
                updated_at: new Date(),
            },
            create: {
                studio_id,
                stripe_subscription_id: subscription.id,
                stripe_customer_id: subscription.customer,
                plan_id: plan.id,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                billing_cycle_anchor: new Date(subscription.billing_cycle_anchor * 1000),
            },
        });

        // Actualizar estado del estudio
        await prisma.studio.update({
            where: { id: studio_id },
            data: {
                is_active: subscription.status === "active",
                updated_at: new Date(),
            },
        });

        console.log("✅ Suscripción creada en BD:", {
            subscriptionId: dbSubscription.id,
            studioId: studio_id,
            planId: plan.id,
            status: subscription.status,
        });
    } catch (error) {
        console.error("❌ Error creando suscripción:", error);
        throw error;
    }
}

async function handleSubscriptionUpdated(subscription: any) {
    console.log("🔄 Suscripción actualizada:", subscription.id);

    try {
        // Buscar el plan por stripe_price_id
        const priceId = subscription.items.data[0].price.id;
        const plan = await prisma.plan.findFirst({
            where: { stripe_price_id: priceId },
        });

        if (!plan) {
            console.error(`❌ No se encontró plan para price_id: ${priceId}`);
            return;
        }

        // Actualizar suscripción en base de datos
        const updatedSubscription = await prisma.subscription.update({
            where: { stripe_subscription_id: subscription.id },
            data: {
                plan_id: plan.id,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000),
                current_period_end: new Date(subscription.current_period_end * 1000),
                billing_cycle_anchor: new Date(subscription.billing_cycle_anchor * 1000),
                updated_at: new Date(),
            },
        });

        // Actualizar estado del estudio
        await prisma.studio.update({
            where: { id: updatedSubscription.studio_id },
            data: {
                is_active: subscription.status === "active",
                updated_at: new Date(),
            },
        });

        console.log("✅ Suscripción actualizada:", {
            subscriptionId: updatedSubscription.id,
            studioId: updatedSubscription.studio_id,
            newPlanId: plan.id,
            status: subscription.status,
        });
    } catch (error) {
        console.error("❌ Error actualizando suscripción:", error);
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription: any) {
    console.log("🗑️ Suscripción cancelada:", subscription.id);

    try {
        // Actualizar suscripción en base de datos
        const updatedSubscription = await prisma.subscription.update({
            where: { stripe_subscription_id: subscription.id },
            data: {
                status: "canceled",
                updated_at: new Date(),
            },
        });

        // Desactivar estudio
        await prisma.studio.update({
            where: { id: updatedSubscription.studio_id },
            data: {
                is_active: false,
                updated_at: new Date(),
            },
        });

        console.log("✅ Suscripción cancelada:", {
            subscriptionId: updatedSubscription.id,
            studioId: updatedSubscription.studio_id,
        });
    } catch (error) {
        console.error("❌ Error cancelando suscripción:", error);
        throw error;
    }
}

async function handleSubscriptionTrialWillEnd(subscription: any) {
    console.log("⏰ Trial terminará pronto:", subscription.id);
    console.log("📅 Trial end:", new Date(subscription.trial_end * 1000));

    // Aquí podrías enviar un email al usuario notificando que el trial terminará
    // Por ahora solo lo registramos
}

// 💳 INVOICE HANDLERS

async function handleInvoicePaymentSucceeded(invoice: any) {
    console.log("✅ Pago de factura exitoso:", invoice.id);

    if (invoice.subscription) {
        try {
            // Crear registro de billing cycle
            const subscription = await prisma.subscription.findFirst({
                where: { stripe_subscription_id: invoice.subscription },
            });

            if (subscription) {
                await prisma.billingCycle.create({
                    data: {
                        subscription_id: subscription.id,
                        period_start: new Date(invoice.period_start * 1000),
                        period_end: new Date(invoice.period_end * 1000),
                        amount: invoice.amount_paid / 100, // Convertir de centavos
                        status: "paid",
                        stripe_invoice_id: invoice.id,
                    },
                });

                console.log("✅ Billing cycle creado:", {
                    subscriptionId: subscription.id,
                    amount: invoice.amount_paid / 100,
                    period: `${new Date(invoice.period_start * 1000)} - ${new Date(invoice.period_end * 1000)}`,
                });
            }
        } catch (error) {
            console.error("❌ Error creando billing cycle:", error);
        }
    }
}

async function handleInvoicePaymentFailed(invoice: any) {
    console.log("❌ Pago de factura fallido:", invoice.id);

    if (invoice.subscription) {
        try {
            const subscription = await prisma.subscription.findFirst({
                where: { stripe_subscription_id: invoice.subscription },
            });

            if (subscription) {
                await prisma.billingCycle.create({
                    data: {
                        subscription_id: subscription.id,
                        period_start: new Date(invoice.period_start * 1000),
                        period_end: new Date(invoice.period_end * 1000),
                        amount: invoice.amount_due / 100, // Convertir de centavos
                        status: "failed",
                        stripe_invoice_id: invoice.id,
                    },
                });

                console.log("❌ Billing cycle fallido creado:", {
                    subscriptionId: subscription.id,
                    amount: invoice.amount_due / 100,
                });
            }
        } catch (error) {
            console.error("❌ Error creando billing cycle fallido:", error);
        }
    }
}

async function handleInvoiceCreated(invoice: any) {
    console.log("📄 Factura creada:", invoice.id);
    console.log("💰 Monto:", invoice.amount_due / 100);
    console.log("📅 Fecha de vencimiento:", new Date(invoice.due_date * 1000));
}

// 🚨 CUSTOMER HANDLERS

async function handleCustomerCreated(customer: any) {
    console.log("👤 Cliente creado:", customer.id);
    console.log("📧 Email:", customer.email);
    console.log("📊 Metadata:", customer.metadata);
}

async function handleCustomerUpdated(customer: any) {
    console.log("🔄 Cliente actualizado:", customer.id);
    console.log("📧 Email:", customer.email);
}
