"use client";

import { useEffect } from 'react';
import { usePlatformConfig } from '@/hooks/usePlatformConfig';

export function DynamicMetadata() {
    const { config } = usePlatformConfig();

    useEffect(() => {
        if (config) {
            // Actualizar el título de la página
            document.title = config.nombre_empresa;

            // Actualizar meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription && config.meta_description) {
                metaDescription.setAttribute('content', config.meta_description);
            }

            // Actualizar meta keywords
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords && config.meta_keywords) {
                metaKeywords.setAttribute('content', config.meta_keywords);
            }

            // Actualizar favicon
            const favicon = document.querySelector('link[rel="icon"]');
            if (favicon && config.favicon_url) {
                favicon.setAttribute('href', config.favicon_url);
            }

            // Actualizar Open Graph
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                ogTitle.setAttribute('content', config.nombre_empresa);
            }

            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription && config.meta_description) {
                ogDescription.setAttribute('content', config.meta_description);
            }

            const ogSiteName = document.querySelector('meta[property="og:site_name"]');
            if (ogSiteName) {
                ogSiteName.setAttribute('content', config.nombre_empresa);
            }

            // Actualizar Twitter
            const twitterTitle = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitle) {
                twitterTitle.setAttribute('content', config.nombre_empresa);
            }

            const twitterDescription = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescription && config.meta_description) {
                twitterDescription.setAttribute('content', config.meta_description);
            }
        }
    }, [config]);

    return null; // Este componente no renderiza nada
}
