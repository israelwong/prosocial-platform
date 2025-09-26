# 🎯 TypeScript Best Practices - ProSocial Platform

## 🚨 **REGLA FUNDAMENTAL: NUNCA USAR `any`**

### ❌ **PROHIBIDO**
```typescript
// ❌ NUNCA HACER ESTO
const data: any = await fetchData();
const user: any = { name: "John" };
function processData(input: any): any { ... }
```

### ✅ **CORRECTO**
```typescript
// ✅ SIEMPRE HACER ESTO
interface UserData {
  name: string;
  email: string;
  id: string;
}

const data: UserData = await fetchData();
const user: UserData = { name: "John", email: "john@example.com", id: "1" };
function processData(input: UserData): ProcessedData { ... }
```

---

## 🏗️ **TIPADO FUERTE EN PRISMA**

### ✅ **Interfaces para Modelos**
```typescript
// ✅ Definir interfaces para todos los modelos
interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  etapaId: string | null;
  agentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PipelineStage {
  id: string;
  nombre: string;
  descripcion?: string;
  color: string;
  orden: number;
  isActive: boolean;
}
```

### ✅ **Tipos para Respuestas de API**
```typescript
// ✅ Tipar respuestas de API
interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

interface LeadsResponse extends ApiResponse<Lead[]> {
  total: number;
  page: number;
}
```

---

## 🔧 **TIPADO EN COMPONENTES REACT**

### ✅ **Props Tipadas**
```typescript
// ✅ Props siempre tipadas
interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  isLoading?: boolean;
}

export function LeadCard({ lead, onEdit, onDelete, isLoading = false }: LeadCardProps) {
  // Componente implementado
}
```

### ✅ **Estados Tipados**
```typescript
// ✅ Estados con tipos específicos
interface KanbanState {
  columns: KanbanColumn[];
  loading: boolean;
  error: string | null;
  activeLead: Lead | null;
}

const [state, setState] = useState<KanbanState>({
  columns: [],
  loading: false,
  error: null,
  activeLead: null
});
```

---

## 🎯 **TIPADO EN API ROUTES**

### ✅ **Request/Response Tipados**
```typescript
// ✅ Tipar requests y responses
interface CreateLeadRequest {
  nombre: string;
  email: string;
  telefono: string;
  etapaId?: string;
}

interface CreateLeadResponse {
  success: boolean;
  data?: Lead;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CreateLeadResponse>> {
  try {
    const body: CreateLeadRequest = await request.json();
    
    // Validar datos
    if (!body.nombre || !body.email) {
      return NextResponse.json({
        success: false,
        error: "Nombre y email son requeridos"
      }, { status: 400 });
    }
    
    // Crear lead
    const lead = await prisma.prosocial_leads.create({
      data: body
    });
    
    return NextResponse.json({
      success: true,
      data: lead
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor"
    }, { status: 500 });
  }
}
```

---

## 🔄 **TIPADO EN HOOKS PERSONALIZADOS**

### ✅ **Hooks Tipados**
```typescript
// ✅ Hooks con tipos específicos
interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createLead: (data: CreateLeadRequest) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export function useLeads(): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Implementación del hook
  
  return {
    leads,
    loading,
    error,
    refetch,
    createLead,
    updateLead,
    deleteLead
  };
}
```

---

## 🎨 **TIPADO EN FORMULARIOS**

### ✅ **Formularios Tipados**
```typescript
// ✅ Usar react-hook-form con tipos
interface LeadFormData {
  nombre: string;
  email: string;
  telefono: string;
  etapaId: string;
  planInteres?: string;
  presupuestoMensual?: number;
}

export function LeadForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormData>();
  
  const onSubmit = async (data: LeadFormData) => {
    // data está completamente tipado
    console.log(data.nombre); // ✅ TypeScript sabe que es string
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register("nombre", { required: true })} 
        placeholder="Nombre del lead"
      />
      {errors.nombre && <span>Nombre es requerido</span>}
    </form>
  );
}
```

---

## 🚀 **TIPADO EN UTILIDADES**

