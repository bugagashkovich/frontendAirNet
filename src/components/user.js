import { useState, useEffect } from "react";
import axios from "axios";

// Огосподи, тут очень страшный кусок, попробую разъяснить
// Беда в том, что я пока не нашел внятного решения (без использования либ), как можно
// грамотно решенить проблему соотношения объекта в списке DOM и объекта в состоянии для передачи
// родительскому объекту
// Потому решил такой костыль изобрести:
// Через map рендерим объекты userList, а затем соотносим индекс в списке DOM (<option> selectedIndex) и индекс в массиве state

function User(props) {
  const [userList, setUserList] = useState([]);

  //   Состояние списка и состояние активного пользователя в памяти
  const [value, setValue] = useState("");
  const [activeUser, setActiveUser] = useState("");

  const [user, setUser] = useState("");

  useEffect(() => {
    // Получаем данные с API
    const getUsersAPI = async () => {
      let users = await axios.get("http://localhost:4000/user");
      let parseUsers = JSON.parse(users.data);
      //   Для избежания ошибки выполнения
      if (parseUsers.length) {
        setUserList(parseUsers);
        setValue(parseUsers[0].name);
        setActiveUser(parseUsers[0]);
      }
    };
    getUsersAPI();
  }, []);

  useEffect(() => {
    // При смене активного пользователя, передадим данные в родительский компонент
    props.handleUser(activeUser);
  }, [activeUser]);

  function handleSection(e, index) {
    // Вся магия тут. При изменении выбранного пользователя он должен смениться в форме (контроллируемый ввод)
    // А также я должен получить сам выбранный объект (а не только имя пользователя)
    setActiveUser(userList[index]);
    setValue(e);
  }

  async function handleAdd(e) {
    // При добавлении нового пользователя мы получаем с API объект пользователя
    e.preventDefault();
    let res = await axios.post("http://localhost:4000/user", null, {
      params: { name: user },
    });
    // Обновляем состояние всех пользователей
    setUserList([...userList, res.data]);
    // Очищаем ввод
    setUser("");
    // Обновляем выбранного пользователя в списке
    setValue(res.data.name);
    // Делаем его активным
    setActiveUser(res.data);
  }

  function handleUserChange(e) {
    setUser(e.target.value);
  }

  const userListRender = userList.length ? (
    userList.map((user, key) => {
      return (
        <option key={key} value={user.name} accessKey={user.id}>
          {user.name}
        </option>
      );
    })
  ) : (
    <option>Введите первого пользователя</option>
  );

  return (
    <div className="container p-4">
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Пользователь
        </span>
        <select
          value={value}
          className="form-control"
          onChange={(e) =>
            handleSection(e.target.value, e.target.selectedIndex)
          }
        >
          {userListRender}
        </select>
      </div>

      <form
        onSubmit={(e) => {
          handleAdd(e);
        }}
      >
        <div className="mb-3">
          <input
            value={user}
            onChange={handleUserChange}
            className="form-control"
          />

          <button type="submit" className="btn btn-primary">
            Добавить нового пользователя
          </button>
        </div>
      </form>
    </div>
  );
}

export default User;
