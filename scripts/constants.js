var CONSTANT = {
    
    //+++++++++++++++++++++++
    //   LINKS AND URL's
    //+++++++++++++++++++++++
    //BASE-URL
    BASE_URL: 'http://www.flexitutor.com/fileadmin/proj_banana/',
    //Directory of the card sounds
    CARDDIRECTORY: './../sounds/cards/',
    //Directory of the menu sounds
    MENUDIRECTORY: './../sounds/menu/',
    //URL for the main menu audio-file
    URLFORMAINMENUAUDIOFILE: './../sounds/menu/m1_main_menu',
    //URL for the sub menu audio-file
    URLFORSUBMENUAUDIOFILE: './../sounds/menu/m2_menu',
    //Directory for the spoken numbers
    NUMBERDIRECTORY: './../sounds/guide/',
    //URL for the audio help file at the start of the blind mode (short one)
    URLFORAUDIOHELPSHORT: './../sounds/guide/f1_help_header',
    //URL for the full audio help file (long one)
    URLFORAUDIOHELPLONG: './../sounds/guide/audio_help_en',
    //URL for number of cards
    NUMBEROFCARDSURL: './../sounds/added/num_of_questions',
    //URL for the toggle text
    URLNONE: './../sounds/added/text_off_',
    URLACTIVEANSWER: './../sounds/added/text_answerbox_',
    URLTEXT: './../sounds/added/text_on_',
    //the extended URL for the sound files for toggle text
    //this could be TOPSOUNDURLEXTEND: 'Top' --> ./../sounds/guide/noneTop
    TOPSOUNDURLEXTEND: 'top',
    BOTTOMSOUNDURLEXTEND: 'bottom',
    //URL for the sound file card without audio
    URLCARDWITHOUTAUDIO: './../sounds/added/cardstack_speed_fast.mp3',
    //URL for menu first level
    MENUFIRSTLEVEL: './../sounds/menu/menu_first_level',
    //URL and name of delete sound
    URLDELETESOUND: './../sounds/guide/zoom_gone',
    //URL for html file in folder
    URLHTMLFILE: './../',
    
    //URL for advance site discussion
    URLADVANCESITEDIS: './../sounds/added/advance_site_discussion',
    //URL for audio site-map
    URLAUDIOSITEMAP: './../sounds/added/audio_sitemap',
    //URL to 'audio off'-file
    URLAUDIOOFF: './../sounds/added/no_audio',
    //URL to 'audio on'-file
    URLAUDIOON: './../sounds/added/no_audio1', //CHANGE IMPORTANT
    //URL for audio top auto-play on and off
    URLTOPAUDIOAUTOPLAYON: './../sounds/added/top_audioplay_on',
    URLTOPAUDIOAUTOPLAYOFF: './../sounds/added/top_audioplay_off',
    //URL for audio bottom auto-play on and off
    URLBOTTOMAUDIOAUTOPLAYON: './../sounds/added/bottom_audioplay_on',
    URLBOTTOMAUDIOAUTOPLAYOFF: './../sounds/added/bottom_audioplay_off',
    //URL for randomized cards
    URLRANDOMCARDS: './../sounds/added/cards_randomized',
    //URL for sound of speed between cards Off, 1-4
    URLSPEEOFF: './../sounds/added/cardstack_speed_off',
    URLSPEEDONE: './../sounds/added/cardstack_speed_slow',
    URLSPEEDTWO: './../sounds/added/cardstack_speed_medium',
    URLSPEEDTHREE: './../sounds/added/cardstack_speed_fast',
    URLSPEEDFOUR: './../sounds/added/cardstack_speed_maximum',
    //URL for sound of speed between cards 1-4
    URLSPEEDATCARDONE: './../sounds/added/audio_cardspeed_slow',
    URLSPEEDATCARDTWO: './../sounds/added/audio_cardspeed_medium',
    URLSPEEDATCARDTHREE: './../sounds/added/audio_cardspeed_fast',
    URLSPEEDATCARDFOUR: './../sounds/added/audio_cardspeed_maximum',
    //URL for sound of auto-feed on or off
    URLAUTOFEEDON: './../sounds/added/autofeed_on',
    URLAUTOFEEDOFF: './../sounds/added/autofeed_off',
    //URL for top, bottom or both audio auto-feed is off
    URLTOPAUDIOAUTOPLAYISOFF: './../sounds/added/turn_top_audio_on',
    URLBOTTOMAUDIOAUTOPLAYISOFF: './../sounds/added/turn_bottom_audio_on',
    URLBOTHAUDIOAUTOPLAYISOFF: './../sounds/added/turn_top_bottom_audio_on',
    
    //+++++++++++++++++++++++
    //   Texts
    //+++++++++++++++++++++++
    //Title
    TITLE: 'Learn Afrikaans Framework',
    //Top Header on site
    HEADERONE: 'Learn Afrikaans',
    //Top language name
    TOPLANGUAGENAME: 'Afrikaans',
    //Bottom language name
    BOTTOMLANGUAGENAME: 'English',
    //Invisible information for screen reader
    INVISIBLEINFORMATION: 'Use Ctrl + B to access blind mode',
    
    //+++++++++++++++++++++++
    //   Settings
    //+++++++++++++++++++++++
    //Separator for answer-choices
    SEPARATOR: ',',
    //Start-value for the audio feedback for the answer-box
    TOGGLE_AUDIOFEEDBACK: true,
    
    
    //+++++++++++++++++++++++
    //   Speed-Settings
    //+++++++++++++++++++++++
    //Speed for the animation in the menu - milliseconds
    ANIMATION_SPEED_MENU: 300,
    //Speed for the animation between cards - milliseconds
    ANIMATION_SPEED_CARDS: 250,
    //Delay in Audio-Mode between starting sound (short) and menu sounds - milliseconds
    DELAY_AUDIOMODEMENU: 2500,
    //Delay when opening the first card - milliseconds
    DELAYONPLAYINGFIRSTCARD: 4500,
    //Delay when playing any card - it doesn't start immediately after loading - milliseconds
    DELAYONPLAYINGOTHERCARDS: 800,
    //Delay for saying the "number of cards" - milliseconds
    NUMBEROFCARDSDELAY: 1500,
    //Delay for saying the numbers - milliseconds
    NUMBERDELAY: 3000,
    //Delay for blind-mode audio playing that autoplay between cards is on or off
    DELAYAUTOPLAYINFORMATION: 1700,
    //Speed for auto-play in cards - delay in seconds
    SPEED_ONE: 4,
    SPEED_TWO: 3,
    SPEED_THREE: 2,
    SPEED_FOUR: 0.2,
    //Speedfactor from one blip to the next one
    SPEEDFAKTORBLIP: 0.8,
    //Delay for saying that one autoplay for autofeed is off in blind mode
    AUTOPLAYISOFFDELAY: 1800
}