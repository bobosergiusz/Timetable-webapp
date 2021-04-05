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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error");
        } else {
          return res;
        }
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
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Error");
      } else {
        return res;
      }
    });
    return promise;
  },
  logout() {
    const promise = fetch(`http://127.0.0.1/logout`, {
      method: "POST",
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Error");
      } else {
        return res;
      }
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

  getAppointments(accountName) {
    const csrfToken = this.getCookie("csrf_access_token");
    const headers = csrfToken != null ? { "X-CSRF-TOKEN": csrfToken } : {};
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
  postAppointment(accountName, since, until, description) {
    const csrfToken = this.getCookie("csrf_access_token");
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
          "X-CSRF-TOKEN": csrfToken,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error");
        } else {
          return res;
        }
      })
      .then((res) => res.json())
      .then((item) => this.prepareApp(item));
    return promise;
  },
  putAppointment(accountName, id) {
    const csrfToken = this.getCookie("csrf_access_token");
    const promise = fetch(
      `http://127.0.0.1/service/${accountName}/appointment/${id}`,
      {
        method: "PUT",
        headers: { "X-CSRF-TOKEN": csrfToken },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error");
        } else {
          return res;
        }
      })
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
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  },
};

export default HttpEndpoint;
