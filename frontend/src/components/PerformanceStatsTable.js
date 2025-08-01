import React, { useMemo } from "react";

function PerformanceStatsTable({ history }) {
  const stats = useMemo(() => {
    if (!Array.isArray(history)) return {};

    const countMap = {};
    const correctMap = {};
    const totalMap = {};

    history.forEach((h) => {
      const key = h.testTitle || h.testId;
      countMap[key] = (countMap[key] || 0) + 1;
      correctMap[key] = (correctMap[key] || 0) + h.correctAnswers;
      totalMap[key] = (totalMap[key] || 0) + h.totalQuestions;
    });

    const sorted = Object.keys(countMap)
      .map((key) => ({
        testTitle: key,
        count: countMap[key],
        avgCorrect:
          totalMap[key] > 0
            ? Math.round((correctMap[key] / totalMap[key]) * 100)
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return sorted.slice(0, 5); // top 5
  }, [history]);

  return (
    <div className="performance-stats">
      <h4>📊 Top bài thi được làm nhiều</h4>
      <table>
        <thead>
          <tr>
            <th>Tên bài thi</th>
            <th>Lượt làm</th>
            <th>Đúng TB</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => (
            <tr key={index}>
              <td>{item.testTitle}</td>
              <td>{item.count}</td>
              <td>{item.avgCorrect}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PerformanceStatsTable;
