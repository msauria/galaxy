define(["utils/utils","mvc/ui/ui-misc","mvc/ui/ui-select-default"],function(a,b,c){var d={DISABLED:"disabled",ENABLED:"enabled",LINKED:"linked"},e={data:[{src:"hda",icon:"fa-file-o",tooltip:"Single dataset",multiple:!1,batch:d.DISABLED},{src:"hda",icon:"fa-files-o",tooltip:"Multiple datasets",multiple:!0,batch:d.LINKED},{src:"hdca",icon:"fa-folder-o",tooltip:"Dataset collection",multiple:!1,batch:d.LINKED}],data_multiple:[{src:"hda",icon:"fa-files-o",tooltip:"Multiple datasets",multiple:!0,batch:d.DISABLED},{src:"hdca",icon:"fa-folder-o",tooltip:"Dataset collection",multiple:!1,batch:d.DISABLED}],data_collection:[{src:"hdca",icon:"fa-folder-o",tooltip:"Dataset collection",multiple:!1,batch:d.DISABLED}],workflow_data:[{src:"hda",icon:"fa-file-o",tooltip:"Single dataset",multiple:!1,batch:d.DISABLED}],workflow_data_multiple:[{src:"hda",icon:"fa-files-o",tooltip:"Multiple datasets",multiple:!0,batch:d.DISABLED}],workflow_data_collection:[{src:"hdca",icon:"fa-folder-o",tooltip:"Dataset collection",multiple:!1,batch:d.DISABLED}],module_data:[{src:"hda",icon:"fa-file-o",tooltip:"Single dataset",multiple:!1,batch:d.DISABLED},{src:"hda",icon:"fa-files-o",tooltip:"Multiple datasets",multiple:!0,batch:d.ENABLED}],module_data_collection:[{src:"hdca",icon:"fa-folder-o",tooltip:"Dataset collection",multiple:!1,batch:d.DISABLED},{src:"hdca",icon:"fa-folder",tooltip:"Multiple collections",multiple:!0,batch:d.ENABLED}]},f=Backbone.View.extend({initialize:function(a){var c=this;this.model=a&&a.model||new Backbone.Model({src_labels:{hda:"dataset",hdca:"dataset collection"},pagelimit:100,statustimer:1e3}).set(a),this.setElement($("<div/>").addClass("ui-select-content")),this.button_product=new b.RadioButton.View({value:"false",data:[{icon:"fa fa-chain",value:"false",tooltip:"Linked inputs will be run in matched order with other datasets e.g. use this for matching forward and reverse reads."},{icon:"fa fa-chain-broken",value:"true",tooltip:"Unlinked dataset inputs will be run against *all* other inputs."}]});var d=$("<div/>").addClass("ui-form-info").append($("<i/>").addClass("fa fa-sitemap")).append($("<span/>").html("This is a batch mode input field. Separate jobs will be triggered for each dataset selection."));this.$batch={linked:d.clone(),enabled:d.clone().append($("<div/>").append($("<div/>").addClass("ui-form-title").html("Batch options:")).append(this.button_product.$el)).append($("<div/>").css("clear","both"))},this.$el.on("dragenter",function(a){this.lastenter=a.target,c.$el.addClass("ui-dragover")}).on("dragover",function(a){a.preventDefault()}).on("dragleave",function(a){this.lastenter===a.target&&c.$el.removeClass("ui-dragover")}).on("drop",function(a){c._handleDrop(a),c.$el.removeClass("ui-dragover")}),this.history={},this.listenTo(this.model,"change:data",this._changeData,this),this.listenTo(this.model,"change:wait",this._changeWait,this),this.listenTo(this.model,"change:current",this._changeCurrent,this),this.listenTo(this.model,"change:value",this._changeValue,this),this.listenTo(this.model,"change:type change:optional change:multiple change:extensions",this._changeType,this),this.render(),this.on("change",function(){a.onchange&&a.onchange(c.value())})},render:function(){this._changeType(),this._changeValue(),this._changeWait()},wait:function(){this.model.set("wait",!0)},unwait:function(){this.model.set("wait",!1)},update:function(a){this.model.set("data",a)},value:function(a){void 0!==a&&this.model.set("value",a);var b=this.model.get("current");if(this.config[b]){var c=this.fields[b].value();if(null!==c&&(c=$.isArray(c)?c:[c],c.length>0)){var d=this._batch({values:[]});for(var e in c){var f=this.history[c[e]+"_"+this.config[b].src];if(!f)return Galaxy.emit.debug("ui-select-content::value()","Requested details not found for '"+c[e]+"'."),null;d.values.push(f)}return d.values.sort(function(a,b){return a.hid-b.hid}),d}}else Galaxy.emit.debug("ui-select-content::value()","Invalid value/source '"+a+"'.");return null},_changeCurrent:function(){var a=this;_.each(this.fields,function(b,c){a.model.get("current")==c?(b.$el.show(),_.each(a.$batch,function(b,d){b[a.config[c].batch==d?"show":"hide"]()}),a.button_type.value(c)):b.$el.hide()})},_changeType:function(){var d=this,f=(this.model.get("flavor")?this.model.get("flavor")+"_":"")+String(this.model.get("type"))+(this.model.get("multiple")?"_multiple":"");e[f]?this.config=e[f]:(this.config=e.data,Galaxy.emit.debug("ui-select-content::_changeType()","Invalid configuration/type id '"+f+"'."));var g=d.model.get("data"),h=a.textify(this.model.get("extensions")),i=this.model.get("src_labels");this.fields=[],this.button_data=[],_.each(this.config,function(a,b){d.button_data.push({value:b,icon:a.icon,tooltip:a.tooltip}),d.fields.push(new c.View({optional:d.model.get("optional"),multiple:a.multiple,searchable:!a.multiple||g&&g[a.src]&&g[a.src].length>d.model.get("pagelimit"),selectall:!1,error_text:"No "+(h?h+" ":"")+(i[a.src]||"content")+" available.",onchange:function(){d.trigger("change")}}))}),this.button_type=new b.RadioButton.View({value:this.model.get("current"),data:this.button_data,onchange:function(a){d.model.set("current",a),d.trigger("change")}}),this.$el.empty();var j=0;this.fields.length>1&&(this.$el.append(this.button_type.$el),j=Math.max(0,36*this.fields.length)+"px"),_.each(this.fields,function(a){d.$el.append(a.$el.css({"margin-left":j}))}),_.each(this.$batch,function(a){d.$el.append(a.css({"margin-left":j}))}),this.model.set("current",0),this._changeCurrent(),this._changeData()},_changeWait:function(){var a=this;_.each(this.fields,function(b){b[a.model.get("wait")?"wait":"unwait"]()})},_changeData:function(){var a=this.model.get("data"),b=this,c={};_.each(a,function(a,d){c[d]=[],_.each(a,function(a){c[d].push({hid:a.hid,keep:a.keep,label:a.hid+": "+a.name,value:a.id,tags:a.tags}),b.history[a.id+"_"+d]=a})}),_.each(this.config,function(a,d){c[a.src]&&b.fields[d].add(c[a.src],function(a,b){return b.hid-a.hid})})},_changeValue:function(){var a=this.model.get("value");if(a&&a.values&&a.values.length>0){var b=[];_.each(a.values,function(a){b.push(a.id)});for(var c=a.values[0].src,d=a.values.length>1,e=0;e<this.config.length;e++){var f=this.fields[e],g=this.config[e];if(g.src==c&&-1!==[d,!0].indexOf(g.multiple)){this.model.set("current",e),f.value(b);break}}}else _.each(this.fields,function(a){a.value(null)})},_handleDrop:function(a){try{var b=this.model.get("data"),c=JSON.parse(a.dataTransfer.getData("text"))[0],d=c.id,e="dataset"==c.history_content_type?"hda":"hdca",f={id:d,src:e};b&&_.findWhere(b[e],f)?(this.model.set("value",{values:[f]}),this._handleDropStatus("success")):this._handleDropStatus("danger")}catch(g){this._handleDropStatus("danger")}},_handleDropStatus:function(a){var b=this;this.$el.addClass("ui-dragover-"+a),setTimeout(function(){b.$el.removeClass("ui-dragover-"+a)},this.model.get("statustimer"))},_batch:function(a){a.batch=!1;var b=this.model.get("current"),c=this.config[b];if("hdca"==c.src&&!c.multiple){var e=this.history[this.fields[b].value()+"_hdca"];e&&e.map_over_type&&(a.batch=!0)}return(c.batch==d.LINKED||c.batch==d.ENABLED)&&(a.batch=!0,c.batch==d.ENABLED&&"true"===this.button_product.value()&&(a.product=!0)),a}});return{View:f}});
//# sourceMappingURL=../../../maps/mvc/ui/ui-select-content.js.map