let users = [
  {
    username: "wonkim",
    // password: abcd1234
    password: "$2b$12$Gki.cBCupxk/8fQqi8Pp.uurDugV9RJY6Mk0ToYeNWL6pVUeKHoD2",
    name: "Won Kim",
    email: "wk12345@gmail.com",
    url: "https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg",
    id: "1",
  },
];

export async function createUser(user) {
  const created = { ...user, id: Date.now().toString() };

  users.push(created);
  return created.id;
}

export async function findByUsername(username) {
  return users.find((user) => user.username === username);
}

export async function findById(id) {
  return users.find((user) => user.id === id);
}