### ✅ **Funciones Utilitarias Tipadas**
```typescript
// ✅ Funciones con tipos específicos
type LeadStatus = 'nuevo' | 'en_contacto' | 'demo_agendada' | 'convertido' | 'archivado';

interface LeadWithStatus extends Lead {
  status: LeadStatus;
}

function getLeadStatus(lead: Lead): LeadStatus {
  if (!lead.etapaId) return 'nuevo';
  if (lead.fechaUltimoContacto) return 'en_contacto';
  return 'nuevo';
}

function filterLeadsByStatus(leads: Lead[], status: LeadStatus): LeadWithStatus[] {
  return leads
    .map(lead => ({ ...lead, status: getLeadStatus(lead) }))
    .filter(lead => lead.status === status);
}
```

---

## 🔍 **TIPADO EN QUERIES DE PRISMA**

### ✅ **Queries Tipadas**
```typescript
// ✅ Tipar queries de Prisma
interface LeadWithRelations {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  etapaId: string | null;
  agentId: string | null;
  prosocial_agents: {
    id: string;
    nombre: string;
    email: string;
  } | null;
  prosocial_pipeline_stages: {
    id: string;
    nombre: string;
    color: string;
  } | null;
}

async function getLeadsWithRelations(): Promise<LeadWithRelations[]> {
  const leads = await prisma.prosocial_leads.findMany({
    include: {
      prosocial_agents: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      prosocial_pipeline_stages: {
        select: {
          id: true,
          nombre: true,
          color: true
        }
      }
    }
  });
  
  return leads as LeadWithRelations[];
}
```

---

## 🎯 **PATRONES AVANZADOS**

### ✅ **Generic Types**
```typescript
// ✅ Usar generics para reutilización
interface ApiEndpoint<T, K> {
  get: () => Promise<ApiResponse<T[]>>;
  getById: (id: string) => Promise<ApiResponse<T>>;
  create: (data: K) => Promise<ApiResponse<T>>;
  update: (id: string, data: Partial<K>) => Promise<ApiResponse<T>>;
  delete: (id: string) => Promise<ApiResponse<void>>;
}

type LeadsEndpoint = ApiEndpoint<Lead, CreateLeadRequest>;
type StagesEndpoint = ApiEndpoint<PipelineStage, CreateStageRequest>;
```

### ✅ **Union Types**
```typescript
// ✅ Usar union types para estados
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface ComponentState {
  status: LoadingState;
  data: Lead[] | null;
  error: string | null;
}
```

---

## 🚨 **ANTI-PATRONES A EVITAR**

### ❌ **NO HACER**
```typescript
// ❌ Evitar estos patrones
const data: any = await fetchData();
const result = data.someProperty; // No hay type safety

function process(input: any): any {
  return input.whatever; // Peligroso
}

// ❌ No usar object genérico
const config: object = { ... };
config.someProperty; // Error de compilación
```

### ✅ **HACER EN SU LUGAR**
```typescript
// ✅ Usar tipos específicos
interface ConfigData {
  apiUrl: string;
  timeout: number;
  retries: number;
}

const data: ConfigData = await fetchData();
const result = data.apiUrl; // Type safe

function process(input: ConfigData): ProcessedConfig {
  return { ...input, processed: true };
}
```

---

## 📋 **CHECKLIST DE TYPESCRIPT**

### ✅ **Antes de Commit**
- [ ] No hay usos de `any`
- [ ] Todas las props están tipadas
- [ ] Todas las funciones tienen tipos de retorno
- [ ] Todas las interfaces están definidas
- [ ] Los estados de React están tipados
- [ ] Las respuestas de API están tipadas
- [ ] No hay errores de TypeScript

### ✅ **En Code Review**
- [ ] Verificar que no se use `any`
- [ ] Revisar que los tipos sean específicos
- [ ] Validar que las interfaces sean completas
- [ ] Confirmar que los generics sean apropiados

---

## 🎯 **BENEFICIOS DEL TIPADO FUERTE**

1. **🔍 Detección Temprana de Errores**: Errores encontrados en tiempo de compilación
2. **🧠 Mejor IntelliSense**: Autocompletado más preciso en IDE
3. **📚 Documentación Automática**: Código auto-documentado
4. **🔄 Refactoring Seguro**: Cambios más seguros y predecibles
5. **👥 Mejor Colaboración**: Código más fácil de entender para el equipo
6. **🚀 Mejor Performance**: Optimizaciones del compilador

---

**Recuerda: El tipado fuerte no es una limitación, es una herramienta que nos ayuda a escribir código más robusto y mantenible.**
