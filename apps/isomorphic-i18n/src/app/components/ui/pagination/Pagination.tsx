'use client';
import { Pagination as MUIPagination } from '@mui/material';
import style from './Pagination.module.css';
import { useState } from 'react';

interface PaginationProps {
  lang?: string;
  totalPages: number; 
  onPageChange: (page: number) => void;
}

function Pagination({ lang, totalPages, onPageChange }: PaginationProps) {
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    onPageChange(value);
  };

  return (
    <div className={style.pagination}>
      <MUIPagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        siblingCount={1}
        boundaryCount={1}
        sx={{
          '& .MuiPaginationItem-root': {
            fontSize: '20px',
            fontWeight: 500,
            lineHeight: 0,
            color: '#404040',
          },
          '& .MuiPaginationItem-previousNext': {
            border: 0,
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'var(--main-color)',
            color: '#fff',
          },
          '& .MuiPaginationItem-root.Mui-selected:hover': {
            backgroundColor: 'var(--main-color)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default Pagination;
