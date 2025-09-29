'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

// Debounce helper
function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function SearchBar({ onSearch, placeholder }: SearchBarProps) {
    const [query, setQuery] = useState('');

    // Debounce para evitar búsquedas excesivas
    const debouncedSearch = useMemo(
        () => debounce((q: string) => onSearch(q), 300),
        [onSearch]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder || "Buscar servicios por nombre, categoría o sección..."}
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    aria-label="Limpiar búsqueda"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
