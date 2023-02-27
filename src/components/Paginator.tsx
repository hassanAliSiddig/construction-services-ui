import React, { useEffect, useState } from "react";

type Props = {
  totalRecords: number;
  pageSize?: number;
  onPageUpdate: (pageNumber: number, pageSize: number) => void;
};

const Paginator = (props: Props) => {
  const [pagesRange, setPagesRange] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let size = props.pageSize ?? 10;
    let numberOfPages = Math.ceil(props.totalRecords / size);
    let range = Array(numberOfPages)
      .fill(0)
      .map((_, index) => index + 1);
    setPagesRange(range);
  }, [props.totalRecords]);

  const updateCurrentPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    props.onPageUpdate(pageNumber, props.pageSize ?? 10)
  }


  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={currentPage === 1 ? "page-item disabled" : 'page-item'}>
            <button disabled={currentPage === 1} onClick={() => updateCurrentPage(currentPage - 1)} className="page-link">Previous</button>
          </li>
          {pagesRange.map((p) => (

            <li
              key={p}
              onClick={(e) => updateCurrentPage(p)}
              className={currentPage === p ? "page-item active" : "page-item"}
            ><button className="page-link">{p}</button></li>
          ))}
          <li className={currentPage === pagesRange[pagesRange.length - 1] ? "page-item disabled" : 'page-item'}>
            <button disabled={currentPage === pagesRange[pagesRange.length - 1]} onClick={() => updateCurrentPage(currentPage + 1)} className="page-link">Next</button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Paginator;
