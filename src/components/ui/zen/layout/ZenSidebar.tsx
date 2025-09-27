"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ZenCard } from "@/components/ui/zen/base/ZenCard";
import { Button } from "@/components/ui/shadcn/button";
import { Menu, X } from "lucide-react";

interface ZenSidebarProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface ZenSidebarTriggerProps {
  className?: string;
}

interface ZenSidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarGroupProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarGroupLabelProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarGroupContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

interface ZenSidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  isActive?: boolean;
}

// Context para el estado del sidebar
const ZenSidebarContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  toggleSidebar: () => {},
});

// Provider del sidebar
export function ZenSidebarProvider({ children, defaultOpen = false }: ZenSidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggleSidebar = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <ZenSidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </ZenSidebarContext.Provider>
  );
}

// Hook para usar el contexto
export function useZenSidebar() {
  const context = React.useContext(ZenSidebarContext);
  if (!context) {
    throw new Error("useZenSidebar must be used within a ZenSidebarProvider");
  }
  return context;
}

// Componente principal del sidebar
export function ZenSidebar({ children, className }: ZenSidebarProps) {
  const { isOpen } = useZenSidebar();

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:z-auto",
        className
      )}
    >
      <ZenCard 
        variant="default" 
        padding="none" 
        className="h-full w-full border-r border-zinc-800 bg-zinc-900"
      >
        {children}
      </ZenCard>
    </div>
  );
}

// Trigger para abrir/cerrar el sidebar
export function ZenSidebarTrigger({ className }: ZenSidebarTriggerProps) {
  const { toggleSidebar } = useZenSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className={cn(
        "lg:hidden",
        className
      )}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

// Contenido del sidebar
export function ZenSidebarContent({ children, className }: ZenSidebarContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

// Header del sidebar
export function ZenSidebarHeader({ children, className }: ZenSidebarHeaderProps) {
  return (
    <div className={cn("border-b border-zinc-800 p-4", className)}>
      {children}
    </div>
  );
}

// Footer del sidebar
export function ZenSidebarFooter({ children, className }: ZenSidebarFooterProps) {
  return (
    <div className={cn("border-t border-zinc-800 p-4", className)}>
      {children}
    </div>
  );
}

// Grupo del sidebar
export function ZenSidebarGroup({ children, className }: ZenSidebarGroupProps) {
  return (
    <div className={cn("p-4", className)}>
      {children}
    </div>
  );
}

// Label del grupo
export function ZenSidebarGroupLabel({ children, className }: ZenSidebarGroupLabelProps) {
  return (
    <div className={cn("mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider", className)}>
      {children}
    </div>
  );
}

// Contenido del grupo
export function ZenSidebarGroupContent({ children, className }: ZenSidebarGroupContentProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  );
}

// Menú del sidebar
export function ZenSidebarMenu({ children, className }: ZenSidebarMenuProps) {
  return (
    <nav className={cn("space-y-1", className)}>
      {children}
    </nav>
  );
}

// Item del menú
export function ZenSidebarMenuItem({ children, className }: ZenSidebarMenuItemProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
    </div>
  );
}

// Botón del menú
export function ZenSidebarMenuButton({ 
  children, 
  className, 
  asChild = false, 
  isActive = false,
  ...props 
}: ZenSidebarMenuButtonProps) {
  const Comp = asChild ? "div" : "button";

  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-zinc-800 hover:text-white",
        "focus:bg-zinc-800 focus:text-white focus:outline-none",
        isActive && "bg-zinc-800 text-white",
        !isActive && "text-zinc-300",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Overlay para mobile
export function ZenSidebarOverlay() {
  const { isOpen, setIsOpen } = useZenSidebar();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
      onClick={() => setIsOpen(false)}
    />
  );
}
