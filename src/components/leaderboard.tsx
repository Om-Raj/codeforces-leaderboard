"use client";

import { useMemo, useState } from "react";

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
} from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserData } from "@/types/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getRankColorClass, getRatingColorClass } from "@/lib/utils";
import Image from "next/image";

export const columns: ColumnDef<UserData>[] = [
  {
    id: "rank",
    header: ({ column }) => {
      return <div className="text-center">Rank</div>;
    },
    meta: {
      label: "Rank",
      isIndex: true,
      isCentered: true,
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
        <div className="flex items-center gap-2 pr-[20]">
          <Image
            src={row.original.avatar}
            alt={row.original.handle}
            width={20}
            height={20}
            className="rounded-full"
          />
          <p
            className={cn(
              "cursor-pointer text-base font-medium",
              getRankColorClass(row.original.rank),
            )}
          >
            {row.getValue("handle")}
          </p>
        </div>
      </Link>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      label: "Name",
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "regId",
    header: "Reg ID",
    meta: {
      label: "Reg ID",
    },
    cell: ({ row }) => <div>{row.getValue("regId")}</div>,
  },
  {
    accessorKey: "year",
    header: "Year",
    meta: {
      label: "Year",
    },
    cell: ({ row }) => <div>{row.getValue("year")}</div>,
    filterFn: (row: Row<UserData>, id: string, year: number) => {
      return !year || row.original.year === year;
    },
  },
  {
    accessorKey: "branch",
    header: "Branch",
    meta: {
      label: "Branch",
    },
    cell: ({ row }) => <div>{row.getValue("branch")}</div>,
    filterFn: (row: Row<UserData>, id: string, branch: string) => {
      return branch === "all" || row.original.branch === branch;
    },
  },
  {
    accessorKey: "rating",
    meta: {
      label: "Rating",
      isCentered: true,
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
          className="w-full! cursor-pointer"
          aria-label="Sort by rating"
        >
          Rating
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "text-center",
          getRatingColorClass(row.getValue("rating")),
        )}
      >
        {row.getValue("rating")}
      </div>
    ),
  },
  {
    accessorKey: "maxRating",
    meta: {
      label: "Max Rating",
      isCentered: true,
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
          className="w-full! cursor-pointer"
          aria-label="Sort by max rating"
        >
          Max Rating
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className={cn(
          "text-center",
          getRatingColorClass(row.getValue("maxRating")),
        )}
      >
        {row.getValue("maxRating")}
      </div>
    ),
  },
  {
    accessorKey: "friendOfCount",
    meta: {
      label: "Friends",
      isCentered: true,
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
          className="w-full! cursor-pointer"
          aria-label="Sort by friends"
        >
          Friends
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("friendOfCount")}</div>
    ),
  },
  {
    accessorKey: "contribution",
    meta: {
      label: "Contribution",
      isCentered: true,
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(true)}
          className="w-full! cursor-pointer"
          aria-label="Sort by contribution"
        >
          Contribution
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("contribution")}</div>
    ),
  },
];

export function LeaderBoard({ data }: { data: UserData[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "rating",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    year: false,
    branch: false,
    friendOfCount: false,
    contribution: false,
  });

  const batches = useMemo(
    () => [...new Set(data.map((item) => item.year))].sort(),
    [data],
  );
  const branches = useMemo(
    () => [...new Set(data.map((item) => item.branch))].sort(),
    [data],
  );

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
  });

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
                value={(
                  table.getColumn("year")?.getFilterValue() ?? 0
                ).toString()}
                onValueChange={(year) =>
                  table.getColumn("year")?.setFilterValue(parseInt(year))
                }
              >
                <DropdownMenuRadioItem value="0">All</DropdownMenuRadioItem>
                {batches.map((year) => {
                  return (
                    <DropdownMenuRadioItem key={year} value={year.toString()}>
                      {year}
                    </DropdownMenuRadioItem>
                  );
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
                value={
                  (table.getColumn("branch")?.getFilterValue() as string) ??
                  "all"
                }
                onValueChange={(branch) =>
                  table.getColumn("branch")?.setFilterValue(branch)
                }
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {branches.map((branch) => {
                  return (
                    <DropdownMenuRadioItem key={branch} value={branch}>
                      {branch}
                    </DropdownMenuRadioItem>
                  );
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
                  );
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
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.isCentered && "text-center",
                      )}
                    >
                      {cell.column.columnDef.meta?.isIndex
                        ? index + 1
                        : flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
  );
}
