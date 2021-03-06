angular
  .module('unicerApp', [
    'ui.select',
    'ngSanitize',
    'ngMaterial',
    'ngMessages',
    'ngRoute'
  ])
  .constant('GlobalURLs', {
    host: "http://gistree.espigueiro.pt",
    host_print: "http://gistree.espigueiro.pt:8081",
    print: "http://gistree.espigueiro.pt:8081/print-servlet-3.8.0/print/gestree/report.pdf"
  });
angular
  .module('unicerApp')
  .config(['$mdDateLocaleProvider', function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    $mdDateLocaleProvider.shortMonths = ['jan', 'feb', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    $mdDateLocaleProvider.days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sabado'];
    $mdDateLocaleProvider.shortDays = ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'];
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
    $mdDateLocaleProvider.formatDate = function (date) {
      return date ? moment(date).format('DD/MM/YYYY') : '';
    };
    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.
    $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
      return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendário';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir o calendário';
    // You can also set when your calendar begins and ends.
    $mdDateLocaleProvider.firstRenderableDate = new Date(2000, 1, 1);
    $mdDateLocaleProvider.lastRenderableDate = new Date(2100, 12, 31);
  }])
angular
  .module('unicerApp')
  .run(function () {
    proj4.defs("EPSG:27493", "+proj=tmerc +lat_0=39.66666666666666 +lon_0=-8.131906111111112 +k=1 +x_0=180.598 +y_0=-86.98999999999999 +ellps=intl +towgs84=-223.237,110.193,36.649,0,0,0,0 +units=m +no_defs");
    var extent = [-127101.82, -300782.39, 160592.41, 278542.12];
    var projection = ol.proj.get('EPSG:27493');
    projection.setExtent(extent);
    ol.Collection.prototype.insertLayer = function (layer) {
      var index = this.getArray().findIndex(function (mapLayer) {
        return mapLayer.get('group') < layer.get('group');
      });
      if (index !== -1) {
        this.insertAt(index, layer);
      } else {
        this.push(layer);
      }
    };
    ol.layer.Base.prototype.isQueryable = function () {
      return this.get('queryable');
    };
  })
angular
  .module('unicerApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/templates/main/Map.html',
        controller: 'MapController',
        controllerAs: 'MapCtrl'
      })
      .when('/interventions', {
        templateUrl: 'views/templates/main/List-Interventions.html',
        controller: 'InterventionListController',
        controllerAs: 'interventionListCtrl',
        resolve: {
          Interventions: ['InterventionsHttp', _getAllInterventions]
        }
      })
      .when('/interventions/add', {
        templateUrl: 'views/templates/main/interventions/Intervention-Add.html',
        controller: 'InterventionAddController',
        controllerAs: 'addCtrl',
        resolve: {
          Defaults: ['DefaultInterventionData', _getDefaults]
        }
      })
      .when('/interventions/:int_id/update', {
        templateUrl: 'views/templates/main/interventions/Intervention-Update.html',
        controller: 'InterventionUpdateController',
        controllerAs: 'updateCtrl',
        resolve: {
          Intervention: ['$route', 'InterventionsHttp', _getIntervention],
          Defaults: ['DefaultInterventionData', _getDefaults]
        }
      })
      .when('/interventions/:int_id/info', {
        templateUrl: 'views/templates/main/interventions/Intervention-Info.html',
        controller: 'InterventionInfoController',
        controllerAs: 'infoCtrl',
        resolve: {
          Intervention: ['$route', 'InterventionsHttp', _getIntervention]
        }
      })
      .when('/interventions/:int_id/close', {
        templateUrl: 'views/templates/main/interventions/Intervention-Close.html',
        controller: 'InterventionCloseController',
        controllerAs: 'closeCtrl',
        resolve: {
          Intervention: ['$route', 'InterventionsHttp', _getIntervention]
        }
      })
      .when('/tree/:parque/:gid/interventions', {
        templateUrl: 'views/templates/main/Tree-Interventions.html',
        controller: 'TreeInterventionsController',
        controllerAs: 'treeInterventionsCtrl',
        resolve: {
          TreeInterventions: ['$route', 'TreesHttp', _getTree]
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);

function _getAllInterventions(InterventionsHttp) {
  return InterventionsHttp.getAll();
}
function _getIntervention($route, InterventionsHttp) {
  return InterventionsHttp.get($route.current.params.int_id);
}
function _getDefaults(Defaults) {
  return Defaults.getInterventionDefaults();
}
function _getTree($route, TreesHttp){
  var selectedTree = {};
  selectedTree.id = $route.current.params.gid;
  selectedTree.parque = $route.current.params.parque;
  return TreesHttp.getTreeInterventions(selectedTree);
}
angular
  .module('unicerApp')
  .config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('whiteGreen', {
      '50': '5cb85c',
      '100': '000000',
      '200': '5cb85c',
      '300': '5cb85c',
      '400': '5cb85c',
      '500': '5cb85c',
      '600': '5cb85c',
      '700': '5cb85c',
      '800': '5cb85c',
      '900': '5cb85c',
      'A100': 'ffffff',
      'A200': '000000',
      'A400': '000000',
      'A700': '000000',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100',
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('green')
      .backgroundPalette('whiteGreen');
  }])
angular
  .module('unicerApp')
  .controller('BaseLayerController', BaseLayerController);

BaseLayerController.$inject = ['$scope'];

function BaseLayerController($scope) {

  $scope.baseLayers = [
    {
      name: "Open Street Map",
      layerDef: new ol.layer.Tile({
        source: new ol.source.OSM({})
      })
    },
    {
      name: "Camada em Branco",
      layerDef: new ol.layer.Tile({})
    }
  ];
  $scope.baseLayer = "Mapa de Base";

  $scope.setBaseLayer = function (layer) {
    $scope.baseLayer = layer.name;
    Map.setBaseLayer(layer.layerDef);
  };
  
}
angular
  .module('unicerApp')
  .controller('InterventionListController', InterventionListController);

InterventionListController.$inject = [
  '$scope',
  'Interventions',
  'SortingService',
  'FilterSharedData',
  '$filter'
];

function InterventionListController($scope, Interventions, SortingService, FilterSharedData, $filter) {

  $scope.sort = SortingService.orderBySeasonYear;

  $scope.$watch(FilterSharedData.getFilter, _handleFilterUpdate, true);
  function _handleFilterUpdate(newVal, oldVal, scope) {
    scope.interventions = $filter('interventions-filter')(Interventions, newVal);
  }

};
angular
  .module('unicerApp')
  .controller('MapController', MapController);

MapController.$inject = ['MapService', 'DirtyDataManager'];

function MapController(MapService, DirtyDataManager) {
  MapService.init();
  MapService.drawMap();
  if (DirtyDataManager.isLayerDirty()) {
    MapService.reloadLayers();
    DirtyDataManager.cleanLayer();
  };
}  
angular
  .module('unicerApp')
  .controller('ParkSelectorController', ParkSelectorController);

ParkSelectorController.$inject = ['ParksHttp', 'Map'];

function ParkSelectorController(ParksHttp, Map) {
  var locCtrl = this;
  activate();

  function activate() {
    ParksHttp.getParks().then(function (loc) {
      locCtrl.locations = loc.features;
    });
    locCtrl.location = {};
  }
  locCtrl.onSelectCallback = function (model) {
    Map.zoomToCoordinate(model.geometry.coordinates, 'EPSG:3857');
  }
}
angular
  .module('unicerApp')
  .controller('TreeInterventionsController', TreeInterventionsController);

TreeInterventionsController.$inject = [
  '$scope',
  'SideNavService',
  'TreeInterventions',
  'SortingService',
  'FilterSharedData',
  '$filter',
];

function TreeInterventionsController($scope, SideNavService, TreeInterventions, SortingService, FilterSharedData, $filter) {
  SideNavService.setActiveTab(3);

  $scope.sort = SortingService.orderBySeasonYear;
  $scope.back = function(e){
    e.preventDefault();
    SideNavService.setActiveTab(1);
    window.history.back();
  }

  $scope.$watch(FilterSharedData.getFilter, _handleFilterUpdate, true);
  function _handleFilterUpdate(newVal, oldVal, scope) {
    scope.interventions = $filter('interventions-filter')(TreeInterventions, newVal);
  }
}
angular
  .module('unicerApp')
  .directive('interventionItem', InterventionItem);

function InterventionItem() {
  var directive = {
    bindToController: true,
    controller: InterventionItemController,
    controllerAs: 'intItemCtrl',
    restrict: 'E',
    scope: {
      intervention: "="
    },
    templateUrl: 'views/templates/components/interventionItem.html'
  };
  return directive;
}

InterventionItemController.$inject = ['$scope', '$location']
function InterventionItemController($scope, $location) {
  var intItemCtrl = this;
  $scope.edit = function () {
    $location.path('/interventions/' + intItemCtrl.intervention.id + '/update');
  };
  $scope.info = function () {
    $location.path('/interventions/' + intItemCtrl.intervention.id + '/info');
  };
  $scope.close = function () {
    $location.path('/interventions/' + intItemCtrl.intervention.id + '/close');
  };
}
angular
  .module('unicerApp')
  .directive('legendItem', LegendItem);

function LegendItem() {
  var directive = {
    restrict: 'A',
    scope: {
      title: '@',
    },
    transclude: true,
    templateUrl: 'views/templates/legendItem.html'
  };
  return directive;
}
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
angular
  .module('unicerApp')
  .directive('treeDetails', TreeDetails);

function TreeDetails() {
  var directive = {
    bindToController: true,
    controller: TreeDetailsController,
    controllerAs: 'treeDetailsCtrl',
    scope: {},
    restrict: 'E',
    templateUrl: 'views/templates/components/TreeDetails.html'
  };
  return directive;

  TreeDetailsController.$inject = [
    '$scope', 
    'MapInteractionsService', 
    'TreeDetailsService', 
    'DirtyDataManager'
  ];
  function TreeDetailsController($scope, MapInteractionsService, TreeDetailsService, DirtyDataManager) {

    MapInteractionsService.getSelectInteraction().on('select', TreeDetailsService.getTreeDetails);
    $scope.$watch(TreeDetailsService.getSelectedTree, function (newVal, oldVal, scope) {
      scope.tree = newVal;
      if (scope.tree) {
        if(DirtyDataManager.isTreeDirty()) TreeDetailsService.getTree(scope.tree.gid, scope.tree.parque);    
        scope.visible = true;
        scope.hasInterventions = scope.tree.open_interventions + scope.tree.closed_interventions; 
      } else {
        scope.visible = false;
      }
    });
    $scope.$on('$destroy', function () {
      MapInteractionsService.getSelectInteraction().un('select', TreeDetailsService.getTreeDetails);
    });

  }
};  
angular
  .module('unicerApp')
  .filter('capitalize', Capitalize);

function Capitalize() {
  return function (input) {
    if (!angular.isNumber(input)) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    } else {
      return input;
    }
  }
}
angular
  .module('unicerApp')
  .filter('interventions-filter', InterventionListFilter);

