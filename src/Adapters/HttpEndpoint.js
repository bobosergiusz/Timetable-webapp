import moment from "moment";

const HttpEndpoint = {
  createUser(user) {
    user.account_name = user.accountName;
    user.account_type = user.type;
    delete user.accountName;
    delete user.type;
    const promise = fetch(`http://127.0.0.1/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((item) => this.prepareUser(item));
    return promise;
  },
  login(accountName, password) {
    const credentials = {
      account_name: accountName,
      password: password,
    };
    const promise = fetch(`http://127.0.0.1/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res.token = res.access_token;
        delete res.access_token;
        return res;
      });
    return promise;
  },
  searchServices(tags) {
    const tagsTrimmed = tags.replaceAll(" ", "");
    const promise = fetch(`http://127.0.0.1/service?tags=${tagsTrimmed}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res.map((u) => this.prepareUser(u)));
    return promise;
  },

  getAppointments(accountName, token) {
    const headers = token != null ? { Authorization: `Bearer ${token}` } : {};
    const promise = fetch(
      `http://127.0.0.1/service/${accountName}/appointment`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then((res) => res.json())
      .then((res) => res.map((item) => this.prepareApp(item)));
    return promise;
  },
  postAppointment(accountName, since, until, description, token) {
    const data = {};
    data.since = since.format("YYYY-MM-DD HH:mm");
    data.until = until.format("YYYY-MM-DD HH:mm");
    data.description = description;
    data.accepted = false;
    const promise = fetch(
      `http://127.0.0.1/service/${accountName}/appointment`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((item) => this.prepareApp(item));
    return promise;
  },
  putAppointment(accountName, id, token) {
    const promise = fetch(
      `http://127.0.0.1/service/${accountName}/appointment/${id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((item) => this.prepareApp(item));
    return promise;
  },

  prepareApp(item) {
    if (item?.from_user != null) {
      item.fromUser = item.from_user;
      delete item.from_user;
    }
    item.since = moment(item.since);
    item.until = moment(item.until);
    return item;
  },
  prepareUser(item) {
    item.accountName = item.account_name;
    delete item.account_name;
    return item;
  },
};

export default HttpEndpoint;
