mainObj = new function() {
	var menuObj;
	var cardsObj;
	var currentKeydownFunction;
	var isShowingHelpInformation = false;
    var isAudioEnabled = true;
	
	var ANIMATION_SPEED_MENU = CONSTANT.ANIMATION_SPEED_MENU;
    var URLFORMAINMENUAUDIOFILE = CONSTANT.URLFORMAINMENUAUDIOFILE;
    var URLFORSUBMENUAUDIOFILE = CONSTANT.URLFORSUBMENUAUDIOFILE;
    var TITLE = CONSTANT.TITLE;

	var setSingleKeydown = function (newKeydownFunction) {
		if(typeof(currentKeydownFunction) == "function"){
			$(document).unbind("keydown", currentKeydownFunction);
		}
		$(document).bind("keydown", newKeydownFunction);
		currentKeydownFunction = newKeydownFunction;
	}
	
	this.getHelpInformationBool = function() {
		return isShowingHelpInformation;
	}
    this.getURLForSubMenuFile = function() {
		return URLFORSUBMENUAUDIOFILE;
	}
    this.getURLForMainMenuFile = function() {
		return URLFORMAINMENUAUDIOFILE;
	}
    this.getIsAudioEnabled = function() {
        return isAudioEnabled;
    }
      
    $(function(){
        var thePage = $("body");
        thePage.html(thePage.html().replace(/TOP-LANGUAGE/g, CONSTANT.TOPLANGUAGENAME));
        thePage.html(thePage.html().replace(/BOTTOM-LANGUAGE/g, CONSTANT.BOTTOMLANGUAGENAME));
        thePage.html(thePage.html().replace(/INVISIBLE-INFORMATION/g, CONSTANT.INVISIBLEINFORMATION));
        thePage.html(thePage.html().replace(/HEADER-INFORMATION/g, CONSTANT.HEADERONE));
        document.title = TITLE;
    });
	
	this.setView = function(view) {
		switch(view){
			case "menu":
                $("#cardElements").css("display", "none");
                MenuSingletonClass().playCurrentMenuSound();
				$("#card_Options").hide(ANIMATION_SPEED_MENU);
				$("#controls_display").hide(ANIMATION_SPEED_MENU);
                $("#cardElements").addClass('menuPosition');
                $("#settingsBox").hide(ANIMATION_SPEED_MENU);
                $("#randomizeCards").hide(ANIMATION_SPEED_MENU);
                $("#menu_Options").css("display", "");
                $("#cardElements").css("display", "");
                $("#helpButton ").css("display", "");
				$("#cards-wrap").hide(ANIMATION_SPEED_MENU, function() {
					//$("#menu_Options").show(ANIMATION_SPEED_MENU);
					$("#main_menu-wrap").show(ANIMATION_SPEED_MENU);
                    //$("#helpButton ").show(ANIMATION_SPEED_MENU);
                    //$("#cardElements").show(ANIMATION_SPEED_MENU);
				});
				
				setSingleKeydown(menuObj.keydown);
				break;
			case "cards":
				$("#main_menu-wrap").css("display", "none");
				$("#menu_Options").css("display", "none");
                $("#helpButton ").css("display", "none");
				$("#cards-wrap").css("display", "");
                $("#settingsBox").css("display", "");
				$("#card_Options").css("display", "");
				$("#controls_display").css("display", "none");
                $("#cardElements").css("display", "");
                $("#randomizeCards").css("display", "");
                $("#cardElements").removeClass('menuPosition');
				
				cardsObj.setCards(menuObj.getCurrentFile());
				setSingleKeydown(cardsObj.keydown);
				break;
		}
	}

	this.start = function() {
        multiselect = new MultiselectSingeltonClass();
		menuObj = new MenuSingletonClass();
		cardsObj = new cardsSingletonClass();
		$("#closeHelpWindow").bind("click", mainObj.showHelpInformation);
        
		this.setView("menu");
        setClickHandlers();
        addDescriptionShortcuts();
	}
	
	this.showHelpInformation = function(e) {
		e = typeof e !== 'undefined' ? e.preventDefault() : false;
		if(isShowingHelpInformation) {
			$("#shortcutWindow").addClass("invisible");
			isShowingHelpInformation = false;
		} else {
			$("#shortcutWindow").removeClass("invisible");
			isShowingHelpInformation = true;
		}
	}
    
    setClickHandlers = function() {
        $('#whichCardElements section input').click( function() { cardsSingletonClass().renewToggleState(MultiselectSingeltonClass().getLastClickedItem().ID, MultiselectSingeltonClass().getLastClickedItem().checked, true); });
        $('#enable-disable_Audio').click( function() {
            isAudioEnabled = $(this).prop('checked');
            if(isAudioEnabled){
                //if audioTop disabled then click
                if(!cardsSingletonClass().getConfig_toggle_isTopAudioAutoplayActive()) {
                    cardsSingletonClass().shortCutCheckboxHelper('audioTop');
                }
                //if audioBottom disabled then click
                if(!cardsSingletonClass().getConfig_toggle_isBottomAudioAutoplayActive()) {
                    cardsSingletonClass().shortCutCheckboxHelper('audioBottom');
                }
            } else {
                //if audioTop enabled then click
                if(cardsSingletonClass().getConfig_toggle_isTopAudioAutoplayActive()) {
                    cardsSingletonClass().shortCutCheckboxHelper('audioTop');
                }
                //if audioBottom enabled then click
                if(cardsSingletonClass().getConfig_toggle_isBottomAudioAutoplayActive()) {
                    cardsSingletonClass().shortCutCheckboxHelper('audioBottom');
                }
            }
        });
        $('#enable-disable_AudioMode').click( function() {
            cardsSingletonClass().toggleBlindMode();
        });
        jwerty.key('ctrl+a', function (e) { 
            e.preventDefault();
            $('#enable-disable_AudioMode').click();
        });
    }
    
    function addDescriptionShortcuts() {
        jwerty.key('ctrl+e', function (e) { 
            e.preventDefault();
            cardsSingletonClass().playHiddenAudioFile(CONSTANT.URLADVANCESITEDIS);
        });
        jwerty.key('ctrl+q', function (e) { 
            e.preventDefault();
            cardsSingletonClass().playHiddenAudioFile(CONSTANT.URLAUDIOSITEMAP);
        });
    }
}

