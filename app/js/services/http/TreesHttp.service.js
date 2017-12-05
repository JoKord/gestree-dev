angular
  .module('unicerApp')
  .service('TreesHttp', TreesHttp);

TreesHttp.$inject = ['$q', '$http'];

function TreesHttp($q, $http) {

  return {
    getTrees: getTrees,
    getTreeDetails: getTreeDetails,
    getTreeInterventions: getTreeInterventions
  };

  function getTrees() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/api/trees/'
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function getTreeDetails(selectedTree) {
    var deferred = $q.defer();
    var parque = selectedTree.getProperties().parque;
    var id = selectedTree.getId();
    $http({
      method: 'GET',
      url: '/api/trees/'+ parque + '/' + id
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function getTreeInterventions(id_tree) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/api/trees/' + id_tree + '/interventions'
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

}