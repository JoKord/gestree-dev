(function () {
    'use strict';

    angular
        .module('InterventionsModule')
        .controller('MoreInfo', MoreInfo);

    MoreInfo.$inject = ['Map', 'StylesFactory', 'intervention'];

    function MoreInfo(Map, StylesFactory, intervention) {
        var moreInfoCtrl = this;
        moreInfoCtrl.inter = intervention;
        var _tree = intervention.tree;
        var _coordinates = [_tree.geom.coordinates[0][0], _tree.geom.coordinates[0][1]];
        activate();

        function activate() {
            Map.setCurrentTarget("minimap");
            Map.setCenterAndZoom(_coordinates, 21, 'EPSG:27493');
            var _layer = Map.addLayer({
                "workspace": "unicer",
                "name": "arvores",
                "type": "WFS",
                "extent": [43858.7242812507, 208452.333204688, 44110.6809999999, 209084.351648437],
                "opacity": 1
            });
            _layer.setStyle(function (feature) {
                return feature.id_ == _tree.gid ? StylesFactory.treeHighlight() : StylesFactory.treeDefault();
            });
        }
    }
})();