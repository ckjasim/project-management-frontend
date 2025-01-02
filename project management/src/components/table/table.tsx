import React, { useState } from 'react';
import { Search, Filter, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column = {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode;
};

type ManagementTableProps = {
  title: string;
  data: any[];
  columns: Column[];
  onBlock: (id: string, email: string) => void;
  organizations: { _id: string; name: string }[];
  filterKey: string;
  searchPlaceholder?: string;
};

const ManagementTable = ({
  title,
  data,
  columns,
  onBlock,
  organizations,
  filterKey,
  searchPlaceholder = "Search by name..."
}: ManagementTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrg, setFilterOrg] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredItems = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterOrg === 'all' || item[filterKey]?.name?.toLowerCase() === filterOrg.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-4">
      <Card>
        <CardHeader className="border-b border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              {title}
            </CardTitle>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="text-base font-medium">Organization</div>
              <div className="flex flex-wrap gap-3">
              {[ 
  { _id: 'all', name: 'all' },
  ...Array.from(
    new Map(organizations.map((org) => [org._id, org])).values()
  ),
].map((org) => (
  <Button
    key={org._id}
    variant={filterOrg === org.name ? 'default' : 'outline'}
    size="sm"
    onClick={() => setFilterOrg(org.name)}
    className={filterOrg === org.name ? 'bg-blue-600' : ''}
  >
    {org.name.charAt(0).toUpperCase() + org.name.slice(1)}
  </Button>
))}

              </div>
            </div>
          )}

          <div className="mt-6 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table className='ml-10'>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + 1} 
                      className="text-center h-24 text-gray-500"
                    >
                      No items match your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((item) => (
                    <TableRow key={item._id}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render ? column.render(item) : item[column.key]}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onBlock(item._id, item.email)}
                            className={`${item.isBlock ? 'bg-green-600' : 'bg-red-600'} hover:${
                              item.isBlock ? 'bg-green-700' : 'bg-red-700'
                            }`}
                          >
                            {item.isBlock ? 'Unblock' : 'Block'}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1;
                    return shouldShow;
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(page)}
                        className={currentPage === page ? "bg-blue-600" : ""}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))
                }
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementTable;