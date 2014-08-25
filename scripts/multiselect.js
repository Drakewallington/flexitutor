function MultiselectSingeltonClass() {

    if ( arguments.callee._singletonInstance ) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

    var currNumberOfMultiselect = 0;
    var lastClickedItem = {
		ID : '',
		checked : false,
        type: ''
	};
    var multiselects = {
		length : 0,
        jElement : [],
        numberOfRadioAreas : [],
        radioAreaHistory : [],
        numberOfCheckboxes : [],
        numberOfCheckedCheckboxes: [],
        numberOfCheckedRadioBtn : []
    }
    
    this.getLastClickedItem = function() {
        return lastClickedItem;
    }
    
    this.writeTextInMultiselectBox = function(whichMultiselect) {
        $('#multiselect_' + whichMultiselect).html((multiselects.numberOfCheckedCheckboxes[whichMultiselect] + multiselects.numberOfCheckedRadioBtn[whichMultiselect]) + ' / ' + (multiselects.numberOfCheckboxes[whichMultiselect] + multiselects.numberOfRadioAreas[whichMultiselect]));
    }
    
    $('div[multiselect="multiselect"]').each(function() {
        var currMultiselect = $(this);
        var heightOfMultiselect = $(this).outerHeight();
        currMultiselect.parent().prepend('<button class="buttonToOpen" id="multiselect_' + currNumberOfMultiselect + '"></button>');
        var offsetOfButton = $('#multiselect_' + currNumberOfMultiselect).offset();
        var currButton = $('#multiselect_' + currNumberOfMultiselect);
        var currNumberOfCheckedCheckboxes = 0;
        var numberOfCheckboxes = 0;
        var numberOfRadioAreas = 0;
        var numberOfCheckedRadioBtn = 0;
        var radioAreaHistory = [];
        currMultiselect.css({
            'display': 'none', 
            'margin-top': ((heightOfMultiselect*(-1)) + 'px'),
            'left': (offsetOfButton.left + 'px')
        });

        $('#multiselect_' + currNumberOfMultiselect).click(function (e) {
            currMultiselect.toggle();
        });
        currMultiselect.find('input').click(function (e) {
            lastClickedItem.ID = e.target.id;
            if(e.target.type == 'radio') {
                lastClickedItem.checked = true;
                lastClickedItem.type = 'radio'
            } else {
                lastClickedItem.checked = e.target.checked;
                lastClickedItem.type = 'checkbox'
            }
        });
        
        var helperDOMObject = $(this)[0];
        var currentCheckboxes = helperDOMObject.getElementsByTagName('input');
        var lastRadioButton = '';
        $(currentCheckboxes).each( function() {
            $(this).on('click', function(e) {
                MultiselectSingeltonClass().recalculateElementsAndPrint(e);
            });
            if($(this).attr('type') == 'checkbox') {
                if($(this).prop('checked')) {
                    currNumberOfCheckedCheckboxes++;
                }
                numberOfCheckboxes++;
            } else if($(this).attr('type') == 'radio' && $(this).attr('name') != lastRadioButton) {
                lastRadioButton = $(this).attr('name');
                if($(this).attr('countaschecked') && $(this).prop('checked')) {
                    numberOfCheckedRadioBtn++;
                    radioAreaHistory[numberOfRadioAreas] = true;
                }
                numberOfRadioAreas++;
            }
        });
        
        multiselects.jElement.push(currMultiselect);
        multiselects.numberOfCheckboxes.push(numberOfCheckboxes);
        multiselects.numberOfCheckedCheckboxes.push(currNumberOfCheckedCheckboxes);
        multiselects.numberOfRadioAreas.push(numberOfRadioAreas);
        multiselects.radioAreaHistory.push(radioAreaHistory);
        multiselects.numberOfCheckedRadioBtn.push(numberOfCheckedRadioBtn);
        MultiselectSingeltonClass().writeTextInMultiselectBox(currNumberOfMultiselect);
        
        currNumberOfMultiselect++;
        multiselects.length++;
    });
    
    this.recalculateElementsAndPrint = function(e) {
        var currentMultiSelect = 0;
        var currentRadioArea = 0;
        var sectionWithOnlyCheckboxes = 0;
        while (multiselects.jElement[currentMultiSelect].find(e.target).length != 1) {
            currentMultiSelect++;
        }
        while ($(multiselects.jElement[currentMultiSelect].children('section')[currentRadioArea]).find(e.target).length != 1) {
            if($(multiselects.jElement[currentMultiSelect].children('section')[currentRadioArea + 1]).find('input[type="radio"]').length == 0) {
                sectionWithOnlyCheckboxes++;
            }
            currentRadioArea++;
        }
        if(e.currentTarget.type == 'checkbox') {
            if(e.originalEvent) { //check if mouseEvent was used
                if(!e.currentTarget.checked) {
                    multiselects.numberOfCheckedCheckboxes[currentMultiSelect]--;
                } else {
                    multiselects.numberOfCheckedCheckboxes[currentMultiSelect]++;
                }
            } else { //jQuery was used
                if(!e.currentTarget.checked) {
                    multiselects.numberOfCheckedCheckboxes[currentMultiSelect]++;
                } else {
                    multiselects.numberOfCheckedCheckboxes[currentMultiSelect]--;
                }
            }
        } else if(e.currentTarget.type == 'radio') {
            if($(e.currentTarget).attr('countaschecked') == 'true' && !multiselects.radioAreaHistory[currentMultiSelect][currentRadioArea - sectionWithOnlyCheckboxes]) {
                multiselects.numberOfCheckedRadioBtn[currentMultiSelect]++;
                multiselects.radioAreaHistory[currentMultiSelect][currentRadioArea - sectionWithOnlyCheckboxes] = true;
            } else if($(e.currentTarget).attr('countaschecked') == 'false' && multiselects.radioAreaHistory[currentMultiSelect][currentRadioArea - sectionWithOnlyCheckboxes]) {
                multiselects.numberOfCheckedRadioBtn[currentMultiSelect]--;
                multiselects.radioAreaHistory[currentMultiSelect][currentRadioArea - sectionWithOnlyCheckboxes] = false;
            }
        }
        MultiselectSingeltonClass().writeTextInMultiselectBox(currentMultiSelect);
    }
    
    
    
    $(document).mouseup(function (e) {
        $.each(multiselects.jElement, function(key, container) {
            if (!container.is(e.target)
              && container.has(e.target).length === 0 && 
              !container.siblings('button').is(e.target)) {
            container.hide();
            }
        });
    });
    
    this.getAllItems = function (multiselectID) {
        var inputArray = multiselectID.find('input');
        var idAndCheckedArray = {
            id : [],
            checked : []
        };
        inputArray.each(function() {
            idAndCheckedArray.id.push($(this)[0].id);
            idAndCheckedArray.checked.push($(this)[0].checked);
        });
        return idAndCheckedArray;
    }
    
}

