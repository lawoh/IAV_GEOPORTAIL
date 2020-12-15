// Déclaration de la projection en EPSG:26191 (Lambert MAROCZ1)
proj4.defs("EPSG:26191", "+proj=lcc +lat_1=33.3 +lat_0=33.3 +lon_0=-5.4 +k_0=0.999625769 +x_0=500000 +y_0=300000 +a=6378249.2 +b=6356515 +towgs84=31,146,47,0,0,0,0 +units=m +no_defs");
ol.proj.proj4.register(proj4);
var projectionz1 = ol.proj.get('EPSG:26191');




// A group layer for base layers

var baseLayers = new ol.layer.Group({
    title: 'Base Layers',
    openInLayerSwitcher: true,
    layers: [

    new ol.layer.Tile({
        title: "ESRI",
        baseLayer: true,
        visible: false,
        source: new ol.source.XYZ({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        })
    }),
    new ol.layer.Tile({
        title: "Google Satellite Hybride",
        baseLayer: true,
        visible: false,
        source: new ol.source.XYZ({ url: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' })

    }),
    new ol.layer.Tile({
        title: "Google Satellite",
        baseLayer: true,
        visible: true,
        source: new ol.source.XYZ({ url: 'http://mt1.google.com/vt/lyrs=s&hl=pl&&x={x}&y={y}&z={z}' })


    }),

    new ol.layer.Tile({
        title: "Open Street Map",
        baseLayer: true,
        source: new ol.source.OSM(),
        visible: false
    }),
    ]
});


sourceBatiment = new ol.source.Vector({
    format: new ol.format.GeoJSON(),

    projection: "EPSG:26191", 

    url: 'http://localhost:8084/geoserver/tourisme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tourisme%3Abatiment_corrige&outputFormat=application%2Fjson',
    strategy: ol.loadingstrategy.bbox
});

sourcePoint = new ol.source.Vector({
    format: new ol.format.GeoJSON(),

    projection: "EPSG:26191", 

    url: 'http://localhost:8084/geoserver/tourisme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tourisme%3Areseau_geodesique&outputFormat=application%2Fjson',
    strategy: ol.loadingstrategy.bbox
});


sourceRoute = new ol.source.Vector({
    format: new ol.format.GeoJSON(),

    projection: "EPSG:26191", 

    url: 'http://localhost:8084/geoserver/tourisme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tourisme%3Aroute_iav&outputFormat=application%2Fjson',
    strategy: ol.loadingstrategy.bbox
});

sourceLimite = new ol.source.Vector({
    format: new ol.format.GeoJSON(),

    projection: "EPSG:26191", 
    url: 'http://localhost:8084/geoserver/tourisme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tourisme%3Alimite_zone&outputFormat=application%2Fjson',
    strategy: ol.loadingstrategy.bbox
});

var Layerss = new ol.layer.Group(
{
    title: 'Les couches Métiers',
    openInLayerSwitcher: true,
    layers:
    [




    new ol.layer.Vector({
        title: 'Limite IAV' ,

        source: sourceLimite,
        style: function (f) {
            return new ol.style.Style({
                image: new ol.style.RegularShape({
                    radius: 5,
                    radius2: 0,
                    points: 4,
                    stroke: new ol.style.Stroke({ color: "#000", width: 1 })
                }),
                
                stroke: new ol.style.Stroke({
                    width: 1,
                    color: [0, 0, 0]
                }),
                fill: new ol.style.Fill({
                    color: [255, 255, 255, .6]
                })
            })
        },
        visible: true
    }),


    new ol.layer.Vector({
        title: 'Reseau routier' ,

        source: sourceRoute,
        style: function (f) {
            return new ol.style.Style({


                stroke: new ol.style.Stroke({
                    width: 2,
                    color: 'black'
                }),
                
            })
        },
        visible: true
    }),


    new ol.layer.Vector({
        title: 'Les batiments' ,

        source: sourceBatiment,
        style: function (f) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    scale: 0.5,
                    src: "icons/marker.png",
                }),
                text: new ol.style.Text({
                    text: f.get('nom').toString(),
                    font: 'bold 11px sans-serif',
                }),
                zIndex: 5,
            }) 

        }, 
        visible: true

    }),

    new ol.layer.Vector({
        title: 'Points Géodésiques ' ,

        source: sourcePoint,
        style: function (f) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    scale: 0.1,
                    src: "icons/icon.png",
                }),
                
                zIndex: 5,
            }) 

        }, 
        visible: true

    })


    ]
});



