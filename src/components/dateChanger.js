// Функция для перелистывания месяца

export default function DateChanger({ date, setDate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "space-around",
      }}
    >
      <h6
        onClick={() => {
          setDate(date.minus({ month: 1 }));
        }}
      >
        Назад
      </h6>
      <h5>
        {date.monthLong.toUpperCase()} {date.year}
      </h5>
      <h6
        onClick={() => {
          setDate(date.plus({ month: 1 }));
        }}
      >
        Вперед
      </h6>
    </div>
  );
}
