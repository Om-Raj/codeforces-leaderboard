"use client"

import { useMemo, useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Rating } from "@/types/types"
import Link from "next/link"

const data: Rating[] = [
  {
    handle: "omium",
    name: "Om Raj",
    regId: "2023UCS022",
    year: 2023,
    branch: "CS",
    curRating: 1525,
    maxRating: 1764,
  },
  {
    handle: "coder123",
    name: "Alice Smith",
    regId: "2022UCS045",
    year: 2022,
    branch: "CS",
    curRating: 1890,
    maxRating: 1950,
  },
  {
    handle: "bug_hunter",
    name: "Bob Jones",
    regId: "2021ECE007",
    year: 2021,
    branch: "EC",
    curRating: 1430,
    maxRating: 1600,
  },
  {
    handle: "math_geek",
    name: "Carol Danvers",
    regId: "2020MTH102",
    year: 2020,
    branch: "MA",
    curRating: 2100,
    maxRating: 2200,
  },
  {
    handle: "hackerman",
    name: "Eve Wright",
    regId: "2023UCS056",
    year: 2023,
    branch: "CS",
    curRating: 980,
    maxRating: 1200,
  },
  {
    handle: "maverick",
    name: "John Maverick",
    regId: "2024MECH011",
    year: 2024,
    branch: "ME",
    curRating: 1560,
    maxRating: 1580,
  },
];


export const columns: ColumnDef<Rating>[] = [
  {
    id: "rank",
    header: "Rank",
    meta: {
      label: "Rank",
      isIndex: true,
    },
  },
  {
    accessorKey: "handle",
    header: "Handle",
    meta: {
      label: "Handle",
    },
    cell: ({ row }) => (
      <Link 
        prefetch={false} 
        href={`https://codeforces.com/profile/${row.getValue("handle")}`}
        target="_blank"
      >
        {row.getValue("handle")}
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      label: "Name",
    },
    cell: ({ row }) => (
      <div>{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "regId",
    header: "Reg ID",
    meta: {
      label: "Reg ID",
    },
    cell: ({ row }) => (
      <div>{row.getValue("regId")}</div>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
    meta: {
      label: "Year",
    },
    cell: ({ row }) => (
      <div>{row.getValue("year")}</div>
    ),
    filterFn: (row: Row<Rating>, id: string, year: number) => {
      return !year || row.original.year === year;
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
    meta: {
      label: "Branch",
    },
    cell: ({ row }) => (
      <div>{row.getValue("branch")}</div>
    ),
    filterFn: (row: Row<Rating>, id: string, branch: string) => {
      return branch === "all" || row.original.branch === branch;
    },
  },
  {
    accessorKey: "curRating",
    meta: {
      label: "Rating",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
        >
          Rating
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("curRating")}</div>,
  },
  {
    accessorKey: "maxRating",
    meta: {
      label: "Max Rating",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
        >
          Max Rating
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("maxRating")}</div>,
  },
];

export function LeaderBoard() {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "curRating",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    year: false,
    branch: false,
  });

  const batches = useMemo(() => [...new Set(data.map((item) => item.year))].sort(), [data]);
  const branches = useMemo(() => [...new Set(data.map((item) => item.branch))].sort(), [data]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex justify-start items-center py-4 gap-3 flex-wrap xs:flex-nowrap">
        <Input
          placeholder="Filter handle"
          value={(table.getColumn("handle")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("handle")?.setFilterValue(event.target.value)
          }
          className="w-full xs:basis-xs"
        />

        <div className="flex gap-3 grow">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Year <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={(table.getColumn("year")?.getFilterValue() ?? 0).toString()}
                onValueChange={(year) => table.getColumn("year")?.setFilterValue(parseInt(year))}>
                <DropdownMenuRadioItem value="0">All</DropdownMenuRadioItem>
                {batches.map((year) => {
                  return (
                    <DropdownMenuRadioItem key={year} value={year.toString()}>
                      {year}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Branch <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={table.getColumn("branch")?.getFilterValue() as string ?? "all"}
                onValueChange={(branch) => table.getColumn("branch")?.setFilterValue(branch)}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {branches.map((branch) => {
                  return (
                    <DropdownMenuRadioItem key={branch} value={branch}>
                      {branch}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                View <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.meta?.label ?? column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.columnDef.meta?.isIndex ? index + 1 : flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )} 
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
