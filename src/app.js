/**
 * Created by hzou on 4/14/16.
 */

(function () {

  angular
    .module('hzou.localdb.app', ['hzou.localdb'])
    .controller('DemoController', DemoController);


  function DemoController($window, localdb) {
    var self = this;
    var url = "/api/cookies/";
    self.remove = remove;
    self.upsert = upsert;
    self.cookies = [];

    init();

    function init() {

      localdb.get(url).then(function (data) {
        if (data.length === 0) {
          $window.localStorage.setItem("/api/cookies/", getInitialCookies());
          localdb.get(url).then(function (data) {
            self.cookies = data;
          });
        } else {
          self.cookies = data;
        }
      });
    }

    /**
     * update or insert based if it's new or existing
     * @param cookie
     */
    function upsert() {
      if (self.item.id) {
        update(self.item);
      } else {
        add(self.item);
      }
    }

    function add(cookie) {
      localdb
        .post(url, cookie)
        .then(function (data) {
          self.cookies.push(data);
          self.item = {};
        });
    }

    function update(cookie) {
      localdb
        .put(url + cookie.id, cookie)
        .then(function (data) {
          _.extend(cookie, data);
          self.item = {};
        });
    }

    function remove(cookie) {
      localdb
        .delete(url + cookie.id, cookie)
        .then(function (data) {
          _.remove(self.cookies, cookie);
        });
    }

    function getInitialCookies() {
      var data = [
        {id: 1, name: "Ginger Bread", price: 0.50},
        {id: 2, name: "Brown Sugar", price: 0.35},
        {id: 3, name: "Chocolate", price: 0.75},
        {id: 4, name: "Ginger", price: 0.45}
      ];

      return JSON.stringify(data);
    }

  }

})();