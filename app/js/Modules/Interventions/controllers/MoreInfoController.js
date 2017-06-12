(function () {
    'use strict';

    angular
        .module('InterventionsModule')
        .controller('MoreInfoContoller', MoreInfo);

    MoreInfo.$inject = ['Minimap', 'StylesFactory', 'intervention', '$scope', '$timeout'];

    function MoreInfo(Minimap, StylesFactory, intervention, $scope, $timeout) {
        var moreInfoCtrl = this;
        moreInfoCtrl.inter = intervention;
        var _tree = intervention.tree;
        var _coordinates = [_tree.geom.coordinates[0][0], _tree.geom.coordinates[0][1]];
        var style = new StylesFactory();
        var mapResize;


        $scope.$on('$destroy', function () {
            $timeout.cancel(mapResize);
        });

        activate();

        function activate() {
            Minimap.setTarget("minimap");
            Minimap.setCenterAndZoom(_coordinates, 21, 'EPSG:27493');
            var _layer = Minimap.addLayer({
                "workspace": "unicer",
                "name": "arvores",
                "type": "WFS",
                "extent": [43858.7242812507, 208452.333204688, 44110.6809999999, 209084.351648437],
                "opacity": 1
            });
            _layer.setStyle(function (feature) {
                return feature.id_ == _tree.gid ? style.treeHighlight() : style.treeDefault();
            });
            mapResize = $timeout(function () {
                Minimap.updateSize();
            }, 100);
        };
    }
})();