export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function calculateScore(correctAnswers, totalQuestions) {
  return Math.round((correctAnswers / totalQuestions) * 100)
}

export function getScoreMessage(score) {
  if (score >= 80) return "Xuất sắc! Bạn đã làm rất tốt."
  if (score >= 60) return "Tốt! Bạn cần cải thiện thêm một chút."
  return "Cần cố gắng hơn. Hãy ôn tập và thử lại!"
}
