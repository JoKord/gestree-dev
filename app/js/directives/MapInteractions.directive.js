angular
  .module('unicerApp')
  .directive('mapInteractions', MapInteractions);

MapInteractions.$inject = ['MapService', '$timeout'];
function MapInteractions(MapService, $timeout) {
  var directive = {
    bindToController: true,
    controller: MapInteractionsController,
    controllerAs: 'itCtrl',
    link: link,
    restrict: 'E',
    scope: {},
    templateUrl: 'views/templates/main/MapInteractions.html'
  }
  return directive;

  function link(scope, element, attrs) {
    var map = MapService.getMap();
    var mapControls = MapService.getControls();
    if (mapControls) {
      mapControls.item(2).setTarget(element.find('#coordinate4326')[0]);
      mapControls.item(2).setMap(map);
      mapControls.item(3).setTarget(element.find('#coordinate27493')[0]);
      mapControls.item(3).setMap(map);
    } else {
      $timeout(function () {
        mapControls.item(2).setTarget(element.find('#coordinate4326')[0]);
        mapControls.item(2).setMap(map);
        mapControls.item(3).setTarget(element.find('#coordinate27493')[0]);
        mapControls.item(3).setMap(map);
      }, 200)
    }
  }

  MapInteractionsController.$inject = ['$scope', 'MapInteractionsService', 'LayerIdentifier', 'ParksHttp'];
  function MapInteractionsController($scope, MapInteractionsService, LayerIdentifier, ParksHttp) {
    var activeInteractionWatch, layerIdentifierWatch;

    $scope.setInteraction = MapInteractionsService.setActiveInteraction;
    $scope.isActive = MapInteractionsService.isActive;
    $scope.setDefaultView = MapInteractionsService.setDefaultView;
    ParksHttp.getParks().then(function (parks) {
      $scope.parks = parks;
      $scope.selectedPark = {};
      $scope.selectPark = function (coor, proj) {
        $scope.selectedPark = {};
        MapInteractionsService.zoomTo(coor, proj);
      }
    });

    $scope.$watch(MapInteractionsService.getActiveInteraction, _setActiveInteraction, true);
    function _setActiveInteraction(newVal, oldVal, scope) {
      scope.activeInteraction = newVal;
    };

    $scope.$watchCollection(LayerIdentifier.getLayers, _setLayerResults);
    function _setLayerResults(newVal, oldVal, scope) {
      newVal.reduce(function (promiseChain, currentValue) {
        return promiseChain.then(function (chainResults) {
          return currentValue.then(function (currentResult) {
            return chainResults.concat(currentResult);
          });
        });
      }, Promise.resolve([])).then(function (layerResults) {
        scope.$apply(function () {
          scope.hasLayerResults = false;
          for (var i = 0; i < layerResults.length; i++) {
            if (layerResults[i].features.length !== 0) {
              scope.hasLayerResults = true;
            }
          }
          scope.layerResults = layerResults;
        });
      });
    };

  }
}