function InterventionListFilter() {
  return function (input, filterData) {
    var filteredInterventions = input;

    if (_hasNoFilters(filterData)) {
      return input;
    }

    for (var prop in filterData) {
      filteredInterventions = _filterArray(filteredInterventions, filterData, prop);
    }
    return filteredInterventions;
  };

  function _filterArray(array, filter, prop) {
    var filtered = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i][prop] === filter[prop]) {
        filtered.push(array[i]);
      }
    }
    return filtered;
  }

  function _hasNoFilters(filterData) {
    for (var prop in filterData) {
      if (filterData.hasOwnProperty(prop))
        return false;
    }
    return true;
  };
}
angular
  .module('unicerApp')
  .controller('InterventionAddController', InterventionAddController);

InterventionAddController.$inject = [
  '$scope',
  '$routeParams',
  '$timeout',
  'InterventionsHttp',
  'Defaults',
  'SideNavService'
];

function InterventionAddController($scope, $routeParams, $timeout, InterventionsHttp, Defaults, SideNavService) {
  SideNavService.hide();

  $scope.defaults = Defaults;
  $scope.intervention = {
    periodicity: '-',
    comments: null,
    team: '-'
  };
  
  if ($routeParams.idTree) {
    $scope.intervention.id_tree = parseInt($routeParams.idTree);
    $scope.intervention.park = Defaults.findPark($routeParams.park);
    $scope.disableID = true;
  }

  $scope.back = _goBack;
  
  $scope.send = function () {
    var _self = this;
    if (!_dataIsInvalid()) {
      return;
    }
    InterventionsHttp.add(this.intervention)
      .then(function (res) {
        _self.error = "";
        _self.message = "Intervenção adicionada com sucesso.";
        $timeout(function () {
          _goBack();
        }, 1000);
      }).catch(function (err) {
        _self.error = "Ocorreu um erro ao adicionar a intervenção.";
      });
  }

  bindSetters()
  function bindSetters() {
    $scope.setType = setValue.bind("type");
    $scope.setTeam = setValue.bind("team");
    $scope.setSeason = setValue.bind("season");
    $scope.setYear = setValue.bind("year");
    $scope.setPeriodicity = setValue.bind("periodicity");
    $scope.setPark = setValue.bind("park");
    function setValue(val) {
      $scope.intervention[this] = val;
    }
  }
  function _dataIsInvalid() {
    var errors = { size: 0 };
    var requiredFields = ['id_tree', 'park', 'type', 'priority', 'season', 'year'];
    requiredFields.map(function (field, index) {
      if (!$scope.intervention.hasOwnProperty(field)) {
        errors[field] = true;
        errors.size++;
      }
    });
    if (errors.size > 0) {
      errors.message = "* Falta Preencher Campos Obrigatórios";
    }
    $scope.errors = errors;
    return errors.size === 0;
  }
  function _goBack(){
    SideNavService.show();
    window.history.back();
  }

}
angular
  .module('unicerApp')
  .controller('InterventionCloseController', InterventionCloseController);

InterventionCloseController.$inject = [
  '$scope',
  'Intervention',
  'InterventionsHttp',
  '$timeout',
  'SideNavService'
];

function InterventionCloseController($scope, Intervention, InterventionsHttp, $timeout, SideNavService) {
  $scope.intervention = Intervention;
  SideNavService.hide();

  $scope.back = function () {
    SideNavService.show();
    window.history.back();
  }
  $scope.close = function (form) {
    var _self = this;
    _self.error = '';
    if (form.$invalid) {
      return;
    }
    _self.intervention.state = "FECHADA";
    InterventionsHttp.close(_self.intervention)
      .then(function (data) {
        _self.message = "A intervenção foi fechada com sucesso.";
        $timeout(function () {
          window.history.back();
          SideNavService.show();
        }, 1000);
      }).catch(function (err) {
        _self.error = "Ocorreu um erro no fecho da intervenção.";
      });
  };
}
angular
  .module('unicerApp')
  .controller('InterventionInfoController', InterventionInfoController);

InterventionInfoController.$inject = [
  '$scope',
  'Intervention',
  'SideNavService'
];

function InterventionInfoController($scope, Intervention, SideNavService) {
  SideNavService.hide();
  $scope.intervention = Intervention;
  $scope.back = function () {
    SideNavService.show();
    window.history.back();
  }
}
angular
  .module('unicerApp')
  .controller('InterventionUpdateController', InterventionUpdateController);

InterventionUpdateController.$inject = [
  '$scope',
  'Intervention',
  'Defaults',
  'InterventionsHttp',
  'SideNavService'
];

function InterventionUpdateController($scope, Intervention, Defaults, InterventionsHttp, SideNavService) {
  SideNavService.hide();

  var _initalID = Intervention.id;
  var interTypes = Defaults.types;

  $scope.intervention = Intervention;
  $scope.defaults = Defaults;

  bindSetters();
  setInterventionType();

  $scope.save = function () {
    $scope.intervention.id = _initalID;
    $scope.error = '';
    InterventionsHttp.update($scope.intervention)
      .then(function (data) {
        $scope.message = "A intervenção foi alterada com sucesso.";
      }).catch(function (err) {
        $scope.error = "Ocorreu um erro ao tentar alterar a intervenção";
      });
  }
  $scope.back = function () {
    SideNavService.show();
    window.history.back();
  }

  function bindSetters() {
    $scope.setType = setValue.bind("type");
    $scope.setTeam = setValue.bind("team");
    $scope.setSeason = setValue.bind("season");
    $scope.setYear = setValue.bind("year");
    $scope.setPeriodicity = setValue.bind("periodicity");

    function setValue(val) {
      $scope.intervention[this] = val;
    }
  }
  function setInterventionType(){
    $scope.intervention.type = interTypes.find(function(type){
      return type.id === Intervention.id_type;
    });
  }

}
angular
  .module('unicerApp')
  .directive('interventionsTab', InterventionsTab);

function InterventionsTab() {
  var directive = {
    bindToController: true,
    controller: InterventionsTabController,
    controllerAs: 'intTabCtrl',
    restrict: 'E',
    scope: {},
    templateUrl: 'views/templates/navigation/tabs/Tab-Interventions.html'
  };
  return directive;
}

InterventionsTabController.$inject = [
  '$scope',
  'DefaultInterventionData',
  'FilterSharedData',
  'SideNavService'
];

