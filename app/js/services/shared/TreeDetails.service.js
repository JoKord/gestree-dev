angular
  .module('unicerApp')
  .service('TreeDetailsService', TreeDetailsService);

TreeDetailsService.$inject = ['$q', 'TreesHttp', '$rootScope', 'DirtyDataManager'];

function TreeDetailsService($q, TreesHttp, $rootScope, Dirty) {

  var selectedTree;

  return {
    getTreeDetails: getTreeDetails,
    getSelectedTree: getSelectedTree,
    getTree: getTree
  }

  function getTreeDetails(evt) {
    var deferred = $q.defer();
    if (evt && evt.selected.length !== 0) {
      var selected = evt.selected[0];
      getTree(selected.getId(), selected.getProperties().parque);
    } else {
      $rootScope.$apply(function () {
        selectedTree = undefined;
      })
    }
  }
  function getSelectedTree() {
    return selectedTree;
  }
  function getTree(id, parque) {
    var selectedPoint = {};
    selectedPoint.id = id;
    selectedPoint.parque = parque;
    TreesHttp.getTreeDetails(selectedPoint).then(function (tree) {
      selectedTree = tree;
      Dirty.cleanTree();
    });
  }

}  