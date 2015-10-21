/***********************************************
APACHE OPEN FOR BUSINESS
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
***********************************************/

//GLOBAL NAMESPACE
var OFBOOT = window.OFBOOT || {};

/**************************************************
SCREEN DOM MANIPULATION
builds main-nav/preferences dropdowns and 
adds functionality to style layout elements
**************************************************/
//Screen transforms
OFBOOT.screenTransform = function(){
	//Transform Layout containers
	jQuery('div#column-container').addClass('row');
	if(jQuery('div.left').length > 0){
		if(jQuery('div.right').length > 0){
			jQuery('div.left').removeClass('left').addClass('col-sm-2');
			jQuery('div.right').removeClass('right').addClass('col-sm-2');
			jQuery('div.center').removeClass('center').addClass('col-sm-8');
		}else{
			if(jQuery('div#content-main-section.leftonly')){
				jQuery('div#content-main-section.leftonly').removeClass('leftonly').addClass('col-sm-10');
			}
			jQuery('div.left').removeClass('left').addClass('col-sm-2');
		}
	}else{
		if(jQuery('div.right').length > 0){
			jQuery('div.right').removeClass('right').addClass('col-sm-2');
			jQuery('div.rightonly').removeClass('rightonly').addClass('col-sm-10');
		}else{
			jQuery('div#content-main-section').addClass('col-sm-12');
		}
	}
	
	if(jQuery('div.screenlet')){
		jQuery('div.screenlet').removeClass( "screenlet" ).addClass( "panel panel-default" );
		if('div.screenlet-body'){
			jQuery('div.screenlet-body').removeClass("screenlet-body").addClass("panel-body");
		}
	}
	if(jQuery('div.screenlet-title-bar')){
		jQuery('div.screenlet-title-bar').removeClass( "screenlet-title-bar" ).addClass( "panel-heading" );
	}
	//Replace panel-heading ul with panel-title for screenlets defined in ftls
	if('div.panel-heading'){
		jQuery('div.panel-heading').each(function(){
			var hasUl = jQuery(this).has("ul").length;
			if(!hasUl == 0){
				//var title = jQuery( "div.panel-heading ul li.h3" ).text();
				var title = jQuery(this).find("li.h3").text();
				jQuery(this).find("li.h3").replaceWith(
						'<div class="pull-left"><h3 class="panel-title">'+ title + '</h3></div>'
						);
				jQuery(this).find('div.pull-left').unwrap();
				jQuery(this).find('li').wrapAll('<ul class="pull-right"></ul>');
				//jQuery(console.log(title));
			}
		});
	}
}
/***********************
TABLE LISTS TRANSFORMS
transforming tables  
*****************************************************/
OFBOOT.tableTranforms = function(){
	if(jQuery('tr.alternate-row')){
		jQuery('tr.alternate-row').removeClass('alternate-row');
	}
	if(jQuery('table.basic-table.hover-bar')){
		jQuery('table.basic-table.hover-bar').removeClass().addClass("table").addClass("table-hover").addClass("table-striped").addClass("table-condensed");
	}
	if(jQuery('table tr td a.buttontext')){
		jQuery('table tr td a.buttontext').removeClass("buttontext").addClass("btn btn-link btn-block").css("text-align","left");
	}
}
/****************************
 Ftl form transforms
 ******************************/
OFBOOT.formTranforms = function(){
	if(jQuery('div.screenlet-body')){
		jQuery('div.screenlet-body').removeClass("screenlet-body").addClass("panel-body");
	}
	jQuery('form').each(function(){
		var hasRole = jQuery(this).is("[role]");
		if(hasRole == false){
			jQuery(this).attr("role","form");
		}
		var hasTable = jQuery(this).has("table").length;
		if(!hasTable == 0){
			var colClass = "";
			var lastColClass = "";
			var numCols = jQuery('table tr:first',this).children('td').size();
			jQuery(console.log('Cols: '+numCols));
			var remainder = 12 % numCols;
			if(numCols == 2){
				var labelColClass = 'col-sm-2';
				var fieldColClass = 'col-sm-10';
			}else{
				if(remainder == 0){
					var colSize = 12/numCols;
					var lastColSize = colSize;
				}else{
					var colSize = (12/numCols)- remainder;
					var lastColSize = colSize + remainder;
				}
			}
			colClass = 'col-sm-'+ colSize;
			lastColClass = 'col-sm-'+ lastColSize;
			//Add the form-horizontal class
			jQuery(this).removeClass("basic-form").addClass("form-horizontal");
			//Determine the number of cells per row
			//Transform table rows
			jQuery('table tr', this).each(function(){
				var fields = [];
				for ( var i = 0; i < numCols; i++ ) {
					if(i == 0){
						var hasContent = jQuery(this).children("td:first").html().length;
						if(!hasContent == 0){
							var contents = jQuery(this).children("td:first").html();
						}else{
							var contents = "&nbsp;";
						}
						if(numCols == 2){
							colClass = labelColClass;
						}
						if(jQuery(this).hasClass("header-row-2")){
							var field = '<div class="'+ colClass +' header-row-2"><label class="header-row-2">'+contents+'</label></div>';
						}else{
							var field = '<div class="'+ colClass +'"><label class="control-label">'+contents+'</label></div>';
						}
					}else{
						var j = i+1;
						var contents = jQuery(this).children("td:nth-child("+j+")").html();
						if(numCols == 2){
							colClass = fieldColClass;
						}
						if(i != numCols){
							if(jQuery(this).hasClass("header-row-2")){
								var field = '<div class="'+ colClass +' header-row-2">'+contents+'</div>';
							}else{
								var field = '<div class="'+ colClass +'">'+contents+'</div>';
							}
						}else{
							if(jQuery(this).hasClass("header-row-2")){
								var field = '<div class="'+ lastColClass +' header-row-2">'+contents+'</div>';
							}else{
								var field = '<div class="'+ lastColClass +'">'+contents+'</div>';
							}
						}
						 
					}
					fields.push(field);
				}
				jQuery(this).replaceWith('<div class="form-group">'+fields.join('')+'</div>');
			})
			//Get all the form data
			var formdata = jQuery(this).children('table').children('tbody').html();
			jQuery(this).children('table').replaceWith(formdata);
		}
	});
	//Transform input types
	jQuery('form input').each(function(){
		var text = jQuery(this).attr("value");
		var icon = "";
		var type = jQuery(this).attr("type");
		var name = jQuery(this).attr("name");
		if(type == "submit"){
			var data = jQuery(this);
			jQuery(this).removeClass("smallSubmit").addClass("btn btn-primary btn-sm");
			/*if(name == "searchButton"){
				//var icon = '<button class="btn btn-primary btn-sm"><span class="glyphicon glyphicon-search"></span>'
				jQuery(this).insertBefore('<div class="button-group"><button class="btn btn-primary btn-sm"><span class="glyphicon glyphicon-search"></span></button>');
				//jQuery(this).after('</div>');
			}*/
		}
	});
	//Transform lookup field button
	jQuery('form span.field-lookup a').each(function(){
		var $id = jQuery(this).attr('id');
		if ($id.indexOf("_lookupId_button") >= 0){
			jQuery(this).addClass('btn btn-primary btn-sm').html('<span class="glyphicon glyphicon-search"></span>');
		}
	});
	//Transform a:buttontext
	jQuery('a.buttontext').removeClass('buttontext').addClass('btn btn-link btn-sm');
}
/************************
 * Navigation Tansforms
 ************************/