function get_browser(){
    var N=navigator.appName, ua=navigator.userAgent, tem;
    var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
    return M[0];
}
function get_browser_version(){
	var N=navigator.appName, ua=navigator.userAgent, tem;
	var M=ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	M=M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];
	return M[1];
}
function get_os_name(){
	var OSName="Unknown OS";
	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
	if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
	if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
	return OSName;
}

$(document).ready(function(){
	currBrowser = get_browser();
	currVersion = get_browser_version();
	currOS = get_os_name();
	if(currBrowser == 'Firefox' && currOS == 'Windows' && currVersion < 21){
		alert('Please update your browser!\nAudio-Files will not work!\n\nDownload your update here:\nhttp://www.mozilla.org/');
	}
	if(currBrowser == 'Firefox' && (currOS == 'Linux' || currOS == 'UNIX') && currVersion < 24){
		alert('Please update your browser!\nAudio-Files will not work!\n\n' + 
		'Download your update here:\nhttp://www.mozilla.org/\n\nYou also have ' + 
		'to install GStreamer. To activate it for Firefox follow these steps:\n' +
		' - Type about:config in the address bar and press Enter\n' +
		' - If you see a warning message then you can confirm that you want to access the about:config page.\n' +
		' - Use the Search bar at the top and type in: gstreamer.enabled\n' + 
		' - Change the setting to true by double-clicking the line.');
	}
    
	mainObj.start();
});