function InterventionsTabController($scope, Defaults, FilterSharedData, SideNavService) {

  $scope.filterData = {
    state: "ABERTA"
  };
  $scope.data = {};
  Defaults.getInterventionDefaults().then(function (defaults) {
    $scope.defaults = defaults;
  });

  $scope.setZone= setZone;
  $scope.setIdTree = setIdTree;
  $scope.setInterType = setInterType;
  $scope.setSeason = setSeason;
  $scope.setYear = setYear;
  $scope.resetFilter = resetFilter;

  $scope.$watch('filterData.parque', function (newVal, oldVal, scope) {
    if (newVal) {
      scope.defaults.parks.forEach(function (el) {
        if (el.name === newVal) scope.zones = el.zones;
      })
    } else {
      delete (scope.filterData.parque);
    }
  }, true);

  $scope.$watch('filterData.priority', function (newVal, oldVal, scope) {
    if (!newVal) {
      delete (scope.filterData.priority);
    }
  }, true);

  $scope.$watch('filterData', function (newVal, oldVal) {
    FilterSharedData.setFilter(newVal);
  }, true);
  $scope.$watch(SideNavService.getActiveTab, function (activeTab, oldVal, scope) {
    if (activeTab === 3) {
      resetFilter.call(scope);
    }
  }, true);

  function setZone(zone) {
    if (zone.id !== 0) {
      this.filterData.zone_id = zone.id;
    } else {
      delete (this.filterData.zone_id);
    }
    this.data.zone = zone.nome;
  }
  function setIdTree(idTree) {
    if (idTree === null) {
      delete (this.filterData.id_tree);
    }
  }
  function setInterType(type) {
    if (type.value !== ' -- ') {
      this.filterData.id_type = type.id;
    } else {
      delete (this.filterData.id_type);
    }
    this.data.typeName = type.value;
  }
  function setSeason(season) {
    if (season !== ' -- ') {
      this.filterData.season = season;
    } else {
      delete (this.filterData.season);
    }

  }
  function setYear(year) {
    if (year !== ' -- ') {
      this.filterData.year = year;
    } else {
      delete (this.filterData.year);
    }
  }
  function resetFilter() {
    this.data = {};
    this.filterData = {
      state: "ABERTA"
    };
  }

}
angular
  .module('unicerApp')
  .directive('layersTab', LayersTab);

LayersTab.$inject = ['MapService', 'Layers', 'LegendsService', '$timeout'];

function LayersTab(MapService, Layers, Legends, $timeout) {
  var directive = {
    bindToController: true,
    controller: LayersTabController,
    controllerAs: 'layersCtrl',
    link: link,
    restrict: 'E',
    scope: {},
    templateUrl: 'views/templates/navigation/tabs/Tab-Layers.html'
  };
  return directive;

  function link(scope, element, attrs) {
    var fancytreeOptions = {
      extensions: ["edit", "glyph", "wide"],
      checkbox: true,
      glyph: {
        map: {
          checkbox: "fa fa-toggle-off",
          checkboxSelected: "fa fa-toggle-on",
          checkboxUnknown: "fa fa-circle",
          doc: "fa fa-search",
          docOpen: "fa fa-search",
          error: "fa fa-exclamation-triangle",
          expanderClosed: "fa  fa-arrow-right",
          expanderLazy: "fa fa-arrow-right",
          expanderOpen: "fa fa-arrow-down",
          folder: "fa fa-folder",
          folderOpen: "fa fa-folder-open",
          loading: "fa fa-spinner"
        }
      },
      //clickFolderMode: 2,
      selectMode: 3,
      source: {
        url: '/layers',
      },
      wide: {
        iconWidth: "1em",
        iconSpacing: "0.5em",
        levelOfs: "1.5em",
        labelSpacing: "0.5em"
      },
      select: _onSelect,
      init: _onInit,
      click: _onClick
    }
    var tree = element.find("#tree").fancytree(fancytreeOptions);
    scope.tree = tree.fancytree("getTree");
  }
  function _onInit(event, eventData) {
    var zoomLevel = MapService.getView().getZoom();
    if (zoomLevel === parseInt(zoomLevel, 10)) {
      eventData.tree.visit(function (node) {
        if (node.checkbox === false) {
          node.addClass("icon-padding");
        }
        if (node.data.preselected) {
          node.setSelected(true);
        }
        var minZoom = node.data.minZoom,
          maxZoom = node.data.maxZoom;
        if (!node.isFolder()) {
          if (minZoom != undefined) {
            if (minZoom < zoomLevel) {
              node.removeClass("layer-hidden");
            } else {
              node.addClass("layer-hidden");
            }
          }
        }
      });
    }
  }
  function _onSelect(event, eventData) {
    $timeout(function () {
      if (eventData.node.isFolder()) {
        var children = eventData.node.children;
        if (eventData.node.isSelected()) {
          children.forEach(function (layer) {
            layer.data.key = layer.data.key || layer.key;
            Layers.addLayer(layer.data);
            if (layer.data.multiLegend) {
              Legends.addMultiLegend(layer);
            } else {
              Legends.addLegend(layer);
            }
          });
        } else {
          children.forEach(function (layer) {
            layer.data.key = layer.data.key || layer.key;
            Layers.removeLayer(layer.data);
            if (layer.data.multiLegend) {
              Legends.removeMultiLegend(layer);
            } else {
              Legends.removeLegend(layer);
            }
          });
        }
      } else {
        if (eventData.node.isSelected()) {
          eventData.node.data.key = eventData.node.data.key || eventData.node.key;
          Layers.addLayer(eventData.node.data);
          if (eventData.node.data.multiLegend) {
            Legends.addMultiLegend(eventData.node);
          } else {
            Legends.addLegend(eventData.node);
          }
        } else {
          eventData.node.data.key = eventData.node.data.key || eventData.node.key;
          Layers.removeLayer(eventData.node.data);
          if (eventData.node.data.multiLegend) {
            Legends.removeMultiLegend(eventData.node);
          } else {
            Legends.removeLegend(eventData.node);
          }
        }
      }
    }, 1);
  }
  function _onClick(event, eventData) {
    if (eventData.targetType === 'icon' && !eventData.node.isFolder()) {
      var extent = ol.proj.transformExtent(eventData.node.data.extent, ol.proj.get('EPSG:27493'), 'EPSG:3857');
      MapService.getView().fit(extent, {
        duration: 1500
      });
    }
  }

  LayersTabController.$inject = ['$scope', 'Layers'];
  function LayersTabController($scope, Layers) {
    // Tree Controllers
    $scope.expandTree = expandTree
    $scope.collapseTree = collapseTree
    $scope.deselectAll = deselectAll
    function expandTree() {
      this.tree.visit(function (node) {
        node.setExpanded(true);
      });
    }
    function collapseTree() {
      this.tree.visit(function (node) {
        node.setExpanded(false);
      });
    }
    function deselectAll() {
      this.tree.visit(function (node) {
        if (!node.isFolder()) {
          node.setSelected(false);
        }
      });
    }

    // Base Layer Controllers
    $scope.baseLayers = [
      {
        name: "Open Street Map",
        layerDef: new ol.layer.Tile({
          source: new ol.source.OSM({})
        })
      },
      {
        name: "Camada em Branco",
        layerDef: new ol.layer.Tile({})
      }]
    $scope.selectedBaseLayer = $scope.baseLayers[0]
    $scope.setBaseLayer = setBaseLayer
    function setBaseLayer(baseLayer) {
      $scope.selectedBaseLayer = baseLayer;
      Layers.setBaseLayer(baseLayer.layerDef);
    }
  }
}
angular
  .module('unicerApp')
  .directive('legendsTab', LegendsTab);

function LegendsTab() {
  var directive = {
    bindToController: true,
    controller: LegendsTabController,
    controllerAs: 'lgCtrl',
    restrict: 'E',
    scope: {},
    templateUrl: 'views/templates/navigation/tabs/Tab-Legends.html'
  };
  return directive;
  
  LegendsTabController.$inject = ['$scope', 'LegendsService'];
  function LegendsTabController($scope, LegendsService) {
    $scope.legends = LegendsService.getLegends();
  }
}
angular
  .module('unicerApp')
  .directive('sideNav', SideNav);

function SideNav() {
  var directive = {
    bindToController: true,
    controller: SideNavController,
    controllerAs: 'SideNavCtrl',
    restrict: 'E',
    scope: {},
    templateUrl: 'views/templates/navigation/navigation.html'
  };
  return directive;

  SideNavController.$inject = ['$rootScope', '$scope', 'SideNavService', 'MapService', '$timeout'];
  function SideNavController($rootScope, $scope, SideNavService, MapService, $timeout) {

    $scope.hideNavigation = SideNavService.hideNavigation;
    $scope.showNavigation = SideNavService.showNavigation;
    $scope.setActiveTab = SideNavService.setActiveTab;
    $scope.isActiveTab = SideNavService.isActiveTab;

    $scope.$watch(SideNavService.isVisible, _changeVisibility, false);
    function _changeVisibility(newVal, oldVal, scope) {
      scope.navigationVisibility = newVal;
      $rootScope.navigationVisibility = newVal;
      MapService.drawMap();
    };

  }
}
angular
  .module('unicerApp')
  .directive('printTab', PrintTab);

