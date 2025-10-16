// components/ui/paquetes/ServiciosDataTable.tsx

"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    HeaderGroup,
    Header,
    Row,
    Cell,
    Column,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table" // Revisa que la ruta sea correcta
import { ZenButton } from "@/components/ui/zen/base/ZenButton"
import { ZenInput } from "@/components/ui/zen/base/ZenInput"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu" // Revisa que la ruta sea correcta


// Definimos las props que nuestro componente de tabla recibirá
interface ServiciosDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    // 'meta' es el objeto que pasaremos a las celdas para la interactividad
    meta: {
        items: { [servicioId: string]: number },
        updateQuantity: (servicioId: string, cantidad: number) => void
    }
}

export function ServiciosDataTable<TData, TValue>({
    columns,
    data,
    meta,
}: ServiciosDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        // Pasamos el objeto 'meta' para que esté disponible en nuestras 'columns'
        meta,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="space-y-4">
            {/* Barra de herramientas de la tabla: Filtros y visibilidad de columnas */}
            <div className="flex items-center">
                <ZenInput
                    placeholder="Filtrar servicios por nombre..."
                    value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        table.getColumn("nombre")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ZenButton variant="outline" className="ml-auto">
                            Columnas
                        </ZenButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column: Column<TData, unknown>) => column.getCanHide())
                            .map((column: Column<TData, unknown>) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* La tabla en sí */}
            <div className="rounded-md border border-zinc-800">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                            <TableRow key={headerGroup.id} className="border-zinc-800">
                                {headerGroup.headers.map((header: Header<TData, unknown>) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row: Row<TData>) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-zinc-800"
                                >
                                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-zinc-500">
                    {table.getFilteredSelectedRowModel().rows.length} de{" "}
                    {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
                </div>
                <ZenButton
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </ZenButton>
                <ZenButton
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Siguiente
                </ZenButton>
            </div>
        </div>
    )
}