var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({

    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
}));

var mousePositionControl = new ol.control.MousePosition({
    undefinedHTML: 'Exterieur de la carte',
    coordinateFormat: ol.coordinate.createStringXY(2),
  //  target: document.getElementById('mouse-position'),
  projection: ol.proj.get('EPSG:26191')
});

var view = new ol.View({
    projection: projectionz1,
    center: [364423, 376391],
    zoom: 18,
    minZoom: 9,
});

var map = new ol.Map({
    target: 'map',
    view: view,

    overlays: [overlay],
    interactions: ol.interaction.defaults({ altShiftDragRotate: false, pinchRotate: false }),
    controls: ol.control.defaults().extend([
        // Add a new Layerswitcher to the map
        new ol.control.LayerSwitcher(),
        // Zoom slider
        new ol.control.ZoomSlider(),

        //Zomm extent
        new ol.control.ZoomToExtent({ extent: [144206, 72930, 377814, 151603] }),


        new ol.control.FullScreen(),
        ]),
    layers: [baseLayers, Layerss,]
});
map.addControl(mousePositionControl);


/*********************************************************************************************** */

// Main control bar
var mainbar = new ol.control.Bar();
map.addControl(mainbar);

var distance = new ol.interaction.Draw({ type: 'LineString' });
var area = new ol.interaction.Draw({ type: 'Polygon' });
position = new ol.interaction.Draw({ type: 'Point' });
var tooltip = new ol.Overlay.Tooltip();

dialogPrompt = new ol.control.Dialog();




