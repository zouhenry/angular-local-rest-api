/**
 * Created by hzou on 2/28/16.
 */

angular
  .module('hzou.localdb', [])
  .factory('localdb', localdb);

function localdb($window, $q, $log) {
  var localstorage = $window.localStorage;

  return {
    get       : get,
    post      : post,
    put       : put,
    "delete"  : remove
  };

  function get(url, opts) {
    $log.log("GET", url);
    var isCollection = url.endsWith('/');
    var indexOf      = url.lastIndexOf('/') + 1;
    url              = isCollection ? url : url.substr(0, indexOf);
    var id           = url.substr(indexOf);

    var collection = getCollection(url);
    var retVal     = collection;
    if (id) {
      retVal = _.find(collection, { id: id });
    }

    return createPromise(function () {
      return retVal;
    });
  }

  function post(url, data, opts) {
    $log.log("POST", url);

    return createPromise(function () {
      var collection      = getCollection(url);
      data.id             = Math.floor(Date.now() / 1000);

      collection.push(data);
      var stringifiedData = JSON.stringify(collection);
      localstorage.setItem(url, stringifiedData);
      return data;
    });
  }

  function put(url, data, opts) {

    $log.log("PUT", url);
    data = _.omit(data, "$$hashKey");

    var isCollection = url.endsWith('/');
    var indexOf      = url.lastIndexOf('/') + 1;
    var id           = +url.substr(indexOf);
    url              = isCollection ? url : url.substr(0, indexOf);

    var collection = getCollection(url);

    return createPromise(function () {
      var item            = _.find(collection, { id: id });
      _.extend(item, data);
      var stringifiedData = JSON.stringify(collection);
      localstorage.setItem(url, stringifiedData);
      return data;
    });
  }

  function remove(url, opts) {
    $log.log("DELETE", url);

    var isCollection = url.endsWith('/');
    var indexOf      = url.lastIndexOf('/') + 1;
    var id           = +url.substr(indexOf);
    url              = isCollection ? url : url.substr(0, indexOf);

    var collection = getCollection(url);

    return createPromise(function () {
      var item = _.find(collection, { id: id });
      console.log("item", item);
      _.remove(collection, item);
      localstorage.setItem(url, JSON.stringify(collection));
      return item;
    });
  }

  /*========================================
   =                 utils                =
   ========================================*/
  function getCollection(url) {
    var val = localstorage.getItem(url) || '[]';
    return JSON.parse(val);
  }

  function createPromise(callback) {
    var data = callback();

    var deferred = $q.defer();
    deferred.resolve(data);
    return deferred.promise;
  }
}