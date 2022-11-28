import { DateTime } from "luxon";

// Плитка на календаре
function DayCard({ day, setActiveDay }) {
  // Определяем стиль плитки на случай наличия дел на день
  const activeTodo = day.todoList.filter((todo) => {
    return todo.state === "0";
  });
  const todoStyle = activeTodo.length ? "dayWithTask" : "dayWithOutTask";

  let today = DateTime.local();
  const active =
    day.date.year === today.year &&
    day.date.month === today.month &&
    day.date.day === today.day
      ? "active"
      : null;

  // Функция, которая открывает окно с задачами
  function openModal(e) {
    e.preventDefault();
    setActiveDay(day);
  }

  return (
    <div className={"dayCard" + " " + day.style + " " + active}>
      <div
        className={todoStyle}
        onClick={(e) => {
          openModal(e);
        }}
      >
        {day.date.day}
      </div>
    </div>
  );
}

export default DayCard;