function PrintTab() {
  var directive = {
    bindToController: true,
    controller: PrintController,
    controllerAs: 'printCtrl',
    restrict: 'E',
    scope: {},
    templateUrl: 'views/templates/navigation/tabs/Tab-Print.html'
  };
  return directive;


  PrintController.$inject = ['$scope', 'PrintManager', 'DefaultInterventionData'];

  function PrintController($scope, PrintManager) {
    $scope.printData = {};

    PrintManager.getPrintDefaults()
      .then(function (defaultPrint) {
        $scope.defaultPrint = defaultPrint;
      });

    $scope.print = print;
    $scope.newPrint = newPrint;
    $scope.setPark = setPark;
    $scope.setZone = setZone;
    $scope.setContent = setContent;
    $scope.setSeason = setSeason;
    $scope.setYear = setYear;
    $scope.setTeam = setTeam;
    $scope.setFormat = setFormat;

    function print() {
      var data = $scope.printData;
       if (!_requiredFields()) {
        return;
      }

      for(var x in $scope.printData){
        if($scope.printData[x] === "--" || $scope.printData[x].id === 0 ){
          delete($scope.printData[x]);
        }  
      }

      $scope.isPrinting = true;
      switch (data.format.key) {
        case 'csv':
          PrintManager.getCSVLinks(data).then(_handleResults);
          break;
        case 'pdf':
          PrintManager.getPDFLinks(data).then(_handleResults);
          break;
      }
      function _handleResults(fileParams) {
        $scope.isPrinting = false;
        $scope.file = fileParams;
      } 
    }
    function newPrint() {
      $scope.printData = {};
      $scope.printFilters = false;
      delete $scope.file;
    }

    function setZone(zone) {
      $scope.printData.zone = zone;
    }
    function setPark(p) {
      $scope.printData.park = p;
      $scope.printData.zone = "--";
      $scope.defaultPrint.parksWithZones.forEach(function (el) {
        if (el.name === p.properties.nome) {
          $scope.zones = el.zones;
        }
      })
    }
    function setContent(c) {
      $scope.printFilters = (c.key === 'interventions')
      $scope.printData.contentType = c;
    }
    function setSeason(s) {
      $scope.printData.season = s;
    }
    function setYear(y) {
      $scope.printData.year = y;
    }
    function setTeam(team){
      $scope.printData.team = team;
    }
    function setFormat(f) {
      $scope.printData.format = f;
    }

    function _requiredFields() {
      var errors = { size: 0 };
      var requiredFields = ['park', 'contentType', 'format'];
      requiredFields.map(function (field, index) {
        if (!$scope.printData.hasOwnProperty(field)) {
          errors[field] = true;
          errors.size++;
        }
      });
      if (errors.size > 0) {
        errors.message = "* Falta Preencher Campos Obrigatórios";
      }
      $scope.errors = errors;
      return errors.size === 0;
    }

  }
}
angular
  .module('unicerApp')
  .directive('printResult', PrintResult);

function PrintResult() {
  var directive = {
    restrict: 'E',
    scope: {
      icon: '@',
      url: '@',
      name: '@',
      params: '<',
      click: "&onClick"
    },
    template: "<a target='_blank' ng-href='{{url}}{{urlParams}}' ng-click='click()'> " +
    " <i class='print_result_icon fa {{icon || \"fa-file-o\"}}'></i>" +
    " <div class='print_result_text'>&nbsp;{{name}}<div>" +
    "<a/>",
    link: function (scope, element, attrs) {
      scope.$watch('params', function () {
        if (scope.params != undefined) {
          scope.urlParams = '?' + Object.keys(scope.params).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(scope.params[k])
          }).join('&');
        }
      });
    },
  };
  return directive;
}
angular
  .module('unicerApp')
  .service('InterventionTypesHttp', InterventionTypesHttp);

InterventionTypesHttp.$inject = ["$q", "$http"];

function InterventionTypesHttp($q, $http) {
  var interventionTypes;

  return {
    getInterventionTypes: getInterventionTypes
  }

  function getInterventionTypes() {
    var deferred = $q.defer();
    if (interventionTypes) {
      deferred.resolve(interventionTypes);
    } else {
      $http.get("/api/intervention_types")
        .then(function (res) {
          interventionTypes = res.data;
          deferred.resolve(res.data);
        });
    }
    return deferred.promise;
  }
  
}
angular
  .module('unicerApp')
  .service('InterventionsHttp', InterventionsHttp);

InterventionsHttp.$inject = ['$q', '$http', 'DirtyDataManager'];

