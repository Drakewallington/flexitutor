function MenuSingletonClass() {

	if ( arguments.callee._singletonInstance ) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	isMovingMainMenu = 1;
	mainmenu_selected = 0;
	submenu_selected = 0;
	menu_array = [];
	isSubMenuActive = false;
    var userUsedMouse = false;
    
    var CARDDIRECTORY = CONSTANT.CARDDIRECTORY;
    var MENUDIRECTORY = CONSTANT.MENUDIRECTORY;
    
    this.isSubMenuActive = function() {
        return isSubMenuActive;
    }
    this.getUserUsedMouse = function() {
        return userUsedMouse;
    }

	//Should be a private function, but the ajax needs access to it
	this.drawMenu = function() {
		for(var menu_i = 0; menu_i < menu_array.length; menu_i++) {
			var menu_html_string = '<li><div id="mainmenutitle_' + menu_i + '">' + menu_array[menu_i][0] + '</div><ul id="mainmenu_' + menu_i + '">';

			for(var submenu_i = 0; submenu_i < menu_array[menu_i][2].length; submenu_i++) {
				menu_html_string += '<li id="submenu_' + submenu_i + '">' + menu_array[menu_i][2][submenu_i] + '</li>';
			}
			menu_html_string += '</ul></li>';

			jQuery('#main_menu-wrap .menu_list').append(menu_html_string);
		}
		$("[id^='mainmenu_']").css("display", "none");
		$("#mainmenutitle_" + mainmenu_selected).css("font-weight", "bold");
		$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "solid");
		
		
	}

	$.ajax({
		type: "GET",
		url: "./../xml/cards/index.xml",
		dataType: "xml",
		success: function(xml) {
			$(xml).find('group').each(function(){
				var group_title = $(this).children('title').text();
                var group_audio = $(this).children('audio').text();
				var tmp_card_sets_titles = [];
				var tmp_card_sets_files = [];
                var tmp_card_sets_audios = [];
				$(this).children('card_set').each(function(){
					tmp_card_sets_titles.push( $(this).children('title').text() );
					tmp_card_sets_files.push( $(this).children('file').text() );
                    tmp_card_sets_audios.push( $(this).children('audio').text() );
				});
				menu_array.push([group_title, group_audio, tmp_card_sets_titles, tmp_card_sets_files, tmp_card_sets_audios]);
			});
		},
		error: function(jqXHR, textStatus, errorThrown) {
        		console.log('Error in MenuSingletonClass() ajax - Status: ' + jqXHR.status + ' ' + jqXHR.statusText + ', Error: ' + textStatus + ', Error Thrown: ' + errorThrown);
		},
		complete: function() {
			MenuSingletonClass().drawMenu();
            MenuSingletonClass().playCurrentMenuPoint(true);
            MenuSingletonClass().registerClickHandler();
		}
	});

	this.getCurrentFile = function() {
		return menu_array[mainmenu_selected][3][submenu_selected];
	}
    
    this.registerClickHandler = function() {
        $(".menu_list>li>div").click(function() { 
            var outermenu = $(this).parent();
            $("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
            submenu_selected = 0;
            $("#mainmenutitle_" + mainmenu_selected).css("font-weight", "");
            $("#mainmenu_" + mainmenu_selected).hide("fast");
            var oldMainMenu_selected = mainmenu_selected;
            mainmenu_selected = parseInt($(".menu_list>li").index(outermenu));
            if(oldMainMenu_selected == mainmenu_selected && isSubMenuActive) {
                isMovingMainMenu = !isMovingMainMenu;
                $("#mainmenu_" + mainmenu_selected).hide("fast");
                $("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
                $("#mainmenutitle_" + mainmenu_selected).css("font-weight", "bold");
                isSubMenuActive = false;
            } else{
                $("#mainmenutitle_" + mainmenu_selected).css("font-weight", "bold");
                if(!isSubMenuActive) {
                    isMovingMainMenu = !isMovingMainMenu;
                }
                $("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
                $("#mainmenu_" + mainmenu_selected).show("fast");
                
                $("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "solid");
                isSubMenuActive = true;
            }
            userUsedMouse = true;
		});
        
        $(".menu_list>li>ul>li").click(function() {
            isSubMenuActive = true;
            var curr_submenu = $(this).attr('id');
            var outermenu = $(this).parent().parent();
            mainmenu_selected = parseInt($(".menu_list>li").index(outermenu));
            $("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
            submenu_selected = parseInt(curr_submenu.substring(8));
            $("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "solid");
            $("#currentSubmenu").html(menu_array[mainmenu_selected][2][submenu_selected]);
            userUsedMouse = true;
            mainObj.setView("cards");
        });
        
        $("#helpButton").click(function() {
            mainObj.showHelpInformation();
        });
    
    }
    
    this.playCurrentMenuPoint = function(hasDelayForMenuPoint) {

        var timeOutTime = 0;
        if(hasDelayForMenuPoint) {
            timeOutTime = 1000;
        }
        if(isSubMenuActive){
            var urlOfAudio = menu_array[mainmenu_selected][4][submenu_selected];
        } else {
            var urlOfAudio = menu_array[mainmenu_selected][1];
        }
        currTimeOutHelper = setTimeout(function() {
            if(urlOfAudio != '') {
                var urlWithoutEnding = urlOfAudio.substr(0, urlOfAudio.length-4);
                cardsSingletonClass().playHiddenAudioFile(urlWithoutEnding, timeOutTime);
            }
        }, 200);
    }
    
    /**
    *  playCurrentMenuSound
    *    plays the sound of the current menu: main-menu OR sub-menu
    */
    this.playCurrentMenuSound = function() {
        if(isSubMenuActive) {
            cardsSingletonClass().playHiddenAudioFile(mainObj.getURLForSubMenuFile());
        } else {
            cardsSingletonClass().playHiddenAudioFile(mainObj.getURLForMainMenuFile());
        }
    }
    
	this.keydown = function(e){
        var hasDelayForMenuPoint = false;
        clearTimeout(cardsSingletonClass().getRunningHiddenAudioPlayerTimeout());
        userUsedMouse = false;
		if(e.keyCode == 112 || mainObj.getHelpInformationBool()) {
			mainObj.showHelpInformation(e);
            if(cardsSingletonClass().getConfig_toggle_isBlindMode()){
                cardsSingletonClass().playHiddenAudioFile(CONSTANT.URLFORAUDIOHELPLONG);
            }
			return;
		} else {
			if(isMovingMainMenu) {
				switch(e.keyCode) {
                    case 37:		//Left Arrow Key
                        cardsSingletonClass().playHiddenAudioFile(CONSTANT.MENUFIRSTLEVEL);
                        return;
					case 38:		//Up Arrow Key
						if(mainmenu_selected > 0) {
							$("#mainmenutitle_" + mainmenu_selected).css("font-weight", "");
							mainmenu_selected--;
							$("#mainmenutitle_" + mainmenu_selected).css("font-weight", "bold");
						}
                        else {
                            cardsSingletonClass().playHiddenAudioFile('firstcard');
                        }
						break;
					case 13: case 39:	//Enter, Right Arrow Key
						isMovingMainMenu = !isMovingMainMenu;
						$("#mainmenu_" + mainmenu_selected).show("fast");
						$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "solid");
						isSubMenuActive = true;
                        hasDelayForMenuPoint = true;
                        MenuSingletonClass().playCurrentMenuSound();
                        MenuSingletonClass().playCurrentMenuPoint(hasDelayForMenuPoint);
						return;
					case 40:		//Down Arrow Key
						if(mainmenu_selected < menu_array.length-1) {
							$("#mainmenutitle_" + mainmenu_selected).css("font-weight", "");
							mainmenu_selected++;
							$("#mainmenutitle_" + mainmenu_selected).css("font-weight", "bold");
						}
                        else{
                            cardsSingletonClass().playHiddenAudioFile('lastcard');
                        }
                        
						break;
                    default: 
                        return;
				}
			} else {
				switch(e.keyCode) {
					case 13: case 39:	//Enter, Right Arrow Key
                        $("#currentSubmenu").html(menu_array[mainmenu_selected][2][submenu_selected]);
                        $('#hiddenPlayer audio')[0].pause();
                        //cardsSingletonClass().playHiddenAudioFile(MENUDIRECTORY + 'm2_card_stack');
						mainObj.setView("cards");
						return;
					case 37:		//Left Arrow Key
						isMovingMainMenu = !isMovingMainMenu;
						$("#mainmenu_" + mainmenu_selected).hide("fast");
						$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
						submenu_selected = 0;
                        isSubMenuActive = false;
                        hasDelayForMenuPoint = true;
                        MenuSingletonClass().playCurrentMenuSound();
                        MenuSingletonClass().playCurrentMenuPoint(hasDelayForMenuPoint);
						return;
					case 38:		//Up Arrow Key
						if(submenu_selected > 0) {
							$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
							submenu_selected--;
							$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "solid");
						}
                        else {
                            cardsSingletonClass().playHiddenAudioFile('firstcard');
                        }
						break;
					case 40:		//Down Arrow Key
						if(submenu_selected < menu_array[mainmenu_selected][2].length-1) {
							$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "");
							submenu_selected++;
							$("#mainmenu_" + mainmenu_selected + " #submenu_" + submenu_selected).css("border-style", "solid");
						}
                        else {
                            cardsSingletonClass().playHiddenAudioFile('lastcard');
                        }
						break;
                    default: 
                        return;
				}
			}
            clearTimeouts();
            MenuSingletonClass().playCurrentMenuPoint(hasDelayForMenuPoint);
		}
	}
    
    function clearTimeouts() {
        clearTimeout(currTimeOutHelper);
        clearTimeout(cardsSingletonClass().getRunningHiddenAudioPlayerTimeout());
    }
}
