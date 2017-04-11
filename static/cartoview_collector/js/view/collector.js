/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.collectorApp').directive('collectorAddItemForm', function (urlsHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_collector/angular-templates/add-item-form.html",
        controller: function ($scope, collectorService) {
            $scope.collectorService = collectorService;
        }
    }
});
angular.module('cartoview.collectorApp').service('collectorService',
    function (urlsHelper, mapService, appConfig, featureListService, $rootScope, $http, $mdSidenav) {

        var service = this;
        this.busy = false;
        this.config = appConfig.collector;
        this.attachements = {
            files: []
        };
        var newFeatureStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 31],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                color: "#00B7F1",
                src: urlsHelper.static + 'cartoview_collector/marker.png'
            })),
            text: new ol.style.Text({
                text: '+',
                fill: new ol.style.Fill({
                    color: '#fff'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                }),
                textAlign: 'center',
                offsetY: -20,
                font: '18px serif'
            })
        });
        var featureStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 31],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                color: "#FF4B00",
                src: urlsHelper.static + 'cartoview_collector/marker.png'
            }))
        });
        var selectedFeatureStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 31],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                color: "#00B7F1",
                src: urlsHelper.static + 'cartoview_collector/marker.png'
            }))
        });
        var featureDetailsTpl = ["<table>"];
        var options = {};
        this.config.attributes.forEach(function (a) {
            if (a.included) {
                var fieldTpl = ["<tr>"];
                fieldTpl.push("<th>" + a.label + "</th>");
                if (['select', 'radioList'].indexOf(a.fieldType) != -1) {
                    options[a.name] = {};
                    angular.forEach(a.options, function (o) {
                        options[a.name][o.value] = o.label;
                    });
                    fieldTpl.push("<td>{{options['" + a.name + "'][" + a.name + "]}}</td>");
                }
                else {
                    fieldTpl.push("<td>{{" + a.name + "}}</td>");
                }
                fieldTpl.push("</tr>");
                featureDetailsTpl.push(fieldTpl.join(""));
            }
        });
        var styleResults = function () {
            if (this.get('isSelected')) {
                return [featureStyle]
            }
            return [selectedFeatureStyle];
        };
        featureDetailsTpl.push("</table>");
        var featureListConfig = {
            included: true,
            name: this.config.layer,
            listItemTpl: this.config.listItemTpl,
            featureDetailsTpl: featureDetailsTpl.join(""),
            forEachFeature: function (f) {
                f.set('options', options);
                //uncomment to show marker
                // f.setStyle(styleResults);
            }
        };
        appConfig.featureList = {
            layers: {}
        };
        appConfig.featureList.layers[this.config.layer] = featureListConfig;

        this.form = {
            visible: false
        };
        this.newItem = function () {
            $mdSidenav('new').toggle();
            var view = mapService.map.olMap.getView();
            service.feature.setGeometry(new ol.geom.Point(view.getCenter()));
            service.vectorLayer.setVisible(true);
            service.modifyInteraction.setActive(true);
            this.form.visible = true;
            this.featureProperties = {};
            service.attachments = {
                files: []
            }
        };
        this.cancelNewItem = function () {
            service.modifyInteraction.setActive(false);
            this.form.visible = false;
            service.busy = false;
            service.vectorLayer.setVisible(false);
        };
        mapService.get().then(function () {
            //create a vector source to add the icon(s) to.
            var view = mapService.map.olMap.getView();
            service.feature = new ol.Feature({
                geometry: new ol.geom.Point(view.getCenter()),
                geometryName: 'the_geom'
            });
            service.feature.setStyle(newFeatureStyle);
            service.vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [service.feature]
                })
            });
            mapService.map.olMap.addLayer(service.vectorLayer);
            service.vectorLayer.setVisible(false);
            service.modifyInteraction = new ol.interaction.Modify({
                features: new ol.Collection([service.feature]),
                // style: new ol.style.Style({
                //     image: new ol.style.Circle({
                //         radius: 30,
                //         fill: new ol.style.Fill({
                //             color: 'rgba(255, 255, 255, 0)'
                //         }),
                //         stroke: new ol.style.Stroke({
                //             color: '#00B7F1',
                //             width: 3
                //         })
                //     })
                // }),
                pixelTolerance: 32
            });
            mapService.map.olMap.addInteraction(service.modifyInteraction);
            service.modifyInteraction.setActive(false);
            featureListService.refresh();
        });

        this.setToCurrentLocation = function () {
            service.busy = true;
            var view = mapService.map.olMap.getView();
            var geolocation = new ol.Geolocation({
                projection: view.getProjection(),
                tracking: true
            });
            service.busy = true;
            geolocation.once('change', function (evt) {
                service.busy = false;
                var pos = geolocation.getPosition();
                view.setCenter(pos);
                view.setZoom(17);

                service.feature.setGeometry(new ol.geom.Point(pos));
                $rootScope.$apply();
            });
        };
        var featureType = service.config.layer.split(":")[1];
        var featureNS, geometryName = 'the_geom';
        var formatWFS = new ol.format.WFS();
        var getWFSInfo = function (callback) {
            var params = {
                service: "wfs",
                version: "2.0.0",
                request: "DescribeFeatureType",
                typeNames: service.config.layer,
                outputFormat: "application/json"
            };

            $http.get(urlsHelper.cartoviewGeoserverProxy + "wfs", {params: params}).then(function (res) {
                if (res.status != 200) {
                    alert("Error");
                    return;
                }
                featureNS = res.data.targetNamespace;
                res.data.featureTypes.forEach(function (type) {
                    if (type.typeName == featureType) {
                        type.properties.forEach(function (property) {
                            if (property.type.indexOf('gml') == 0) {
                                geometryName = property.name;
                                return false; //break type.properties.forEach
                            }
                        });
                        return false; //break res.data.featureTypes.forEach
                    }
                });
                callback();
            });

        };

        var save = function () {
            var formatGMLOptions = {
                featureNS: featureNS,
                featureType: featureType,
                // TODO: remove hard-coded srs.
                gmlOptions: {srsName: "EPSG:900913"}
            };
            service.featureProperties[geometryName] = service.feature.getGeometry();
            service.feature.setProperties(service.featureProperties);
            service.feature.setGeometryName(geometryName);
            var node = formatWFS.writeTransaction([service.feature], null, null, formatGMLOptions);
            var s = new XMLSerializer();
            var str = s.serializeToString(node);
            service.status = "Saving Data";
            $http({
                method: 'POST',
                url: urlsHelper.cartoviewGeoserverProxy + "wfs",
                data: str,
                headers: {"Content-Type": 'application/xml'}
            }).then(function (data) {
                featureListService.refresh();
            });
        };
        this.saveNewItem = function () {
            service.busy = true;
            if (featureNS) {
                save()
            } else {
                getWFSInfo(save);
            }

        };// end transactWFS

    });