function InterventionsHttp($q, $http, DirtyDataManager) {

  return {
    add: add,
    getAll: getAll,
    get: get,
    getFilteredInterventions: getFilteredInterventions,
    update: update,
    close: close
  };

  function add(inter) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/api/trees/' + inter.park.name + '/' + inter.id_tree + '/interventions',
      data: _prepareData(inter)
    }).then(function (response) {
      DirtyDataManager.setDirty();
      deferred.resolve(response.data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function getAll() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/api/interventions'
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function get(id) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'api/interventions/' + id
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function getFilteredInterventions(filter) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: 'api/interventions/filter',
      headers: {
        'Content-Type': 'application/json'
      },
      params: filter
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function update(inter) {
    return _updateRequest(_prepareData(inter));
  }
  function close(inter) {
    return _updateRequest(inter);
  }

  function _updateRequest(inter) {
    var deferred = $q.defer();
    $http({
      method: 'PUT',
      url: 'api/interventions/' + inter.id,
      headers: {
        'Content-Type': 'application/json'
      },
      data: inter
    }).then(function successCallback(response) {
      DirtyDataManager.setDirty();
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function _prepareData(inter) {
    return Object.assign({}, inter,{ id_type: inter.type.id });
  }

}
angular
  .module('unicerApp')
  .service('LayersHttp', LayersHttp);

LayersHttp.$inject = ['$q', '$http', 'GlobalURLs'];

function LayersHttp($q, $http, GlobalURLs) {

  return {
    fetch: fetch,
    fetchInfo: fetchInfo
  };

  function fetch(data) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: GlobalURLs.host+'/geoserver/wfs',
      params: data
    }).then(function (response) {
      deferred.resolve(response.data);
    });
    return deferred.promise;
  }
  function fetchInfo(layer, coordinate, view) {
    var deferred = $q.defer();
    var url = layer.getSource().getGetFeatureInfoUrl(
      ol.proj.transform(coordinate, "EPSG:3857", ol.proj.get('EPSG:27493')),
      view.getResolution(),
      ol.proj.get('EPSG:27493'), {
        'INFO_FORMAT': 'application/json'
      });
    $http({
      method: 'GET',
      url: url
    }).then(function (response) {
      deferred.resolve(response.data);
    });
    return deferred.promise;
  }

}
angular
  .module('unicerApp')
  .factory('ParksHttp', ParksHttp);

ParksHttp.$inject = ['$http', '$q'];

function ParksHttp($http, $q) {
  return {
    getParks: get
  };

  function get() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/locations'
    }).then(function successCallback(response) {
      deferred.resolve(response.data.features);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
}
angular
  .module('unicerApp')
  .service('PrintHttp', PrintHttp);

PrintHttp.$inject = ['GlobalURLs', '$q', '$http', '$timeout'];

function PrintHttp(GlobalURLs, $q, $http, $timeout) {

  return {
    printTrees: print,
    printInterventions: print
  };

  function print(requestData) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: GlobalURLs.print,
      data: requestData,
    })
      .then(function (response) {
        return response.data.statusURL;
      })
      .then(_checkStatus)
      .then(function (res) {
        deferred.resolve(GlobalURLs.host_print + res.downloadURL);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
    return deferred.promise;
  }
  function _checkStatus(statusURL) {
    var deferred = $q.defer();
    _fetchData();
    function _fetchData() {
      $http({
        method: 'GET',
        url: GlobalURLs.host_print + statusURL
      }).then(function (res) {
        if (res.data.done) {
          deferred.resolve(res.data);
        } else {
          $timeout(function () {
            _fetchData();
          }, 1500);
        }
      });
    }
    return deferred.promise;
  }

};
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

  function getTrees(params) {
    var filter;
    if (params.zone) filter = { zone: params.zone.id };

    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/api/trees/' + params.park.properties.nome,
      params: filter
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise; 
  }
  function getTreeDetails(selectedTree) {
    var deferred = $q.defer();
    var parque = selectedTree.parque;
    var id = selectedTree.id;
    $http({
      method: 'GET',
      url: '/api/trees/' + parque + '/' + id
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
  function getTreeInterventions(selectedTree) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/api/trees/' + selectedTree.parque + '/' + selectedTree.id + '/interventions'
    }).then(function successCallback(response) {
      deferred.resolve(response.data);
    }, function errorCallback(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

}
angular
  .module('unicerApp')
  .service('DefaultInterventionData', DefaultInterventionData);

DefaultInterventionData.$inject = ['$q', 'InterventionTypesHttp'];

function DefaultInterventionData($q, InterventionTypesHttp) {

  var deferred = $q.defer();

  return {
    getInterventionDefaults: getInterventionDefaults,
    getSeasons: getSeasons,
    getYears: getYears,
    getTeams: getTeams,
    getParks: getParks,
    findPark: findPark,
    getPeriodicities: getPeriodicities,
    getInterventionTypes: getInterventionTypes
  }

  function getInterventionDefaults() {
    var defaults = {};
    defaults.seasons = getSeasons();
    defaults.years = getYears();
    defaults.periodicities = getPeriodicities();
    defaults.teams = getTeams();
    defaults.parks = getParks();
    defaults.findPark = findPark;
    InterventionTypesHttp.getInterventionTypes()
      .then(function (types) {
        defaults.types = types;
        defaults.types.unshift({ id: 0, value: " -- " });
        deferred.resolve(defaults);
      })
    return deferred.promise;
  }
  function getInterventionTypes() {
    return InterventionTypesHttp.getInterventionTypes();
  }
  function getPeriodicities() {
    return ["--", 'Anual', 'Bi-Anual'];
  }
  function getTeams() {
    return ["--", "Interna", "Externa", "Outra"];
  }
  function getSeasons() {
    return ["--", "Primavera", "Verão", "Outono", "Inverno"];
  }
  function getParks() {
    return [{
      id: "PSalgadas",
      name: "Pedras Salgadas",
      zones: [
        { id: 0, nome: "--" },
        { id: 31, nome: "Avenida das Fontes", extent: [43860.674, 208462.308267831, 44097.2807250976, 209065.765373682] },
        { id: 3, nome: "Balneário Termal ", extent: [43944.388, 208558.958497075, 44079.4575729246, 208761.9924] },
        { id: 12, nome: "Campo de Ténis", extent: [43899.64585, 208821.67024974, 44003.3538, 208976.830814358] },
        { id: 29, nome: "Capela", extent: [43817.4569173673, 208839.35423794, 43926.1175885201, 208925.9889], },
        { id: 15, nome: "Casa da Azinheira", extent: [43721.3482, 208615.4776, 43768.0393855883, 208681.267182222] },
        { id: 26, nome: "Casa da Faia", extent: [43858.3909098116, 208494.818440665, 43929.893, 208614.527200818] },
        { id: 16, nome: "Casa da Tuia", extent: [43750.0611671879, 208593.273, 43793.9665045547, 208681.267182222] },
        { id: 13, nome: "Casa de Chá", extent: [43946.0438227177, 208753.476593041, 44001.5058629713, 208909.724520881] },
        { id: 8, nome: "Casa de Passáros", extent: [43755.35975, 208728.23185276, 43855.3323169366, 208888.738395483] },
        { id: 25, nome: "Casa do Abetto", extent: [43828.1214863097, 208499.677652578, 43881.3827272647, 208566.820099047] },
        { id: 19, nome: "Casa do Azevinho", extent: [43788.2826429618, 208573.496059248, 43817.3121629101, 208616.864925832] },
        { id: 20, nome: "Casa do Bordo", extent: [43772.9819990117, 208506.837045523, 43797.4231315278, 208535.199459113] },
        { id: 21, nome: "Casa do Carvalho Negral", extent: [43789.3800840071, 208526.490621593, 43818.2851528213, 208578.365719] },
        { id: 27, nome: "Casa do Castanheiro", extent: [43813.3174754019, 208557.97762405, 43868.7814479943, 208625.954908031] },
        { id: 24, nome: "Casa do Cedro", extent: [43817.0686, 208463.878, 43897.6652416267, 208511.573574314] },
        { id: 22, nome: "Casa do Ciprestre", extent: [43813.9369405137, 208542.105280908, 43851.4265850152, 208581.965479248] },
        { id: 18, nome: "Casa do Esquilo", extent: [43774.2690017352, 208529.79802407, 43795.2600848045, 208599.904547939] },
        { id: 23, nome: "Casa do Medronheiro", extent: [43787.6314, 208489.252, 43834.8236761157, 208555.267029872] },
        { id: 17, nome: "Casa do Pinheiro", extent: [43779.533072807, 208598.443974244, 43823.3042601858, 208653.539027209] },
        { id: 11, nome: "Casino", extent: [43708.8045554272, 208651.455150922, 43860.9311741564, 208792.6210551] },
        { id: 9, nome: "Depósito", extent: [43675.3470696784, 208735.692170034, 43760.3152877867, 208807.489803537] },
        { id: 6, nome: "Garagens e Portaria", extent: [43929.6661950791, 208976.830814358, 44013.273286719, 209083.716484633] },
        { id: 14, nome: "Grande Alcalina", extent: [43914.261, 208696.10370806, 43977.4295654196, 208775.993215322] },
        { id: 30, nome: "Grande Hotel", extent: [43813.7904562498, 208703.114, 43954.6267233635, 208865.970411081] },
        { id: 7, nome: "Gruta", extent: [43818.7644829972, 208881.2312, 43948.0857603283, 209019.950946566] },
        { id: 2, nome: "Lago e Minigolfe", extent: [44001.7157, 208742.580507337, 44109.087974707, 208966.24787249] },
        { id: 28, nome: "Monte Avelames", extent: [43806.3575659664, 208579.118763725, 43950.955, 208708.419] },
        { id: 10, nome: "Observatório", extent: [43661.0130375914, 208627.8333, 43738.6023425355, 208744.921138485] },
        { id: 5, nome: "Parque Infantil e Chalet", extent: [43876.2414736616, 208452.031403359, 44010.5816, 208529.594558112] },
        { id: 1, nome: "Piscina", extent: [44025.0045, 208930.067086977, 44092.9299807205, 209034.242339843] },
        { id: 4, nome: "Roseiral", extent: [43943.6884744044, 208483.8044, 44036.3608023003, 208599.229999999] }
      ]
    }, {
      id: "Vidago",
      name: "Vidago Palace",
      zones: [
        { id: 0, nome: "--" },
        { id: 5, nome: "Avenida das Fontes", extent: [46498.9845, 217489.999483097, 46617.9621575461, 218292.684272455] },
        { id: 9, nome: "Centro de congressos", extent: [46531.0181966032, 218328.025252417, 46611.3708937015, 218536.060508136] },
        { id: 1, nome: "Cercado do Burro", extent: [46462.4218118696, 217532.605501288, 46600.5077900117, 217756.265708016] },
        { id: 12, nome: "Clubhouse", extent: [46463.7985, 218075.577275582, 46519.88, 218187.320802064] },
        { id: 6, nome: "Coreto", extent: [46530.2394254834, 218071.528419621, 46645.3069363016, 218264.365380945] },
        { id: 10, nome: "Coreto", extent: [46522.4717137596, 218246.620071557, 46626.8075489991, 218317.355] },
        { id: 14, nome: "Entrada", extent: [46442.9466141505, 218243.386091724, 46614.724, 218391.981280812] },
        { id: 7, nome: "Estacionamento de serviço", extent: [46283.1896687427, 218154.7335, 46449.6357537877, 218529.551575359] },
        { id: 13, nome: "Fonte 1 e Chalet", extent: [46448.0619874613, 218185.800733946, 46520.17699, 218272.364644886] },
        { id: 11, nome: "Fonte 2 e Lago", extent: [46424.6972411675, 217990.095, 46511.151050836, 218109.876342416] },
        { id: 4, nome: "Fonte Salus", extent: [46565.2760966469, 217450.585892474, 46611.1989985182, 217536.050609917] },
        { id: 15, nome: "Lago", extent: [46395.5568659415, 218338.942193524, 46565.7453503453, 218534.829583112] },
        { id: 2, nome: "Núcleo Rural e Polidesportivo", extent: [46396.4359028875, 217751.996580544, 46564.3968249448, 217906.678646599] },
        { id: 3, nome: "Starter Golf", extent: [46459.1213036824, 217877.710345068, 46542.9697665875, 217992.14321878] },
        { id: 8, nome: "Traseiras do Hotel", extent: [46291.6051170259, 218221.679164848, 46486.0405655678, 218531.764791995] }
      ]
    }]
  }
  function findPark(name) {
    var parks = getParks();
    return parks.find(function (park) {
      return park.name === name;
    });
  }
  function getYears(year_range) {
    var YEAR_RANGE = year_range || 5;
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = 0; i < YEAR_RANGE; i++) {
      years.push(currentYear + i);
    }
    years.unshift('--');
    return years;
  }

}
angular
  .module('unicerApp')
  .service('DirtyDataManager', DirtyDataManager);

function DirtyDataManager(){
  var dirtyTree = true,
      dirtyLayers = true;

  return {
    setDirty: setDataDirty,
    isLayerDirty: isTreeDirty,
    isTreeDirty: isTreeDirty,
    cleanTree: cleanTree,
    cleanLayer: cleanLayer
  };

  function setDataDirty(){
    dirtyTree = true;
    dirtyLayers = true;
  }
  function isLayerDirty(){
    return dirtyLayers;
  };
  function isTreeDirty(){
    return dirtyTree;
  };
  function cleanTree(){
    dirtyTree = false;
  };
  function cleanLayer(){
    dirtyLayers = false;
  };
}  
angular
  .module('unicerApp')
  .service('FilterSharedData', FilterSharedData);

function FilterSharedData() {
  var filterData = {};

  return {
    setFilter: set,
    getFilter: get
  }

  function set(filter) {
    filterData = filter;
  }
  function get() {
    return filterData;
  }

}
angular
  .module('unicerApp')
  .service('LayerIdentifier', LayerIdentifierService);

LayerIdentifierService.$inject = ['LayersHttp'];

function LayerIdentifierService(LayersHttp) {
  var promises = [];

  return {
    setLayers: setLayers,
    getLayers: getLayers
  };

  function setLayers(evt, view, layers) {
    promises.length = 0;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].isQueryable()) {
        promises.push(LayersHttp.fetchInfo(layers[i], evt.coordinate, view));
      }
    }
  }
  
  function getLayers(){
    return promises;
  }
}
angular
  .module('unicerApp')
  .service('Layers', Layers);

