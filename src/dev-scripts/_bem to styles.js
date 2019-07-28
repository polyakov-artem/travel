/* CREATING OUTPUT BLOCK */
var classesBlock = document.createElement('div');
classesBlock.innerHTML = `
	<div style="overflow: hidden">
		<button class="classes__button" style="color: green;float: right; display: block;  width: 70px; background: transparent; border: 1px solid #333">Показать</button>
		<button class="classes__get-classes" style="color: green;float: right; display: block;  width: 70px; background: transparent; border: 1px solid #333">Извлечь</button>
		<input class="classes__class-name" style="color: green;float: right; display: block;  width: 70px; background: transparent; border: 1px solid #333"></input>
	</div>
	
	<div class= "textareas-wrap" style="display: none; overflow: hidden; background: #fff">
		<textarea class="classes__sass-textarea" style="float: left; width: 300px; height: 300px; "></textarea>
		<textarea class="classes__css-textarea" style="float: left; width: 300px; height: 300px;"></textarea>
		<textarea class="classes__csspos-textarea" style="float: left; width: 300px; height: 300px;"></textarea>
	<div/>`
classesBlock.style = `position: fixed; top: 250px; right: 0; z-index: 9999`;
classesBlock.classList.add('classes');
document.querySelector('body').appendChild(classesBlock);


var sassTextarea = document.querySelector('.classes__sass-textarea');
var cssTextarea = document.querySelector('.classes__css-textarea');
var cssposTextarea = document.querySelector('.classes__csspos-textarea');

var textareasWrap = document.querySelector('.textareas-wrap');



document.querySelector('.classes__button').onclick = function(event) {
    event.preventDefault();
    console.log('css');
    if (textareasWrap.style.display == 'none') {
        textareasWrap.style.display = 'block'
    } else {
        textareasWrap.style.display = 'none'
    }
};


document.querySelector('.classes__get-classes').onclick = function(event) {
    event.preventDefault();
    findClasses(document.querySelector('.classes__class-name').value)
};
/* CREATING OUTPUT BLOCK END */



var nodeClasses;


findClasses();

function findClasses(parentClass) {
    nodeClasses = {};

    var selector;

    if (!parentClass) {
        selector = "*";
    } else {
        selector = "." + parentClass + " *";
    };

    var allElem = document.querySelectorAll(selector);
    var allElemArr = Array.prototype.slice.call(allElem);
    if (selector !== '*') allElemArr.unshift(document.querySelector('.' + parentClass));


    for (var i = 0; i < allElemArr.length; i++) {
        var elem = allElemArr[i];
        if (typeof elem.className !== 'string') {
            continue
        };

        //массив классов dom элемента
        var elemClasses = elem.className.split(' ');

        for (var j = 0; j < elemClasses.length; j++) {
            var currClassName = elemClasses[j];

            if (currClassName == '' || currClassName == '|') continue;



            var parentClassName;


            if (isChildClass(currClassName)) {
                parentClassName = findParentClass(currClassName);
                if (nodeClasses[parentClassName] == undefined) {
                    nodeClasses[parentClassName] = {};
                } else {
                    nodeClasses[parentClassName][currClassName] = {};
                };
            } else {
                if (nodeClasses[currClassName] == undefined) {
                    nodeClasses[currClassName] = {};
                }
            };


        };

    };

    function isChildClass(className) {
        return (className.indexOf('__') !== -1 || className.indexOf('_') !== -1) ? true : false;
    }

    function findParentClass(className) {
        var parentNameEnd;
        var parentName;
        if (className.indexOf('__') !== -1) {
            parentNameEnd = className.indexOf('__');
        } else {
            parentNameEnd = className.indexOf('_');
        };
        parentName = className.slice(0, parentNameEnd);
        return parentName;
    };


    function hasProperties(obj) {
        for (var prop in obj) {
            return true
        };
        return false;
    };


    function print(obj) {
        var sassTextAreaText = '';
        var cssTextAreaText = '';
        var cssposTextAreaText = '';

        var parentSelector = parentClass ? `.${parentClass} `: '';

       	// Комментарий в начале css поля
        // if (parentClass) cssTextAreaText += '/* ' + parentClass + ' */\n\n';

        if (parentClass) cssposTextAreaText += '/* ' + parentClass + ' */\n\n';


        function findProps(obj) {
            for (var prop in obj) {

                cssTextAreaText += `.${prop} {\n}\n\n`;
                if (prop == parentClass) {
                    cssposTextAreaText += '.' + prop + '{ }\n';
                } else {
                    cssposTextAreaText += parentSelector + '.' + prop + '{ }\n';
                };


                if (hasProperties(obj[prop]) || !isChildClass(prop)) {
                    sassTextAreaText += '.' + prop + '\n';
                } else {
                    if (prop.indexOf('__') !== -1) {
                        sassTextAreaText += "\t&" + prop.slice(prop.indexOf('__')) + '\n';
                    } else {
                        sassTextAreaText += "\t&" + prop.slice(prop.indexOf('_')) + '\n';
                    };
                }
                findProps(obj[prop])
            }

        };



        findProps(obj);
        // Комментарий в конце  css поля
        // if (parentClass) cssTextAreaText += '\n/* ' + parentClass + ' end */\n\n';
        
        if (parentClass) cssposTextAreaText += '\n/* ' + parentClass + ' end */\n\n';
        sassTextarea.value = sassTextAreaText;
        cssTextarea.value = cssTextAreaText;
        cssposTextarea.value = cssposTextAreaText;

    };
    print(nodeClasses);

};