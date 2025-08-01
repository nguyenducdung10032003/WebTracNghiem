import "./css/Paging.css";
function Pagination({ page, setPage, total }) {
  const handleClick = (newPage) => {
    if (newPage >= 1 && newPage <= total) {
      setPage(newPage);
    }
  };

  return (
    <div className="pagination">
      <button onClick={() => handleClick(page - 1)} disabled={page === 1}>
        &laquo;
      </button>
      {[...Array(total)].map((_, i) => (
        <button
          key={i}
          className={page === i + 1 ? "active" : ""}
          onClick={() => handleClick(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => handleClick(page + 1)} disabled={page === total}>
        &raquo;
      </button>
    </div>
  );
}

export default Pagination;