Layers.$inject = ['MapService', 'LayersHttp', 'WFSStyles', 'DirtyDataManager'];

function Layers(MapService, LayersHttp, WFSStyles, DirtyDataManager) {

  var layers = {};

  return {
    addLayer: addLayer,
    removeLayer: removeLayer,
    setBaseLayer: setBaseLayer
  }

  function addLayer(layerData, style) {
    if (layerData.type === 'WMS') {
      _addWMSLayer(layerData);
    } else if (layerData.type === 'TileWMS') {
      _addTiledWMSLayer(layerData);
    } else {
      _addWFSLayer(layerData, style);
    }
  }
  function removeLayer(layerData) {
    if (layers[layerData.key]) {
      MapService.getMap().removeLayer(layers[layerData.key]);
      layers[layerData.key].isVisible = false;
    }
  }
  function setBaseLayer(layer) {
    MapService.getMap().getLayers().setAt(0, layer);
  }

  function _addWFSLayer(layerData) {
    if (_checkLayer(layerData.key)) {
      var wfsLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          loader: function (extent) {
            var dataOptions = {
              service: 'WFS',
              version: '1.1.1',
              request: 'GetFeature',
              typename: layerData.workspace + ":" + layerData.name,
              srsname: 'EPSG:27493',
              outputFormat: 'application/json',
              format_options: 'id_policy:gid'
            }
            if (layerData.filter) {
              dataOptions.CQL_FILTER = "id_zona=" + layerData.filter.id_zona;
            } else {
              dataOptions.bbox = ol.proj.transformExtent(extent, 'EPSG:3857', ol.proj.get('EPSG:27493')).join(',') + ',' + ol.proj.get('EPSG:27493').getCode()
            }
            LayersHttp
              .fetch(dataOptions)
              .then(function (response) {
                wfsLayer
                  .getSource()
                  .addFeatures(
                  new ol.format.GeoJSON().readFeatures(response, {
                    featureProjection: 'EPSG:3857',
                    dataProjection: ol.proj.get('EPSG:27493')
                  }))
              });
          },
          strategy: ol.loadingstrategy.bbox,
          updateWhileAnimating: true,
        }),
        priority: layerData.priority
      });

      if (layerData.style) {
        wfsLayer.setStyle(WFSStyles[layerData.style]);
      }
      if (layerData.opacity) {
        wfsLayer.setOpacity(layerData.opacity);
      }

      _addLayerWithPriority(wfsLayer, layerData);
      wfsLayer.isVisible = true;
      layers[layerData.key] = wfsLayer;
    } else {
      if (layerData.style) {
        layers[layerData.key].setStyle(WFSStyles[layerData.style]);
      }
      if (!layers[layerData.key].isVisible) {
        _addLayerWithPriority(layers[layerData.key], layerData);
        layers[layerData.key].isVisible = true;
      }
    }
  }
  function _addWMSLayer(layerData) {
    if (_checkLayer(layerData.key)) {
      var wmsLayer = new ol.layer.Image({
        opacity: layerData.opacity,
        source: new ol.source.ImageWMS({
          url: 'http://gistree.espigueiro.pt/geoserver/wms',
          params: {
            'LAYERS': layerData.workspace + ":" + layerData.name
          },
          extent: layerData.extent,
        }),
        minResolution: _calculateResolution(layerData.maxZoom),
        maxResolution: _calculateResolution(layerData.minZoom),
        group: layerData.group,
        queryable: layerData.queryable,
        priority: layerData.priority
      });
      _addLayerWithPriority(wmsLayer, layerData);
      wmsLayer.isVisible = true;
      layers[layerData.key] = wmsLayer;
    } else {
      if (!layers[layerData.key].isVisible) {
        _addLayerWithPriority(layers[layerData.key], layerData);
        layers[layerData.key].isVisible = true;
      }
    }
  }
  function _addTiledWMSLayer(layerData) {
    if (_checkLayer(layerData.key)) {
      var wmsLayer = new ol.layer.Tile({
        opacity: layerData.opacity,
        source: new ol.source.TileWMS({
          url: 'http://gistree.espigueiro.pt/geoserver/wms',
          params: {
            'LAYERS': layerData.workspace + ":" + layerData.name
          },
          extent: layerData.extent,
        }),
        minResolution: _calculateResolution(layerData.maxZoom),
        maxResolution: _calculateResolution(layerData.minZoom),
        group: layerData.group,
        queryable: layerData.queryable,
        priority: layerData.priority
      });
      _addLayerWithPriority(wmsLayer, layerData);
      wmsLayer.isVisible = true;
      layers[layerData.key] = wmsLayer;
    } else {
      if (!layers[layerData.key].isVisible) {
        _addLayerWithPriority(layers[layerData.key], layerData);
        layers[layerData.key].isVisible = true;
      }
    }

  }

  function _checkLayer(layer_key) {
    return !layers.hasOwnProperty(layer_key);
  }
  function _calculateResolution(zoomLevel) {
    if (typeof zoomLevel == 'undefined') {
      return zoomLevel;
    } else {
      return Math.floor(156543.04 / (Math.pow(2, zoomLevel)));
    }
  };

  function _addLayerWithPriority(layer, layerData) {
    var map = MapService.getMap();
    var aLayers = map.getLayers().getArray();
    var index = aLayers.findIndex(function (el) {
      return el.getProperties().priority > layerData.priority;
    })
    if (index !== -1) {
      map.getLayers().insertAt(index, layer);
    } else {
      map.addLayer(layer);
    }
  }

}
angular
  .module('unicerApp')
  .service('LegendsService', LegendsService);

function LegendsService() {
  var legends = [
    {
      title: "Pedras Salgadas",
      legendas: []
    },
    {
      title: "Vidago Palace",
      legendas: []
    }
  ];
  var multiLegendsManager = {};

  return {
    getLegends: getLegends,
    addLegend: addLegend,
    addMultiLegend: addMultiLegend,
    removeLegend: removeLegend,
    removeMultiLegend: removeMultiLegend
  }


  function addMultiLegend(layer) {
    var legendID = layer.data.multiLegendID;
    if (multiLegendsManager[legendID] && multiLegendsManager[legendID].length !== 0) {
      if (multiLegendsManager[legendID].indexOf(layer.data.key) === -1) {
        multiLegendsManager[legendID].push(layer.data.key);
      }
    } else {
      multiLegendsManager[legendID] = [];
      multiLegendsManager[legendID].push(layer.data.key);
      addLegend(layer);
    }
  }
  function removeMultiLegend(layer) {
    var legendID = layer.data.multiLegendID;
    var index = multiLegendsManager[legendID].indexOf(layer.data.key);
    multiLegendsManager[legendID].splice(index, 1);
    if (multiLegendsManager[legendID].length === 0) {
      removeLegend(layer);
    }
  }

  function addLegend(layer) {
    var style = layer.data.style || '';
    var parent = layer.parent;
    var grandParent = parent.parent;
    var parkIndex = _findParkIndex(legends, grandParent);
    var groupIndex = _findGroupIndex(legends[parkIndex].legendas, parent);
    if (groupIndex > -1) {
      var layerIndex = _findIndex(legends[parkIndex].legendas[groupIndex].data, layer);
      if (layerIndex == -1) {
        legends[parkIndex].legendas[groupIndex].data.push({
          _key: layer.data.multiLegendID || layer.data.key,
          title: layer.title,
          url: 'http://gistree.espigueiro.pt/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + layer.data.workspace + ':' + layer.data.name + '&LEGEND_OPTIONS=forceLabels:on;fontSize:11&SCALE=1000000&Style=' + style
        });
      } else {
        legends[parkIndex].legendas[groupIndex].data[layerIndex] = {
          _key: layer.data.multiLegendID || layer.data.key,
          title: layer.title,
          url: 'http://gistree.espigueiro.pt/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.1.1&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + layer.data.workspace + ':' + layer.data.name + '&LEGEND_OPTIONS=forceLabels:on;fontSize:11&SCALE=1000000&Style=' + style
        }
      }
    } else {
      legends[parkIndex].legendas.push({
        title: layer.parent.title,
        data: []
      });
      addLegend(layer);
    }
  }
  function getLegends() {
    return legends;
  }
  function removeLegend(layer) {
    var parkIndex = _findParkIndex(legends, layer.parent.parent);
    var groupIndex = _findGroupIndex(legends[parkIndex].legendas, layer.parent);
    if (groupIndex > -1) {
      var lIndex = _findIndex(legends[parkIndex].legendas[groupIndex].data, layer);
      if (lIndex > -1) {
        _removeAt(legends[parkIndex].legendas[groupIndex].data, lIndex);
        if (legends[parkIndex].legendas[groupIndex].data == 0) {
          _removeAt(legends[parkIndex].legendas, groupIndex);
        }
      }
    }
  }

  function _findParkIndex(array, data) {
    return array.findIndex(function (e) {
      return e.title == this.title;
    }, data);
  }
  function _findGroupIndex(array, data) {
    return array.findIndex(function (e) {
      return e.title == this.title;
    }, data);
  }
  function _findIndex(array, data) {
    return array.findIndex(function (e) {
      if (this.data.multiLegendID) {
        return e._key == this.data.multiLegendID;
      } else {
        return e._key == this.data.key;
      }
    }, data);
  }
  function _removeAt(a, i) {
    a.splice(i, 1);
  }
}

