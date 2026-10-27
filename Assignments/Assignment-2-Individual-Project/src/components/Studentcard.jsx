
function StudentCard({ student }) {
  return (
    <div className="student-card">
      <h3>{student.name}</h3>
      <p>Branch: {student.branch}</p>
      <p>Status: {student.status}</p>
    </div>
  );
}

export default StudentCard;