// Add buttons to the bar
var mesure = new ol.control.Bar({
    group: true,
    controls: [

    new ol.control.Button({
        html: '<i class="fa fa-road" style="cursor: pointer;" ></i> ',
        title: 'Calcul itinéraire',
        
        handleClick: function () {
            map.addInteraction(distance);
            map.removeInteraction(position);
            area.setActive(false);
            position.setActive(false);
            distance.setActive(false);
            // Calculate the speed factor
            var speed = { A:1, P:1, R:1, L:1};
            function calcSpeed() {
                if ($("#speed").prop('checked')) {
                    speed.A = 1 / Math.max(Number($(".speed #A").val()),1);
                    speed.P = 1 / Math.max(Number($(".speed #P").val()),1);
                    speed.R = 1 / Math.max(Number($(".speed #R").val()),1);
                    speed.L = 1 / Math.max(Number($(".speed #L").val()),1);
                } else {
                    speed = { A:1, P:1, R:1, L:1};
                }
            }
            calcSpeed();

  // The vector graph
  var graph = new ol.source.Vector({
      projection: "EPSG:26191", 
      url: 'http://localhost:8084/geoserver/tourisme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tourisme%3Aroute_iav&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON()
  });
  listenerKey = graph.on('change', function() {
      if (graph.getState() == 'ready') {
          $('.loading').hide();
          ol.Observable.unByKey(listenerKey);
      }
  });
  var vector_routing = new ol.layer.Vector({
      title: 'Route',
      source: graph
  });
  map.addLayer(vector_routing);

// A layer to draw the result
var result = new ol.source.Vector();
map.addLayer ( new ol.layer.Vector({
    source: result,
    style: new ol.style.Style({ 
        stroke: new ol.style.Stroke({ 
            width: 2,
            color: "#f00"
        }) 
    })
}));

   // Dijkstra
   var dijkstra = new ol.graph.Dijskra({
       source: graph
   });
  // Start processing
  dijkstra.on('start', function(e) {
      $('#warning').hide();
      $("#notfound").hide();
      $("#notfound0").hide();
      $("#result").hide();
      result.clear();
  });
  // Finish > show the route
  dijkstra.on('finish', function(e) {
      $('#warning').hide();
      result.clear();
      console.log(e);
      if (!e.route.length) {
          if (e.wDistance===-1) $("#notfound0").show();
          else $("#notfound").show();
          $("#result").hide();
      } else {
          $("#result").show();
          var t = (e.distance/1000).toFixed(2) + 'km';
      // Weighted distance

         var h = e.wDistance/1000;
        var mn = Math.round((e.wDistance%1000)/1000*60);
        if (mn < 10) mn = '0'+mn;
        t += '<br/>' + h.toFixed(0) + 'h ' + mn + 'mn'; 

        $("#result span").html(t);
    }
    result.addFeatures(e.route);
    start = end;
    popStart.show(start);
    popEnd.hide();
});
  // Paused > resume
  dijkstra.on('pause', function(e) {
      if (e.overflow) {
          $('#warning').show();
          dijkstra.resume();
      } else {
      // User pause
  }
});
  // Calculating > show the current "best way"
  dijkstra.on('calculating', function(e) {
      if ($('#path').prop('checked')) {
          var route = dijkstra.getBestWay();
          result.clear();
          result.addFeatures(route);
      }
  });

  // Get the weight of an edge
  dijkstra.weight = function(feature) {
      var type = feature ? feature.get('type') : 'A';
      if (!speed[type]) console.error(type)
          return speed[type] || speed.L;
  };
  // Get direction of the edge
  dijkstra.direction = function(feature) {
      return feature.get('dir');
  }
  // Get the real length of the geom
  dijkstra.getLength = function(geom) {
      if (geom.getGeometry) {
      //? return geom.get('km')*1000;
      geom = geom.getGeometry();
  }
  return ol.sphere.getLength(geom)
}


  // Display nodes in a layer
  var nodes = new ol.layer.Vector({
      title: 'Nodes',
      source: dijkstra.getNodeSource(),
      style: new ol.style.Style({
          image: new ol.style.Circle({
              radius: 5,
              fill: new ol.style.Fill({ color: [255,0,0,.1] })
          })
      })
  });
  map.addLayer(nodes);

  // Start / end Placemark
  var popStart = new ol.Overlay.Placemark({ popupClass: 'flagv', color: '#080' });
  map.addOverlay(popStart);
  var popEnd = new ol.Overlay.Placemark({ popupClass: 'flag finish', color: '#000' });
  map.addOverlay(popEnd);

  // Manage start / end on click
  var start, end;
  map.on('click', function(e) {
      if (!start) {
          start = e.coordinate;
          popStart.show(start);
      } else {
          var se = dijkstra.path(start, e.coordinate);
          if (se) {
              start = se[0];
              end = se[1];
              popEnd.show(end);
          }
      } 


  })
}
}),

new ol.control.Button({
    html: '<i class="fa fa-arrows-h" style="cursor: pointer;" ></i> ',
    title: 'Distance',
    handleClick: function () {
        map.addInteraction(distance);
        map.removeInteraction(position);
        area.setActive(false);
        position.setActive(false);
        distance.setActive(true);
                // Set feature on drawstart
                distance.on('drawstart', tooltip.setFeature.bind(tooltip));
                // Remove feature on finish
                distance.on(['change:active', 'drawend'], tooltip.removeFeature.bind(tooltip));
                //distance.setActive(false);
            }
        }),
new ol.control.Button({
    html: '<i class="fa fa-map"  style="cursor: pointer;" ></i>',
    title: 'Area',
    handleClick: function () {
        map.addInteraction(area);
        map.removeInteraction(position);
        distance.setActive(false);
        position.setActive(false);
        area.setActive(true);
                // Set feature on drawstart
                area.on('drawstart', tooltip.setFeature.bind(tooltip));
                // Remove feature on finish
                area.on(['change:active', 'drawend'], tooltip.removeFeature.bind(tooltip));
                //area.setActive(false);
            }
        }),

new ol.control.Button({
    html: '<i class="fa fa-map-marker"  style="cursor: pointer;" ></i>',
    title: 'Position',
    handleClick: function () {

        map.addInteraction(position);
        distance.setActive(false);
        area.setActive(false);
        position.setActive(true);
        position.on('drawstart', function (evt) {
            var feature = evt.feature;
            coords = feature.getGeometry().getCoordinates();


            dialogPrompt.setContent({
                content: 'X= ' + Number.parseFloat(coords[0]).toFixed(2) + '\n\n'
                + 'Y= ' + Number.parseFloat(coords[1]).toFixed(2)  + '\n\n',
                title: 'Position ',
                buttons: { cancel: 'X' }
            });

            map.addControl(dialogPrompt);
            dialogPrompt.show();
            position.setActive(false);
            map.removeInteraction(position);
            map.removeControl();


        }
        );
                position.on(['change:active','drawend'], tooltip.removeFeature.bind(tooltip));

            }
        }),
]
});