angular
  .module('unicerApp')
  .service('MapService', MapService);

MapService.$inject = ['$timeout'];

function MapService($timeout) {

  var map;
  var defaultInteractions = [
    new ol.interaction.MouseWheelZoom()];
  var defaultControls = [
    new ol.control.ScaleLine(),
    new ol.control.OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [
        new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: 'http://gistree.espigueiro.pt/geoserver/wms',
            params: {
              'LAYERS': 'unicer:limite'
            },
            extent: [43858.7242812507, 208452.333204688, 44110.6809999999, 209084.351648437],
          }),
        }),
        /* new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: 'http://gistree.espigueiro.pt/geoserver/wms',
            params: {
              'LAYERS': 'unicer:base'
            },
            extent: [43858.7242812507, 208452.333204688, 44110.6809999999, 209084.351648437],
          }),
        }), */
        new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: 'http://gistree.espigueiro.pt/geoserver/wms',
            params: {
              'LAYERS': 'unicer:edificios'
            },
            extent: [43858.7242812507, 208452.333204688, 44110.6809999999, 209084.351648437],
          }),
        }),
        new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: 'http://gistree.espigueiro.pt/geoserver/wms',
            params: {
              'LAYERS': 'unicer:limite_vidago'
            },
            extent: [46283.1896687427, 217450.585892474, 46645.3069363016, 218536.060508136],
          }),
        }),
        /* new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: 'http://gistree.espigueiro.pt/geoserver/wms',
            params: {
              'LAYERS': 'unicer:base_vidago'
            },
            extent: [46283.1896687427, 217450.585892474, 46645.3069363016, 218536.060508136],
          }),
        }), */
        new ol.layer.Image({
          source: new ol.source.ImageWMS({
            url: 'http://gistree.espigueiro.pt/geoserver/wms',
            params: {
              'LAYERS': 'unicer:edificios_vidago'
            },
            extent: [46283.1896687427, 217450.585892474, 46645.3069363016, 218536.060508136],
          }),
        })
      ],
      collapseLabel: '\u002D',
      label: '\u002B',
      collapsed: false,
      tipLabel: ''
    }),
    new ol.control.MousePosition({
      coordinateFormat: function (coord) {
        return ol.coordinate.format(coord, " {x} , {y} ", 4);
      },
      projection: 'EPSG:4326',
      className: '',
      undefinedHTML: '&nbsp;'
    }),
    new ol.control.MousePosition({
      coordinateFormat: function (coord) {
        return ol.coordinate.format(coord, " {x} , {y} ", 4);
      },
      projection: ol.proj.get('EPSG:27493'),
      className: '',
      undefinedHTML: '&nbsp;'
    })];
  var defaultOptions = {
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({}),
        queryable: false
      })
    ],
    interactions: [],
    controls: [],
    view: new ol.View({
      center: ol.proj.transform([-7.593569, 41.595564], 'EPSG:4326', 'EPSG:3857'),
      zoom: 11,
      minZoom: 11
    })
  };

  return {
    init: mapInitialization,
    getMap: getMap,
    getView: getView,
    getControls: getControls,
    getInteractions: getInteractions,
    resetView: resetView,
    zoomToCoordinate: zoomToCoordinate,
    drawMap: drawMap,
    reloadLayers: reloadLayers
  };

  function mapInitialization(options) {
    var mapOptions = angular.extend(defaultOptions, options);
    if (!map) {
      map = new ol.Map(mapOptions);
      for (var i = 0; i < defaultInteractions.length; i++) {
        map.addInteraction(defaultInteractions[i]);
      }
      $timeout(function () {
        for (var i = 0; i < defaultControls.length; i++) {
          map.addControl(defaultControls[i]);
        }
      })
    }
  }
  function getMap() {
    return map;
  }
  function getView() {
    return map.getView();
  }
  function getControls() {
    return map.getControls();
  }
  function getInteractions() {
    return map.getInteractions();
  }
  function resetView() {
    var newView = new ol.View({
      center: ol.proj.transform([-7.593569, 41.595564], 'EPSG:4326', 'EPSG:3857'),
      zoom: 11,
      minZoom: 11
    });
    map.setView(newView);
  }
  function zoomToCoordinate(coordinate, projection) {
    var proj = projection || 'EPSG:4326';
    map.getView().animate({
      center: ol.proj.transform(coordinate, ol.proj.get(proj), 'EPSG:3857'),
      duration: 1000,
      zoom: 16
    });
  }
  function drawMap() {
    $timeout(function () {
      map.setTarget(document.getElementById('map'));
      map.updateSize();
    }, 200);
  }
  function reloadLayers() {
    map.getLayers().forEach(function (layer) {
      if (layer instanceof ol.layer.Vector) {
        layer.getSource().clear();
      }
    });
  }

}
angular
  .module('unicerApp')
  .service('MapInteractionsService', MapInteractionsService);

MapInteractionsService.$inject = ['MapService', 'LayerIdentifier', 'WFSStyles', '$timeout'];

function MapInteractionsService(MapService, LayerIdentifier, WFSStyles, $timeout) {
  var mapInteractions = MapService.getInteractions();
  var activeInteraction = {};
  var selectInteraction = new ol.interaction.Select({
    style: WFSStyles.treeSelected
  });
  setActiveInteraction('DragPan');

  $timeout(function () {
    MapService.getMap().addInteraction(selectInteraction);
  }, 250)
  return {
    setActiveInteraction: setActiveInteraction,
    getActiveInteraction: getActiveInteraction,
    isActive: isActive,
    setDefaultView: setDefaultView,
    zoomTo: zoomTo,
    getSelectInteraction: getSelectInteraction
  }

  function setActiveInteraction(interaction) {
    switch (interaction) {
      case 'DragPan':
        activeInteraction = new ol.interaction.DragPan({});
        activeInteraction.text = 'Mover Mapa';
        break;
      case 'ZoomIn':
        activeInteraction = new ol.interaction.Pointer({
          handleDownEvent: function (e) {
            var view = MapService.getView();
            view.setCenter(e.coordinate);
            view.setZoom(view.getZoom() + 1);
          }
        });
        activeInteraction.text = 'Aproximar Mapa';
        break;
      case 'ZoomOut':
        activeInteraction = new ol.interaction.Pointer({
          handleDownEvent: function (e) {
            var view = MapService.getView();
            view.setCenter(e.coordinate);
            view.setZoom(view.getZoom() - 1);
          }
        })
        activeInteraction.text = 'Afastar Mapa';
        break;
      case 'ZoomBox':
        activeInteraction = new ol.interaction.DragZoom({
          condition: ol.events.condition.always,
          className: 'drag_zoom_box'
        })
        activeInteraction.text = 'Fazer Zoom de Caixa';
        break;
      case 'Identify':
        activeInteraction = new ol.interaction.Pointer({
          handleDownEvent: function (evt) {
            LayerIdentifier.setLayers(evt, evt.map.getView(), evt.map.getLayers().getArray());
          }
        });
        activeInteraction.text = 'Identificar Camadas';
        break;
    }
    activeInteraction.type = interaction;
    mapInteractions.setAt(1, activeInteraction);
  }
  function getActiveInteraction() {
    return activeInteraction.text;
  }
  function isActive(type) {
    return activeInteraction.type === type;
  }
  function setDefaultView() {
    MapService.resetView();
  }
  function zoomTo(coordinate, proj) {
    MapService.zoomToCoordinate(coordinate, proj);
  }
  function getSelectInteraction() {
    return selectInteraction;
  }



}
angular
  .module('unicerApp')
  .service('PrintManager', PrintManager);

PrintManager.$inject = [
  '$q',
  'ParksHttp',
  'PrintHttp',
  'TreesHttp',
  'InterventionsHttp',
  'DefaultInterventionData',
];

