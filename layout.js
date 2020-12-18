/*     
    Copyright 2012-2013 OpenBroadcaster, Inc.

    This file is part of OpenBroadcaster Server.

    OpenBroadcaster Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OpenBroadcaster Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with OpenBroadcaster Server.  If not, see <http://www.gnu.org/licenses/>.
*/

function Layout()
{

  this.set_main_size = function()
  { 
    
    var main = $('#layout_main');

    var main_extra_width = parseInt(main.css('borderLeftWidth')) + parseInt(main.css('borderRightWidth')) 
                 + parseInt(main.css('margin-left')) + parseInt(main.css('margin-right')) 
                 + parseInt(main.css('padding-left')) + parseInt(main.css('padding-right'));

    $('#layout_main').width( $('#layout_container').width() - $('#layout_sidebar').outerWidth(true) - main_extra_width - 14);

    var main_extra_height = parseInt(main.css('borderTopWidth')) + parseInt(main.css('borderBottomWidth')) 
                 + parseInt(main.css('margin-top')) + parseInt(main.css('margin-bottom')) 
                 + parseInt(main.css('padding-top')) + parseInt(main.css('padding-bottom'));

    $('#layout_main').height( $(window).height() - $('#layout_footer').outerHeight(true) - main_extra_height );
  
    var searchbox = $('#sidebar_search_media_container');
    var sidebar = $('#layout_sidebar');

    var sidebar_extra_height = parseInt(sidebar.css('borderTopWidth')) + parseInt(sidebar.css('borderBottomWidth')) 
                 + parseInt(sidebar.css('margin-top')) + parseInt(sidebar.css('margin-bottom')) 
                 + parseInt(sidebar.css('padding-top')) + parseInt(sidebar.css('padding-bottom'));

    var searchbox_extra_height = parseInt(searchbox.css('borderTopWidth')) + parseInt(searchbox.css('borderBottomWidth')) 
                 + parseInt(searchbox.css('margin-top')) + parseInt(searchbox.css('margin-bottom')) 
                 + parseInt(searchbox.css('padding-top')) + parseInt(searchbox.css('padding-bottom'));

    var searchbox_height = $('#layout_main').height() - $('#sidebar_player').outerHeight(true) - searchbox_extra_height - sidebar_extra_height - 25;

    $('#sidebar_search_media_container').height( searchbox_height );
    $('#sidebar_search_playlist_container').height( searchbox_height );

    // var search_results_container = searchbox_height - 72 - $('#sidebar_search_media_select_buttons').height() - parseInt($('#sidebar_search_media_select_buttons').css('padding-top')) - parseInt($('#sidebar_search_media_select_buttons').css('padding-bottom')) - $('#sidebar_search_media_buttons').height() - parseInt($('#sidebar_search_media_buttons').css('padding-top')) - parseInt($('#sidebar_search_media_buttons').css('padding-bottom'));

    // using a "dumb" constant here, since sometimes heights are not available (above) if hidden.  Something more intelligent can be done at some point.
    var playlist_results_container = searchbox_height - 158;
    var media_results_container = searchbox_height - 158;

    if(media_results_container < 0) media_results_container = 0;
    if(playlist_results_container < 0) playlist_results_container = 0;

    $('#sidebar_search_media_results_container').height( media_results_container );
    $('#sidebar_search_playlist_results_container').height( playlist_results_container );

  }

  this.home = function()
  {
    $('#layout_main').html(html.get('main.html'));
  }

  this.open_dom_window = function()
  {
    $.openDOMWindow({ 
      windowBGColor: '#333',
      modal: 1,
    });
    this.set_main_size(); // window open/close disrupts sizing
  }

  this.close_dom_window = function()
  {
    $.closeDOMWindow();
    this.set_main_size(); // window open/close disrupts sizing
  }

  this.permissions_update = function(context)
  {

    if(typeof(context)==='undefined') context = 'body';

    var available_permissions = new Array();

    // determine available permissions without item id.  (we just need access to 1 item in order to show) if item id is not specified.
    $.each(settings.permissions, function(index,permission)
    {
      var permission_array = permission.split(':');
      available_permissions.push(permission_array[0]);
    });

    // show/hide based on available permissions.
    $(context).find('[data-permissions]').each(function(index,element)
    {

      var permissions_list = $(element).attr('data-permissions').split(' ');
      var has_permission = false;
    
      for(var i in permissions_list)
      {
        if(available_permissions.indexOf(permissions_list[i])!=-1 || settings.permissions.indexOf(permissions_list[i])!=-1) { has_permission = true; break; }
      }

      if(has_permission) $(element).show();
      else $(element).hide();

    });

    // if our menu has no items, hide the menu...
    $(context).find('#footer_box_left .sf-menu > li').each(function(index,element)
    {
      var count = 0;  

      $(element).find('li').each(function(i,e) { if($(e).css('display')!='none') count++; });

      if(count==0) $(element).hide();
      else $(element).show();
    });
  }

  this.table_fixed_headers = function($headers,$table)
  {
    $headers.width($table.width())

    $headers.find('th:visible').each(function(index,element)
    {
      if(!$(element).attr('data-column')) return;

      $column = $table.find('td:visible[data-column='+$(element).attr('data-column')+']').first();
      if(!$column.length) return;

      // wrap out table heading if <div> so we can have it cut off if too long.
      if(!$(element).find('div').length)
        $(element).html('<div style="overflow: hidden; white-space: nowrap; width: '+$column.width()+'px;">'+$(element).html()+'</div>');

      $(element).width($column.width());
    });
  }

}

layout = new Layout();

layout.docready_complete = false;

$(document).ready(function() {

  if(!layout.docready_complete)
  {

    //layout.set_main_size();
    $(window).resize(function() { layout.set_main_size(); });

    layout.home();

    // mousewheel scrolling
    $('#layout_main').bind('mousewheel', function(event, delta) {
      if(delta>0) $('#layout_main').scrollTo('-=35px');
      else $('#layout_main').scrollTo('+=35px');
      return false;
    });

    $("ul.sf-menu").superfish({autoArrows: false, speed: 'fast', delay: 300}); 

    // show/hide functionality based on permissions...
    callbacks.permissions_update.push(function() { layout.permissions_update(); });

    layout.docready_complete = true;

  }

});

$(window).load(function() {
  layout.set_main_size();
  ModulePlayerMap.init_map();
});
