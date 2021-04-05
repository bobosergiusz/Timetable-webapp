import moment from "moment";

const FakeEndpoint = {
  users: [
    {
      accountName: "dr A",
      password: "dr A",
      tags: ["best", "love"],
      type: "service",
      appointments: [
        {
          id: 1,
          since: "2021-03-01 12:00",
          until: "2021-03-01 12:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 51,
          since: "2021-03-03 12:00",
          until: "2021-03-04 12:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 61,
          since: "2021-03-05 8:00",
          until: "2021-03-05 12:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 8,
          since: "2021-04-01 12:00",
          until: "2021-04-01 12:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 10,
          since: "2021-03-01 13:00",
          until: "2021-03-01 14:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 2,
          since: "2021-03-02 12:00",
          until: "2021-03-02 12:30",
          accepted: false,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 7,
          since: "2021-03-02 13:00",
          until: "2021-03-02 13:30",
          accepted: false,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 5,
          since: "2021-03-02 09:30",
          until: "2021-03-02 10:00",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
      ],
    },
    {
      accountName: "mr S",
      tags: ["IT"],
      type: "service",
      password: "mr S",
      appointments: [
        {
          id: 62,
          since: "2021-03-05 10:00",
          until: "2021-03-05 15:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 22,
          since: "2021-03-01 12:00",
          until: "2021-03-01 13:30",
          accepted: false,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
        {
          id: 23,
          since: "2021-03-01 13:00",
          until: "2021-03-01 14:30",
          accepted: true,
          fromUser: "konan",
          description: "im giovani giorgio",
        },
      ],
    },
  ],
  createUser(user) {
    const u = this.users.find((u) => u.accountName == user.accountName);

    if (u == null) {
      this.users.push(user);
      return new Promise((resolve) => resolve(user));
    } else {
      return Promise.reject(new Error("User exists"));
    }
  },
  login(accountName, password) {
    const u = this.users.find((u) => u.accountName == accountName);
    if (u?.password == password) {
      return new Promise(() => null);
    } else {
      return Promise.reject(new Error("Wrong login"));
    }
  },
  logout() {
    return new Promise((resolve) => resolve(null));
  },
  searchServices(tags) {
    const tagsSplitted = tags.trim() == "" ? [] : tags.trim().split(", ");
    var usersSelected = this.users.filter((u) => u?.type == "service");
    for (let tag of tagsSplitted) {
      usersSelected = usersSelected.filter((u) => u.tags.includes(tag));
    }
    return new Promise((resolve) => resolve(usersSelected));
  },

  getAppointments(accountName) {
    const u = this.users.find((u) => u.accountName == accountName);
    if (u == null) {
      return Promise.reject(new Error("User does not exist"));
    }
    const appointments = u.appointments;
    const arrPrepared = [];
    for (const app of appointments) {
      const prepared = {};
      if (app.accepted) {
        prepared.since = moment(app.since);
        prepared.until = moment(app.until);
        arrPrepared.push(prepared);
      }
    }
    return new Promise((resolve) => resolve(arrPrepared));
  },
  postAppointment(accountName, since, until, description) {
    const u = this.users.find((u) => u.accountName == accountName);
    const fromUser = "dummy";
    const prepared = {};
    prepared.id = this.availableId(u.appointments);
    prepared.fromUser = fromUser;
    prepared.since = since.format("YYYY-MM-DD HH:mm");
    prepared.until = until.format("YYYY-MM-DD HH:mm");
    prepared.description = description;
    prepared.accepted = false;
    u.appointments.push(prepared);
    const toReturn = Object.assign({}, prepared);
    toReturn.since = since;
    toReturn.until = until;
    return new Promise((resolve) => resolve(toReturn));
  },
  putAppointment(accountName, id) {
    const u = this.users.find((u) => u.accountName == accountName);
    const app = u.appointments.find((a) => a.id == id);
    app.accepted = true;
    const toReturn = Object.assign({}, app);
    toReturn.since = moment(toReturn.since);
    toReturn.until = moment(toReturn.until);
    return new Promise((resolve) => resolve(toReturn));
  },
  availableId(appointments) {
    const sorted = [...appointments].sort((a, b) => {
      return a.id - b.id;
    });
    for (const [id, app] of sorted.entries()) {
      if (app.id != id + 1) {
        return id + 1;
      }
    }
  },
};

export default FakeEndpoint;
