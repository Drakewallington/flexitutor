function cardsSingletonClass() {

	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	var card_selected = 1;
	var card_map = {
		length : 0,
		terms : [],
        terms_sentences : [],
		audio_terms : [],
		audio_translations : [],
		imageURLs : [],
		translations : [],
        translations_sentences : [],
        term_answerchoices: [],
        translation_answerchoices: []
	};
	var deletedCards = {
		length : 0,
		terms : [],
        terms_sentences : [],
		audio_terms : [],
		audio_translations : [],
		imageURLs : [],
		translations : [],
        translations_sentences : [],
        term_answerchoices: [],
        translation_answerchoices: []
	};
	var card_set_file = "basics/color.xml";
	var card_meta_map = {
		length : 3,
		card_ids : [card_selected - 1, card_selected, card_selected + 1],
		ids : ["card_left", "card_middle", "card_right"]
	};

	//Constants
	var BASE_URL = CONSTANT.BASE_URL;
	var CARDDIRECTORY = CONSTANT.CARDDIRECTORY;
    var NUMBERDIRECTORY = CONSTANT.NUMBERDIRECTORY;
    var DELAYONPLAYINGFIRSTCARD = CONSTANT.DELAYONPLAYINGFIRSTCARD;
    var DELAYONPLAYINGOTHERCARDS = CONSTANT.DELAYONPLAYINGOTHERCARDS;
    var ANIMATION_SPEED_CARDS = CONSTANT.ANIMATION_SPEED_CARDS;

	/*-------------------------------------------
    -- Settings
    -------------------------------------------*/
    //Top
	var config_toggle_isTopTextActive = true;
    var config_toggle_isTopTextInactive = false;
    var config_toggle_isTopAnswerActive = false;
	
    //Bottom
	var config_toggle_isBottomTextActive = true;
	var config_toggle_isBottomTextInactive = false;
    var config_toggle_isBottomAnswerActive = false;
	
    //general Settings
    var config_toggle_isTopAudioAutoplayActive = true;
    var config_toggle_isImageActive = true;
    var config_toggle_isBottomAudioAutoplayActive = true;
    var config_toggle_isBlindMode = false;
    
    //other Buttons
    var config_toggle_isAutoplay = false;
	var config_toggle_isAudioFeedback = CONSTANT.TOGGLE_AUDIOFEEDBACK;

    var config_currentCardSpeedValue = 0;
    var config_currentTopBottomSpeedValue = getCorrectSpeed(2, 'betweenAudioSpeed');;
    var timeoutHelper;
    
	//audioFix
    var controlCorrectAudioCard = {
        autoplayedTranslation_Once : false,
        autoplayedTerm_Once : false
    };
	var alreadyPressedEsc = false;
    var runningTimeoutForAudio;
    var runningTimeoutCard;
    var runningHiddenAudioPlayerTimeout;
    var runningBlindModeTimeout;
    var playInbetweenSound = false;

	var placeHolderImage = false;

	var shortCutsAndHandlersAreAllSet = false;
    var isOnCardStackForTheFirstTime = true;
    
    this.getRunningHiddenAudioPlayerTimeout = function() {
        return runningHiddenAudioPlayerTimeout;
    }
    
    this.getConfig_toggle_isTopAudioAutoplayActive = function() {
        return config_toggle_isTopAudioAutoplayActive;
    }
    this.getConfig_toggle_isBottomAudioAutoplayActive = function() {
        return config_toggle_isBottomAudioAutoplayActive;
    }
    this.getConfig_toggle_isBlindMode = function() {
        return config_toggle_isBlindMode;
    }
    
	//Should be a private function, but the getCardSet()'s ajax needs access to it
	this.setView = function () {
		getCurrentCardSelected();
        var termInsert = '';
        var translationInsert = '';
		for (var i_card = 0; i_card < card_meta_map.length; i_card++) {
			var card_id = card_meta_map.card_ids[i_card];
             
			if (config_toggle_isTopTextActive && !config_toggle_isTopTextInactive && !config_toggle_isTopAnswerActive) {
				$('#' + card_meta_map.ids[i_card] + ' .term-wrapper').html(
					'<p class="textOfCard">' + card_map.terms[card_id] + '</p>');
			} else {
                termInsert = '<span class="icon-eye-blocked textPlaceholder"></span>';
                if(card_map.terms_sentences[card_id] != '' && i_card == 1) {
                    termInsert += '<p class="textHelper inactiveSentence"></p>';
                }
                termInsert += '<p class="helperSentenceTerm"></p>';
                $('#' + card_meta_map.ids[i_card] + ' .term-wrapper').html(termInsert);
			}
			$('#' + card_meta_map.ids[i_card] + ' .term-wrapper').append('<div id="audioTerm' + i_card + '" class="audioDiv"></div>');

			if (config_toggle_isBottomTextActive && !config_toggle_isBottomTextInactive && !config_toggle_isBottomAnswerActive) {
				$('#' + card_meta_map.ids[i_card] + ' .translation-wrapper').html(
					'<p class="textOfCard">' + card_map.translations[card_id] + '</p>');
			} else {
                translationInsert = '<span class="icon-eye-blocked textPlaceholder"></span>';
                if(card_map.translations_sentences[card_id] != '' && i_card == 1) {
                    translationInsert += '<p class="textHelper inactiveSentence"></p>';
                }
                translationInsert += '<p class="helperSentenceTranslation"></p>';
				$('#' + card_meta_map.ids[i_card] + ' .translation-wrapper').html(translationInsert);
			}
			$('#' + card_meta_map.ids[i_card] + ' .translation-wrapper').append('<div id="audioTranslation' + i_card + '" class="audioDiv"></div>');
		}
		var isSound = (config_toggle_isAudioFeedback ? "feedbackSoundIstrue" : "feedbackSoundIsfalse");
		$(".feedbackSoundSymbol").html('<div class="' + isSound + '"></div>');
        showOrHideElement((config_toggle_isTopAnswerActive && !config_toggle_isTopTextInactive), 'answerFormTerm');
        showOrHideElement((config_toggle_isBottomAnswerActive && !config_toggle_isBottomTextInactive), 'answerFormTranslation');

		showCorrectProgress();
	}
    

	function getCardSet() {
		card_selected = 0;
        card_map = {
            length : 0,
            terms : [],
            terms_sentences : [],
            audio_terms : [],
            audio_translations : [],
            imageURLs : [],
            translations : [],
            translations_sentences : [],
            term_answerchoices: [],
            translation_answerchoices: []
        };

		$.ajax({
			type : "GET",
			url : CONSTANT.URLHTMLFILE + "xml/cards/" + card_set_file,
			dataType : "xml",
			success : function (xml) {
				$(xml).find('card').each(function () {
					var term = $(this).find('term').text();
                    var term_sentence = $(this).find('term_sentence').text();
					var translation = $(this).find('translation').text();
                    var translation_sentence = $(this).find('translation_sentence').text();
                    var term_answerchoices = [];
                    var translation_answerchoices = [];
					var audio_africana = '';
					var audio_english = '';
                    
					var imagePath = $(this).find('image').text();
					if (imagePath != '') {
						imageURL = CONSTANT.URLHTMLFILE + 'images/cards/' + imagePath;
					} else {
						imageURL = CONSTANT.URLHTMLFILE + 'images/cards/no-image.png';
					}
                    
                    if($(this).find('term_answerchoices').text() != '') {
                        term_answerchoices = $(this).find('term_answerchoices').text().split(CONSTANT.SEPARATOR);
                    }
                    
                    if($(this).find('translation_answerchoices').text() != '') {
                        translation_answerchoices = $(this).find('translation_answerchoices').text().split(',');
                    }
                    

					if ($(this).find('audio1').text() != '') {
						audio_africana = CARDDIRECTORY + $(this).find('audio1').text();
					} else {
                        audio_africana = CONSTANT.URLCARDWITHOUTAUDIO;
                    }

					if ($(this).find('audio2').text() != '') {
						audio_english = CARDDIRECTORY + $(this).find('audio2').text();
					} else {
                        audio_english = CONSTANT.URLCARDWITHOUTAUDIO;
                    }

					card_map.terms.push(term);
                    card_map.terms_sentences.push(term_sentence);
					card_map.translations.push(translation);
                    card_map.translations_sentences.push(translation_sentence);
					card_map.imageURLs.push(imageURL);
					card_map.audio_terms.push(audio_africana);
					card_map.audio_translations.push(audio_english);
                    term_answerchoices.push(term);
                    card_map.term_answerchoices.push(term_answerchoices);
                    translation_answerchoices.push(translation);
                    card_map.translation_answerchoices.push(translation_answerchoices);
					card_map.length++;
				});
			},
			error : function (jqXHR, textStatus, errorThrown) {
				console.log('Error in cardsSingletonClass() getCardSet ajax - Status: ' + jqXHR.status + ' ' + jqXHR.statusText + ', Error: ' + textStatus + ', Error Thrown: ' + errorThrown);
			},
			complete : function () {
                randomizeCards();
                $('.answerBox:visible:first').focus();
            }
		});
	}
    

	function getCurrentCardSelected() {
		card_meta_map.card_ids[0] = card_selected - 1;
		card_meta_map.card_ids[1] = card_selected;
		card_meta_map.card_ids[2] = card_selected + 1;

		if (card_selected == 0) {
			card_meta_map.card_ids[0] = card_map.length - 1;
		} else if (card_selected == card_map.length - 1) {
			card_meta_map.card_ids[2] = 0;
		}
	}

	function insertImages() {
		getCurrentCardSelected();

		for (var i_card = 0; i_card < card_meta_map.length; i_card++) {
			var card_id = card_meta_map.card_ids[i_card];
			if (config_toggle_isImageActive) {
				$('#' + card_meta_map.ids[i_card] + ' .image-wrapper').html('<img src="' + card_map.imageURLs[card_id] + '">');
				placeHolderImage = false;
			} else {
				$('#' + card_meta_map.ids[i_card] + ' .image-wrapper').html('<img src="' + CONSTANT.URLHTMLFILE + 'images/placeholder.png">');
				placeHolderImage = true;
			}
		}
        testImages();
	}
    
    function testImages() {
        $('img').error(function(){
            $(this).attr('src', CONSTANT.URLHTMLFILE + 'images/cards/no-image.png');
        });
    }
    
    
	function insertAudio() {
		getCurrentCardSelected();
        
		for (var i_card = 0; i_card < card_meta_map.length; i_card++) {
			var card_id = card_meta_map.card_ids[i_card];
            
			var urlForMP3FileTerm = card_map.audio_terms[card_id];
			var urlForOGGFileTerm = urlForMP3FileTerm.substr(0, urlForMP3FileTerm.length - 3) + 'ogg';
            
			$('#audioTerm' + i_card).html(
				'<audio controls id="playerTop' + i_card + '" height="100" width="100">' +
				'<source type="audio/mpeg" src="' + urlForMP3FileTerm + '">' +
				'<source type="audio/mpeg" src="' + urlForOGGFileTerm + '">' +
				'Your browser does not support the audio tag!' +
				//'<embed height="50" width="100" src="' + card_map.audio_terms[card_id] + '">' +
				'</audio>');

			var urlForMP3FileTrans = card_map.audio_translations[card_id];
			var urlForOGGFileTrans = urlForMP3FileTrans.substr(0, urlForMP3FileTrans.length - 3) + 'ogg';
			$('#audioTranslation' + i_card).html(
				'<audio controls id="playerBottom' + i_card + '" height="100" width="100">' +
				'<source type="audio/mpeg" src="' + urlForMP3FileTrans + '">' +
				'<source type="audio/mpeg" src="' + urlForOGGFileTrans + '">' +
				'Your browser does not support the audio tag!' +
				//'<embed height="50" width="100" src="' + card_map.audio_translations[card_id] + '">' +
				'</audio>');

			if (card_id == card_map.length - 1 && !alreadyPressedEsc && i_card == 1 && config_toggle_isBottomAudioAutoplayActive) {
				document.getElementById('playerBottom1').addEventListener('ended', cardsSingletonClass().playHiddenAudioFile(CARDDIRECTORY + 'lastcard'));
			} else if (card_id == card_map.length - 1 && !alreadyPressedEsc && i_card == 1 && !config_toggle_isBottomAudioAutoplayActive) {
				cardsSingletonClass().playHiddenAudioFile(CARDDIRECTORY + 'lastcard');
			}
		}
        playCurrentCard();
        
		$('audio').on('click', function () {
			changeGlobalAudioVolume(this)
		});
	}

	function playCurrentCard() {
        var delayForCards = DELAYONPLAYINGOTHERCARDS;
        if(isOnCardStackForTheFirstTime) {
            if(!MenuSingletonClass().getUserUsedMouse()){
                cardsSingletonClass().playCurrentCardsTotal();
            }
            delayForCards = DELAYONPLAYINGFIRSTCARD;
            isOnCardStackForTheFirstTime = false;
        }
        
		runningTimeoutCard = setTimeout(function () { //that you have a little pause between switching cards and playing
			var audioPlayerTerm = document.getElementById('playerTop1');
            if (config_toggle_isTopAudioAutoplayActive && !controlCorrectAudioCard.autoplayedTranslation_Once && !alreadyPressedEsc) {
				audioPlayerTerm.play();
                controlCorrectAudioCard.autoplayedTerm_Once = true;
			}
            
            if (config_toggle_isBottomAudioAutoplayActive && !controlCorrectAudioCard.autoplayedTranslation_Once && !alreadyPressedEsc) {
				var audioPlayerTranslation = document.getElementById('playerBottom1');
                if(config_toggle_isTopAudioAutoplayActive && !alreadyPressedEsc) {
                    
                    audioPlayerTerm.addEventListener('ended', function () {
                        if(!controlCorrectAudioCard.autoplayedTranslation_Once && !alreadyPressedEsc) {
                            playInbetweenSound = true;
                            cardsSingletonClass().playHiddenAudioFile(CARDDIRECTORY + 'blip', (config_currentTopBottomSpeedValue * 1000 - (CONSTANT.SPEEDFAKTORBLIP * config_currentTopBottomSpeedValue * 1000)));
                            playInbetweenSound = false;
                            runningTimeoutForAudio = setTimeout(function () {
                                audioPlayerTranslation.play();
                                controlCorrectAudioCard.autoplayedTranslation_Once = true;
                            }, config_currentTopBottomSpeedValue * 1000);
                        }
                    });
                } else {
                    audioPlayerTranslation.play();
                    controlCorrectAudioCard.autoplayedTranslation_Once = true;
                }
                if(config_toggle_isAutoplay) {
                    document.getElementById('playerBottom1').addEventListener('ended', goToNextCard);
                }
			} else if (config_toggle_isTopAudioAutoplayActive && !config_toggle_isBottomAudioAutoplayActive && !alreadyPressedEsc && config_toggle_isAutoplay){
                audioPlayerTerm.addEventListener('ended', goToNextCard);
            } else if (config_toggle_isAutoplay && !config_toggle_isTopAudioAutoplayActive && !config_toggle_isBottomAudioAutoplayActive){
                    goToNextCard();
            }
		}, delayForCards);
        
	}
    
	/*
	START FUNCTION
	 */
	this.setCards = function (new_card_set_file) {
		controlCorrectAudioCard.autoplayedTranslation_Once = false;
		alreadyPressedEsc = false;
		card_set_file = new_card_set_file;
		getCardSet();
		if (!shortCutsAndHandlersAreAllSet) {
			setHooks();
			cardsSingletonClass().addShortcuts();
		}
	}
    
	function setHooks() {
        $('#toggle_useSpace').click(function () { cardsSingletonClass().renewToggleState(this.id) });
		$('.feedbackSoundSymbol').click(function () { cardsSingletonClass().toggleElement($(this).attr('class')) });
		$('.answerForm button').click(function () { cardsSingletonClass().btnClickHandler(this.id) });
		$('#backToMenuBtn').click(function () {
            var e = jQuery.Event('keydown');
            e.which = 27;
            $(document).trigger(e);
		});
		$('.item_middle .image-wrapper').click(function () { showHiddenPicture() });
		$('#card_left').click(function () { cardsSingletonClass().goBackOrForward('back') });
		$('#card_right').click(function () { cardsSingletonClass().goBackOrForward('forward') });
		$('.item_middle .term-wrapper').click(function (e) { showHiddenText('toggle_term', this, e.target) });
		$('.item_middle .translation-wrapper').click(function (e) { showHiddenText('toggle_translation', this, e.target) });
		$('.delete_card').click(function () { deleteCurrentCard() });
        $('.multiselect section input').click( function() { cardsSingletonClass().renewToggleState(MultiselectSingeltonClass().getLastClickedItem().ID, MultiselectSingeltonClass().getLastClickedItem().checked); });
        $('#randomizeCards').click( function() { randomizeCards() });
	}

	this.resetCardView = function () {
        cardsSingletonClass().setView();
		insertImages();
		insertAudio();
	}

	this.keydown = function (e) {
		if (e.keyCode == 112 || mainObj.getHelpInformationBool()) { //F1
			mainObj.showHelpInformation(e);
            playOnlyInBlindMode(CONSTANT.URLFORAUDIOHELPLONG);
			return;
		} else {
            $('#hiddenPlayer audio')[0].pause();
			switch (e.which) {
			case 13: //Enter Key
                $(':focus').next().click();
				return;
			case 27: //Escape
                autoplayedTranslation_Once = true;
				alreadyPressedEsc = true;
                isOnCardStackForTheFirstTime = true;
                resetAnswerBox();
                stopAudio();
				mainObj.setView('menu');
                MenuSingletonClass().playCurrentMenuPoint(true);
				return;
			case 37: //Left Arrow Key
				cardsSingletonClass().goBackOrForward('back');
				return;
			case 38: //Up Arrow Key
				break;
			case 39: //Right Arrow Key
				cardsSingletonClass().goBackOrForward('forward');
				return;
			case 40: //Down Arrow Key
				break;
			default:
				return;
			}
		}
		cardsSingletonClass().resetCardView();
		resetAnswerBox();
	}

	this.goBackOrForward = function (backOrForward) {
		document.getElementById('playerTop1').removeEventListener('ended', cardsSingletonClass().playHiddenAudioFile);
        goToNextCardHelper();
        var whichDirection;
		switch (backOrForward) {
            case 'back': //Left Arrow Key
                if (card_selected == 0) {
                    card_selected = card_map.length - 1;
                } else {
                    card_selected--;
                }
                whichDirection = '-';
                break;
            case 'forward': //Right Arrow Key
                if (card_selected == card_map.length - 1) {
                    card_selected = 0;
                } else {
                    card_selected++;
                }
                whichDirection = '+';
                break;
            default:
                return;
		}
        
		animateCardsSlide(whichDirection);
	}
    
	this.btnClickHandler = function (termOrTranslation) {
		resetAnswerBoxBorder();
        var answerText;
        var answerBoxWithBorder;
        var correctAnswerArray;
        var displayedString = 'incorrect';
        switch (termOrTranslation) {
            case 'answerButtonTop':
                answerBoxWithBorder = $('#answerBoxTop');
                answerText = $('#answerBoxTop').val().trim().toLowerCase();
                correctAnswerArray = card_map.term_answerchoices[card_selected];
                break;
            case 'answerButtonBottom':
                answerBoxWithBorder = $('#answerBoxBottom');
                answerText = $('#answerBoxBottom').val().trim().toLowerCase();
                correctAnswerArray = card_map.translation_answerchoices[card_selected];
                break;
            default:
                return;
		}
        $.each(correctAnswerArray, function(index, answer) {
            if (answerText == answer.trim().toLowerCase()) {
                answerBoxWithBorder.addClass('correctBorder');
                displayedString = 'correct';
                return false;
            }
        });
		if (displayedString == 'incorrect') {
			answerBoxWithBorder.addClass('wrongBorder');
            answerBoxWithBorder.select();
		}
		if (config_toggle_isAudioFeedback) {
			cardsSingletonClass().playHiddenAudioFile(CARDDIRECTORY + displayedString);
		}
		answerBoxWithBorder.parent().append('<p class="displayedString">' + displayedString + ' answer</p>');
		return false;
	}

	function resetAnswerBoxBorder() {
		$('.answerBox').removeClass('wrongBorder correctBorder');
		if ($('.displayedString')) {
			$('.displayedString').remove();
		}
	}
    function resetAnswerBox() {
        resetAnswerBoxBorder();
        $('.answerBox').val('');
    }
    
    function stopAudio() {
        clearTimeout(runningTimeoutForAudio);
        delete runningTimeoutForAudio;
        clearTimeout(runningTimeoutCard);
        delete runningTimeoutCard;
        clearTimeout(runningHiddenAudioPlayerTimeout);
        delete runningHiddenAudioPlayerTimeout;
        clearTimeout(runningBlindModeTimeout);
        delete runningBlindModeTimeout;
        $('#hiddenPlayer audio')[0].pause();
        $('#playerTop1')[0].pause();
        $('#playerBottom1')[0].pause();
    }
    

	function showHiddenPicture() {
		if (!config_toggle_isImageActive && placeHolderImage) {
			$('.item_middle .image-wrapper img').attr('src', card_map.imageURLs[card_selected]);
			placeHolderImage = false;
		} else if (!config_toggle_isImageActive && !placeHolderImage) {
			$('.item_middle .image-wrapper img').attr('src', CONSTANT.URLHTMLFILE + 'images/placeholder.png');
			placeHolderImage = true;
		}
	}
	function showHiddenText(termOrTranslation, whatElementWasClicked, target) {
		var jQueryWhatElementWasClicked = $(whatElementWasClicked);
        var helperWord = jQueryWhatElementWasClicked.children('span');
        var helperSentence = jQueryWhatElementWasClicked.children('p.textHelper');
        if(helperWord.is(target)){
            var textToReplace;
            var isCurrentTextActive;
            
            var isPlaceholderActive = helperWord.hasClass('icon-eye-blocked');

            switch (termOrTranslation) {
            case 'toggle_term':
                textToReplace = card_map.terms[card_selected];
                isCurrentTextActive = config_toggle_isTopTextActive;
                break;
            case 'toggle_translation':
                textToReplace = card_map.translations[card_selected];
                isCurrentTextActive = config_toggle_isBottomTextActive;
                break;
            default:
                return;
            }

            if (!isCurrentTextActive && isPlaceholderActive) {
                helperWord.css('background', 'none');
                helperWord.removeClass('icon-eye-blocked');
                helperWord.addClass('centeredText');
                helperWord.html(textToReplace);
            } else if (!isCurrentTextActive && !isPlaceholderActive) {
                helperWord.addClass('icon-eye-blocked');
                helperWord.html('');
            }
        } else if(helperSentence.is(target)){
            var textToReplace;
            var isCurrentTextActive;
            var whichReplacingParagraph;
            
            var isPlaceholderActive = helperSentence.hasClass('inactiveSentence');

            switch (termOrTranslation) {
            case 'toggle_term':
                textToReplace = card_map.terms_sentences[card_selected];
                isCurrentTextActive = config_toggle_isTopTextActive;
                whichReplacingParagraph = 'helperSentenceTerm';
                break;
            case 'toggle_translation':
                textToReplace = card_map.translations_sentences[card_selected];
                isCurrentTextActive = config_toggle_isBottomTextActive;
                whichReplacingParagraph = 'helperSentenceTranslation';
                break;
            default:
                return;
            }
            if (!isCurrentTextActive && isPlaceholderActive) {
                helperSentence.removeClass('inactiveSentence');
                $('.item_middle .' + whichReplacingParagraph).html(textToReplace);
            } else if (!isCurrentTextActive && !isPlaceholderActive) {
                helperSentence.addClass('inactiveSentence');
                $('.item_middle .' + whichReplacingParagraph).html('');
            }
        }
	}

	function resetCardsAndDontPlayFirst() {
		alreadyPressedEsc = true;
		cardsSingletonClass().resetCardView();
		alreadyPressedEsc = false;
	}

	/**
	 * playHiddenAudioFile(audioFile, delayTimeToPlay*)
	 *  is a helper function and plays an audio file
	 *  input: audioFile: String, delayTimeToPlay: Integer (optional)
	 *    audioFile: plays the audio file in the first parameter
	 *      the file has to have the correct path starting from the css directory
	 *    delayTimeToPlay (optional)
	 *      it is the delay of the audio file starting to play
	 */
	this.playHiddenAudioFile = function (audioFile, delayTimeToPlay) {
		if(!mainObj.getIsAudioEnabled() && !playInbetweenSound) {
            return;
        }
        delayTimeToPlay = typeof delayTimeToPlay !== 'undefined' ? delayTimeToPlay : 0;
		runningHiddenAudioPlayerTimeout = setTimeout(function () {
			$('#hiddenPlayer').html('<div class="invisible">' +
				'<audio autoplay="autoplay" >' +
				'<source src="' + audioFile + '.mp3" type="audio/mpeg" id="hiddenMP3File">' +
				'<source src="' + audioFile + '.ogg" type="audio/ogg" id="hiddenOGGFile">' +
				'</audio></div>');
		}, delayTimeToPlay);
	}
    
    this.playCurrentCardsTotal = function () {
        var number = card_map.length;
        var url = NUMBERDIRECTORY + 'en_';
        if(number < 10) {
            url += '0';
        }
        url += number;
        if(isOnCardStackForTheFirstTime) {
            delay = CONSTANT.NUMBERDELAY;
            cardsSingletonClass().playHiddenAudioFile(CONSTANT.NUMBEROFCARDSURL, CONSTANT.NUMBEROFCARDSDELAY);
            cardsSingletonClass().playHiddenAudioFile(url, CONSTANT.NUMBERDELAY);
        } else {
            cardsSingletonClass().playHiddenAudioFile(CONSTANT.NUMBEROFCARDSURL);
            cardsSingletonClass().playHiddenAudioFile(url, 1000);
        }
    }
    
	function changeGlobalAudioVolume(currentAudioPlayer) {
		$.each($('audio'), function () {
			this.volume = currentAudioPlayer.volume;
		});
	}
    
    
    this.toggleElement = function (id) {
		var whichToggleToChange;
		switch (id) {
		case 'feedbackSoundSymbol':
			config_toggle_isAudioFeedback = !config_toggle_isAudioFeedback;
            playStatusInformation(config_toggle_isAudioFeedback, CONSTANT.URLAUDIOON, CONSTANT.URLAUDIOOFF);
			resetCardsAndDontPlayFirst();
			return;
		default:
			return;
		}
		$('#' + id).prop('checked', whichToggleToChange);
		resetCardsAndDontPlayFirst();
	}
    
    this.renewToggleState = function(id, checked, gotInformationFromMenu) {
        switch (id) {
            case 'textTop':
                config_toggle_isTopTextActive = checked;
                config_toggle_isTopTextInactive = !checked;
                config_toggle_isTopAnswerActive = !checked;
                break;
            case 'activeAnswerTop':
                config_toggle_isTopTextActive = !checked;
                config_toggle_isTopTextInactive = !checked;
                config_toggle_isTopAnswerActive = checked;
                break;
            case 'noneTop':
                config_toggle_isTopTextActive = !checked;
                config_toggle_isTopTextInactive = checked;
                config_toggle_isTopAnswerActive = !checked;
                break;
            case 'textBottom':
                config_toggle_isBottomTextActive = checked;
                config_toggle_isBottomTextInactive = !checked;
                config_toggle_isBottomAnswerActive = !checked;
                break;
            case 'activeAnswerBottom':
                config_toggle_isBottomTextActive = !checked;
                config_toggle_isBottomTextInactive = !checked;
                config_toggle_isBottomAnswerActive = checked;
                break;
            case 'noneBottom':
                config_toggle_isBottomTextActive = !checked;
                config_toggle_isBottomTextInactive = checked;
                config_toggle_isBottomAnswerActive = !checked;
                break;
            case 'audioTop':
                config_toggle_isTopAudioAutoplayActive = checked;
                stopAudio();
                playStatusInformation(checked, CONSTANT.URLTOPAUDIOAUTOPLAYON, CONSTANT.URLTOPAUDIOAUTOPLAYOFF);
                toggleSliderStatusBetweenAudio();
                return;
            case 'image':
                config_toggle_isImageActive = checked;
                break;
            case 'audioBottom':
                config_toggle_isBottomAudioAutoplayActive = checked;
                stopAudio();
                playStatusInformation(checked, CONSTANT.URLBOTTOMAUDIOAUTOPLAYON, CONSTANT.URLBOTTOMAUDIOAUTOPLAYOFF);
                toggleSliderStatusBetweenAudio();
                return;
            default:
                return;
		}
        if(gotInformationFromMenu){
            return;
        }
        resetCardsAndDontPlayFirst();
        $('.answerBox:visible:first').focus();
    }
    
    function playStatusInformation(checked, urlActive, urlInactive){
        if(checked) {
            playOnlyInBlindMode(urlActive);
        } else {
            playOnlyInBlindMode(urlInactive);
        }
    }
    function playOnlyInBlindMode(url, delay){
        delay = typeof delay !== 'undefined' ? delay : 0;
        if(config_toggle_isBlindMode) {
            cardsSingletonClass().playHiddenAudioFile(url, delay);
        }
    }
    
    function toggleSliderStatusBetweenAudio() {
        if(!config_toggle_isTopAudioAutoplayActive || !config_toggle_isBottomAudioAutoplayActive){
            $('#betweenAudioSpeed').attr('disabled', 'disabled');
            playOnlyInBlindMode(CONSTANT.URLAUTOFEEDOFF, CONSTANT.DELAYAUTOPLAYINFORMATION)
        } else {
            $('#betweenAudioSpeed').removeAttr('disabled');
            playOnlyInBlindMode(CONSTANT.URLAUTOFEEDON, CONSTANT.DELAYAUTOPLAYINFORMATION)
        }
    }
    
    function getNextRadioBox(topOrBottom) {
        var options = new Array('text' + topOrBottom, 'none' + topOrBottom, 'activeAnswer' + topOrBottom);
        var topOrBottomName = (topOrBottom == 'Top' ? CONSTANT.TOPLANGUAGENAME : CONSTANT.BOTTOMLANGUAGENAME);
        var lastItem = $('input[name=' + topOrBottomName + ']:checked')[0].id;
        var currentPositionOfItemInArray = jQuery.inArray( lastItem, options );
        if(currentPositionOfItemInArray == 2) {
            currentPositionOfItemInArray = 0;
        } else {
            currentPositionOfItemInArray ++;
        }
        var nextBox = options[currentPositionOfItemInArray];
        stopAudio();
        var urlFile;
        switch (nextBox.slice(0,4)) {
            case 'none':
                urlFile = CONSTANT.URLNONE;
                break;
            case 'acti':
                urlFile = CONSTANT.URLACTIVEANSWER;
                break;
            case 'text':
                urlFile = CONSTANT.URLTEXT;
                break;
            default:
                break;
        }
        if(topOrBottom == 'Top'){
            urlFile += CONSTANT.TOPSOUNDURLEXTEND;
        } else {
            urlFile += CONSTANT.BOTTOMSOUNDURLEXTEND;
        }
        cardsSingletonClass().playHiddenAudioFile(urlFile);
        return nextBox;
    }
    
	/**
	 * shortCutCheckboxHelper is a helper function
	 *  it changes the state of the checkbox and calls
	 *  the toggleElement-function
	 *  input: checkBoxID: String
	 *    the id of the checkbox which should change
	 */
	this.shortCutCheckboxHelper = function(checkBoxID) {
        $('#' + checkBoxID).click();
		var termCheckbox = $('#' + checkBoxID);
        var isChecked = termCheckbox.prop('checked');
        cardsSingletonClass().renewToggleState(checkBoxID, isChecked)
	}

	/**
	 * addShortcuts adds shortcuts to the page
	 *   uses the jwerty.js
	 */
	this.addShortcuts = function() {
        jwerty.key('ctrl+z', function (e) { 
            e.preventDefault();
            if(!config_toggle_isAutoplay) {
                cardsSingletonClass().updateTextInput($('#autoplaySpeed')[0], 2);
                $('#autoplaySpeed').val('2');
                config_currentCardSpeedValue = getCorrectSpeed(2);
                goToNextCardHelper();
                cardsSingletonClass().resetCardView();
                playOnlyInBlindMode(CONSTANT.URLSPEEDTWO);
            } else {
                cardsSingletonClass().updateTextInput($('#autoplaySpeed')[0], 0);
                $('#autoplaySpeed').val('0');
                config_currentCardSpeedValue = 0;
                playOnlyInBlindMode(CONSTANT.URLSPEEOFF);
            }
        });
        jwerty.key('ctrl+y', function (e) { 
            e.preventDefault();
            cardsSingletonClass().toggleElement('feedbackSoundSymbol');
        });
        jwerty.key('ctrl+s', function (e) { 
            e.preventDefault();
            document.getElementById('playerTop1').play();
        });
        jwerty.key('ctrl+d', function (e) { 
            e.preventDefault();
            document.getElementById('playerBottom1').play();
        });
        jwerty.key('ctrl+v', function (e) { 
            e.preventDefault();
            idForNextClickRadiobox = getNextRadioBox('Top');
            $('#' + idForNextClickRadiobox).click();
        });
        jwerty.key('ctrl+b', function (e) { 
            e.preventDefault();
            idForNextClickRadiobox = getNextRadioBox('Bottom');
            $('#' + idForNextClickRadiobox).click();
        });
        jwerty.key('ctrl+i', function (e) { 
            e.preventDefault();
            cardsSingletonClass().shortCutCheckboxHelper('image');
        });
        jwerty.key('ctrl+f', function (e) { 
            e.preventDefault();
            cardsSingletonClass().shortCutCheckboxHelper('audioTop');
        });
        jwerty.key('ctrl+g', function (e) { 
            e.preventDefault();
            cardsSingletonClass().shortCutCheckboxHelper('audioBottom');
        });
        jwerty.key('ctrl+x', function (e) { 
            e.preventDefault();
            deleteCurrentCard();
        });
        jwerty.key('ctrl+1', function (e) { 
            e.preventDefault();
            updateSpeedSlider('-');
        });
        jwerty.key('ctrl+2', function (e) { 
            e.preventDefault();
            updateSpeedSlider('+');
        });
        jwerty.key('ctrl+3', function (e) { 
            e.preventDefault();
            updateSliders('-', $('#betweenAudioSpeed'));
        });
        jwerty.key('ctrl+4', function (e) { 
            e.preventDefault();
            updateSliders('+', $('#betweenAudioSpeed'));
        });
        jwerty.key('ctrl+c', function (e) { 
            e.preventDefault();
            stopAudio();
            cardsSingletonClass().playCurrentCardsTotal();
        });
        jwerty.key('ctrl+r', function (e) { 
            e.preventDefault();
            randomizeCards();
        });
		shortCutsAndHandlersAreAllSet = true;
	}
    
    function updateSliders(deOrInCrease, jQElement) {
        var currentSpeedValue = parseInt(jQElement.val());
        var newSpeedValue = currentSpeedValue;
        //decrease speed
        if(deOrInCrease == '-' && jQElement.attr('min') < currentSpeedValue) {
            newSpeedValue = currentSpeedValue - 1;
            jQElement.next().val(newSpeedValue);
        } 
        //increase speed
        else if(deOrInCrease == '+' && currentSpeedValue < jQElement.attr('max')) {
            newSpeedValue = currentSpeedValue + 1;
            jQElement.next().val(newSpeedValue);
        }
        var delayForSayingAutoplayIsOff = CONSTANT.AUTOPLAYISOFFDELAY;
        if(!config_toggle_isTopAudioAutoplayActive && !config_toggle_isBottomAudioAutoplayActive){
            playOnlyInBlindMode(CONSTANT.URLBOTHAUDIOAUTOPLAYISOFF, delayForSayingAutoplayIsOff);
        } else if(!config_toggle_isTopAudioAutoplayActive) {
            playOnlyInBlindMode(CONSTANT.URLTOPAUDIOAUTOPLAYISOFF, delayForSayingAutoplayIsOff);
        } else if(!config_toggle_isBottomAudioAutoplayActive) {
            playOnlyInBlindMode(CONSTANT.URLBOTTOMAUDIOAUTOPLAYISOFF, delayForSayingAutoplayIsOff);
        }
        jQElement.val(newSpeedValue);
        cardsSingletonClass().updateTextInput(jQElement[0], newSpeedValue);
    }
    function updateSpeedSlider(deOrInCrease) {
        var currentSpeedValue = parseInt($('#autoplaySpeed').val());
        if(currentSpeedValue == 'Off') {
            currentSpeedValue = 0;
        }
        var newSpeedValue = currentSpeedValue;
        //decrease speed
        if(deOrInCrease == '-' && $('#autoplaySpeed').attr('min') < currentSpeedValue) {
            newSpeedValue = currentSpeedValue - 1;
            if(newSpeedValue == 0){
                $('#speedOutput').val('Off');
                config_toggle_isAutoplay = false;
                playOnlyInBlindMode(CONSTANT.URLSPEEOFF);
            } else {
                $('#speedOutput').val(newSpeedValue);
            }
        } 
        //increase speed
        else if(deOrInCrease == '+' && currentSpeedValue < $('#autoplaySpeed').attr('max')) {
            newSpeedValue = currentSpeedValue + 1;
            $('#speedOutput').val(newSpeedValue);
            config_toggle_isAutoplay = true;
        }
        
        $('#autoplaySpeed').val(newSpeedValue);
        cardsSingletonClass().updateTextInput($('#autoplaySpeed')[0], newSpeedValue);
    }
    
	/**
	 *  deleteCurrentCard
	 *    deletes the current card from the stack when called
	 *    also plays a sound which is set in the constants-file
	 */
	function deleteCurrentCard() {
		if (card_map.length > 2) {
			deletedCards.terms.push(card_map.terms[card_selected]);
			card_map.terms.splice(card_selected, 1);
            
            deletedCards.terms_sentences.push(card_map.terms_sentences[card_selected]);
            card_map.terms_sentences.splice(card_selected, 1);

			deletedCards.translations.push(card_map.translations[card_selected]);
			card_map.translations.splice(card_selected, 1);

			deletedCards.imageURLs.push(card_map.imageURLs[card_selected]);
			card_map.imageURLs.splice(card_selected, 1);

			deletedCards.audio_terms.push(card_map.audio_terms[card_selected]);
			card_map.audio_terms.splice(card_selected, 1);

			deletedCards.audio_translations.push(card_map.audio_translations[card_selected]);
			card_map.audio_translations.splice(card_selected, 1);
            
            deletedCards.term_answerchoices.push(card_map.term_answerchoices[card_selected]);
            card_map.term_answerchoices.splice(card_selected, 1);
            
            deletedCards.translation_answerchoices.push(card_map.translation_answerchoices[card_selected]);
            card_map.translation_answerchoices.splice(card_selected, 1);

			deletedCards.length++;
			card_map.length--;
            

			if (card_selected == card_map.length) {
				card_selected = 0;
			}
            goToNextCardHelper();
            cardsSingletonClass().playHiddenAudioFile(CONSTANT.URLDELETESOUND);
			cardsSingletonClass().resetCardView();
		} else {
            cardsSingletonClass().playHiddenAudioFile(CARDDIRECTORY + 'incorrect');
        }
	}
    
    
    function goToNextCardHelper() {
        stopAudio();
        controlCorrectAudioCard.autoplayedTranslation_Once = false;
    }
    
    
    /**
	 * showCorrectProgress displays the progress 
	 *    of the cards on the top right corner
     *    uses a class div in the markup
	 */
	function showCorrectProgress() {
		$(".currentProgress").html('Card ' + (card_selected + 1) + '/' + card_map.length);
	}

	/**
	 * animateCardsSlide animates the cards
	 *  input: plusOrMinus: String
	 *    the input is needed for the direction
	 *    plus is to the left; minus is to the right
	 */
	function animateCardsSlide(plusOrMinus) {
		controlCorrectAudioCard.autoplayedTranslation_Once = false;
		$('#answerBox1').val('');
		var windowWidthThird = $(window).width() * 0.322;
		var startAnimationPosition = plusOrMinus + windowWidthThird + 'px';
		cardsSingletonClass().resetCardView();
		resetAnswerBox();
		$('.items').css('left', startAnimationPosition);
		$('.items').animate({
			left : "0px"
		}, ANIMATION_SPEED_CARDS);
	}
    
    /**
	 * showOrHideElement shows or hides an id element using display
	 *  input: showOrHide: Boolean, whichElement: String
	 *    showOrHide: tells if the element should be shown or hidden
	 *    whichElement: the id of an element which should be 
     *      displayed or hidden
	 */
    function showOrHideElement(showOrHide, whichElement) {
        var id = "#" + whichElement;
        if (!showOrHide) {
			$(id).css('display', 'none');
		} else {
			$(id).css('display', '');
		}
    }
    
    function goToNextCard() {
        timeoutHelper = setTimeout(function () {
            cardsSingletonClass().goBackOrForward('forward');
		}, config_currentCardSpeedValue * 1000);
    }
    
    this.updateTextInput = function (element, val) {
        clearTimeout(timeoutHelper);
        if(element.id == 'autoplaySpeed') {
            if(val == 0){
                config_toggle_isAutoplay = false;
                $(element).next().val('Off');
                return;
            } else {
                config_toggle_isAutoplay = true;
                config_currentCardSpeedValue = getCorrectSpeed(val, element.id);
                insertAudio();
            }
            resetCardsAndDontPlayFirst();
        } else if(element.id == 'betweenAudioSpeed') {
            config_currentTopBottomSpeedValue = getCorrectSpeed(val, element.id);
        }
        $(element).next().val(val);
    }
    function getCorrectSpeed(speed, whichSpeedPlay){
        speed = parseInt(speed);
        var newSpeed = '';
        var urlForSpeedBetweenCards = '';
        var urlForSpeedOneCard = '';
        switch (speed) {
            case 1:
                newSpeed = CONSTANT.SPEED_ONE;
                urlForSpeedBetweenCards = CONSTANT.URLSPEEDONE;
                urlForSpeedOneCard = CONSTANT.URLSPEEDATCARDONE;
                break;
            case 2:
                newSpeed = CONSTANT.SPEED_TWO;
                urlForSpeedBetweenCards = CONSTANT.URLSPEEDTWO;
                urlForSpeedOneCard = CONSTANT.URLSPEEDATCARDTWO;
                break;
            case 3:
                newSpeed = CONSTANT.SPEED_THREE;
                urlForSpeedBetweenCards = CONSTANT.URLSPEEDTHREE;
                urlForSpeedOneCard = CONSTANT.URLSPEEDATCARDTHREE;
                break;
            case 4:
                newSpeed = CONSTANT.SPEED_FOUR;
                urlForSpeedBetweenCards = CONSTANT.URLSPEEDFOUR;
                urlForSpeedOneCard = CONSTANT.URLSPEEDATCARDFOUR;
                break;
            default:
                break;
        }
        if(whichSpeedPlay == 'autoplaySpeed'){
            playOnlyInBlindMode(urlForSpeedBetweenCards);
        } else if(whichSpeedPlay == 'betweenAudioSpeed'){
            playOnlyInBlindMode(urlForSpeedOneCard);
        }
        return newSpeed;
    }
    
    
    function shuffledArray(array) {
      var m = array.length, t, i;
      var helperArray = [];

      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        helperArray.push(i);
      }

      return helperArray;
    }
    function swapElements(array, helperArray) {
        var m = array.length-1, t;
        $.each(helperArray, function( index, value ) {
            t = array[m];
            array[m] = array[value];
            array[value] = t;
            m--;
        });
    }
    function randomizeCards() {
        var changeArray = shuffledArray(card_map.terms);
        swapElements(card_map.terms, changeArray);
        swapElements(card_map.terms_sentences, changeArray);
        swapElements(card_map.audio_terms, changeArray);
        swapElements(card_map.audio_translations, changeArray);
        swapElements(card_map.imageURLs, changeArray);
        swapElements(card_map.translations, changeArray);
        swapElements(card_map.translations_sentences, changeArray);
        swapElements(card_map.term_answerchoices, changeArray);
        swapElements(card_map.translation_answerchoices, changeArray);
        playOnlyInBlindMode(CONSTANT.URLRANDOMCARDS);
        resetCardsAndDontPlayFirst();
    }
    
    this.toggleBlindMode = function() {
        clearTimeout(runningHiddenAudioPlayerTimeout);
        if(config_toggle_isBlindMode) {
            $('#hiddenPlayer audio')[0].pause();
            $('#blind').remove();
            config_toggle_isBlindMode = false;
        } else {
            cardsSingletonClass().playHiddenAudioFile(CONSTANT.URLFORAUDIOHELPSHORT);
            runningBlindModeTimeout = setTimeout( function() {
                MenuSingletonClass().playCurrentMenuSound();
                MenuSingletonClass().playCurrentMenuPoint(true);
            }, CONSTANT.DELAY_AUDIOMODEMENU);
            
            $('body').prepend('<div id="blind"><div class="close close-white"></div></div>');
            $('#blind').css({
                'background-image': 'url("./../images/screen_05.jpg")'
            });
            if(!config_toggle_isTopAudioAutoplayActive) {
                cardsSingletonClass().shortCutCheckboxHelper('audioTop');
            }
            if(!config_toggle_isBottomAudioAutoplayActive) {
                cardsSingletonClass().shortCutCheckboxHelper('audioBottom');
            }
            config_toggle_isBlindMode = true;
        }
        $('#blind .close').click( function() {
            $('#enable-disable_AudioMode').click();
        });
    }
}
