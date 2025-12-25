import React from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function TableToolbar({
  search,
  setSearch,
  sort,
  setSort,
  page,
  setPage,
  totalPages,
  placeholder = "Search..."
}) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 border border-slate-200 shadow-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
          {/* Sort */}
          <div className="relative w-full sm:w-auto">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-200">
            <motion.button
              whileHover={{ scale: page === 1 ? 1 : 1.02 }}
              whileTap={{ scale: page === 1 ? 1 : 0.98 }}
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </motion.button>

            <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <span className="text-sm font-semibold text-slate-800">
                {page} <span className="text-slate-500">/</span> {totalPages}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: page === totalPages ? 1 : 1.02 }}
              whileTap={{ scale: page === totalPages ? 1 : 0.98 }}
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50 transition-all flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}