mainbar.addControl(mesure);
map.addOverlay(tooltip);
mainbar.setPosition("top");



var secondbar = new ol.control.Bar();
map.addControl(secondbar);

var mesure = new ol.control.Bar({
    group: true,
    controls: [

    new ol.control.Button({
        html: '<i class="fa fa-info-circle" style="cursor: pointer; aria-hidden="true"></i>',
        title: 'Info',
        handleClick: function () {
            map.removeInteraction(position);
            map.removeInteraction(area);
            map.removeInteraction(distance);

            $("#infos").slideToggle();


        }
    }),


    // new ol.control.Button({
    //     html: '<i class="fa fa-globe"  style="cursor: pointer;" font-size:40px;></i>',
    //     title: 'Naviguer vers (x, y)',
    //     handleClick: function () {
    //         map.removeInteraction(position);
    //         map.removeInteraction(area);
    //         map.removeInteraction(distance);

    //             var div = document.getElementById('choixpos');
    //             div.style.display = div.style.display == "none" ? "block" : "none";
    //             $("#choixpos").fadeToggle();

    //         }
    //     }),
    new ol.control.Button({
        html: '<i class="fa fa-close"  style="cursor: pointer;" ></i>',
        title: 'Annuler',
        handleClick: function () {
            map.removeInteraction(position);
            map.removeInteraction(area);
            map.removeInteraction(distance);
            distance.setActive(false);
            area.setActive(false);
            position.setActive(false);

        }
    }),



    ]
});
secondbar.addControl(mesure);
secondbar.setPosition("bottom");

/*********************************************************************************************** */
// Control echelle numérique
var ctrl = new ol.control.Scale({});
map.addControl(ctrl);
map.addControl(new ol.control.ScaleLine());

function setDiagonal(val) {
    var res = Math.sqrt(window.screen.width * window.screen.width + window.screen.height * window.screen.height) / val;
    res = Math.round(res);
    $('#ppi').val(res);
    ctrl.set('ppi', res);
    ctrl.setScale()
};


var printControl = new ol.control.Print({
    label: "Print",
});
//map.addControl(printControl);

printControl.on('print', function (e) {


    // Export pdf using the print info
    var pdf = new jsPDF({
        orientation: e.print.orientation,
        unit: e.print.unit,
        format: e.print.format
    });
    pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
    pdf.save();
    console.log('printing');

});

mainbar.addControl(printControl);

/********** */
// var overView = new ol.control.OverviewMap({

//     // collapsible: false,
//     view: new ol.View({
//         projection: 'EPSG:26191',

//     })
// });

// map.addControl(overView);


