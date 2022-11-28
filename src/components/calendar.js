import DayCard from "./daycard";
import TodoList from "./todoList";
import DateChanger from "./dateChanger";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import axios from "axios";

function Calendar(props) {
  // При инициализации получим сегодняшнюю дату, количество дней и день недели первого дня
  const [date, setDate] = useState(DateTime.now());
  const [calendar, setCalendar] = useState(null);
  const [todoList, setTodoList] = useState([]);

  const [activeDay, setActiveDay] = useState(null);

  // Загружаем пользователей
  useEffect(() => {
    const todoProccess = async () => {
      let res = await axios.get("http://localhost:4000/todos", {
        params: { id: props.user.id },
      });
      setTodoList(res.data);
    };
    todoProccess();
    setActiveDay(null);
  }, [props.user]);

  // Вызываем функцию конфигурации календаря
  useEffect(() => {
    const calendarProccess = async () => {
      setCalendar(await dateWorker(date, todoList));
    };
    calendarProccess();
  }, [date, todoList]);

  // Сетка для календаря
  const calendarGrid = calendar ? (
    calendar.map((day, key) => {
      return (
        <div key={key}>
          <DayCard day={day} setActiveDay={setActiveDay} />
        </div>
      );
    })
  ) : (
    <div>Подготавливаем Ваш календарь</div>
  );

  return (
    <div className="container">
      {activeDay ? (
        <TodoList
          day={activeDay}
          owner={props.user.id}
          todoList={todoList}
          setTodoList={setTodoList}
        />
      ) : null}
      <h3 style={{ textAlign: "center" }}>
        <DateChanger date={date} setDate={setDate} />
      </h3>
      <div className="daySection text-center">
        <h5 className="dayInSection">ПН</h5>
        <h5 className="dayInSection">ВТ</h5>
        <h5 className="dayInSection">СР</h5>
        <h5 className="dayInSection">ЧТ</h5>
        <h5 className="dayInSection">ПТ</h5>
        <h5 className="dayInSection">СБ</h5>
        <h5 className="dayInSection">ВС</h5>
      </div>
      <div className="calendar">{calendarGrid}</div>
    </div>
  );
}

async function dateWorker(date, _todoList) {
  // Парсим даты в todo
  let list = _todoList
    ? _todoList.map((todo) => {
        if (typeof todo.date == "number") {
          todo.date = DateTime.fromMillis(todo.date);
        }

        return todo;
      })
    : [];
  // Количество дней в месяце
  let daysNumber = date.daysInMonth;
  let firstDay = DateTime.local(date.year, date.month, 1);
  let lastDay = DateTime.local(date.year, date.month, daysNumber);
  // День недели первого дня
  let firstDayWeekNumber = firstDay.weekday;
  // День недели последнего дня
  let lastDayWeekNumber = lastDay.weekday;

  // Максимальная сетка - 6*7. Создадим массив с датами, заполнив "пустые" дни
  // Массив дат до актуального месяца
  let offMonthBefore = [];
  for (let index = firstDayWeekNumber - 1; index !== 0; index--) {
    offMonthBefore.push({
      date: firstDay.minus({ days: index }),
      style: "offMonth",
    });
  }

  // Массив дат после актуального месяца
  let offMonthAfter = [];
  for (let index = 1; index <= 7 - lastDayWeekNumber; index++) {
    offMonthAfter.push({
      date: lastDay.plus({ days: index }),
      style: "offMonth",
    });
  }

  // Массив дат актуального месяца
  let actualMonth = [];
  for (let index = 0; index < daysNumber; index++) {
    let date = firstDay.plus({ days: index });
    let res = await axios.get("https://isdayoff.ru/api/getdata", {
      params: {
        year: date.year,
        month: date.month,
        day: date.day,
      },
    });
    actualMonth.push({
      date: date,
      style: res.data ? "weekends" : "weekdays",
    });
  }

  // Объедим массивы
  let calendarArray = [...offMonthBefore, ...actualMonth, ...offMonthAfter];

  // Добавим todo к соответствующим датам
  calendarArray = calendarArray.map((day) => {
    day.todoList = list.filter(
      (todo) =>
        todo.date.year === day.date.year &&
        todo.date.month === day.date.month &&
        todo.date.day === day.date.day
    );
    return day;
  });

  return calendarArray;
}

export default Calendar;