function PrintManager($q, ParksHttp, PrintHttp, TreesHttp, InterventionsHttp, Defaults) {

  return {
    getPrintDefaults: getPrintDefaults,
    getCSVLinks: getCSVLinks,
    getPDFLinks: getPDFLinks
  };

  function getPrintDefaults() {
    return ParksHttp.getParks().then(function (parks) {
      return {
        parks: parks,
        seasons: Defaults.getSeasons(),
        years: Defaults.getYears(),
        teams: Defaults.getTeams(),
        contentTypes: [
          {
            key: 'trees',
            value: "Árvores"
          },
          {
            key: 'interventions',
            value: "Intervenções"
          }],
        formats: [
          {
            key: 'csv',
            value: ".csv (Comma Separated Values)"
          }, {
            key: "pdf",
            value: ".pdf (Printable Document Format)"
          }],
        parksWithZones: Defaults.getParks()
      }
    });
  }
  function getCSVLinks(params) {
    var deferred = $q.defer();
    var data = {
      url: 'print/csv/' + params.contentType.key,
      name: params.contentType.value + '.csv',
      params: {
        park: params.park.properties.nome
      },
      icon: 'fa-file-excel-o'
    };
    if (params.season) data.params.season = params.season;
    if (params.year) data.params.year = params.year;
    if (params.zone) data.params.zone = params.zone.id;
    if (params.team) data.params.team = params.team;
    deferred.resolve(data);
    return deferred.promise;
  }
  function getPDFLinks(params) {
    var requestData = _getDefaultRequestData();

    requestData.params = params;

    if (params.zone) {
      var transformedExtent = ol.proj.transformExtent(params.zone.extent, 'EPSG:27493', 'EPSG:4326')
      requestData.attributes.map.bbox = ol.proj.transformExtent(params.zone.extent, 'EPSG:27493', 'EPSG:4326');
    } else {
      requestData.attributes.map.center = ol.proj.toLonLat(params.park.geometry.coordinates);
      requestData.attributes.map.scale = params.park.properties.scale;
      requestData.attributes.map.longitudeFirst = true;
      requestData.attributes.map.height = 550;
      requestData.attributes.map.width = 500;
    }

    requestData.attributes.parque = params.park.properties.nome;
    requestData.attributes.map.layers[0].layers = params.park.properties.layers_to_print;
    
    if (params.contentType.key === "trees") {
      requestData.layout = "arvores";
      requestData.outputFilename = "Árvores - " + params.park.properties.nome;
      requestData.attributes.subtitle = "Impressão de Árvores";
      requestData.attributes.map.layers[0].styles = ["", "", "limites_zonas", "", ""];
      return _getTreeLink(requestData).then(function (downloadURL) {
        return {
          name: 'Árvores - ' + params.park.properties.nome + '.pdf',
          url: downloadURL,
          icon: 'fa-file-pdf-o'
        }
      });
    } else {
      requestData.layout = "inter";
      requestData.outputFilename = "Intervenções - " + params.park.properties.nome;
      requestData.attributes.subtitle = "Impressão de Intervenções";
      requestData.attributes.map.layers[0].styles = ["", "", "limites_zonas", "", "treeIntervention"];

      return _getInterventionsLink(requestData).then(function (downloadURL) {
        return {
          name: 'Intervenções  - ' + params.park.properties.nome + '.pdf',
          url: downloadURL,
          icon: 'fa-file-pdf-o'
        }
      })
    }
  }

  function _getDefaultRequestData() {
    return {
      outputFormat: "pdf",
      attributes: {
        title: "Gestree - Gestão",
        map: {
          projection: "EPSG:4326",
          dpi: 254,
          rotation: 0,
          useAdjustBounds: true,
          useNearestScale: true,
          layers: [
            {
              type: "WMS",
              baseURL: "http://localhost/geoserver/wms",
              layers: [],
              serverType: "geoserver"
            }
          ]
        },
        datasource: []
      }
    }
  }
  function _getTreeLink(requestData) {
    return TreesHttp.getTrees(requestData.params)
      .then(_getTreeTable)
      .then(function (datasource) {
        requestData.attributes.datasource.push({ title: "Árvores" });
        requestData.attributes.datasource[0].table = datasource;
        return requestData;
      }).then(function (requestData) {
        console.log(JSON.stringify(requestData));
        return PrintHttp.printTrees(requestData);
      });
  }
  function _getTreeTable(trees) {
    var columns = [], data = [];
    var genericTree = trees[0];
    for (var attr in genericTree) {
      columns.push(attr);
    };
    for (var i = 0; i < trees.length; i++) {
      var treeData = [];
      for (var treeAttr in trees[i]) {
        treeData.splice(
          columns.findIndex(function (el) {
            return el === treeAttr;
          }), 0, trees[i][treeAttr]);
      }
      data.push(treeData);
    }
    return {
      columns: columns,
      data: data
    };
  }
  function _getInterventionsLink(requestData) {
    var filter = {};
    filter.park = requestData.attributes.parque;
    if (requestData.params.hasOwnProperty('season') && requestData.params.season !== "--") {
      filter.season = requestData.params.season;
    }
    if (requestData.params.hasOwnProperty('year') && requestData.params.year !== "--") {
      filter.year = requestData.params.year;
    }
    if (requestData.params.hasOwnProperty('team') && requestData.params.team !== "--") {
      filter.team = requestData.params.team;
    }
    if (requestData.params.hasOwnProperty('zone') && requestData.params.zone !== "--") {
      filter.zone = requestData.params.zone.id;
    }
    return InterventionsHttp.getFilteredInterventions(filter)
      .then(_getInterventionsTable)
      .then(function (datasource) {
        requestData.attributes.datasource = datasource;
        return requestData;
      })
      .then(function (requestData) {
        return PrintHttp.printInterventions(requestData);
      });
  }
  function _getInterventionsTable(interventions) {
    var columns = [];
    var datasource = [];
    var genericIntervention = interventions[0];
    for (var attr in genericIntervention) {
      columns.push(attr);
    }
    for (var i = 0; i < interventions.length; i++) {
      var interventionsData = [];
      var id_tree = interventions[i].id_tree;
      var hasTree = datasource.findIndex(function (el) {
        return el.id_tree === id_tree;
      })
      for (var interventionsAttr in interventions[i]) {
        interventionsData.splice(
          columns.findIndex(function (el) {
            return el === interventionsAttr;
          }), 0, interventions[i][interventionsAttr]);
      };
      if (hasTree === -1) {
        datasource.push({
          id_tree: id_tree,
          table: {
            columns: columns,
            data: [interventionsData]
          }
        });
      } else {
        datasource[hasTree].table.data.push(interventionsData);
      }
    }
    return datasource;
  }
}  
angular
  .module('unicerApp')
  .service('SideNavService', SideNavService);

function SideNavService() {

  var isVisible = true;
  var activeTab = 1;
  var lastActiveTab;

  return {
    isVisible: getVisibility,
    showNavigation: showNavigation,
    hideNavigation: hideNavigation,
    setActiveTab: setActiveTab,
    getActiveTab: getActiveTab,
    isActiveTab: isActiveTab,
    hide: hide,
    show: show
  }

  function getVisibility() {
    return isVisible;
  }
  function showNavigation() {
    isVisible = true;
  }
  function hideNavigation() {
    isVisible = false;
  }

  function setActiveTab(tab) {
    activeTab = tab;
  }
  function getActiveTab(){
    return activeTab;
  }
  function isActiveTab(tab){
    return activeTab === tab;
  }

  function hide(){
    lastActiveTab = activeTab;
    setActiveTab(null);
  }
  function show(){
    setActiveTab(lastActiveTab);
  }

}  
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
angular
  .module('unicerApp')
  .service('SortingService', SortingService);

SortingService.$inject = ['DefaultInterventionData'];

function SortingService(Defaults){

  return {
    orderBySeasonYear: orderBySeasonYear
  };

  function orderBySeasonYear(intervention) {
    var date = new Date(
      intervention.year,
      Defaults.getSeasons().indexOf(intervention.season) + 3,
      1
    );
    return date.getTime();
  }
}  
angular
  .module('unicerApp')
  .service('WFSStyles', WFSStyles);

function WFSStyles() {

  var _styles = {
    treeDefault: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 3,
        fill: new ol.style.Fill({
          color: [10, 230, 10, 1]
        }),
        stroke: new ol.style.Stroke({
          color: [0, 0, 0, 1]
        }),
      })
    }),
    selected: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
          color: [110, 5, 5, 1]
        }),
        stroke: new ol.style.Stroke({
          color: [0, 0, 0, 1],
          width: 2
        }),
      }),
      zIndex: 100
    }),
    intervention: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 4,
        stroke: new ol.style.Stroke({
            color: [200, 5, 5, 1],
          width: 2
        })
      }),
      zIndex: 50
    }),
    noIntervention: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 3,
        fill: new ol.style.Fill({
          color: [10, 230, 10, 0.7]
        }),
        stroke: new ol.style.Stroke({
          color: [0, 0, 0, 1]
        }),
      })
    })
  };

  return {
    treeSelected: treeSelected,
    treeDefault: treeDefault,
    treeIntervention: treeIntervention,
    treeHighlight: treeHighlight
  }

  function treeSelected(feature, res) {
    var style = _styles.selected;
    if (res < 0.6) {
      addLabel.call(style, feature.getId().toString());
    }else{
      style.setText(null);
    }
    return style;
  }
  function treeDefault(feature, res) {
    var style = _styles.treeDefault;
    if (res < 0.6) {
      addLabel.call(style, feature.getId().toString());
    }else{
      style.setText(null);
    }
    return style;
  }
  function treeIntervention(feature, res) {
    return feature.getProperties().has_inter ? _styles.intervention : _styles.noIntervention;
  }
  function treeHighlight(selectedFeatureID) {
    return function (feature, layer) {
      return selectedFeatureID === feature.getId() ? _styles.selected : _styles.defaultStyle;
    }
  }

  function addLabel(label) {
    this.setText(new ol.style.Text({
      text: label,
      offsetX: 10,
      offsetY: -7,
      scale: 1,
      stroke: new ol.style.Stroke({
        color: [0, 0, 0, 1]
      }),
      fill: new ol.style.Fill({
        color: [0, 0, 0, 1]
      })
    }))
  }

}