(function () {
    'use strict';

    angular
        .module('LegendsModule', [])
        .run(['ControlPanelService', function (cPanelService) {
            cPanelService.addTab({
                id: 2,
                name: "Legendas",
                tooltip: "Legendas",
                iconClass: "my-icon-legends",
                location: "/"
            });
        }]);
})();