'use client';

import React, { useState } from 'react';
import { ZenInput, ZenButton } from '@/components/ui/zen';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onClear: () => void;
    initialQuery?: string;
}

export function SearchBar({ onSearch, onClear, initialQuery = '' }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
            <div className="relative flex-grow">
                <ZenInput
                    placeholder="Buscar por nombre o descripción..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    icon={Search}
                    iconPosition="left"
                    className="w-full"
                />
                {query && (
                    <ZenButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                    </ZenButton>
                )}
            </div>
            <ZenButton type="submit">Buscar</ZenButton>
        </form>
    );
}
