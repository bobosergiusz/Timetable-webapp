import moment from "moment";

const HttpEndpoint = {
  getAppointments() {
    const promise = fetch("http://127.0.0.1/appointment")
      .then((res) => res.json())
      .then((res) => res.map((item) => this.prepareItem(item)));
    return promise;
  },
  postAppointment(since, until) {
    const data = {};
    data.since = since.format("YYYY-MM-DD HH:mm");
    data.until = until.format("YYYY-MM-DD HH:mm");
    data.accepted = false;
    const promise = fetch("http://127.0.0.1/appointment", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return promise;
  },
  putAppointment(id) {
    const promise = fetch(`http://127.0.0.1/appointment/${id}`, {
      method: "PUT",
    });
    return promise;
  },

  prepareItem(item) {
    item.since = moment(item.since);
    item.until = moment(item.until);
    return item;
  },
};

export default HttpEndpoint;
