'use client';

import React, { useState } from 'react';
import { ZenInput } from '@/components/ui/zen';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onClear: () => void;
    initialQuery?: string;
}

export function SearchBar({ onSearch, onClear, initialQuery = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        // Filtrar en tiempo real
        onSearch(newQuery);
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <div className="relative w-full">
            <ZenInput
                placeholder="Buscar items..."
                value={query}
                onChange={handleChange}
                icon={Search}
                iconPosition="left"
                className="w-full pr-10"
            />
            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Limpiar búsqueda"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