$(document).ready(function () {


    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point([182606.302328, 182606.302328]),
    });


    vectorSource = new ol.source.Vector({
        features: [iconFeature]
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        title: ' Marker',
    });
    center = map.getView().getCenter();
    $('#lon').val(center[0]);
    $('#lat').val(center[1]);

    $('#changeCenter').on("click", function () {

        var source = vectorLayer.getSource();
        source.clear();
        map.removeLayer(vectorLayer);


        var center = [parseFloat($('#lon').val()), parseFloat($('#lat').val())];

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
                //src: 'https://www.google.com/url?sa=i&source=images&cd=&ved=&url=https%3A%2F%2Fwww.iconfinder.com%2Ficons%2F299087%2Fmap_marker_icon&psig=AOvVaw3rCtK17dmLy2-2pitFcpVd&ust=1566567446756403'
            }))
        });

        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(center)
        });

        iconFeature.setStyle(iconStyle);

        vectorSource = new ol.source.Vector({
            features: [iconFeature]
        });

        vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            title: ' Marker',

        });


        view.setZoom(12);

        map.addLayer(vectorLayer);


        map.getView().animate({
            center: center,
            //zoom: 0,
            easing: ol.easing.easeIn,
            //animation : ol.animation.bounce
        })

        map.getView().setCenter(center);

    });


    $('#vieww').on("click", function () {
        var center = map.getView().getCenter();
        $('#lon').val(center[0]);
        $('#lat').val(center[1]);
    });


    $('#supp').on("click", function () {

        var source = vectorLayer.getSource();

        /* var features = source.getFeatures();

        console.log(features);
        for (var i = 0; i < features.length && i < 10; i++) {
            vectorSource.removeFeature(features[i]);
        }
        */
        source.clear();
        map.removeLayer(vectorLayer);
    });
    /* 
        $(".p").on('click', function () {
            $("#choixpos").fadeToggle();
    
        }); */

    //******************************* */


    /******************* */
    var geolocBar = new ol.control.GeolocationBar({
        zoom: 16,
        label: "Geolocalisation"
    });
    map.addControl(geolocBar);
    //map.getView().getCenter();




    /******************************** */


    //////quadrillage

    var grat =
    {
        '26191': new ol.control.Graticule({ step: 50, stepCoord: 1, projection: 'EPSG:26191' })
    };

    var g;

    $('#line').change(function () {
        // alert('changed');

        function setGraticule(proj) {

            // var checkboxes = document.getElementById('line');
            // checkboxes.checked = false;

            // verr = $("#line").prop('checked');
            // console.log(verr);


            if (g) map.removeControl(g);

            g = grat['26191'];
            var c = 'black';
            var style = new ol.style.Style();

            if ($("#line").prop('checked')) {

                style.setStroke(new ol.style.Stroke({ color: 'gray', width: 1 }));
                //style.setFill (new ol.style.Fill({ color: 'black' ? "#fff" : "#000" }));
                style.setText(new ol.style.Text(
                {
                    stroke: new ol.style.Stroke({ color: "#fff", width: 3 }),
                    fill: new ol.style.Fill({ color: c }),
                }));
            }
            g.setStyle(style);
            map.addControl(g);
            if (proj && ol.proj.get(g.get('projection')).getExtent()) {
                var ext = ol.proj.get(g.get('projection')).getExtent();
                ext = ol.proj.transformExtent(ext, g.get('projection'), map.getView().getProjection());
                map.getView().fit(ext, ol.proj.get(g.get('projection')).getExtent(), map.getSize());
                map.getView().setZoom(map.getView().getZoom() + 1)
            }
        }
        setGraticule();
    });



    /*********** */
    // Select  interaction
    var selecti = new ol.interaction.Select({
        hitTolerance: 5,
        condition: ol.events.condition.singleClick
    });
    map.addInteraction(selecti);
    // Select feature when click on the reference index
    selecti.on('select', function (e) {
        var f = e.selected[0];
        if (f) {
            var prop = f.getProperties();
            var ul = $('.infos ul').html('');

            for (var p in prop) if (p !== 'geometry') {
                $('<li>').text(p + ': ' + prop[p]).appendTo(ul);
            }
        }
    });
    // Select control
    // var selectCtrl = new ol.control.Select({

    //     source: sourceBatiment,
    //     property: $(".options select").val(),

    // });
    // map.addControl(selectCtrl);
    // selectCtrl.on('select', function (e) {
    //     console.log(e);
    //     selecti.getFeatures().clear();
    //     for (var i = 0, f; f = e.features[i]; i++) {
    //         selecti.getFeatures().push(f);
    //     }
    // });

    /******/
    
    
    function zoomToExtent() {
        var extent = shapeLayer.getSource().getExtent();
        map.getView().fit(extent, map.getSize());
        view.setZoom(6);
    }


    function loadShpZip() {
        var epsg = ($('#epsg').val() == '') ? 4326 : $('#epsg').val(),
        encoding = ($('#encoding').val() == '') ? 'UTF-8' : $('#encoding').val();
        if (file.name.split('.')[1] == 'zip') {
            if (file) $('.dimmer').addClass('active');
            
            var source = new ol.source.Vector()
            var shapeLayer = new ol.layer.Vector({title:file.name, source: source });  
            map.addLayer(shapeLayer);

            loadshp({
                url: file,
                encoding: encoding,
                EPSG: epsg
            }, function (data) {
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL,
                url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));

                $('#link').attr('href', url);
                $('#link').html(file.name + '.geojson' + '<i class="download icon"></i>').attr('download', file.name + '.geojson');

                $('#downloadLink').slideDown(400);

                $('.shp-modal').toggleClass('effect');
                $('.overlay').toggleClass('effect');
                $('#wrap').toggleClass('blur');

                //  la projection doit etre la meme que la vue
                var features = new ol.format.GeoJSON().readFeatures(data, { featureProjection: 'EPSG:26191' });

                // Add feature to the source. If you want to, you can even track this feature collection, and remove
                // just these features later.
                shapeLayer.getSource().addFeatures(features);

                zoomToExtent();
                $('.dimmer').removeClass('active');
                $('#preview').addClass('disabled');
                $('#epsg').val('');
                $('#encoding').val('');
                $('#info').addClass('picInfo');
                $('#option').slideUp(500);
            });
        } else {
            $('.modal').modal('show');
        }
    }
    //		initVector();

    $("#file").change(function (evt) {
        file = evt.target.files[0];
        if (file.size > 0) {
            $('#dataInfo').text(' ').append(file.name + ' , ' + file.size + ' kb');
            $('#option').slideDown(500);
            $('#preview').removeClass('disabled');
        }
    });

    $('#preview').click(function () {
        loadShpZip();
    });

    $('.button').popup({
        inline: true,
        position: 'bottom left'
    });
    
    $('#entireLayer').click(function () {
        map.fitBounds(vector.getBounds());
    });
    $('#downloadfile').click(function () {
        window.location.href = 'demo/10tnvillage.zip';
    });
    $('#addZipfile').click(function () {
        $('.shp-modal').toggleClass('effect');
        $('.overlay').toggleClass('effect');
        $('#wrap').toggleClass('blur');
    });
    $('#cancel').click(function () {
        $('.shp-modal').toggleClass('effect');
        $('.overlay').toggleClass('effect');
        $('#wrap').toggleClass('blur');
    });
    $('#removeLayer').click(function () {
        $('#attr').fadeOut(300);
        //Pour Recharger la page    
        window.location.reload();
    });
    $('#encoding').dropdown();
    $('.v').change(function () {
        var msg = '<div class="msg" id="msg" style="display: none;"><div class="ui primary inverted red segment">' +
        '<p>You can find the EPSG Code of your Shapefile on <strong>spatialreference.org</strong></p></div><br /></div>';
        if ($('#epsg').val().match(/^\d{4}$/) != null) {
            $('#zipfile').removeClass('disabled');
            $('.msg').slideUp(750);
        } else {
            if ($('.msg')[0] == undefined) {
                $('#epsgField').after(msg);
                $('.msg').slideDown(1500);
            }
        }
    });

    $("#attr").draggable({ containment: $(this).parent().parent(), scroll: false, cursor: "move" });
    $('#cancelAttr').click(function () { $('#attr').slideUp(300); });

});
var select = new ol.interaction.Select({})
map.addInteraction(select);
var popup = new ol.Overlay.PopupFeature({
    popupClass: 'default anim',
    select: select,
    canFix: true
});
map.addOverlay (popup);

  // Control Select 
  var recherche = new ol.interaction.Select({});
  map.addInteraction(recherche);

    // Set the control grid reference
    var search = new ol.control.SearchFeature(
        {    //target: $(".options").get(0),
        source: sourceBatiment,
        property: 'nom'
    });
    map.addControl (search);

    // Select feature when click on the reference index
    search.on('select', function(e)
        {    recherche.getFeatures().clear();
            recherche.getFeatures().push (e.search);
            var p = e.search.getGeometry().getFirstCoordinate();
            map.getView().animate({ center:p });
        });


