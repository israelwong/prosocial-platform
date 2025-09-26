// UI Components - Exports centralizados
// Maneja tanto componentes Shadcn como ZEN Design System

// =============================================================================
// SHADCN COMPONENTS (Existentes)
// =============================================================================
export { Button, buttonVariants } from './shadcn/button';
export { Input } from './shadcn/input';
export { Label } from './shadcn/label';
export { Textarea } from './shadcn/textarea';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './shadcn/card';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './shadcn/dialog';
export { Badge, badgeVariants } from './shadcn/badge';
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './shadcn/select';
export { Checkbox } from './shadcn/checkbox';
export { Switch } from './shadcn/switch';
export { Avatar, AvatarFallback, AvatarImage } from './shadcn/avatar';
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from './shadcn/dropdown-menu';
export { Popover, PopoverContent, PopoverTrigger } from './shadcn/popover';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './shadcn/alert-dialog';
export { Alert, AlertDescription, AlertTitle } from './shadcn/alert';
export { Separator } from './shadcn/separator';
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './shadcn/table';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './shadcn/tabs';
export { Calendar } from './shadcn/calendar';
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFormField } from './shadcn/form';
export { Skeleton } from './shadcn/Skeleton';
export { SkeletonLogo } from './shadcn/SkeletonLogo';
export { LoadingSpinner } from './shadcn/loading-spinner';
export { Dropzone } from './shadcn/dropzone';
export { FilePreview } from './shadcn/file-preview';
export { Modal } from './shadcn/modal';
export { HeaderNavigation } from './shadcn/header-navigation';
export { SectionNavigation } from './shadcn/section-navigation';
export { Logo } from './shadcn/logo';
export { ThemeToggle } from './shadcn/theme-toggle';
export { Toaster } from './shadcn/sonner';

// Shadcn Icons
export { FacebookIcon } from './shadcn/icons/FacebookIcon';
export { InstagramIcon } from './shadcn/icons/InstagramIcon';
export { LinkedInIcon } from './shadcn/icons/LinkedInIcon';
export { RedSocialIcon } from './shadcn/icons/RedSocialIcon';
export { SpotifyIcon } from './shadcn/icons/SpotifyIcon';
export { ThreadsIcon } from './shadcn/icons/ThreadsIcon';
export { TikTokIcon } from './shadcn/icons/TikTokIcon';
export { WhatsAppIcon } from './shadcn/icons/WhatsAppIcon';
export { YouTubeIcon } from './shadcn/icons/YouTubeIcon';

// =============================================================================
// ZEN DESIGN SYSTEM (Nuevos)
// =============================================================================
// Re-export todos los componentes ZEN
export * from './zen';

// =============================================================================
// BACKWARD COMPATIBILITY
// =============================================================================
// Mantener compatibilidad con imports existentes
// Los componentes Shadcn siguen funcionando como antes
// Los nuevos componentes ZEN se pueden usar gradualmente
