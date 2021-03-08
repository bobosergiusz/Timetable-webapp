import moment from "moment";

const FakeEndpoint = {
  appointments: [
    {
      id: 1,
      since: "2021-03-01 12:00",
      until: "2021-03-01 12:30",
      accepted: true,
    },
    {
      id: 51,
      since: "2021-03-03 12:00",
      until: "2021-03-04 12:30",
      accepted: true,
    },
    {
      id: 61,
      since: "2021-03-05 8:00",
      until: "2021-03-05 12:30",
      accepted: true,
    },
    {
      id: 62,
      since: "2021-03-05 10:00",
      until: "2021-03-05 15:30",
      accepted: true,
    },
    {
      id: 22,
      since: "2021-03-01 12:00",
      until: "2021-03-01 13:30",
      accepted: true,
    },
    {
      id: 23,
      since: "2021-03-01 13:00",
      until: "2021-03-01 14:30",
      accepted: true,
    },
    {
      id: 8,
      since: "2021-04-01 12:00",
      until: "2021-04-01 12:30",
      accepted: true,
    },
    {
      id: 10,
      since: "2021-03-01 13:00",
      until: "2021-03-01 14:30",
      accepted: true,
    },
    {
      id: 2,
      since: "2021-03-02 12:00",
      until: "2021-03-02 12:30",
      accepted: false,
    },
    {
      id: 7,
      since: "2021-03-02 13:00",
      until: "2021-03-02 13:30",
      accepted: false,
    },
    {
      id: 5,
      since: "2021-03-02 09:30",
      until: "2021-03-02 10:00",
      accepted: true,
    },
  ],
  getAppointments() {
    const arrPrepared = [];
    for (const app of this.appointments) {
      const prepared = Object.assign({}, app);
      prepared.since = moment(prepared.since);
      prepared.until = moment(prepared.until);
      arrPrepared.push(prepared);
    }
    return arrPrepared;
  },
  postAppointment(since, until) {
    const prepared = {};
    prepared.since = since.format("YYYY-MM-DD HH:mm");
    prepared.until = until.format("YYYY-MM-DD HH:mm");
    prepared.accepted = false;
    prepared.id = this.availableId();
    this.appointments.push(prepared);
    const toReturn = Object.assign({}, prepared);
    toReturn.since = since;
    toReturn.until = until;
    return toReturn;
  },
  putAppointment(id) {
    const app = this.appointments.find((el) => el.id == id);
    app.accepted = true;
    const toReturn = Object.assign({}, app);
    toReturn.since = moment(toReturn.since);
    toReturn.until = moment(toReturn.until);
    return toReturn;
  },
  availableId() {
    const sorted = [...this.appointments].sort((a, b) => {
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
