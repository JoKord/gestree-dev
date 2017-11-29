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
      getTree(evt.selected[0].getId());
    } else {
      $rootScope.$apply(function () {
        selectedTree = undefined;
      })
    }
  }
  function getSelectedTree() {
    return selectedTree;
  }
  function getTree(treeID) {
    TreesHttp.getTreeDetails(treeID).then(function (tree) {
      selectedTree = tree;
      Dirty.cleanTree();
    });
  }

}  