OFBOOT.navigationTranforms = function(){
	//Tansform button bar - style 1
	jQuery('div.button-bar.button-style-1').each(function(){
		jQuery(this).children('a').each(function(){
			var btnClass = "btn btn-primary btn-sm";
			var icon = "";
			var contents = jQuery(this).text();
			//jQuery(console.log(contents));
			if(jQuery(this).hasClass('create')){
				icon = '<span class="glyphicon glyphicon-plus"></span>';
				jQuery(this).html(icon+ " "+contents);
				jQuery(this).removeClass('create');
			}else{
				if(jQuery(this).hasClass('delete')){
					jQuery(console.log(contents));
					icon = '<span class="glyphicon glyphicon-remove"></span>';
					jQuery(this).html(icon+ " "+contents);
					jQuery(this).removeClass('delete');
				}else{
					if(jQuery(this).hasClass('search')){
						jQuery(console.log(contents));
						icon = '<span class="glyphicon glyphicon-search"></span>';
						jQuery(this).html(icon+ " "+contents);
						jQuery(this).removeClass('search');
					}else{
						if(jQuery(this).hasClass('refresh')){
							jQuery(console.log(contents));
							icon = '<span class="glyphicon glyphicon-refresh"></span>';
							jQuery(this).html(icon+ " "+contents);
							jQuery(this).removeClass('refresh');
						}
					}
				}
			}
			jQuery(this).addClass(btnClass);
		});
		jQuery(this).removeClass('button-bar button-style-1').addClass('btn-group');
	});
	//Tansform button bar - style 2
	jQuery('div.button-bar.button-style-2').each(function(){
		//Wrap inline forms in form-group
		var hasForm = jQuery(this).has("form").length;
		if(!hasForm == 0){
			jQuery(this).children('form').addClass('form-group').css('display','inline');
		}
		//Transform buttons
		jQuery(this).children('a').each(function(){
			var btnClass = "btn btn-link btn-sm";
			var icon = "";
			var contents = jQuery(this).text();
			//jQuery(console.log(contents));
			if(jQuery(this).hasClass('create')){
				icon = '<span class="glyphicon glyphicon-plus"></span>';
				jQuery(this).html(icon+ " "+contents);
				jQuery(this).removeClass('create');
			}else{
				if(jQuery(this).hasClass('delete')){
					jQuery(console.log(contents));
					icon = '<span class="glyphicon glyphicon-remove"></span>';
					jQuery(this).html(icon+ " "+contents);
					jQuery(this).removeClass('delete');
				}else{
					if(jQuery(this).hasClass('search')){
						jQuery(console.log(contents));
						icon = '<span class="glyphicon glyphicon-search"></span>';
						jQuery(this).html(icon+ " "+contents);
						jQuery(this).removeClass('search');
					}else{
						if(jQuery(this).hasClass('refresh')){
							jQuery(console.log(contents));
							icon = '<span class="glyphicon glyphicon-refresh"></span>';
							jQuery(this).html(icon+ " "+contents);
							jQuery(this).removeClass('refresh');
						}
					}
				}
			}
			jQuery(this).addClass(btnClass);
		});
		jQuery(this).removeClass('button-bar button-style-2').addClass('btn-group');
	});
}
/************************
 * Miscellanous Transforms
 ******************************/
OFBOOT.miscTranforms = function(){
	//Misc transforms
	jQuery('div.topcontainerhidden').removeClass('topcontainerhidden').addClass('panel panel-default');
	jQuery('td.label').removeClass('label').addClass('table-label');
	jQuery('table.basic-table').removeClass('basic-table').addClass('table table-condensed table-striped');
}
/**************************************************
LOAD 'EM UP
**************************************************/
//LOAD GLOBAL BOOTSTRAP FUNCTIONS
jQuery(window).load(function(){
	OFBOOT.screenTransform();
	OFBOOT.navigationTranforms();
	OFBOOT.tableTranforms();
	OFBOOT.formTranforms();
	OFBOOT.miscTranforms();
});