/**
 * Copyright (c) 2008-2011 The Open Planning Project
 *
 * Published under the GPL license.
 * See https://github.com/opengeo/gxp/raw/master/license.txt for the full text
 * of the license.
 */

/**
 * @requires plugins/Tool.js
 */

/** api: (define)
 *  module = gxp.plugins
 *  class = FeedGetFeatureInfo
 */

/** api: (extends)
 *  plugins/Tool.js
 */
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: FeedGetFeatureInfo(config)
 *
 *    Plugin for removing a selected layer from the map.
 *    TODO Make this plural - selected layers
 */

gxp.plugins.FeedGetFeatureInfo =  Ext.extend(gxp.plugins.Tool,{

    /** api: ptype = gxp_getfeedfeatureinfo */
    ptype: "gxp_getfeedfeatureinfo",


    construction: function(config) {
        gxp.plugins.FeedGetFeatureInfo.superclass.constructor.apply(this, arguments);
    },

    addActions: function() {
        this.target.mapPanel.layers.on({
            "add": this.addLayer,
            "remove": this.removeLayer,
            scope: this
        });
    },

    addLayer: function(store, records, index){

        for (var i = 0,  ii = records.length; i < ii; ++i) {
            var record = records[i];
        var source = this.target.getSource(record);
        var layer = record.getLayer();
            if (source  instanceof gxp.plugins.FeedSource) {
                //Create a SelectFeature control & add layer to it.
                if (this.target.selectControl == null) {
                    this.target.selectControl = new OpenLayers.Control.SelectFeature(layer, {
                        clickout: true,
                        listeners: {
                            'clickoutFeature': function () {
                            }
                        },
                        scope: this
                    });

                    this.target.mapPanel.map.addControl(this.target.selectControl);

                } else {
                    var currentLayers = this.target.selectControl.layers ? this.target.selectControl.layers :
                        (this.target.selectControl.layer ? [this.target.selectControl.layer] : []);
                    currentLayers.push(layer);
                    this.target.selectControl.setLayer(currentLayers);
                }
            }
            }

        if (this.target.selectControl)
            this.target.selectControl.activate();
     },



    /**
     * Remove a feed layer from the SelectFeatureControl (if present) when that layer is removed from the map.
     * If this is not done, the layer will remain on the map even after the record is deleted.
     * @param record
     */
    removeLayer:  function(store, records, index){
        for (var i = 0,  ii = records.length; i < ii; ++i) {
            var layer = records[i].getLayer();
            var selectControl = this.target.selectControl;
            //SelectControl might have layers array or single layer object
            if ( selectControl  != null){
                for (var x = 0; x < selectControl.layers.length; x++)
                {
                    var selectLayer = selectControl.layers[x];
                    var selectLayers = selectControl.layers;
                    if (selectLayer.id === layer.id) {
                        selectLayers.splice(x,1);
                        selectControl.setLayer(selectLayers);
                    }
                }
            }
            if (selectControl.layer != null) {
                if (recordLayer.id === selectControl.layer.id) {
                    selectControl.setLayer([]);
                }
            }
        }
    }


});


Ext.preg(gxp.plugins.FeedGetFeatureInfo.prototype.ptype, gxp.plugins.FeedGetFeatureInfo);